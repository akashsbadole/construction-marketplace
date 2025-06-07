import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateMetadata } from '@/lib/seo/metadata'
import { 
  SearchIcon,
  FileTextIcon,
  UsersIcon,
  CheckCircleIcon,
  CreditCardIcon,
  StarIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  MessageCircleIcon,
  TruckIcon
} from 'lucide-react'

export const metadata = generateMetadata({
  title: 'How BuildConnect Works - Simple Steps to Your Dream Project',
  description: 'Learn how BuildConnect makes finding contractors and completing construction projects simple. Step-by-step guide for customers, contractors, and vendors.',
  keywords: [
    'how buildconnect works',
    'construction process',
    'hire contractors',
    'construction marketplace guide',
    'project workflow',
    'contractor platform'
  ],
  canonical: 'https://buildconnect.com/how-it-works'
})

const customerSteps = [
  {
    step: 1,
    icon: FileTextIcon,
    title: 'Post Your Project',
    description: 'Describe your construction project with details, budget, timeline, and requirements.',
    details: [
      'Fill out a simple project form',
      'Upload photos and documents',
      'Set your budget and timeline',
      'Choose project visibility settings'
    ]
  },
  {
    step: 2,
    icon: SearchIcon,
    title: 'Get Matched',
    description: 'Our algorithm matches you with verified contractors based on your project requirements.',
    details: [
      'Receive bids from qualified contractors',
      'View contractor profiles and portfolios',
      'Compare ratings and reviews',
      'Check certifications and experience'
    ]
  },
  {
    step: 3,
    icon: UsersIcon,
    title: 'Choose & Hire',
    description: 'Review proposals, chat with contractors, and hire the best fit for your project.',
    details: [
      'Compare detailed proposals',
      'Chat directly with contractors',
      'Negotiate terms and pricing',
      'Sign digital contracts'
    ]
  },
  {
    step: 4,
    icon: CheckCircleIcon,
    title: 'Project Execution',
    description: 'Track progress, communicate with your contractor, and manage milestones.',
    details: [
      'Real-time project updates',
      'Milestone-based payments',
      'Direct communication tools',
      'Progress photo sharing'
    ]
  },
  {
    step: 5,
    icon: StarIcon,
    title: 'Review & Complete',
    description: 'Complete your project, make final payment, and leave a review.',
    details: [
      'Final project inspection',
      'Secure payment release',
      'Rate your contractor',
      'Share project photos'
    ]
  }
]

const contractorSteps = [
  {
    step: 1,
    icon: ShieldCheckIcon,
    title: 'Get Verified',
    description: 'Complete our verification process to build trust with potential customers.',
    details: [
      'Submit business documents',
      'Verify licenses and certifications',
      'Background check completion',
      'Portfolio review and approval'
    ]
  },
  {
    step: 2,
    icon: SearchIcon,
    title: 'Find Projects',
    description: 'Browse relevant projects in your area and specialization.',
    details: [
      'Filter by location and category',
      'View project requirements',
      'Check customer ratings',
      'Access project budgets'
    ]
  },
  {
    step: 3,
    icon: FileTextIcon,
    title: 'Submit Proposals',
    description: 'Create compelling proposals with detailed quotes and timelines.',
    details: [
      'Detailed cost breakdowns',
      'Project timeline planning',
      'Material specifications',
      'Terms and conditions'
    ]
  },
  {
    step: 4,
    icon: MessageCircleIcon,
    title: 'Win Projects',
    description: 'Communicate with customers and win projects based on your expertise.',
    details: [
      'Direct customer communication',
      'Clarify project requirements',
      'Negotiate project terms',
      'Finalize contracts'
    ]
  },
  {
    step: 5,
    icon: CreditCardIcon,
    title: 'Get Paid',
    description: 'Complete projects and receive secure payments through our platform.',
    details: [
      'Milestone-based payments',
      'Secure escrow system',
      'Quick payment processing',
      'Transparent fee structure'
    ]
  }
]

