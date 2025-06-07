"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { StarIcon, Filter, MapPin, Briefcase, CheckCircle } from "lucide-react"
import { useState } from "react"

const contractors = [
  {
    id: 1,
    name: "Sharma Construction",
    description: "Specializing in residential buildings with 15+ years of experience.",
    location: "Delhi NCR",
    category: "Residential",
    rating: 4.8,
    projects: 120,
    verified: true,
  },
  {
    id: 2,
    name: "Patel Brothers",
    description: "Commercial construction experts with focus on modern office spaces.",
    location: "Mumbai",
    category: "Commercial",
    rating: 4.9,
    projects: 85,
    verified: true,
  },
  {
    id: 3,
    name: "Reddy Interiors",
    description: "Interior renovation specialists with attention to detail.",
    location: "Bangalore",
    category: "Interior",
    rating: 4.7,
    projects: 200,
    verified: true,
  },
  {
    id: 4,
    name: "Singh & Sons",
    description: "Family-run business specializing in residential renovations.",
    location: "Punjab",
    category: "Residential",
    rating: 4.5,
    projects: 75,
    verified: false,
  },
  {
    id: 5,
    name: "Modern Builders",
    description: "Experts in modern architectural designs and construction.",
    location: "Hyderabad",
    category: "Architectural",
    rating: 4.6,
    projects: 60,
    verified: true,
  },
]

export default function ContractorsPage() {
  const [priceRange, setPriceRange] = useState([0, 100])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="interior">Interior Design</SelectItem>
                    <SelectItem value="renovation">Renovation</SelectItem>
                    <SelectItem value="architectural">Architectural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi NCR</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget Range (Lakhs ₹)</label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={100} step={5} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]} L</span>
                  <span>₹{priceRange[1]} L</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select defaultValue="rating">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="projects">Most Projects</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </aside>

          {/* Contractors Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <Input placeholder="Search contractors..." className="max-w-md" />
              <Button>Search</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contractors.map((contractor) => (
                <Card key={contractor.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start gap-2">
                      <span>{contractor.name}</span>
                      <Badge variant="secondary">{contractor.category}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{contractor.description}</p>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <StarIcon className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm">{contractor.rating}</span>
                      <span className="text-sm text-muted-foreground">({contractor.projects} projects)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{contractor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>15+ years experience</span>
                    </div>
                    {contractor.verified && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Verified Contractor</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <Button variant="outline">View Profile</Button>
                    <Button>Contact</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
