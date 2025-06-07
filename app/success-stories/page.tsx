import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { generateMetadata } from '@/lib/seo/metadata'
import { 
  StarIcon,
  TrendingUpIcon,
  MapPinIcon,
  CalendarIcon,
  IndianRupeeIcon,
  BuildingIcon,
  UsersIcon,
  AwardIcon,
  QuoteIcon,
  CheckCircleIcon,
  ArrowUpIcon
} from 'lucide-react'

export const metadata = generateMetadata({
  title: 'Success Stories - Real Results from BuildConnect Users',
  description: 'Read inspiring success stories from contractors, vendors, and customers who have achieved remarkable results using BuildConnect marketplace platform.',
  keywords: [
    'buildconnect success stories',
    'contractor success',
    'construction marketplace results',
    'customer testimonials',
    'vendor growth stories',
    'construction business growth'
  ],
  canonical: 'https://buildconnect.com/success-stories'
})

const contractorStories = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    business: 'Kumar Construction',
    location: 'Delhi NCR',
    avatar: '/placeholder-contractor.jpg',
    joinedDate: '2023-01-15',
    specialization: 'Residential Construction',
    stats: {
      projectsCompleted: 156,
      revenue: 2500000,
      rating: 4.9,
      growthPercentage: 340
    },
    story: 'I started my construction business 8 years ago with just 2 workers. Finding customers was always a challenge until I discovered BuildConnect. The platform has completely transformed my business.',
    achievements: [
      'Expanded team from 2 to 25 workers',
      'Increased monthly revenue by 340%',
      'Completed 156+ projects with 4.9★ rating',
      'Expanded service area to 3 cities'
    ],
    testimonial: 'BuildConnect gave me access to customers I could never reach before. The verification system builds trust, and the payment protection gives me confidence. I recommend it to every contractor.',
    beforeAfter: {
      before: {
        monthlyProjects: 2,
        monthlyRevenue: 150000,
        teamSize: 2,
        serviceArea: 1
      },
      after: {
        monthlyProjects: 12,
        monthlyRevenue: 500000,
        teamSize: 25,
        serviceArea: 3
      }
    }
  },
  {
    id: 2,
    name: 'Priya Sharma',
    business: 'Sharma Interiors',
    location: 'Mumbai',
    avatar: '/placeholder-contractor.jpg',
    joinedDate: '2023-03-20',
    specialization: 'Interior Design',
    stats: {
      projectsCompleted: 89,
      revenue: 1800000,
      rating: 4.8,
      growthPercentage: 280
    },
    story: 'As a female entrepreneur in construction, building trust with customers was difficult. BuildConnect\'s verification system and review platform helped establish my credibility.',
    achievements: [
      'Built a team of 15 skilled professionals',
      'Achieved 280% business growth in 10 months',
      'Completed high-value commercial projects',
      'Featured in local business magazine'
    ],
    testimonial: 'The platform levels the playing field. Customers judge based on work quality and reviews, not assumptions. It\'s been a game-changer for my business.',
    beforeAfter: {
      before: {
        monthlyProjects: 3,
        monthlyRevenue: 80000,
        teamSize: 3,
        serviceArea: 1
      },
      after: {
        monthlyProjects: 8,
        monthlyRevenue: 220000,
        teamSize: 15,
        serviceArea: 2
      }
    }
  },
  {
    id: 3,
    name: 'Amit Patel',
    business: 'Patel Renovations',
    location: 'Bangalore',
    avatar: '/placeholder-contractor.jpg',
    joinedDate: '2022-11-10',
    specialization: 'Renovation & Remodeling',
    stats: {
      projectsCompleted: 203,
      revenue: 3200000,
      rating: 5.0,
      growthPercentage: 450
    },
    story: 'I was struggling to compete with larger contractors. BuildConnect helped me showcase my specialized skills and build a strong reputation through customer reviews.',
    achievements: [
      'Achieved perfect 5.0★ rating',
      'Completed 200+ renovation projects',
      'Increased revenue by 450%',
      'Became top-rated contractor in Bangalore'
    ],
    testimonial: 'The detailed project requirements help me provide accurate quotes. The milestone-based payment system ensures I get paid fairly for my work.',
    beforeAfter: {
      before: {
        monthlyProjects: 4,
        monthlyRevenue: 120000,
        teamSize: 5,
        serviceArea: 1
      },
      after: {
        monthlyProjects: 15,
        monthlyRevenue: 550000,
        teamSize: 30,
        serviceArea: 4
      }
    }
  }
]

