import type {
  NotificationChannel,
  CommunicationLog,
  User,
  MaterialRequirement,
  VendorResponse,
} from "@/lib/types/marketplace"

export interface EmailConfig {
  apiKey: string
  fromEmail: string
  fromName: string
}

export interface TwilioConfig {
  accountSid: string
  authToken: string
  fromNumber: string
}

export interface WhatsAppConfig {
  apiKey: string
  fromNumber: string
  baseUrl: string
}

export class CommunicationService {
  private emailConfig: EmailConfig
  private twilioConfig: TwilioConfig
  private whatsappConfig: WhatsAppConfig
  private logs: Map<string, CommunicationLog> = new Map()

  constructor(emailConfig: EmailConfig, twilioConfig: TwilioConfig, whatsappConfig: WhatsAppConfig) {
    this.emailConfig = emailConfig
    this.twilioConfig = twilioConfig
    this.whatsappConfig = whatsappConfig
  }

  // Email Service
  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In a real implementation, you would use a service like SendGrid, AWS SES, or Resend
      console.log("Sending email:", { to, subject })

      // Mock email sending
      const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Log the communication
      await this.logCommunication({
        fromUserId: "system",
        toUserId: to,
        channel: "email",
        type: "general",
        subject,
        message: htmlContent,
        status: "sent",
        metadata: { messageId },
      })