const vendorSteps = [
  {
    step: 1,
    icon: ShieldCheckIcon,
    title: 'Register & Verify',
    description: 'Set up your vendor profile and get verified to start selling.',
    details: [
      'Business registration',
      'Product catalog setup',
      'Quality certifications',
      'Delivery area mapping'
    ]
  },
  {
    step: 2,
    icon: FileTextIcon,
    title: 'List Products',
    description: 'Add your construction materials and products to our marketplace.',
    details: [
      'Product descriptions and specs',
      'Competitive pricing',
      'High-quality images',
      'Stock availability updates'
    ]
  },
  {
    step: 3,
    icon: SearchIcon,
    title: 'Receive Orders',
    description: 'Get orders from customers and contractors in your service area.',
    details: [
      'Real-time order notifications',
      'Customer requirements',
      'Delivery preferences',
      'Payment terms'
    ]
  },
  {
    step: 4,
    icon: TruckIcon,
    title: 'Fulfill Orders',
    description: 'Process orders, arrange delivery, and maintain quality standards.',
    details: [
      'Order processing',
      'Quality assurance',
      'Timely delivery',
      'Customer communication'
    ]
  },
  {
    step: 5,
    icon: StarIcon,
    title: 'Build Reputation',
    description: 'Deliver excellent service and build your reputation on the platform.',
    details: [
      'Customer reviews',
      'Rating improvements',
      'Repeat business',
      'Platform recognition'
    ]
  }
]

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Verified Professionals',
    description: 'All contractors and vendors go through our rigorous verification process'
  },
  {
    icon: CreditCardIcon,
    title: 'Secure Payments',
    description: 'Escrow-based payment system protects both customers and contractors'
  },
  {
    icon: ClockIcon,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to help with any issues'
  },
  {
    icon: StarIcon,
    title: 'Quality Assurance',
    description: 'Rating and review system ensures high-quality service delivery'
  }
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How BuildConnect Works
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover how our platform makes construction projects simple, transparent, and successful. 
              Whether you're a customer, contractor, or vendor, we've streamlined the process for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <PlayCircleIcon className="h-5 w-5 mr-2" />
                Watch Demo Video
              </Button>
              <Button variant="outline" size="lg">
                Start Your Project
              </Button>
            </div>
          </div>
        </section>

        {/* Process Tabs */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Journey</h2>
              <p className="text-lg text-muted-foreground">
                Select your role to see how BuildConnect works for you
              </p>
            </div>

            <Tabs defaultValue="customers" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="customers">For Customers</TabsTrigger>
                <TabsTrigger value="contractors">For Contractors</TabsTrigger>
                <TabsTrigger value="vendors">For Vendors</TabsTrigger>
              </TabsList>

              {/* Customer Journey */}
              <TabsContent value="customers" className="mt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Customer Journey</h3>
                  <p className="text-muted-foreground">From project idea to completion in 5 simple steps</p>
                </div>
                
                <div className="space-y-8">
                  {customerSteps.map((step, index) => {
                    const IconComponent = step.icon
                    return (
                      <div key={index} className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-shrink-0 order-2 lg:order-1">
                          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {step.step}
                          </div>
                        </div>
                        
                        <div className="flex-1 order-3 lg:order-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3">
                                <IconComponent className="h-6 w-6 text-primary" />
                                {step.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-4">{step.description}</p>
                              <ul className="space-y-2">
                                {step.details.map((detail, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {index < customerSteps.length - 1 && (
                          <div className="flex-shrink-0 order-1 lg:order-3">
                            <ArrowRightIcon className="h-8 w-8 text-muted-foreground transform lg:rotate-0 rotate-90" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Contractor Journey */}
              <TabsContent value="contractors" className="mt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Contractor Journey</h3>
                  <p className="text-muted-foreground">Build your business and win projects in 5 steps</p>
                </div>
                
                <div className="space-y-8">
                  {contractorSteps.map((step, index) => {
                    const IconComponent = step.icon
                    return (
                      <div key={index} className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-shrink-0 order-2 lg:order-1">
                          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {step.step}
                          </div>
                        </div>
                        
                        <div className="flex-1 order-3 lg:order-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3">
                                <IconComponent className="h-6 w-6 text-green-600" />
                                {step.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-4">{step.description}</p>
                              <ul className="space-y-2">
                                {step.details.map((detail, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {index < contractorSteps.length - 1 && (
                          <div className="flex-shrink-0 order-1 lg:order-3">
                            <ArrowRightIcon className="h-8 w-8 text-muted-foreground transform lg:rotate-0 rotate-90" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Vendor Journey */}
              <TabsContent value="vendors" className="mt-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Vendor Journey</h3>
                  <p className="text-muted-foreground">Sell construction materials and grow your business</p>
                </div>
                
                <div className="space-y-8">
                  {vendorSteps.map((step, index) => {
                    const IconComponent = step.icon
                    return (
                      <div key={index} className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-shrink-0 order-2 lg:order-1">
                          <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {step.step}
                          </div>
                        </div>
                        
                        <div className="flex-1 order-3 lg:order-2">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3">
                                <IconComponent className="h-6 w-6 text-purple-600" />
                                {step.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-4">{step.description}</p>
                              <ul className="space-y-2">
                                {step.details.map((detail, idx) => (
                                  <li key={idx} className="flex items-center gap-2 text-sm">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                        
                        {index < vendorSteps.length - 1 && (
                          <div className="flex-shrink-0 order-1 lg:order-3">
                            <ArrowRightIcon className="h-8 w-8 text-muted-foreground transform lg:rotate-0 rotate-90" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose BuildConnect?</h2>
              <p className="text-lg text-muted-foreground">
                Features that make us the most trusted construction marketplace in India
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Card key={index} className="text-center h-full">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Common questions about how BuildConnect works
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How does BuildConnect verify contractors?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We verify contractors through a comprehensive process including license verification, 
                    background checks, portfolio review, and customer reference validation. Only verified 
                    contractors can bid on projects.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>What fees does BuildConnect charge?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    For customers, posting projects is free. Contractors pay a small commission (3-5%) only 
                    when they successfully complete a project. Vendors pay a commission on sales (2-4%). 
                    No hidden fees or upfront costs.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How are payments handled?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We use a secure escrow system where payments are held safely until project milestones 
                    are completed. This protects both customers and contractors, ensuring fair and secure transactions.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>What if I'm not satisfied with the work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We have a comprehensive dispute resolution process. Our support team mediates issues, 
                    and we offer protection through our escrow system. Customer satisfaction is our top priority.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful projects on BuildConnect today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Post Your First Project
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Join as Professional
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