const customerStories = [
  {
    id: 1,
    name: 'Anita Desai',
    location: 'Pune',
    projectType: 'Home Renovation',
    projectValue: 850000,
    completionTime: '45 days',
    rating: 5,
    story: 'We needed to renovate our 20-year-old home. BuildConnect helped us find the perfect contractor who understood our vision and budget.',
    challenges: [
      'Finding trustworthy contractors',
      'Getting accurate cost estimates',
      'Ensuring quality workmanship',
      'Managing project timeline'
    ],
    solution: 'BuildConnect\'s verification system and review platform helped us choose the right contractor. The milestone-based payment system ensured quality work.',
    results: [
      'Project completed 5 days ahead of schedule',
      'Stayed within budget with no hidden costs',
      'Excellent quality workmanship',
      'Ongoing maintenance support from contractor'
    ]
  },
  {
    id: 2,
    name: 'Vikram Singh',
    location: 'Gurgaon',
    projectType: 'Office Construction',
    projectValue: 2500000,
    completionTime: '90 days',
    rating: 5,
    story: 'Building our new office was crucial for business expansion. We needed a reliable contractor who could deliver on time and within budget.',
    challenges: [
      'Tight deadline for office opening',
      'Complex commercial requirements',
      'Coordinating multiple vendors',
      'Ensuring minimal business disruption'
    ],
    solution: 'Found an experienced commercial contractor through BuildConnect who managed the entire project professionally.',
    results: [
      'Office ready for grand opening on time',
      'All compliance and safety requirements met',
      'Seamless coordination with vendors',
      'Excellent post-completion support'
    ]
  }
]

const vendorStories = [
  {
    id: 1,
    name: 'Suresh Gupta',
    business: 'Gupta Building Materials',
    location: 'Jaipur',
    category: 'Construction Materials',
    joinedDate: '2023-02-01',
    stats: {
      ordersCompleted: 450,
      revenue: 5200000,
      rating: 4.7,
      growthPercentage: 320
    },
    story: 'Our family business was limited to local customers. BuildConnect opened up opportunities across Rajasthan and neighboring states.',
    achievements: [
      'Expanded to 15+ cities',
      'Increased sales by 320%',
      'Built relationships with 200+ contractors',
      'Improved inventory management'
    ]
  }
]

