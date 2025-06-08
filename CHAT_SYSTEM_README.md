# BuildConnect Open Source Chat System

A complete, production-ready chat system designed specifically for construction marketplace applications. Built with modern technologies and comprehensive features for real-time communication.

## 🚀 Features

### Core Messaging
- ✅ **Real-time Messaging** - Instant message delivery with WebSocket support
- ✅ **Message Types** - Text, images, files, system messages, and more
- ✅ **Message Reactions** - React with emojis, view reaction counts and users
- ✅ **Message Editing** - Edit sent messages with proper indicators
- ✅ **Message Deletion** - Delete messages with tombstone indicators
- ✅ **Message Replies** - Reply to specific messages with threading
- ✅ **Read Receipts** - Track message delivery and read status

### Conversation Management
- ✅ **Direct Messages** - One-on-one conversations
- ✅ **Group Chats** - Multi-user conversations
- ✅ **Project Discussions** - Context-aware project-based chats
- ✅ **Support Conversations** - Customer support integration
- ✅ **Conversation Search** - Find conversations and messages quickly

### Advanced Features
- ✅ **File Attachments** - Upload and share images, documents, and files
- ✅ **Notifications** - Real-time notifications with customizable settings
- ✅ **User Presence** - Online/offline status and last seen
- ✅ **Message Search** - Full-text search across all conversations
- ✅ **Chat Settings** - Comprehensive user preferences
- ✅ **Privacy Controls** - Block users, manage privacy settings
- ✅ **Multi-language Support** - Support for 10+ Indian languages

### Security & Privacy
- ✅ **Row Level Security** - Database-level security with Supabase RLS
- ✅ **User Authentication** - Secure user authentication and authorization
- ✅ **Data Encryption** - Secure data transmission and storage
- ✅ **Privacy Controls** - User blocking, message deletion, and privacy settings

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Database**: PostgreSQL with advanced features
- **Real-time**: Supabase Realtime (WebSockets)
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: React Hooks + Context API
- **File Storage**: Supabase Storage
- **Security**: Row Level Security + JWT Auth

### Database Schema
Complete PostgreSQL schema with 10+ tables:
- `users` - User profiles and online status
- `conversations` - Chat conversations with metadata
- `messages` - Individual messages with attachments
- `message_reads` - Read receipts and delivery status
- `conversation_participants` - Participant management
- `notifications` - System notifications
- `chat_attachments` - File attachment metadata
- `message_reactions` - Message reactions and emojis
- `chat_settings` - User preferences and settings
- `blocked_users` - Privacy and blocking controls

## 📁 File Structure

```
/database/
  chat-schema.sql                 # Complete database schema

/lib/services/
  messaging-service.ts            # Core messaging service with all APIs

/components/
  messaging.tsx                   # Basic messaging component
  enhanced-messaging.tsx          # Advanced messaging with reactions, editing
  messaging-trigger.tsx           # Chat trigger button for navigation
  chat-settings.tsx              # Comprehensive settings component

/app/
  chat-demo/page.tsx             # Complete demo and documentation page
```

## 🚀 Quick Start

### 1. Database Setup

1. **Create Supabase Project**
   ```bash
   # Create a new Supabase project at https://supabase.com
   ```

2. **Run Database Schema**
   ```sql
   -- Execute the complete schema
   \i database/chat-schema.sql
   ```

3. **Configure Environment**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 2. Frontend Integration

1. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   npm install date-fns
   npm install lucide-react
   ```

2. **Add Components**
   ```tsx
   import { EnhancedMessaging } from '@/components/enhanced-messaging'
   import { MessagingTrigger } from '@/components/messaging-trigger'
   
   // In your app
   <MessagingTrigger currentUserId={userId} unreadCount={3} />
   
   // Full chat interface
   <EnhancedMessaging currentUserId={userId} />
   ```

### 3. Configuration

1. **Supabase Client Setup**
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   )
   ```

2. **Enable Real-time**
   ```sql
   -- Enable real-time for tables
   ALTER PUBLICATION supabase_realtime ADD TABLE messages;
   ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
   ```

## 🎯 Usage Examples

