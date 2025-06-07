import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { generateMetadata } from '@/lib/seo/metadata'
import { 
  BuildingIcon, 
  UsersIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon,
  HeartIcon,
  LightbulbIcon,
  TargetIcon,
  AwardIcon,
  MapPinIcon,
  CalendarIcon
} from 'lucide-react'

export const metadata = generateMetadata({
  title: 'About BuildConnect - India\'s Leading Construction Marketplace',
  description: 'Learn about BuildConnect\'s mission to revolutionize the construction industry in India. Discover our story, values, and commitment to connecting quality contractors with customers.',
  keywords: [
    'about buildconnect',
    'construction marketplace india',
    'company story',
    'construction platform',
    'building industry',
    'contractor network'
  ],
  canonical: 'https://buildconnect.com/about'
})

const stats = [
  { label: 'Active Contractors', value: '10,000+', icon: UsersIcon },
  { label: 'Projects Completed', value: '50,000+', icon: BuildingIcon },
  { label: 'Cities Covered', value: '100+', icon: MapPinIcon },
  { label: 'Customer Satisfaction', value: '98%', icon: AwardIcon }
]

const values = [
  {
    icon: ShieldCheckIcon,
    title: 'Trust & Transparency',
    description: 'We verify every contractor and ensure transparent pricing and processes for all users.'
  },
  {
    icon: LightbulbIcon,
    title: 'Innovation',
    description: 'We leverage technology to simplify construction processes and improve user experiences.'
  },
  {
    icon: HeartIcon,
    title: 'Customer First',
    description: 'Every decision we make is centered around providing value to our customers and partners.'
  },
  {
    icon: TargetIcon,
    title: 'Quality Excellence',
    description: 'We maintain high standards in everything we do, from platform features to customer service.'
  }
]

const team = [
  {
    name: 'Rajesh Kumar',
    role: 'CEO & Co-Founder',
    bio: '15+ years in construction industry, former civil engineer',
    image: '/placeholder-team.jpg'
  },
  {
    name: 'Priya Sharma',
    role: 'CTO & Co-Founder',
    bio: 'Tech veteran with expertise in marketplace platforms',
    image: '/placeholder-team.jpg'
  },
  {
    name: 'Amit Patel',
    role: 'Head of Operations',
    bio: 'Operations expert with deep construction industry knowledge',
    image: '/placeholder-team.jpg'
  },
  {
    name: 'Sneha Reddy',
    role: 'Head of Customer Success',
    bio: 'Customer experience specialist focused on user satisfaction',
    image: '/placeholder-team.jpg'
  }
]

const milestones = [
  {
    year: '2022',
    title: 'Company Founded',
    description: 'BuildConnect was founded with a vision to digitize the construction industry'
  },
  {
    year: '2022',
    title: 'First 100 Contractors',
    description: 'Onboarded our first 100 verified contractors across Delhi NCR'
  },
  {
    year: '2023',
    title: 'Series A Funding',
    description: 'Raised $5M Series A to expand across major Indian cities'
  },
  {
    year: '2023',
    title: '10,000 Projects',
    description: 'Facilitated over 10,000 successful construction projects'
  },
  {
    year: '2024',
    title: 'National Expansion',
    description: 'Expanded to 100+ cities across India with 10,000+ contractors'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Building India's Future, One Project at a Time
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                BuildConnect is India's most trusted construction marketplace, connecting homeowners and businesses 
                with verified contractors, suppliers, and vendors to bring their construction dreams to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">Join Our Network</Button>
                <Button variant="outline" size="lg">Watch Our Story</Button>
              </div>
            </div>
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

        {/* Our Story */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-lg text-muted-foreground">
                  How we're transforming the construction industry in India
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">The Problem We Solve</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      The construction industry in India has long been fragmented, with customers struggling to find 
                      reliable contractors and contractors finding it difficult to reach potential clients. Traditional 
                      methods of finding construction services were time-consuming, unreliable, and often led to 
                      unsatisfactory outcomes.
                    </p>
                    <p className="text-muted-foreground">
                      We recognized this gap and set out to create a platform that would bring transparency, 
                      reliability, and efficiency to the construction marketplace.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Our Solution</h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      BuildConnect bridges this gap by providing a comprehensive platform where customers can easily 
                      find, compare, and hire verified contractors and suppliers. Our rigorous verification process 
                      ensures quality, while our transparent rating system builds trust.
                    </p>
                    <p className="text-muted-foreground">
                      We've digitized the entire construction workflow - from project posting and bidding to 
                      project management and payments - making construction projects more efficient and successful.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do and shape our commitment to our users and partners
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <Card key={index} className="text-center h-full">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
              <p className="text-lg text-muted-foreground">
                Key milestones in our mission to transform construction in India
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {milestone.year.slice(-2)}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-16 bg-primary/30 mt-4"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{milestone.year}</Badge>
                        <h3 className="text-xl font-semibold">{milestone.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground">
                The passionate people behind BuildConnect's success
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback className="text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-blue-50">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <TargetIcon className="h-8 w-8 text-primary" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To democratize access to quality construction services across India by creating a transparent, 
                    efficient, and trustworthy marketplace that empowers both customers and service providers to 
                    achieve their construction goals.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <TrendingUpIcon className="h-8 w-8 text-primary" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To become India's most trusted construction ecosystem, where every construction project - 
                    from small home repairs to large commercial developments - is executed with excellence, 
                    transparency, and customer satisfaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build with Us?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers and contractors on BuildConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Post Your Project
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                Join as Contractor
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