const stats = [
  { label: 'Success Stories', value: '1,000+', icon: AwardIcon },
  { label: 'Average Growth', value: '300%', icon: TrendingUpIcon },
  { label: 'Customer Satisfaction', value: '98%', icon: StarIcon },
  { label: 'Projects Completed', value: '50,000+', icon: BuildingIcon }
]

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Success Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover how contractors, customers, and vendors have transformed their businesses 
              and achieved remarkable results with BuildConnect.
            </p>
            <Button size="lg">Share Your Success Story</Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Success Stories Tabs */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Success Stories by Category</h2>
              <p className="text-lg text-muted-foreground">
                Explore inspiring stories from different user types
              </p>
            </div>

            <Tabs defaultValue="contractors" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="contractors">Contractors</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
              </TabsList>

              {/* Contractor Stories */}
              <TabsContent value="contractors" className="mt-12">
                <div className="space-y-12">
                  {contractorStories.map((story) => (
                    <Card key={story.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                          {/* Story Content */}
                          <div className="lg:col-span-2 p-8">
                            <div className="flex items-start gap-4 mb-6">
                              <Avatar className="h-16 w-16">
                                <AvatarImage src={story.avatar} alt={story.name} />
                                <AvatarFallback className="text-lg">
                                  {story.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-1">{story.name}</h3>
                                <p className="text-lg text-primary font-medium mb-2">{story.business}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <MapPinIcon className="h-4 w-4" />
                                    {story.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    Joined {new Date(story.joinedDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              
                              <Badge className="bg-green-100 text-green-800">
                                <ArrowUpIcon className="h-3 w-3 mr-1" />
                                {story.stats.growthPercentage}% Growth
                              </Badge>
                            </div>
                            
                            <div className="mb-6">
                              <QuoteIcon className="h-6 w-6 text-muted-foreground mb-3" />
                              <p className="text-lg italic text-muted-foreground mb-4">"{story.story}"</p>
                              <p className="text-muted-foreground">"{story.testimonial}"</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Key Achievements:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {story.achievements.map((achievement, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {/* Stats Sidebar */}
                          <div className="bg-gradient-to-br from-primary/5 to-blue-50 p-8">
                            <h4 className="font-semibold mb-6">Performance Metrics</h4>
                            
                            <div className="space-y-6">
                              <div className="text-center p-4 bg-white rounded-lg">
                                <div className="text-2xl font-bold text-primary">{story.stats.projectsCompleted}</div>
                                <div className="text-sm text-muted-foreground">Projects Completed</div>
                              </div>
                              
                              <div className="text-center p-4 bg-white rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  ₹{(story.stats.revenue / 100000).toFixed(1)}L
                                </div>
                                <div className="text-sm text-muted-foreground">Total Revenue</div>
                              </div>
                              
                              <div className="text-center p-4 bg-white rounded-lg">
                                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-yellow-600">
                                  {story.stats.rating}
                                  <StarIcon className="h-5 w-5 fill-current" />
                                </div>
                                <div className="text-sm text-muted-foreground">Average Rating</div>
                              </div>
                            </div>
                            
                            <div className="mt-8">
                              <h5 className="font-medium mb-4">Before vs After</h5>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span>Monthly Projects:</span>
                                  <span>{story.beforeAfter.before.monthlyProjects} → {story.beforeAfter.after.monthlyProjects}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Team Size:</span>
                                  <span>{story.beforeAfter.before.teamSize} → {story.beforeAfter.after.teamSize}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Service Areas:</span>
                                  <span>{story.beforeAfter.before.serviceArea} → {story.beforeAfter.after.serviceArea}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Customer Stories */}
              <TabsContent value="customers" className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {customerStories.map((story) => (
                    <Card key={story.id} className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl">{story.name}</CardTitle>
                            <p className="text-muted-foreground">{story.location}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-500">
                              {[...Array(story.rating)].map((_, i) => (
                                <StarIcon key={i} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{story.rating}/5 Rating</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Project Type:</span>
                            <p className="text-muted-foreground">{story.projectType}</p>
                          </div>
                          <div>
                            <span className="font-medium">Project Value:</span>
                            <p className="text-muted-foreground">₹{story.projectValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Completion Time:</span>
                            <p className="text-muted-foreground">{story.completionTime}</p>
                          </div>
                        </div>
                        
                        <div>
                          <QuoteIcon className="h-5 w-5 text-muted-foreground mb-2" />
                          <p className="italic text-muted-foreground">"{story.story}"</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Challenges Faced:</h4>
                          <ul className="space-y-1">
                            {story.challenges.slice(0, 2).map((challenge, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Results Achieved:</h4>
                          <ul className="space-y-1">
                            {story.results.slice(0, 2).map((result, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {result}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Vendor Stories */}
              <TabsContent value="vendors" className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {vendorStories.map((story) => (
                    <Card key={story.id} className="h-full">
                      <CardHeader>
                        <CardTitle className="text-xl">{story.name}</CardTitle>
                        <p className="text-primary font-medium">{story.business}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            {story.location}
                          </div>
                          <Badge variant="outline">{story.category}</Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold text-primary">{story.stats.ordersCompleted}</div>
                            <div className="text-xs text-muted-foreground">Orders</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              ₹{(story.stats.revenue / 100000).toFixed(1)}L
                            </div>
                            <div className="text-xs text-muted-foreground">Revenue</div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground italic">"{story.story}"</p>
                        
                        <div>
                          <h4 className="font-medium mb-2">Key Achievements:</h4>
                          <ul className="space-y-1">
                            {story.achievements.slice(0, 3).map((achievement, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Badge className="bg-green-100 text-green-800">
                          <ArrowUpIcon className="h-3 w-3 mr-1" />
                          {story.stats.growthPercentage}% Growth
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful users who have transformed their business with BuildConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Get Started Today
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Share Your Story
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
