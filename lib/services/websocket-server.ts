import { Server as SocketIOServer } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { ScalableMessagingService, defaultConfig } from './scalable-messaging-service'
import { Server as HTTPServer } from 'http'

export interface SocketUser {
  id: string
  name: string
  avatar?: string
  role: 'customer' | 'vendor' | 'contractor' | 'admin'
}

export interface ChatRoom {
  id: string
  name: string
  type: 'direct' | 'group' | 'project' | 'support'
  participants: string[]
  metadata?: Record<string, any>
}

export interface MessagePayload {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'system'
  metadata?: Record<string, any>
  reply_to?: string
  created_at: string
}

class ScalableWebSocketServer {
  private io: SocketIOServer
  private messagingService: ScalableMessagingService
  private connectedUsers: Map<string, Set<string>> = new Map() // userId -> Set of socketIds
  private socketToUser: Map<string, string> = new Map() // socketId -> userId
  private userRooms: Map<string, Set<string>> = new Map() // userId -> Set of roomIds

  constructor(httpServer: HTTPServer, redisUrl?: string) {
    this.messagingService = new ScalableMessagingService(defaultConfig)
    this.initializeSocketIO(httpServer, redisUrl)
    this.setupEventHandlers()
  }

  private async initializeSocketIO(httpServer: HTTPServer, redisUrl?: string) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e6, // 1MB
      allowEIO3: true
    })

    // Set up Redis adapter for horizontal scaling
    if (redisUrl) {
      try {
        const pubClient = createClient({ url: redisUrl })
        const subClient = pubClient.duplicate()

        await Promise.all([
          pubClient.connect(),
          subClient.connect()
        ])

        this.io.adapter(createAdapter(pubClient, subClient))
        console.log('✅ Socket.IO Redis adapter initialized')
      } catch (error) {
        console.error('❌ Failed to initialize Redis adapter:', error)
      }
    }

    // Middleware for authentication
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        const user = await this.authenticateUser(token)
        
        if (user) {
          socket.data.user = user
          next()
        } else {
          next(new Error('Authentication failed'))
        }
      } catch (error) {
        next(new Error('Authentication error'))
      }
    })
  }

  private async authenticateUser(token: string): Promise<SocketUser | null> {
    // Implement your authentication logic here
    // This should validate the JWT token and return user info
    try {
      // Mock authentication for demo
      if (token === 'demo-token') {
        return {
          id: 'user-123',
          name: 'Demo User',
          avatar: '/placeholder-user.jpg',
          role: 'customer'
        }
      }
      
      // In production, validate JWT token here
      // const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // return await getUserById(decoded.userId)
      
      return null
    } catch (error) {
      console.error('Authentication error:', error)
      return null
    }
  }

  private setupEventHandlers() {
    this.io.on('connection', async (socket) => {
      const user = socket.data.user as SocketUser
      console.log(`✅ User ${user.name} (${user.id}) connected with socket ${socket.id}`)

      // Register connection in messaging service
      await this.messagingService.registerConnection(user.id, socket.id)
      
      // Track connection locally
      if (!this.connectedUsers.has(user.id)) {
        this.connectedUsers.set(user.id, new Set())
      }
      this.connectedUsers.get(user.id)!.add(socket.id)
      this.socketToUser.set(socket.id, user.id)

      // Update user presence
      await this.messagingService.updateUserPresence(user.id, 'online')

      // Join user to their personal room
      socket.join(`user:${user.id}`)

      // Set up event handlers
      this.setupSocketEventHandlers(socket, user)

      // Handle disconnection
      socket.on('disconnect', async (reason) => {
        console.log(`❌ User ${user.name} (${user.id}) disconnected: ${reason}`)
        await this.handleDisconnection(socket, user)
      })
    })

    // Listen to messaging service events
    this.messagingService.on('message', ({ channel, data }) => {
      this.handleMessagingServiceEvent(channel, data)
    })
  }

  private setupSocketEventHandlers(socket: any, user: SocketUser) {
    // Join conversation
    socket.on('join_conversation', async (conversationId: string) => {
      try {
        // Verify user has access to this conversation
        const hasAccess = await this.verifyConversationAccess(user.id, conversationId)
        
        if (hasAccess) {
          socket.join(`conversation:${conversationId}`)
          
          // Track user rooms
          if (!this.userRooms.has(user.id)) {
            this.userRooms.set(user.id, new Set())
          }
          this.userRooms.get(user.id)!.add(conversationId)

          // Subscribe to conversation updates
          await this.messagingService.subscribeToConversation(conversationId)
          
          // Send cached messages
          const cachedMessages = await this.messagingService.getCachedMessages(conversationId)
          socket.emit('conversation_messages', {
            conversation_id: conversationId,
            messages: cachedMessages
          })

          console.log(`📥 User ${user.id} joined conversation ${conversationId}`)
        } else {
          socket.emit('error', { message: 'Access denied to conversation' })
        }
      } catch (error) {
        console.error('Error joining conversation:', error)
        socket.emit('error', { message: 'Failed to join conversation' })
      }
    })

    // Leave conversation
    socket.on('leave_conversation', async (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`)
      this.userRooms.get(user.id)?.delete(conversationId)
      await this.messagingService.unsubscribeFromConversation(conversationId)
      console.log(`📤 User ${user.id} left conversation ${conversationId}`)
    })

    // Send message
    socket.on('send_message', async (messageData: Omit<MessagePayload, 'id' | 'created_at'>) => {
      try {
        // Rate limiting
        const canSend = await this.messagingService.checkRateLimit(user.id, 'send_message', 100, 60)
        if (!canSend) {
          socket.emit('error', { message: 'Rate limit exceeded' })
          return
        }

        // Verify user has access to conversation
        const hasAccess = await this.verifyConversationAccess(user.id, messageData.conversation_id)
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied to conversation' })
          return
        }

        // Create message
        const message: MessagePayload = {
          ...messageData,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sender_id: user.id,
          created_at: new Date().toISOString()
        }

        // Publish message for real-time delivery
        await this.messagingService.publishMessage(message)

        // Queue message for database persistence
        await this.messagingService.queueMessage(message, 1)

        // Increment metrics
        await this.messagingService.incrementCounter('messages_sent')

        console.log(`💬 Message sent by ${user.id} to conversation ${message.conversation_id}`)
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Typing indicators
    socket.on('typing_start', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        user_id: user.id,
        user_name: user.name,
        conversation_id: conversationId
      })
    })

    socket.on('typing_stop', (conversationId: string) => {
      socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', {
        user_id: user.id,
        conversation_id: conversationId
      })
    })

    // Message reactions
    socket.on('add_reaction', async (data: { message_id: string; emoji: string }) => {
      try {
        // Add reaction logic here
        socket.to(`conversation:${data.message_id}`).emit('reaction_added', {
          message_id: data.message_id,
          user_id: user.id,
          emoji: data.emoji
        })
      } catch (error) {
        console.error('Error adding reaction:', error)
      }
    })

    // Presence updates
    socket.on('update_presence', async (status: 'online' | 'away' | 'busy') => {
      await this.messagingService.updateUserPresence(user.id, status)
      
      // Notify contacts about presence change
      socket.broadcast.emit('user_presence_changed', {
        user_id: user.id,
        status,
        timestamp: new Date().toISOString()
      })
    })

    // Request user presence
    socket.on('get_user_presence', async (userIds: string[]) => {
      try {
        const presence = await this.messagingService.getMultipleUserPresence(userIds)
        socket.emit('user_presence_update', presence)
      } catch (error) {
        console.error('Error getting user presence:', error)
      }
    })
  }

  private async handleDisconnection(socket: any, user: SocketUser) {
    // Unregister connection
    await this.messagingService.unregisterConnection(user.id, socket.id)
    
    // Clean up local tracking
    const userSockets = this.connectedUsers.get(user.id)
    if (userSockets) {
      userSockets.delete(socket.id)
      if (userSockets.size === 0) {
        this.connectedUsers.delete(user.id)
        // Update presence to offline if no other connections
        await this.messagingService.updateUserPresence(user.id, 'offline')
      }
    }
    
    this.socketToUser.delete(socket.id)
    this.userRooms.delete(user.id)
  }

  private handleMessagingServiceEvent(channel: string, data: any) {
    if (channel.startsWith('conversation:')) {
      const conversationId = channel.replace('conversation:', '')
      
      switch (data.type) {
        case 'new_message':
          this.io.to(`conversation:${conversationId}`).emit('new_message', data.data)
          break
        case 'message_updated':
          this.io.to(`conversation:${conversationId}`).emit('message_updated', data.data)
          break
        case 'message_deleted':
          this.io.to(`conversation:${conversationId}`).emit('message_deleted', data.data)
          break
      }
    }
  }

  private async verifyConversationAccess(userId: string, conversationId: string): Promise<boolean> {
    // Implement conversation access verification
    // This should check if the user is a participant in the conversation
    try {
      // Mock verification for demo
      return true
      
      // In production, check database:
      // const conversation = await getConversation(conversationId)
      // return conversation.participants.includes(userId)
    } catch (error) {
      console.error('Error verifying conversation access:', error)
      return false
    }
  }

  // Public methods for external use
  public async sendNotification(userId: string, notification: any) {
    this.io.to(`user:${userId}`).emit('notification', notification)
  }

  public async broadcastToConversation(conversationId: string, event: string, data: any) {
    this.io.to(`conversation:${conversationId}`).emit(event, data)
  }

  public getConnectedUserCount(): number {
    return this.connectedUsers.size
  }

  public async getServerStats() {
    const health = await this.messagingService.healthCheck()
    const metrics = await this.messagingService.getMetrics('*')
    
    return {
      connected_users: this.connectedUsers.size,
      total_sockets: this.socketToUser.size,
      redis_health: health,
      metrics
    }
  }

  public async shutdown() {
    console.log('🔄 Shutting down WebSocket server...')
    
    // Notify all connected users
    this.io.emit('server_shutdown', {
      message: 'Server is shutting down. Please reconnect.',
      timestamp: new Date().toISOString()
    })
    
    // Close all connections
    this.io.close()
    
    // Cleanup messaging service
    await this.messagingService.cleanup()
    
    console.log('✅ WebSocket server shutdown complete')
  }
}

export { ScalableWebSocketServer }
