'use client'

import { useState, useEffect, useRef } from 'react'
import { messagingService, Conversation, Message } from '@/lib/services/messaging-service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  MessageCircleIcon,
  SendIcon,
  PaperclipIcon,
  SearchIcon,
  MoreVerticalIcon,
  PhoneIcon,
  VideoIcon,
  FileIcon
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface MessagingSystemProps {
  currentUserId: string
  initialConversationId?: string
}

export function MessagingSystem({ currentUserId, initialConversationId }: MessagingSystemProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load conversations
  useEffect(() => {
    loadConversations()
  }, [currentUserId])

  // Load initial conversation
  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === initialConversationId)
      if (conversation) {
        selectConversation(conversation)
      }
    }
  }, [initialConversationId, conversations])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversations = async () => {
    try {
      const userConversations = await messagingService.getUserConversations(currentUserId)
      setConversations(userConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setMessages([])
    
    try {
      const conversationMessages = await messagingService.getConversationMessages(conversation.id)
      setMessages(conversationMessages.reverse()) // Reverse to show oldest first
      
      // Mark messages as read
      await messagingService.markMessagesAsRead(conversation.id, currentUserId)
      
      // Update conversation in list to remove unread count
      setConversations(prev => prev.map(c => 
        c.id === conversation.id ? { ...c, unread_count: 0 } : c
      ))
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    try {
      const message = await messagingService.sendMessage(currentUserId, {
        conversation_id: selectedConversation.id,
        content: newMessage.trim()
      })

      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      // Update conversation in list
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, last_message: message, last_message_at: message.created_at }
          : c
      ))
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  const getOtherParticipant = (conversation: Conversation) => {
    // For direct conversations, get the other participant
    const otherParticipantId = conversation.participants.find(id => id !== currentUserId)
    // In a real app, you'd fetch user details
    return { id: otherParticipantId, name: 'User', avatar: null }
  }

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true
    const otherParticipant = getOtherParticipant(conv)
    return otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conv.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircleIcon className="h-5 w-5" />
            <h3 className="font-semibold">Messages</h3>
          </div>
          
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircleIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation)
                const isSelected = selectedConversation?.id === conversation.id

                return (
                  <div
                    key={conversation.id}
                    onClick={() => selectConversation(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={otherParticipant.avatar || undefined} />
                        <AvatarFallback>
                          {otherParticipant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium truncate">{otherParticipant.name}</h4>
                          {conversation.unread_count && conversation.unread_count > 0 && (
                            <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                        
                        {conversation.last_message && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.last_message.content}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(conversation.last_message.created_at)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getOtherParticipant(selectedConversation).name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{getOtherParticipant(selectedConversation).name}</h3>
                    <p className="text-sm text-muted-foreground">Online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <PhoneIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <VideoIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.sender_id === currentUserId
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            isOwnMessage
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.message_type === 'text' && (
                            <p className="text-sm">{message.content}</p>
                          )}
                          
                          {message.message_type === 'image' && (
                            <div className="space-y-2">
                              <img
                                src={message.attachments[0]?.url}
                                alt="Shared image"
                                className="rounded max-w-full h-auto"
                              />
                              {message.content && (
                                <p className="text-sm">{message.content}</p>
                              )}
                            </div>
                          )}
                          
                          {message.message_type === 'file' && (
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-4 w-4" />
                              <span className="text-sm">{message.attachments[0]?.name}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className={`mt-1 text-xs text-muted-foreground ${
                          isOwnMessage ? 'text-right' : 'text-left'
                        }`}>
                          {formatMessageTime(message.created_at)}
                        </div>
                      </div>
                      
                      {!isOwnMessage && (
                        <Avatar className="h-8 w-8 order-1 mr-2">
                          <AvatarFallback className="text-xs">
                            {message.sender?.first_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                
                <div className="flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isSending}
                  />
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="sm"
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  // Handle file upload
                  const file = e.target.files?.[0]
                  if (file) {
                    // Implement file upload logic
                    console.log('File selected:', file)
                  }
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircleIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
