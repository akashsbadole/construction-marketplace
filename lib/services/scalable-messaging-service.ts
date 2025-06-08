import Redis from 'ioredis'
import { EventEmitter } from 'events'

// Scalable messaging service with Redis and message queues
export interface ScalableMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'system'
  metadata: Record<string, any>
  created_at: string
  delivery_status: 'pending' | 'sent' | 'delivered' | 'read'
}

export interface ConnectionInfo {
  user_id: string
  socket_id: string
  server_id: string
  connected_at: string
  last_seen: string
}

export interface CacheConfig {
  redis: {
    host: string
    port: number
    password?: string
    cluster?: boolean
    nodes?: Array<{ host: string; port: number }>
  }
  ttl: {
    messages: number // 1 hour
    conversations: number // 30 minutes
    presence: number // 5 minutes
    connections: number // 24 hours
  }
}

class ScalableMessagingService extends EventEmitter {
  private redis: Redis.Redis | Redis.Cluster
  private pubClient: Redis.Redis | Redis.Cluster
  private subClient: Redis.Redis | Redis.Cluster
  private config: CacheConfig
  private serverId: string

  constructor(config: CacheConfig) {
    super()
    this.config = config
    this.serverId = `server_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.initializeRedis()
  }

  private initializeRedis() {
    if (this.config.redis.cluster && this.config.redis.nodes) {
      // Redis Cluster for high availability
      this.redis = new Redis.Cluster(this.config.redis.nodes, {
        redisOptions: {
          password: this.config.redis.password,
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3
        }
      })
      this.pubClient = this.redis.duplicate()
      this.subClient = this.redis.duplicate()
    } else {
      // Single Redis instance
      const redisOptions = {
        host: this.config.redis.host,
        port: this.config.redis.port,
        password: this.config.redis.password,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      }
      
      this.redis = new Redis(redisOptions)
      this.pubClient = new Redis(redisOptions)
      this.subClient = new Redis(redisOptions)
    }

    // Set up pub/sub for real-time messaging
    this.setupPubSub()
  }

  private setupPubSub() {
    this.subClient.on('message', (channel: string, message: string) => {
      try {
        const data = JSON.parse(message)
        this.emit('message', { channel, data })
      } catch (error) {
        console.error('Error parsing pub/sub message:', error)
      }
    })

    this.subClient.on('error', (error) => {
      console.error('Redis subscriber error:', error)
    })
  }

  // Connection Management
  async registerConnection(userId: string, socketId: string): Promise<void> {
    const connectionInfo: ConnectionInfo = {
      user_id: userId,
      socket_id: socketId,
      server_id: this.serverId,
      connected_at: new Date().toISOString(),
      last_seen: new Date().toISOString()
    }

    const pipeline = this.redis.pipeline()
    
    // Store connection info
    pipeline.hset(
      `connections:${userId}`,
      socketId,
      JSON.stringify(connectionInfo)
    )
    
    // Set user as online
    pipeline.setex(
      `presence:${userId}`,
      this.config.ttl.presence,
      JSON.stringify({
        status: 'online',
        last_seen: new Date().toISOString(),
        server_id: this.serverId
      })
    )
    
    // Add to server's connection list
    pipeline.sadd(`server:${this.serverId}:connections`, `${userId}:${socketId}`)
    
    await pipeline.exec()
  }

  async unregisterConnection(userId: string, socketId: string): Promise<void> {
    const pipeline = this.redis.pipeline()
    
    // Remove connection info
    pipeline.hdel(`connections:${userId}`, socketId)
    
    // Check if user has other connections
    const otherConnections = await this.redis.hlen(`connections:${userId}`)
    
    if (otherConnections <= 1) {
      // Set user as offline if no other connections
      pipeline.setex(
        `presence:${userId}`,
        this.config.ttl.presence,
        JSON.stringify({
          status: 'offline',
          last_seen: new Date().toISOString()
        })
      )
    }
    
    // Remove from server's connection list
    pipeline.srem(`server:${this.serverId}:connections`, `${userId}:${socketId}`)
    
    await pipeline.exec()
  }

  // Message Caching
  async cacheMessage(message: ScalableMessage): Promise<void> {
    const pipeline = this.redis.pipeline()
    
    // Cache individual message
    pipeline.setex(
      `message:${message.id}`,
      this.config.ttl.messages,
      JSON.stringify(message)
    )
    
    // Add to conversation's recent messages (sorted set by timestamp)
    pipeline.zadd(
      `conversation:${message.conversation_id}:messages`,
      Date.now(),
      message.id
    )
    
    // Keep only last 50 messages in cache
    pipeline.zremrangebyrank(
      `conversation:${message.conversation_id}:messages`,
      0,
      -51
    )
    
    // Set TTL for conversation messages
    pipeline.expire(
      `conversation:${message.conversation_id}:messages`,
      this.config.ttl.messages
    )
    
    await pipeline.exec()
  }

  async getCachedMessages(conversationId: string, limit = 50): Promise<ScalableMessage[]> {
    // Get recent message IDs from sorted set
    const messageIds = await this.redis.zrevrange(
      `conversation:${conversationId}:messages`,
      0,
      limit - 1
    )
    
    if (messageIds.length === 0) {
      return []
    }
    
    // Get message details
    const pipeline = this.redis.pipeline()
    messageIds.forEach(id => {
      pipeline.get(`message:${id}`)
    })
    
    const results = await pipeline.exec()
    const messages: ScalableMessage[] = []
    
    results?.forEach((result) => {
      if (result && result[1]) {
        try {
          messages.push(JSON.parse(result[1] as string))
        } catch (error) {
          console.error('Error parsing cached message:', error)
        }
      }
    })
    
    return messages
  }

  // Real-time Message Distribution
  async publishMessage(message: ScalableMessage): Promise<void> {
    // Publish to conversation channel for real-time delivery
    await this.pubClient.publish(
      `conversation:${message.conversation_id}`,
      JSON.stringify({
        type: 'new_message',
        data: message
      })
    )
    
    // Cache the message
    await this.cacheMessage(message)
  }

  async subscribeToConversation(conversationId: string): Promise<void> {
    await this.subClient.subscribe(`conversation:${conversationId}`)
  }

  async unsubscribeFromConversation(conversationId: string): Promise<void> {
    await this.subClient.unsubscribe(`conversation:${conversationId}`)
  }

  // User Presence Management
  async updateUserPresence(userId: string, status: 'online' | 'offline' | 'away'): Promise<void> {
    await this.redis.setex(
      `presence:${userId}`,
      this.config.ttl.presence,
      JSON.stringify({
        status,
        last_seen: new Date().toISOString(),
        server_id: this.serverId
      })
    )
  }

  async getUserPresence(userId: string): Promise<{ status: string; last_seen: string } | null> {
    const presence = await this.redis.get(`presence:${userId}`)
    return presence ? JSON.parse(presence) : null
  }

  async getMultipleUserPresence(userIds: string[]): Promise<Record<string, any>> {
    const pipeline = this.redis.pipeline()
    userIds.forEach(userId => {
      pipeline.get(`presence:${userId}`)
    })
    
    const results = await pipeline.exec()
    const presence: Record<string, any> = {}
    
    userIds.forEach((userId, index) => {
      const result = results?.[index]
      if (result && result[1]) {
        try {
          presence[userId] = JSON.parse(result[1] as string)
        } catch (error) {
          presence[userId] = { status: 'offline', last_seen: null }
        }
      } else {
        presence[userId] = { status: 'offline', last_seen: null }
      }
    })
    
    return presence
  }

  // Conversation Caching
  async cacheUserConversations(userId: string, conversations: any[]): Promise<void> {
    await this.redis.setex(
      `user:${userId}:conversations`,
      this.config.ttl.conversations,
      JSON.stringify(conversations)
    )
  }

  async getCachedUserConversations(userId: string): Promise<any[] | null> {
    const cached = await this.redis.get(`user:${userId}:conversations`)
    return cached ? JSON.parse(cached) : null
  }

  // Rate Limiting
  async checkRateLimit(userId: string, action: string, limit: number, window: number): Promise<boolean> {
    const key = `rate_limit:${userId}:${action}`
    const current = await this.redis.incr(key)
    
    if (current === 1) {
      await this.redis.expire(key, window)
    }
    
    return current <= limit
  }

  // Message Queue Integration (for background processing)
  async queueMessage(message: ScalableMessage, priority = 0): Promise<void> {
    // Add message to processing queue with priority
    await this.redis.zadd(
      'message_queue',
      priority,
      JSON.stringify({
        ...message,
        queued_at: new Date().toISOString()
      })
    )
  }

  async dequeueMessage(): Promise<ScalableMessage | null> {
    // Get highest priority message from queue
    const result = await this.redis.zpopmax('message_queue')
    
    if (result && result.length >= 2) {
      try {
        return JSON.parse(result[0] as string)
      } catch (error) {
        console.error('Error parsing queued message:', error)
        return null
      }
    }
    
    return null
  }

  // Analytics and Monitoring
  async incrementCounter(metric: string, value = 1): Promise<void> {
    await this.redis.incrby(`metrics:${metric}`, value)
  }

  async getMetrics(pattern: string): Promise<Record<string, number>> {
    const keys = await this.redis.keys(`metrics:${pattern}`)
    const pipeline = this.redis.pipeline()
    
    keys.forEach(key => {
      pipeline.get(key)
    })
    
    const results = await pipeline.exec()
    const metrics: Record<string, number> = {}
    
    keys.forEach((key, index) => {
      const result = results?.[index]
      if (result && result[1]) {
        const metricName = key.replace('metrics:', '')
        metrics[metricName] = parseInt(result[1] as string) || 0
      }
    })
    
    return metrics
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; latency: number; connections: number }> {
    const start = Date.now()
    
    try {
      await this.redis.ping()
      const latency = Date.now() - start
      
      // Get connection count for this server
      const connections = await this.redis.scard(`server:${this.serverId}:connections`)
      
      return {
        status: 'healthy',
        latency,
        connections
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start,
        connections: 0
      }
    }
  }

  // Cleanup
  async cleanup(): Promise<void> {
    // Remove all connections for this server
    const connections = await this.redis.smembers(`server:${this.serverId}:connections`)
    
    const pipeline = this.redis.pipeline()
    
    connections.forEach(connection => {
      const [userId, socketId] = connection.split(':')
      pipeline.hdel(`connections:${userId}`, socketId)
    })
    
    pipeline.del(`server:${this.serverId}:connections`)
    
    await pipeline.exec()
    
    // Close Redis connections
    await this.redis.quit()
    await this.pubClient.quit()
    await this.subClient.quit()
  }
}

// Factory function for creating scalable messaging service
export function createScalableMessagingService(config: CacheConfig): ScalableMessagingService {
  return new ScalableMessagingService(config)
}

// Default configuration for development
export const defaultConfig: CacheConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    cluster: process.env.REDIS_CLUSTER === 'true',
    nodes: process.env.REDIS_NODES ? JSON.parse(process.env.REDIS_NODES) : undefined
  },
  ttl: {
    messages: 3600, // 1 hour
    conversations: 1800, // 30 minutes
    presence: 300, // 5 minutes
    connections: 86400 // 24 hours
  }
}

export { ScalableMessagingService }
