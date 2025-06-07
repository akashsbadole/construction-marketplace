import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/lib/seo/metadata";
import {
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  TrendingUpIcon,
  HeartIcon,
  GiftIcon,
  GraduationCapIcon,
  CoffeeIcon,
  HomeIcon,
  DollarSignIcon,
  CalendarIcon,
} from "lucide-react";

export const metadata = generateMetadata({
  title:
    "Careers at BuildConnect - Join India's Leading Construction Marketplace",
  description:
    "Join BuildConnect and help transform the construction industry in India. Explore exciting career opportunities in technology, operations, sales, and more.",
  keywords: [
    "buildconnect careers",
    "construction tech jobs",
    "marketplace jobs india",
    "startup careers",
    "technology jobs",
    "remote work india",
  ],
  canonical: "https://buildconnect.com/careers",
});

const openPositions = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Bangalore / Remote",
    type: "Full-time",
    experience: "4-6 years",
    description:
      "Build scalable web applications using React, Node.js, and modern technologies to enhance our marketplace platform.",
    requirements: [
      "Strong experience with React, Node.js, TypeScript",
      "Experience with cloud platforms (AWS/GCP)",
      "Knowledge of microservices architecture",
      "Experience with databases (PostgreSQL, Redis)",
    ],
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Delhi / Hybrid",
    type: "Full-time",
    experience: "3-5 years",
    description:
      "Drive product strategy and roadmap for our contractor and vendor platforms, working closely with engineering and design teams.",
    requirements: [
      "Experience in product management for B2B/marketplace platforms",
      "Strong analytical and problem-solving skills",
      "Experience with user research and data analysis",
      "Excellent communication and leadership skills",
    ],
  },
  {
    id: 3,
    title: "Business Development Manager",
    department: "Sales",
    location: "Mumbai",
    type: "Full-time",
    experience: "2-4 years",
    description:
      "Expand our contractor and vendor network by building relationships and driving partnerships in the construction industry.",
    requirements: [
      "Experience in B2B sales or business development",
      "Knowledge of construction industry preferred",
      "Strong networking and relationship building skills",
      "Results-driven with proven track record",
    ],
  },
  {
    id: 4,
    title: "UX/UI Designer",
    department: "Design",
    location: "Bangalore / Remote",
    type: "Full-time",
    experience: "2-4 years",
    description:
      "Design intuitive user experiences for our web and mobile platforms, focusing on contractor and customer workflows.",
    requirements: [
      "Strong portfolio showcasing UX/UI design work",
      "Proficiency in Figma, Sketch, or similar tools",
      "Experience with user research and usability testing",
      "Understanding of responsive and mobile design",
    ],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "3-5 years",
    description:
      "Manage and scale our cloud infrastructure, implement CI/CD pipelines, and ensure platform reliability and security.",
    requirements: [
      "Experience with AWS/GCP cloud platforms",
      "Knowledge of containerization (Docker, Kubernetes)",
      "Experience with CI/CD tools and automation",
      "Strong understanding of security best practices",
    ],
  },
  {
    id: 6,
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Delhi / Hybrid",
    type: "Full-time",
    experience: "1-3 years",
    description:
      "Ensure customer satisfaction and success by providing support, training, and building long-term relationships.",
    requirements: [
      "Excellent communication and interpersonal skills",
      "Experience in customer success or account management",
      "Problem-solving mindset with attention to detail",
      "Ability to work with diverse stakeholders",
    ],
  },
];

const benefits = [
  {
    icon: DollarSignIcon,
    title: "Competitive Salary",
    description:
      "Market-leading compensation with performance bonuses and equity options",
  },
  {
    icon: HomeIcon,
    title: "Flexible Work",
    description:
      "Remote-first culture with flexible working hours and hybrid options",
  },
  {
    icon: HeartIcon,
    title: "Health & Wellness",
    description:
      "Comprehensive health insurance, mental health support, and wellness programs",
  },
  {
    icon: GraduationCapIcon,
    title: "Learning & Development",
    description:
      "Annual learning budget, conference attendance, and skill development programs",
  },
  {
    icon: CalendarIcon,
    title: "Time Off",
    description:
      "Generous vacation policy, sick leave, and parental leave benefits",
  },
  {
    icon: CoffeeIcon,
    title: "Great Culture",
    description:
      "Collaborative environment, team events, and modern office spaces",
  },
];

