import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { generateMetadata } from '@/lib/seo/metadata'
import { CalendarIcon, ShieldIcon, EyeIcon, LockIcon, UserCheckIcon } from 'lucide-react'

export const metadata = generateMetadata({
  title: 'Privacy Policy - BuildConnect',
  description: 'Learn how BuildConnect collects, uses, and protects your personal information. Our comprehensive privacy policy explains your data rights and our security practices.',
  keywords: [
    'privacy policy',
    'data protection',
    'buildconnect privacy',
    'personal information',
    'data security',
    'user privacy'
  ],
  canonical: 'https://buildconnect.com/privacy'
})

export default function PrivacyPolicyPage() {
  const lastUpdated = '2024-01-15'

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Last updated: {new Date(lastUpdated).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <Badge variant="outline">GDPR Compliant</Badge>
          </div>
          
          <p className="mt-4 text-muted-foreground leading-relaxed">
            At BuildConnect, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, share, and protect your data when you use our platform.
          </p>
        </div>

        <div className="space-y-8">
          {/* Quick Summary */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EyeIcon className="h-5 w-5 text-blue-600" />
                Privacy at a Glance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-4 bg-white rounded-lg">
                  <LockIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium mb-1">Secure Data</h4>
                  <p className="text-muted-foreground">Your data is encrypted and stored securely</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <UserCheckIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium mb-1">Your Control</h4>
                  <p className="text-muted-foreground">You control what data you share</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <ShieldIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium mb-1">No Selling</h4>
                  <p className="text-muted-foreground">We never sell your personal data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium">1.1 Information You Provide</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Account Information</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Name and contact details</li>
                    <li>• Email address and phone number</li>
                    <li>• Profile picture and bio</li>
                    <li>• Business information (for professionals)</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Project Information</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Project descriptions and requirements</li>
                    <li>• Location and timeline details</li>
                    <li>• Budget and payment information</li>
                    <li>• Photos and documents</li>
                  </ul>
                </div>
              </div>
              
              <h4 className="font-medium">1.2 Information We Collect Automatically</h4>
              <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Location data (with your permission)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          {/* 2. How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Primary Uses</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Provide and improve our marketplace services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Match customers with contractors and vendors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Process payments and transactions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Verify user identities and prevent fraud</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Secondary Uses</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Send important updates and notifications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Provide customer support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Analyze usage patterns to improve our platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>Send marketing communications (with consent)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>3. How We Share Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">We Never Sell Your Data</h4>
                <p className="text-sm text-green-700">
                  BuildConnect does not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
              
              <h4 className="font-medium">We may share your information in these situations:</h4>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-blue-500 bg-blue-50/50">
                  <h5 className="font-medium">With Other Users</h5>
                  <p className="text-sm text-muted-foreground">
                    Profile information, project details, and reviews are visible to facilitate connections and transactions.
                  </p>
                </div>
                <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50/50">
                  <h5 className="font-medium">With Service Providers</h5>
                  <p className="text-sm text-muted-foreground">
                    Trusted third parties who help us operate our platform (payment processors, hosting providers, etc.).
                  </p>
                </div>
                <div className="p-3 border-l-4 border-red-500 bg-red-50/50">
                  <h5 className="font-medium">Legal Requirements</h5>
                  <p className="text-sm text-muted-foreground">
                    When required by law, court order, or to protect our rights and safety.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Data Security */}
          <Card>
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We implement comprehensive security measures to protect your personal information from unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Technical Safeguards</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SSL/TLS encryption for data transmission</li>
                    <li>• AES-256 encryption for data storage</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Secure cloud infrastructure</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Administrative Safeguards</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Limited access on need-to-know basis</li>
                    <li>• Employee background checks and training</li>
                    <li>• Incident response procedures</li>
                    <li>• Regular security policy updates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Your Rights and Choices */}
          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You have several rights regarding your personal information:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium">Access & Portability</h5>
                    <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium">Correction</h5>
                    <p className="text-sm text-muted-foreground">Update or correct inaccurate information</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium">Deletion</h5>
                    <p className="text-sm text-muted-foreground">Request deletion of your account and data</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium">Opt-out</h5>
                    <p className="text-sm text-muted-foreground">Unsubscribe from marketing communications</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium">Restriction</h5>
                    <p className="text-sm text-muted-foreground">Limit how we process your data</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium">Objection</h5>
                    <p className="text-sm text-muted-foreground">Object to certain data processing activities</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">How to Exercise Your Rights</h4>
                <p className="text-sm text-blue-700">
                  Contact us at privacy@buildconnect.com or use the privacy controls in your account settings. 
                  We will respond to your request within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <h5 className="font-medium mb-2">Essential Cookies</h5>
                  <p className="text-sm text-muted-foreground">Required for basic platform functionality</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <h5 className="font-medium mb-2">Analytics Cookies</h5>
                  <p className="text-sm text-muted-foreground">Help us understand how you use our platform</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <h5 className="font-medium mb-2">Marketing Cookies</h5>
                  <p className="text-sm text-muted-foreground">Used to show relevant advertisements</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                You can manage your cookie preferences through your browser settings or our cookie consent banner.
              </p>
            </CardContent>
          </Card>

          {/* 7. Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We retain your personal information only as long as necessary to provide our services and comply with legal obligations.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Account Information</span>
                  <span className="text-sm text-muted-foreground">Until account deletion + 30 days</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Transaction Records</span>
                  <span className="text-sm text-muted-foreground">7 years (legal requirement)</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Communication Logs</span>
                  <span className="text-sm text-muted-foreground">3 years</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Analytics Data</span>
                  <span className="text-sm text-muted-foreground">26 months (anonymized)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle>8. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your data during international transfers.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Data Protection Measures</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Standard Contractual Clauses (SCCs)</li>
                  <li>• Adequacy decisions by relevant authorities</li>
                  <li>• Binding Corporate Rules where applicable</li>
                  <li>• Additional security measures for sensitive data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 9. Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                BuildConnect is not intended for use by children under 18 years of age. We do not knowingly collect 
                personal information from children under 18. If we become aware that we have collected such information, 
                we will take steps to delete it promptly.
              </p>
            </CardContent>
          </Card>

          {/* 10. Changes to Privacy Policy */}
          <Card>
            <CardHeader>
              <CardTitle>10. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
                We will notify you of any material changes by posting the updated policy on our platform and sending you 
                an email notification.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle>Contact Our Privacy Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Privacy Officer</h4>
                  <p>Email: privacy@buildconnect.com</p>
                  <p>Phone: +91-11-4567-8901</p>
                  <p>Response time: Within 48 hours</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mailing Address</h4>
                  <p>BuildConnect Privacy Team<br />
                  123 Business District<br />
                  New Delhi, 110001<br />
                  India</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            This Privacy Policy is effective as of {new Date(lastUpdated).toLocaleDateString('en-IN')} and applies to all users of BuildConnect.
          </p>
          <p className="mt-2">
            Last updated: {new Date(lastUpdated).toLocaleDateString('en-IN')} | GDPR Compliant
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
