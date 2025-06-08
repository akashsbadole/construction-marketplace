'use client'

import { useState, useEffect } from 'react'
import { messagingService, ChatSettings } from '@/lib/services/messaging-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  SettingsIcon,
  BellIcon,
  VolumeXIcon,
  MonitorIcon,
  MailIcon,
  PaletteIcon,
  GlobeIcon,
  ClockIcon,
  ShieldIcon,
  UserXIcon
} from 'lucide-react'

interface ChatSettingsProps {
  userId: string
  onClose?: () => void
}

export function ChatSettings({ userId, onClose }: ChatSettingsProps) {
  const [settings, setSettings] = useState<ChatSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [userId])

  const loadSettings = async () => {
    try {
      const userSettings = await messagingService.getChatSettings(userId)
      setSettings(userSettings || {
        id: '',
        user_id: userId,
        notifications_enabled: true,
        sound_enabled: true,
        desktop_notifications: true,
        email_notifications: false,
        theme: 'light',
        language: 'en',
        timezone: 'UTC'
      })
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSetting = async (key: keyof ChatSettings, value: any) => {
    if (!settings) return

    const updatedSettings = { ...settings, [key]: value }
    setSettings(updatedSettings)

    setIsSaving(true)
    try {
      await messagingService.updateChatSettings(userId, { [key]: value })
    } catch (error) {
      console.error('Error updating setting:', error)
      // Revert on error
      setSettings(settings)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load settings</p>
        <Button onClick={loadSettings} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Chat Settings</h2>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellIcon className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications for new messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for new messages
              </p>
            </div>
            <Switch
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => updateSetting('notifications_enabled', checked)}
              disabled={isSaving}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <VolumeXIcon className="h-4 w-4" />
                Sound Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Play sound when receiving messages
              </p>
            </div>
            <Switch
              checked={settings.sound_enabled}
              onCheckedChange={(checked) => updateSetting('sound_enabled', checked)}
              disabled={isSaving || !settings.notifications_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <MonitorIcon className="h-4 w-4" />
                Desktop Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Show desktop notifications for new messages
              </p>
            </div>
            <Switch
              checked={settings.desktop_notifications}
              onCheckedChange={(checked) => updateSetting('desktop_notifications', checked)}
              disabled={isSaving || !settings.notifications_enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <MailIcon className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for missed messages
              </p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
              disabled={isSaving || !settings.notifications_enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PaletteIcon className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of your chat experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(value: 'light' | 'dark' | 'auto') => updateSetting('theme', value)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GlobeIcon className="h-5 w-5" />
            Language & Region
          </CardTitle>
          <CardDescription>
            Set your preferred language and timezone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => updateSetting('language', value)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Timezone
            </Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) => updateSetting('timezone', value)}
              disabled={isSaving}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                <SelectItem value="Asia/Singapore">Singapore Standard Time</SelectItem>
                <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                <SelectItem value="America/New_York">Eastern Standard Time (EST)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Standard Time (PST)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Manage your privacy and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Read Receipts</Label>
              <p className="text-sm text-muted-foreground">
                Let others know when you've read their messages
              </p>
            </div>
            <Switch
              checked={true}
              onCheckedChange={() => {}}
              disabled={true}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Online Status</Label>
              <p className="text-sm text-muted-foreground">
                Show when you're online to other users
              </p>
            </div>
            <Switch
              checked={true}
              onCheckedChange={() => {}}
              disabled={true}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <UserXIcon className="h-4 w-4" />
              Blocked Users
            </Label>
            <p className="text-sm text-muted-foreground">
              Manage users you've blocked from messaging you
            </p>
            <Button variant="outline" className="w-full">
              Manage Blocked Users
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Storage</CardTitle>
          <CardDescription>
            Manage your chat data and storage preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-download Media</Label>
              <p className="text-sm text-muted-foreground">
                Automatically download images and files
              </p>
            </div>
            <Switch
              checked={true}
              onCheckedChange={() => {}}
              disabled={true}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Storage Usage</Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Messages: 2.3 MB</Badge>
              <Badge variant="outline">Media: 45.7 MB</Badge>
              <Badge variant="outline">Total: 48 MB</Badge>
            </div>
            <Button variant="outline" className="w-full">
              Clear Chat Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Status */}
      {isSaving && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            Saving settings...
          </div>
        </div>
      )}
    </div>
  )
}
