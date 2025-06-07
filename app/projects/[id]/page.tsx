"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProjectBidding } from "@/components/project-bidding"
import { MapPin, Calendar, Ruler, Home, Clock, User } from "lucide-react"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = {
    id: params.id,
    title: "2BHK Apartment Renovation",
    description:
      "Complete renovation of kitchen and bathrooms with modern fixtures. Looking for experienced contractors who can handle plumbing, electrical work, and interior design.",
    location: "Koramangala, Bangalore",
    budget: { min: 800000, max: 1200000 },
    timeline: "3-4 months",
    area: 1200,
    projectType: "Residential",
    postedBy: "Rajesh Kumar",
    postedDate: "2024-01-10",
    status: "Open for Bids",
    requirements: [
      "Kitchen renovation with modular cabinets",
      "Bathroom renovation with modern fixtures",
      "Electrical rewiring",
      "Plumbing work",
      "Interior painting",
      "Flooring replacement",
    ],
    images: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted on {project.postedDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {project.postedBy}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{project.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{project.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium">{project.projectType}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Ruler className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium">{project.area} sq.ft</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium">{project.timeline}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-sm font-medium">Flexible Start</div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="font-semibold mb-3">Project Requirements</h3>
                    <ul className="space-y-2">
                      {project.requirements.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 bg-primary rounded-full" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Project Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {project.images.map((image, index) => (
                      <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bidding Section */}
              <ProjectBidding projectId={project.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ₹{project.budget.min.toLocaleString()} - ₹{project.budget.max.toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Estimated project cost</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{project.postedBy}</h4>
                      <p className="text-sm text-muted-foreground">Project Owner</p>
                    </div>
                  </div>
                  <Button className="w-full">Contact Owner</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Save Project
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share Project
                  </Button>
                  <Button variant="outline" className="w-full">
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
