'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  PhoneIcon, 
  MailIcon, 
  ShieldCheckIcon, 
  EyeOffIcon,
  MessageSquareIcon,
  InfoIcon,
  CheckCircleIcon
} from 'lucide-react'

interface ContactInfo {
  phone?: string
  email?: string
  website?: string
}

interface ContactProtectionProps {
  contactInfo: ContactInfo
  businessName: string
  businessType: 'contractor' | 'vendor'
  isVerified?: boolean
  onContactRequest?: (requestData: ContactRequestData) => void
}

interface ContactRequestData {
  requesterName: string
  requesterEmail: string
  requesterPhone: string
  projectDescription: string
  budget?: string
  timeline?: string
  requestType: 'quote' | 'consultation' | 'partnership' | 'general'
}

// Utility function to mask contact details
export function maskPhone(phone: string): string {
  if (!phone) return ''
  // Show first 3 digits and last 2 digits: +91 987** ***10
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length >= 10) {
    const countryCode = cleaned.startsWith('91') ? '+91 ' : ''
    const number = cleaned.slice(-10)
    return `${countryCode}${number.slice(0, 3)}** ***${number.slice(-2)}`
  }
  return phone.slice(0, 3) + '***' + phone.slice(-2)
}

export function maskEmail(email: string): string {
  if (!email) return ''
  const [username, domain] = email.split('@')
  if (!username || !domain) return email
  
  const maskedUsername = username.length > 2 
    ? username.slice(0, 2) + '*'.repeat(Math.max(1, username.length - 2))
    : username
  
  return `${maskedUsername}@${domain}`
}

export function ContactProtection({ 
  contactInfo, 
  businessName, 
  businessType,
  isVerified = false,
  onContactRequest 
}: ContactProtectionProps) {
  const [showContactForm, setShowContactForm] = useState(false)
  const [requestData, setRequestData] = useState<ContactRequestData>({
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    projectDescription: '',
    budget: '',
    timeline: '',
    requestType: 'quote'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  const handleContactRequest = async () => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (onContactRequest) {
      onContactRequest(requestData)
    }
    
    setRequestSent(true)
    setIsSubmitting(false)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowContactForm(false)
      setRequestSent(false)
      setRequestData({
        requesterName: '',
        requesterEmail: '',
        requesterPhone: '',
        projectDescription: '',
        budget: '',
        timeline: '',
        requestType: 'quote'
      })
    }, 3000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-green-600" />
          Protected Contact Information
          {isVerified && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Contact details are protected. Submit a requirement to get connected.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Masked Contact Info */}
        <div className="space-y-3">
          {contactInfo.phone && (
            <div className="flex items-center gap-3">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm">{maskPhone(contactInfo.phone)}</span>
              <EyeOffIcon className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          {contactInfo.email && (
            <div className="flex items-center gap-3">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm">{maskEmail(contactInfo.email)}</span>
              <EyeOffIcon className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          {contactInfo.website && (
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 text-muted-foreground">🌐</span>
              <a 
                href={contactInfo.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                {contactInfo.website}
              </a>
            </div>
          )}
        </div>

        {/* Contact Request Button */}
        <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <MessageSquareIcon className="h-4 w-4 mr-2" />
              Request Contact Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Contact {businessName}</DialogTitle>
              <DialogDescription>
                Share your requirement details to get connected with this {businessType}.
              </DialogDescription>
            </DialogHeader>

            {!requestSent ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={requestData.requesterName}
                      onChange={(e) => setRequestData(prev => ({ ...prev, requesterName: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Your Phone *</Label>
                    <Input
                      id="phone"
                      value={requestData.requesterPhone}
                      onChange={(e) => setRequestData(prev => ({ ...prev, requesterPhone: e.target.value }))}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={requestData.requesterEmail}
                    onChange={(e) => setRequestData(prev => ({ ...prev, requesterEmail: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="project">Project Description *</Label>
                  <Textarea
                    id="project"
                    value={requestData.projectDescription}
                    onChange={(e) => setRequestData(prev => ({ ...prev, projectDescription: e.target.value }))}
                    placeholder="Describe your project requirements..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Input
                      id="budget"
                      value={requestData.budget}
                      onChange={(e) => setRequestData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="₹ 5,00,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Timeline (Optional)</Label>
                    <Input
                      id="timeline"
                      value={requestData.timeline}
                      onChange={(e) => setRequestData(prev => ({ ...prev, timeline: e.target.value }))}
                      placeholder="3 months"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <InfoIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Privacy Protection</p>
                      <p>Your details will only be shared with {businessName} for this specific requirement.</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleContactRequest} 
                  disabled={isSubmitting || !requestData.requesterName || !requestData.requesterEmail || !requestData.projectDescription}
                  className="w-full"
                >
                  {isSubmitting ? 'Sending Request...' : 'Send Contact Request'}
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Request Sent Successfully!</h3>
                <p className="text-muted-foreground">
                  {businessName} will review your requirement and contact you within 24 hours.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="text-xs text-muted-foreground">
          <p>🔒 Contact details are protected to prevent spam and ensure quality connections.</p>
        </div>
      </CardContent>
    </Card>
  )
}
