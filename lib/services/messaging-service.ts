import { supabase } from '@/lib/supabase/client'

export type MessageType = 'text' | 'image' | 'file' | 'system'
export type NotificationType = 'order' | 'payment' | 'kyc' | 'message' | 'project' | 'system'

export interface Conversation {
  id: string
  participants: string[] // Array of user IDs
  type: 'direct' | 'group' | 'support'
  title?: string
  last_message_at: string
  created_at: string
  updated_at: string
  unread_count?: number
  last_message?: Message
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  message_type: MessageType
  content: string
  attachments: any[]
  metadata: Record<string, any>
  is_read: boolean
  read_at?: string
  created_at: string
  updated_at: string
  sender?: {
    id: string
    first_name: string
    last_name: string
    avatar_url?: string
  }
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data: Record<string, any>
  is_read: boolean
  read_at?: string
  created_at: string
}

export interface SendMessageRequest {
  conversation_id: string
  content: string
  message_type?: MessageType
  attachments?: File[]
  metadata?: Record<string, any>
}

class MessagingService {
  // Create or get conversation between users
  async getOrCreateConversation(participantIds: string[]): Promise<Conversation> {
    try {
      // Sort participant IDs for consistent lookup
      const sortedParticipants = [...participantIds].sort()
      
      // Try to find existing conversation
      const { data: existingConversations, error: searchError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', sortedParticipants)
        .eq('type', 'direct')

      if (searchError) throw searchError

      // Check if we have an exact match
      const exactMatch = existingConversations?.find(conv => 
        conv.participants.length === sortedParticipants.length &&
        conv.participants.every((id: string) => sortedParticipants.includes(id))
      )

      if (exactMatch) {
        return exactMatch
      }

      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({
          participants: sortedParticipants,
          type: 'direct'
        })
        .select()
        .single()

      if (createError) throw createError
      return newConversation
    } catch (error) {
      console.error('Error getting/creating conversation:', error)
      throw new Error('Failed to create conversation')
    }
  }

  // Get user's conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages!inner(
            id,
            content,
            message_type,
            created_at,
            sender_id,
            is_read,
            sender:users!sender_id(id, first_name, last_name, avatar_url)
          )
        `)
        .contains('participants', [userId])
        .order('last_message_at', { ascending: false })

      if (error) throw error

      // Process conversations to add unread count and last message
      const conversations = data?.map(conv => {
        const messages = conv.messages || []
        const lastMessage = messages.length > 0 ? messages[0] : null
        const unreadCount = messages.filter((msg: any) => 
          msg.sender_id !== userId && !msg.is_read
        ).length

        return {
          ...conv,
          last_message: lastMessage,
          unread_count: unreadCount
        }
      }) || []

      return conversations
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  // Get messages for a conversation
  async getConversationMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(id, first_name, last_name, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  // Send message
  async sendMessage(senderId: string, request: SendMessageRequest): Promise<Message> {
    try {
      let attachmentUrls: string[] = []

      // Upload attachments if any
      if (request.attachments && request.attachments.length > 0) {
        attachmentUrls = await this.uploadAttachments(request.attachments, senderId)
      }

      // Create message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: request.conversation_id,
          sender_id: senderId,
          message_type: request.message_type || 'text',
          content: request.content,
          attachments: attachmentUrls,
          metadata: request.metadata || {}
        })
        .select(`
          *,
          sender:users!sender_id(id, first_name, last_name, avatar_url)
        `)
        .single()

      if (messageError) throw messageError

      // Update conversation's last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', request.conversation_id)

      // Send notifications to other participants
      await this.notifyParticipants(request.conversation_id, senderId, message)

      return message
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Failed to send message')
    }
  }

  // Upload attachments
  private async uploadAttachments(files: File[], userId: string): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/messages/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('message-attachments')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(fileName)

      return {
        url: publicUrl,
        name: file.name,
        size: file.size,
        type: file.type
      }
    })

    return Promise.all(uploadPromises)
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('is_read', false)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking messages as read:', error)
      return false
    }
  }

  // Notify participants about new message
  private async notifyParticipants(conversationId: string, senderId: string, message: Message): Promise<void> {
    try {
      // Get conversation participants
      const { data: conversation } = await supabase
        .from('conversations')
        .select('participants')
        .eq('id', conversationId)
        .single()

      if (!conversation) return

      // Get sender info
      const { data: sender } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', senderId)
        .single()

      const senderName = sender ? `${sender.first_name} ${sender.last_name}` : 'Someone'

      // Create notifications for other participants
      const notifications = conversation.participants
        .filter((id: string) => id !== senderId)
        .map((userId: string) => ({
          user_id: userId,
          type: 'message' as NotificationType,
          title: `New message from ${senderName}`,
          message: message.content.substring(0, 100) + (message.content.length > 100 ? '...' : ''),
          data: {
            conversation_id: conversationId,
            message_id: message.id,
            sender_id: senderId
          }
        }))

      if (notifications.length > 0) {
        await supabase
          .from('notifications')
          .insert(notifications)
      }
    } catch (error) {
      console.error('Error notifying participants:', error)
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  }

  // Create system notification
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error creating notification:', error)
      return false
    }
  }

  // Subscribe to real-time messages for a conversation
  subscribeToConversation(conversationId: string, onMessage: (message: Message) => void) {
    return supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data: message } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!sender_id(id, first_name, last_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          if (message) {
            onMessage(message)
          }
        }
      )
      .subscribe()
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(userId: string, onNotification: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new as Notification)
        }
      )
      .subscribe()
  }

  // Delete conversation
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting conversation:', error)
      return false
    }
  }

  // Search messages
  async searchMessages(userId: string, query: string): Promise<Message[]> {
    try {
      // Get user's conversations first
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .contains('participants', [userId])

      if (!conversations) return []

      const conversationIds = conversations.map(c => c.id)

      // Search messages in user's conversations
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(id, first_name, last_name, avatar_url)
        `)
        .in('conversation_id', conversationIds)
        .ilike('content', `%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching messages:', error)
      return []
    }
  }
}

export const messagingService = new MessagingService()