### Basic Messaging
```tsx
import { EnhancedMessaging } from '@/components/enhanced-messaging'

function ChatPage() {
  return (
    <div className="h-screen">
      <EnhancedMessaging 
        currentUserId="user-123"
        initialConversationId="conv-456"
      />
    </div>
  )
}
```

### Navigation Integration
```tsx
import { MessagingTrigger } from '@/components/messaging-trigger'

function Navigation() {
  return (
    <nav>
      <MessagingTrigger 
        currentUserId={user?.id}
        unreadCount={unreadMessages}
      />
    </nav>
  )
}
```

### Chat Settings
```tsx
import { ChatSettings } from '@/components/chat-settings'

function SettingsPage() {
  return (
    <ChatSettings 
      userId="user-123"
      onClose={() => router.back()}
    />
  )
}
```

## 🔧 API Reference

### MessagingService Methods

```typescript
// Conversations
await messagingService.getOrCreateConversation(['user1', 'user2'])
await messagingService.getUserConversations('user-id')
await messagingService.deleteConversation('conversation-id')

// Messages
await messagingService.sendMessage('user-id', {
  conversation_id: 'conv-id',
  content: 'Hello world!',
  message_type: 'text'
})
await messagingService.getConversationMessages('conversation-id')
await messagingService.editMessage('message-id', 'user-id', 'New content')
await messagingService.deleteMessage('message-id', 'user-id')

// Reactions
await messagingService.addReaction('message-id', 'user-id', '👍')
await messagingService.removeReaction('message-id', 'user-id', '👍')
await messagingService.getMessageReactions('message-id')

// Settings
await messagingService.getChatSettings('user-id')
await messagingService.updateChatSettings('user-id', { theme: 'dark' })

// Privacy
await messagingService.blockUser('blocker-id', 'blocked-id')
await messagingService.unblockUser('blocker-id', 'blocked-id')
```

## 🎨 Customization

### Styling
The chat system uses Tailwind CSS and can be easily customized:

```tsx
// Custom theme
<EnhancedMessaging 
  currentUserId={userId}
  className="custom-chat-theme"
/>
```

### Message Types
Add custom message types for marketplace-specific needs:

```typescript
// Custom message types
type CustomMessageType = 'quote' | 'order' | 'payment' | 'project_update'

// Send custom message
await messagingService.sendMessage(userId, {
  conversation_id: conversationId,
  content: 'Quote request for cement',
  message_type: 'quote',
  metadata: {
    quote_id: 'quote-123',
    amount: 50000,
    items: ['cement', 'steel']
  }
})
```

## 🔒 Security Features

### Row Level Security
```sql
-- Users can only see their own conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (auth.uid()::text = ANY(participants::text[]));

-- Users can only send messages to their conversations
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM conversations WHERE id = conversation_id 
            AND auth.uid()::text = ANY(participants::text[]))
  );
```

### Privacy Controls
- User blocking and unblocking
- Message deletion with tombstones
- Read receipt controls
- Online status privacy
- Notification preferences

## 📱 Mobile Support

The chat system is fully responsive and mobile-optimized:
- Touch-friendly interface
- Swipe gestures for actions
- Mobile-optimized file uploads
- Responsive design for all screen sizes

## 🌐 Internationalization

Support for multiple languages:
- English, Hindi, Bengali, Telugu, Marathi
- Tamil, Gujarati, Kannada, Malayalam, Punjabi
- Easy to add more languages
- RTL language support ready

## 🚀 Performance

### Optimizations
- Efficient database queries with proper indexing
- Real-time subscriptions for instant updates
- Lazy loading for message history
- Image optimization and compression
- Caching for frequently accessed data

### Scalability
- Horizontal scaling with Supabase
- CDN support for file attachments
- Database connection pooling
- Optimized for high concurrent users

## 📊 Analytics & Monitoring

Track chat system usage:
- Message volume and frequency
- User engagement metrics
- Popular features usage
- Performance monitoring
- Error tracking and logging

## 🤝 Contributing

This is an open-source chat system. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This chat system is open source and available under the MIT License.

## 🆘 Support

For support and questions:
- Check the demo at `/chat-demo`
- Review the database schema in `/database/chat-schema.sql`
- Examine the service implementation in `/lib/services/messaging-service.ts`

---

**Built with ❤️ for the BuildConnect construction marketplace community**