      return { success: true, messageId }
    } catch (error) {
      console.error("Email sending failed:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  // SMS Service (Twilio)
  async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In a real implementation, you would use Twilio SDK
      console.log("Sending SMS:", { to, message })

      // Mock SMS sending
      const messageId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Log the communication
      await this.logCommunication({
        fromUserId: "system",
        toUserId: to,
        channel: "sms",
        type: "general",
        message,
        status: "sent",
        metadata: { messageId },
      })

      return { success: true, messageId }
    } catch (error) {
      console.error("SMS sending failed:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  // WhatsApp Service
  async sendWhatsApp(
    to: string,
    message: string,
    templateName?: string,
    templateParams?: Record<string, string>,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // In a real implementation, you would use WhatsApp Business API
      console.log("Sending WhatsApp:", { to, message, templateName })

      // Mock WhatsApp sending
      const messageId = `whatsapp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Log the communication
      await this.logCommunication({
        fromUserId: "system",
        toUserId: to,
        channel: "whatsapp",
        type: "general",
        message,
        status: "sent",
        metadata: { messageId, templateName, templateParams },
      })

      return { success: true, messageId }
    } catch (error) {
      console.error("WhatsApp sending failed:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  // Multi-channel notification
  async sendNotification(
    user: User,
    title: string,
    message: string,
    channels: NotificationChannel[] = ["email"],
    data?: Record<string, any>,
  ): Promise<{ success: boolean; results: Record<NotificationChannel, any> }> {
    const results: Record<NotificationChannel, any> = {}
    let overallSuccess = true

    for (const channel of channels) {
      if (!user.preferences.notifications[channel]) {
        results[channel] = { success: false, error: "User has disabled this channel" }
        continue
      }

      try {
        switch (channel) {
          case "email":
            if (user.email) {
              const emailResult = await this.sendEmail(
                user.email,
                title,
                this.generateEmailTemplate(title, message, data),
                message,
              )
              results[channel] = emailResult
            } else {
              results[channel] = { success: false, error: "No email address" }
            }
            break

          case "sms":
            if (user.phone) {
              const smsResult = await this.sendSMS(user.phone, `${title}\n\n${message}`)
              results[channel] = smsResult
            } else {
              results[channel] = { success: false, error: "No phone number" }
            }
            break

          case "whatsapp":
            if (user.phone) {
              const whatsappResult = await this.sendWhatsApp(user.phone, `*${title}*\n\n${message}`)
              results[channel] = whatsappResult
            } else {
              results[channel] = { success: false, error: "No phone number" }
            }
            break

          default:
            results[channel] = { success: false, error: "Unsupported channel" }
        }

        if (!results[channel].success) {
          overallSuccess = false
        }
      } catch (error) {
        results[channel] = { success: false, error: error instanceof Error ? error.message : "Unknown error" }
        overallSuccess = false
      }
    }

    return { success: overallSuccess, results }
  }

  // Requirement-specific notifications
  async notifyVendorsAboutRequirement(
    requirement: MaterialRequirement,
    vendors: User[],
    channels: NotificationChannel[] = ["email", "sms"],
  ): Promise<void> {
    const title = `New Material Requirement: ${requirement.title}`
    const message = `A new material requirement has been posted in your area.\n\nCategory: ${requirement.category}\nLocation: ${requirement.location.city}, ${requirement.location.state}\nBudget: ₹${requirement.budget.min || "Not specified"} - ₹${requirement.budget.max || "Open"}\n\nView details and respond to connect with the customer.`

    const data = {
      requirementId: requirement.id,
      category: requirement.category,
      location: requirement.location.city,
      budget: requirement.budget,
      urgency: requirement.timeline.urgency,
    }

    for (const vendor of vendors) {
      await this.sendNotification(vendor, title, message, channels, data)
    }
  }

  async notifyCustomerAboutVendorResponse(
    customer: User,
    requirement: MaterialRequirement,
    vendorResponse: VendorResponse,
    vendor: User,
  ): Promise<void> {
    const title = `New Response for: ${requirement.title}`
    const message = `${vendor.firstName} ${vendor.lastName} has responded to your material requirement.\n\nStatus: ${vendorResponse.status}\nPreferred Contact: ${vendorResponse.contactPreference}\n\nView the response and connect with the vendor.`

    const data = {
      requirementId: requirement.id,
      vendorId: vendorResponse.vendorId,
      responseId: vendorResponse.id,
      vendorName: `${vendor.firstName} ${vendor.lastName}`,
    }

    await this.sendNotification(
      customer,
      title,
      message,
      customer.preferences.notifications.email ? ["email", "sms"] : ["sms"],
      data,
    )
  }

  // Template generators
  private generateEmailTemplate(title: string, message: string, data?: Record<string, any>): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>BuildConnect</h1>
            </div>
            <div class="content">
              <h2>${title}</h2>
              <p>${message.replace(/\n/g, "<br>")}</p>
              ${data?.requirementId ? `<a href="${process.env.NEXT_PUBLIC_APP_URL}/requirements/${data.requirementId}" class="button">View Requirement</a>` : ""}
            </div>
            <div class="footer">
              <p>BuildConnect - Your Construction Marketplace</p>
              <p>If you no longer wish to receive these emails, <a href="#">unsubscribe here</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  // Communication logging
  private async logCommunication(log: Omit<CommunicationLog, "id" | "sentAt">): Promise<void> {
    const communicationLog: CommunicationLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sentAt: new Date().toISOString(),
    }

    this.logs.set(communicationLog.id, communicationLog)
  }

  // Get communication history
  async getCommunicationHistory(userId: string): Promise<CommunicationLog[]> {
    return Array.from(this.logs.values())
      .filter((log) => log.fromUserId === userId || log.toUserId === userId)
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
  }
}

// Initialize communication service with environment variables
export const communicationService = new CommunicationService(
  {
    apiKey: process.env.EMAIL_API_KEY || "mock-email-key",
    fromEmail: process.env.FROM_EMAIL || "noreply@buildconnect.com",
    fromName: process.env.FROM_NAME || "BuildConnect",
  },
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "mock-twilio-sid",
    authToken: process.env.TWILIO_AUTH_TOKEN || "mock-twilio-token",
    fromNumber: process.env.TWILIO_FROM_NUMBER || "+1234567890",
  },
  {
    apiKey: process.env.WHATSAPP_API_KEY || "mock-whatsapp-key",
    fromNumber: process.env.WHATSAPP_FROM_NUMBER || "+1234567890",
    baseUrl: process.env.WHATSAPP_API_URL || "https://api.whatsapp.com",
  },
)
