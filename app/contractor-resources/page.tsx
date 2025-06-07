import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { generateMetadata } from '@/lib/seo/metadata'
import { 
  BookOpenIcon,
  DownloadIcon,
  PlayCircleIcon,
  FileTextIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  UsersIcon,
  ClockIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  LightbulbIcon
} from 'lucide-react'

export const metadata = generateMetadata({
  title: 'Contractor Resources - Tools, Guides & Training | BuildConnect',
  description: 'Access free resources for contractors including business guides, cost calculators, legal templates, and training materials to grow your construction business.',
  keywords: [
    'contractor resources',
    'construction business guides',
    'contractor tools',
    'construction templates',
    'business training',
    'contractor education'
  ],
  canonical: 'https://buildconnect.com/contractor-resources'
})

const resourceCategories = [
  {
    title: 'Business Guides',
    icon: BookOpenIcon,
    description: 'Comprehensive guides to help you grow and manage your construction business',
    resources: [
      {
        title: 'Starting Your Construction Business',
        type: 'PDF Guide',
        description: 'Complete guide covering licenses, permits, insurance, and legal requirements',
        downloadUrl: '/resources/starting-construction-business.pdf',
        size: '2.5 MB'
      },
      {
        title: 'Pricing Your Services Right',
        type: 'PDF Guide',
        description: 'Learn how to calculate costs, set competitive prices, and maximize profits',
        downloadUrl: '/resources/pricing-guide.pdf',
        size: '1.8 MB'
      },
      {
        title: 'Customer Relationship Management',
        type: 'PDF Guide',
        description: 'Best practices for client communication and building long-term relationships',
        downloadUrl: '/resources/crm-guide.pdf',
        size: '2.1 MB'
      }
    ]
  },
  {
    title: 'Tools & Calculators',
    icon: CalculatorIcon,
    description: 'Free online tools to help with project estimation and business calculations',
    resources: [
      {
        title: 'Project Cost Calculator',
        type: 'Online Tool',
        description: 'Calculate material costs, labor, and overhead for accurate project estimates',
        url: '/tools/cost-calculator',
        features: ['Material cost estimation', 'Labor calculation', 'Profit margin analysis']
      },
      {
        title: 'Timeline Planner',
        type: 'Online Tool',
        description: 'Plan project timelines and manage multiple project schedules',
        url: '/tools/timeline-planner',
        features: ['Gantt chart creation', 'Milestone tracking', 'Resource allocation']
      },
      {
        title: 'ROI Calculator',
        type: 'Online Tool',
        description: 'Calculate return on investment for equipment purchases and business decisions',
        url: '/tools/roi-calculator',
        features: ['Equipment ROI', 'Project profitability', 'Break-even analysis']
      }
    ]
  },
  {
    title: 'Legal Templates',
    icon: FileTextIcon,
    description: 'Ready-to-use legal documents and contract templates',
    resources: [
      {
        title: 'Construction Contract Template',
        type: 'Word Document',
        description: 'Comprehensive contract template for residential and commercial projects',
        downloadUrl: '/templates/construction-contract.docx',
        size: '156 KB'
      },
      {
        title: 'Change Order Form',
        type: 'PDF Template',
        description: 'Professional change order form for project modifications',
        downloadUrl: '/templates/change-order.pdf',
        size: '89 KB'
      },
      {
        title: 'Lien Waiver Forms',
        type: 'PDF Template',
        description: 'Standard lien waiver forms for payment protection',
        downloadUrl: '/templates/lien-waiver.pdf',
        size: '124 KB'
      }
    ]
  },
  {
    title: 'Training Videos',
    icon: PlayCircleIcon,
    description: 'Video tutorials and training sessions for skill development',
    resources: [
      {
        title: 'Using BuildConnect Platform',
        type: 'Video Series',
        description: 'Complete tutorial on maximizing your success on BuildConnect',
        duration: '45 minutes',
        topics: ['Profile optimization', 'Bidding strategies', 'Customer communication']
      },
      {
        title: 'Digital Marketing for Contractors',
        type: 'Webinar',
        description: 'Learn how to market your construction business online',
        duration: '60 minutes',
        topics: ['Social media marketing', 'Google My Business', 'Online reviews']
      },
      {
        title: 'Safety Best Practices',
        type: 'Video Course',
        description: 'Comprehensive safety training for construction sites',
        duration: '90 minutes',
        topics: ['OSHA compliance', 'Safety protocols', 'Risk management']
      }
    ]
  }
]

