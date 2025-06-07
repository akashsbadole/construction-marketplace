'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { MessagingSystem } from '@/components/messaging'
import { MessageCircleIcon } from 'lucide-react'

interface MessagingTriggerProps {
  currentUserId?: string
  unreadCount?: number
}

export function MessagingTrigger({ currentUserId, unreadCount = 0 }: MessagingTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // If no user ID is provided, show a login prompt
  if (!currentUserId) {
    return (
      <Button variant="outline" size="icon" className="relative">
        <MessageCircleIcon className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <MessageCircleIcon className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-4xl p-0" side="right">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Messages</SheetTitle>
        </SheetHeader>
        
        <div className="h-[calc(100vh-80px)]">
          <MessagingSystem currentUserId={currentUserId} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
