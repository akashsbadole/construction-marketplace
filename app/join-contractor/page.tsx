import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { generateMetadata } from '@/lib/seo/metadata'
import { 
  HammerIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  UsersIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  BriefcaseIcon,
  AwardIcon,
  ClockIcon
} from 'lucide-react'

export const metadata = generateMetadata({
  title: 'Join as Contractor - Grow Your Construction Business | BuildConnect',
  description: 'Join BuildConnect as a verified contractor and access thousands of construction projects. Grow your business with our trusted marketplace platform.',
  keywords: [
    'join as contractor',
    'contractor registration',
    'construction business',
    'contractor marketplace',
    'construction projects',
    'contractor platform india'
  ],
  canonical: 'https://buildconnect.com/join-contractor'
})

const benefits = [
  {
    icon: TrendingUpIcon,
    title: 'Grow Your Business',
    description: 'Access thousands of construction projects and expand your client base across India',
    stats: '10,000+ projects posted monthly'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Build Trust',
    description: 'Get verified and showcase your credentials to attract more customers',
    stats: '98% customer satisfaction rate'
  },
  {
    icon: CreditCardIcon,
    title: 'Secure Payments',
    description: 'Get paid on time with our escrow-based payment system',
    stats: '₹50+ Crores processed safely'
  },
  {
    icon: UsersIcon,
    title: 'Professional Network',
    description: 'Connect with other contractors, suppliers, and industry professionals',
    stats: '10,000+ verified contractors'
  }
]

const requirements = [
  'Valid business license or registration',
  'Professional experience in construction',
  'Insurance coverage (preferred)',
  'Portfolio of completed projects',
  'Valid contact information',
  'Bank account for payments'
]

const specializations = [
  'Residential Construction',
  'Commercial Construction',
  'Industrial Construction',
  'Renovation & Remodeling',
  'Interior Design',
  'Electrical Work',
  'Plumbing',
  'Roofing',
  'Flooring',
  'Painting',
  'HVAC',
  'Landscaping'
]

const successStories = [
  {
    name: 'Rajesh Kumar',
    business: 'Kumar Construction',
    location: 'Delhi',
    growth: '300% increase in projects',
    testimonial: 'BuildConnect helped me expand my business beyond my local area. The quality of leads is excellent.',
    rating: 4.9,
    projects: 150
  },
  {
    name: 'Priya Sharma',
    business: 'Sharma Interiors',
    location: 'Mumbai',
    growth: '250% revenue growth',
    testimonial: 'The platform is user-friendly and the payment system gives me confidence. Highly recommended!',
    rating: 4.8,
    projects: 89
  },
  {
    name: 'Amit Patel',
    business: 'Patel Renovations',
    location: 'Bangalore',
    growth: '400% client base expansion',
    testimonial: 'I love how BuildConnect verifies customers too. It ensures serious inquiries and quality projects.',
    rating: 5.0,
    projects: 203
  }
]

export default function JoinContractorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <HammerIcon className="h-8 w-8 text-green-600" />
                  <Badge className="bg-green-100 text-green-800">For Contractors</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Grow Your Construction Business with BuildConnect
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Join India's most trusted construction marketplace and access thousands of verified 
                  customers looking for quality contractors. Build your reputation, grow your business, 
                  and get paid securely.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Join Now - It's Free
                  </Button>
                  <Button variant="outline" size="lg">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Call Us: +91-1234567890
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">10,000+</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹50Cr+</div>
                    <div className="text-sm text-muted-foreground">Payments Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.8★</div>
                    <div className="text-sm text-muted-foreground">Platform Rating</div>
                  </div>
                </div>
              </div>
              
              <div>
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-center">Quick Registration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter first name" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter last name" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                    
                    <div>
                      <Label htmlFor="business">Business Name</Label>
                      <Input id="business" placeholder="Enter business name" />
                    </div>
                    
                    <div>
                      <Label htmlFor="specialization">Primary Specialization</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          {specializations.map((spec) => (
                            <SelectItem key={spec} value={spec.toLowerCase().replace(/\s+/g, '-')}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter your city" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the <a href="/terms" className="text-green-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>
                      </Label>
                    </div>
                    
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Register as Contractor
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      Already have an account? <a href="/login" className="text-green-600 hover:underline">Sign in here</a>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose BuildConnect?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of successful contractors who have grown their business with our platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <Card key={index} className="text-center h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground mb-3">{benefit.description}</p>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {benefit.stats}
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Start winning projects in just 4 simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Register & Verify</h3>
                <p className="text-sm text-muted-foreground">Complete your profile and get verified by our team</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Browse Projects</h3>
                <p className="text-sm text-muted-foreground">Find relevant projects in your area and specialization</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Submit Proposals</h3>
                <p className="text-sm text-muted-foreground">Send detailed quotes and win projects</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="font-semibold mb-2">Get Paid</h3>
                <p className="text-sm text-muted-foreground">Complete projects and receive secure payments</p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground">
                Hear from contractors who have transformed their business with BuildConnect
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <Card key={index} className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <BriefcaseIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{story.name}</h3>
                        <p className="text-sm text-muted-foreground">{story.business}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                        {story.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        {story.rating}
                      </div>
                    </div>
                    
                    <Badge className="bg-green-100 text-green-800 mb-4">
                      {story.growth}
                    </Badge>
                    
                    <p className="text-muted-foreground italic mb-4">
                      "{story.testimonial}"
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{story.projects} projects completed</span>
                      <div className="flex items-center gap-1">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        Verified
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Requirements to Join</h2>
                <p className="text-lg text-muted-foreground">
                  Make sure you meet these basic requirements before applying
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      Basic Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AwardIcon className="h-5 w-5 text-blue-600" />
                      Verification Process
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                          1
                        </div>
                        <span className="text-sm">Document verification</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                          2
                        </div>
                        <span className="text-sm">Background check</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                          3
                        </div>
                        <span className="text-sm">Portfolio review</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                          4
                        </div>
                        <span className="text-sm">Phone verification</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold">
                          ✓
                        </div>
                        <span className="text-sm font-medium text-green-600">Approved & Active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Common questions from contractors joining our platform
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How much does it cost to join BuildConnect?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Joining BuildConnect is completely free. We only charge a small commission (3-5%) 
                    when you successfully complete a project. No upfront fees or monthly charges.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How long does the verification process take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The verification process typically takes 2-3 business days. We'll review your documents, 
                    conduct background checks, and verify your credentials to ensure quality standards.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How do I get paid for completed projects?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Payments are processed through our secure escrow system. Funds are released based on 
                    project milestones, ensuring you get paid fairly and on time for completed work.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Can I work on projects outside my city?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can specify your service areas and bid on projects within your coverage zone. 
                    Many contractors work across multiple cities to expand their business reach.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful contractors on BuildConnect today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Register Now - Free
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Call: +91-1234567890
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-green-500/30">
              <p className="text-green-100">
                Questions? Email us at <a href="mailto:contractors@buildconnect.com" className="underline">contractors@buildconnect.com</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