const quickTips = [
  {
    icon: TrendingUpIcon,
    title: 'Optimize Your Profile',
    description: 'Complete your profile with high-quality photos, detailed descriptions, and customer testimonials to win more projects.'
  },
  {
    icon: ClockIcon,
    title: 'Respond Quickly',
    description: 'Fast response times increase your chances of winning projects. Aim to respond to inquiries within 2 hours.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Build Trust',
    description: 'Get verified, maintain high ratings, and showcase your certifications to build credibility with customers.'
  },
  {
    icon: UsersIcon,
    title: 'Communicate Clearly',
    description: 'Clear, professional communication throughout the project lifecycle leads to better reviews and repeat business.'
  }
]

const industryInsights = [
  {
    title: 'Construction Industry Trends 2024',
    description: 'Latest trends shaping the construction industry in India',
    readTime: '8 min read',
    category: 'Industry News'
  },
  {
    title: 'Sustainable Construction Practices',
    description: 'How to implement eco-friendly practices in your projects',
    readTime: '12 min read',
    category: 'Sustainability'
  },
  {
    title: 'Technology in Construction',
    description: 'Emerging technologies transforming construction workflows',
    readTime: '10 min read',
    category: 'Technology'
  }
]

export default function ContractorResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contractor Resources
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Access free tools, guides, templates, and training materials to help you grow your 
              construction business and succeed on BuildConnect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Browse All Resources
              </Button>
              <Button variant="outline" size="lg">
                Join Contractor Community
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Quick Success Tips</h2>
              <p className="text-lg text-muted-foreground">
                Essential tips to maximize your success on BuildConnect
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickTips.map((tip, index) => {
                const IconComponent = tip.icon
                return (
                  <Card key={index} className="text-center h-full">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Resource Library</h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive collection of tools and materials for contractors
              </p>
            </div>
            
            <div className="space-y-12">
              {resourceCategories.map((category, categoryIndex) => {
                const IconComponent = category.icon
                return (
                  <div key={categoryIndex}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{category.title}</h3>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.resources.map((resource, resourceIndex) => (
                        <Card key={resourceIndex} className="h-full hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{resource.title}</CardTitle>
                                <Badge variant="outline" className="mt-2">
                                  {resource.type}
                                </Badge>
                              </div>
                              {resource.downloadUrl && (
                                <Button size="sm" variant="outline">
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{resource.description}</p>
                            
                            {resource.size && (
                              <p className="text-sm text-muted-foreground mb-3">
                                File size: {resource.size}
                              </p>
                            )}
                            
                            {resource.duration && (
                              <p className="text-sm text-muted-foreground mb-3">
                                Duration: {resource.duration}
                              </p>
                            )}
                            
                            {resource.features && (
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Features:</h4>
                                <ul className="space-y-1">
                                  {resource.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                      <CheckCircleIcon className="h-3 w-3 text-green-500" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {resource.topics && (
                              <div className="mb-4">
                                <h4 className="font-medium mb-2">Topics covered:</h4>
                                <ul className="space-y-1">
                                  {resource.topics.map((topic, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                      <CheckCircleIcon className="h-3 w-3 text-green-500" />
                                      {topic}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              {resource.downloadUrl ? (
                                <Button className="flex-1">
                                  <DownloadIcon className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              ) : (
                                <Button className="flex-1">
                                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                                  Access Tool
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Industry Insights */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Industry Insights</h2>
              <p className="text-lg text-muted-foreground">
                Stay updated with the latest trends and insights in construction
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {industryInsights.map((insight, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3">
                      {insight.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-3">{insight.title}</h3>
                    <p className="text-muted-foreground mb-4">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{insight.readTime}</span>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-blue-50">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <LightbulbIcon className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Need More Help?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our support team is here to help you succeed. Get personalized assistance and guidance.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2">Live Chat Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get instant help from our support team
                    </p>
                    <Button variant="outline" size="sm">
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2">Video Consultation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Schedule a one-on-one consultation
                    </p>
                    <Button variant="outline" size="sm">
                      Book Call
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2">Community Forum</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with other contractors
                    </p>
                    <Button variant="outline" size="sm">
                      Join Forum
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
            <p className="text-xl mb-8 opacity-90">
              Use these resources to build a successful construction business on BuildConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Join BuildConnect
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
                Download All Resources
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
