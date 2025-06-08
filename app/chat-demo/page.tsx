'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { EnhancedMessaging } from '@/components/enhanced-messaging'
import { ChatSettings } from '@/components/chat-settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircleIcon,
  SettingsIcon,
  DatabaseIcon,
  CodeIcon,
  CheckCircleIcon,
  StarIcon,
  UsersIcon,
  ShieldIcon,
  ZapIcon,
  GlobeIcon
} from 'lucide-react'

export default function ChatDemoPage() {
  const [activeTab, setActiveTab] = useState('demo')
  
  // Mock user ID for demo
  const currentUserId = 'demo-user-123'

  const features = [
    {
      icon: MessageCircleIcon,
      title: 'Real-time Messaging',
      description: 'Instant messaging with WebSocket support for real-time communication',
      status: 'implemented'
    },
    {
      icon: StarIcon,
      title: 'Message Reactions',
      description: 'React to messages with emojis, view reaction counts and users',
      status: 'implemented'
    },
    {
      icon: CodeIcon,
      title: 'Message Editing & Deletion',
      description: 'Edit sent messages or delete them with proper indicators',
      status: 'implemented'
    },
    {
      icon: UsersIcon,
      title: 'Multi-user Conversations',
      description: 'Support for direct messages, group chats, and project discussions',
      status: 'implemented'
    },
    {
      icon: ShieldIcon,
      title: 'Privacy & Security',
      description: 'Message encryption, user blocking, and privacy controls',
      status: 'implemented'
    },
    {
      icon: ZapIcon,
      title: 'Advanced Features',
      description: 'File attachments, message search, notifications, and more',
      status: 'implemented'
    },
    {
      icon: GlobeIcon,
      title: 'Multi-language Support',
      description: 'Support for 10+ Indian languages and international languages',
      status: 'implemented'
    },
    {
      icon: DatabaseIcon,
      title: 'Complete Database Schema',
      description: 'Production-ready PostgreSQL schema with proper indexing and RLS',
      status: 'implemented'
    }
  ]

  const schemaFeatures = [
    'Users table with online status and user types',
    'Conversations with support for direct, group, and project chats',
    'Messages with replies, reactions, and attachments',
    'Message read receipts and delivery status',
    'Notifications system with multiple types',
    'Chat settings and user preferences',
    'Blocked users and privacy controls',
    'File attachments with metadata',
    'Real-time subscriptions with Supabase',
    'Row Level Security (RLS) for data protection'
  ]

  const techStack = [
    { name: 'Frontend', tech: 'Next.js 15 + TypeScript + Tailwind CSS' },
    { name: 'Backend', tech: 'Supabase (PostgreSQL + Real-time + Auth)' },
    { name: 'State Management', tech: 'React Hooks + Context API' },
    { name: 'UI Components', tech: 'Shadcn/ui + Radix UI' },
    { name: 'Real-time', tech: 'Supabase Realtime (WebSockets)' },
    { name: 'File Storage', tech: 'Supabase Storage' },
    { name: 'Database', tech: 'PostgreSQL with advanced features' },
    { name: 'Security', tech: 'Row Level Security + JWT Auth' }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Open Source Chat System for BuildConnect
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A complete, production-ready chat system with advanced features, 
              comprehensive database schema, and modern architecture.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="schema">Database Schema</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Live Demo Tab */}
            <TabsContent value="demo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircleIcon className="h-6 w-6" />
                    Live Chat Demo
                  </CardTitle>
                  <CardDescription>
                    Experience the full-featured chat system with reactions, editing, replies, and more.
                    This is a fully functional demo with mock data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <EnhancedMessaging currentUserId={currentUserId} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <MessageCircleIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Real-time Messaging</h3>
                    <p className="text-sm text-muted-foreground">
                      Instant message delivery with WebSocket support
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <StarIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Message Reactions</h3>
                    <p className="text-sm text-muted-foreground">
                      React with emojis and see who reacted
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <CodeIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold">Edit & Delete</h3>
                    <p className="text-sm text-muted-foreground">
                      Edit or delete your messages with indicators
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Feature Set</CardTitle>
                  <CardDescription>
                    All the features you need for a modern chat system in a construction marketplace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{feature.title}</h3>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              {feature.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                  <CardDescription>
                    Modern, scalable technologies for enterprise-grade chat functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {techStack.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="outline">{item.tech}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Database Schema Tab */}
            <TabsContent value="schema" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DatabaseIcon className="h-6 w-6" />
                    Complete Database Schema
                  </CardTitle>
                  <CardDescription>
                    Production-ready PostgreSQL schema with all necessary tables, indexes, and security
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 p-4 rounded-lg mb-4">
                    <h3 className="font-semibold mb-2">Schema Location</h3>
                    <code className="text-sm bg-background p-2 rounded border">
                      /database/chat-schema.sql
                    </code>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-3">Database Tables</h3>
                      <div className="space-y-2">
                        {[
                          'users - User profiles and status',
                          'conversations - Chat conversations',
                          'messages - Individual messages',
                          'message_reads - Read receipts',
                          'conversation_participants - Participant management',
                          'notifications - System notifications',
                          'chat_attachments - File attachments',
                          'message_reactions - Message reactions',
                          'chat_settings - User preferences',
                          'blocked_users - Privacy controls'
                        ].map((table, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            <span>{table}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Advanced Features</h3>
                      <div className="space-y-2">
                        {schemaFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircleIcon className="h-4 w-4 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Features</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Complete PostgreSQL schema with proper relationships</li>
                      <li>• Row Level Security (RLS) for data protection</li>
                      <li>• Optimized indexes for performance</li>
                      <li>• Triggers for automatic data management</li>
                      <li>• Support for real-time subscriptions</li>
                      <li>• Scalable architecture for enterprise use</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-6 w-6" />
                    Chat Settings Demo
                  </CardTitle>
                  <CardDescription>
                    Comprehensive user settings for notifications, appearance, privacy, and more
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChatSettings userId={currentUserId} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Implementation Guide */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Implementation Guide</CardTitle>
              <CardDescription>
                How to implement this chat system in your BuildConnect marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">1. Database Setup</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Run the SQL schema in your PostgreSQL database</p>
                    <p>• Configure Supabase project with the schema</p>
                    <p>• Set up Row Level Security policies</p>
                    <p>• Enable real-time subscriptions</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">2. Frontend Integration</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Install required dependencies</p>
                    <p>• Configure Supabase client</p>
                    <p>• Add messaging components to your app</p>
                    <p>• Integrate with your authentication system</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">3. Customization</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Customize UI components to match your design</p>
                    <p>• Add marketplace-specific message types</p>
                    <p>• Configure notification preferences</p>
                    <p>• Set up file upload and storage</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Ready for Production</h4>
                <p className="text-sm text-green-700">
                  This chat system is production-ready with proper error handling, security measures, 
                  performance optimizations, and scalable architecture. It's designed specifically 
                  for construction marketplace applications like BuildConnect.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