const values = [
  {
    icon: TrendingUpIcon,
    title: "Growth Mindset",
    description:
      "We believe in continuous learning and pushing boundaries to achieve excellence.",
  },
  {
    icon: UsersIcon,
    title: "Team First",
    description:
      "We succeed together by supporting each other and celebrating collective wins.",
  },
  {
    icon: HeartIcon,
    title: "Customer Obsession",
    description:
      "Every decision we make is driven by creating value for our customers.",
  },
  {
    icon: GiftIcon,
    title: "Innovation",
    description:
      "We embrace new ideas and technologies to solve complex problems creatively.",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Build Your Career with BuildConnect
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join our mission to transform the construction industry in
                India. We're looking for passionate, talented individuals who
                want to make a real impact while growing their careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">View Open Positions</Button>
                <Button variant="outline" size="lg">
                  Learn About Our Culture
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Join BuildConnect?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Be part of a fast-growing startup that's revolutionizing how
                construction projects are executed across India
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card key={index} className="text-center h-full">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <p className="text-lg text-muted-foreground">
                Explore exciting opportunities across different departments
              </p>
            </div>

            <div className="space-y-6">
              {openPositions.map((position) => (
                <Card
                  key={position.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <BriefcaseIcon className="h-6 w-6 text-primary" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">
                                {position.title}
                              </h3>
                              <Badge variant="secondary">
                                {position.department}
                              </Badge>
                              <Badge variant="outline">{position.type}</Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="h-4 w-4" />
                                {position.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {position.experience}
                              </div>
                            </div>

                            <p className="text-muted-foreground mb-4">
                              {position.description}
                            </p>

                            <div>
                              <h4 className="font-medium mb-2">
                                Key Requirements:
                              </h4>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {position.requirements
                                  .slice(0, 2)
                                  .map((req, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                      {req}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Button>Apply Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Don't see a role that fits? We're always looking for talented
                people.
              </p>
              <Button variant="outline">Send Us Your Resume</Button>
            </div>
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Benefits & Perks</h2>
              <p className="text-lg text-muted-foreground">
                We believe in taking care of our team with comprehensive
                benefits and a great work environment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card key={index} className="text-center h-full">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <IconComponent className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Company Culture */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-blue-50">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Culture</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    At BuildConnect, we've built a culture that values
                    innovation, collaboration, and personal growth. We believe
                    that great products come from great teams, and we're
                    committed to creating an environment where everyone can do
                    their best work.
                  </p>
                  <p className="text-muted-foreground">
                    Our team is diverse, passionate, and united by a common
                    goal: to transform the construction industry and make it
                    more accessible, transparent, and efficient for everyone
                    involved.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground">
                        Team Members
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        4.8/5
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Employee Rating
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <CoffeeIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <GraduationCapIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                    <TrendingUpIcon className="h-12 w-12 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Application Process</h2>
              <p className="text-lg text-muted-foreground">
                Our hiring process is designed to be transparent and efficient
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Apply Online</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit your application through our careers page
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Initial Screening</h3>
                  <p className="text-sm text-muted-foreground">
                    HR review and initial phone/video screening
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Technical Round</h3>
                  <p className="text-sm text-muted-foreground">
                    Technical assessment or case study presentation
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Final Interview</h3>
                  <p className="text-sm text-muted-foreground">
                    Meet the team and cultural fit assessment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Team?</h2>
            <p className="text-xl mb-8 opacity-90">
              Take the next step in your career and help us build the future of
              construction
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Browse Open Positions
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-primary"
              >
                Contact HR Team
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
