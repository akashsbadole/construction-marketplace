"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Ruler, PaintBucket, Wrench, Lightbulb, Home, Building, Hammer, FileText, ShieldCheck } from "lucide-react"

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Construction Services</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From architectural design to final finishing touches, we offer comprehensive construction services for all
              your needs.
            </p>
          </div>

          <Tabs defaultValue="construction">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="construction">Construction</TabsTrigger>
              <TabsTrigger value="renovation">Renovation</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="legal">Legal & Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="construction" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-3 rounded-lg">
                        <Home className="h-6 w-6 text-amber-600" />
                      </div>
                      <CardTitle>Residential Construction</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Complete construction services for homes, apartments, and villas with quality materials and
                      skilled labor.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Structural warranty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Quality materials</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">On-time delivery</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Get Quote</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle>Commercial Construction</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Construction services for offices, retail spaces, and industrial buildings with focus on
                      durability and functionality.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Commercial compliance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Fire safety measures</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Industrial-grade materials</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Get Quote</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="renovation" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <PaintBucket className="h-6 w-6 text-green-600" />
                      </div>
                      <CardTitle>Interior Renovation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Complete interior makeovers including painting, flooring, and fixture upgrades.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Hammer className="h-6 w-6 text-purple-600" />
                      </div>
                      <CardTitle>Structural Renovation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Structural modifications, wall removals, and layout changes with engineering expertise.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Wrench className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle>Kitchen & Bathroom</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Specialized renovation services for kitchens and bathrooms with modern fixtures.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Learn More</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="design" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-3 rounded-lg">
                        <Ruler className="h-6 w-6 text-indigo-600" />
                      </div>
                      <CardTitle>Architectural Design</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Professional architectural design services including floor plans, elevations, and 3D
                      visualizations.
                    </p>
                    <div className="mt-4">
                      <Badge variant="outline">2D Plans</Badge>
                      <Badge variant="outline" className="ml-2">
                        3D Visualization
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        Structural Design
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Get Design Quote</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 p-3 rounded-lg">
                        <Lightbulb className="h-6 w-6 text-pink-600" />
                      </div>
                      <CardTitle>Interior Design</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Creative interior design solutions with space planning, color schemes, and furniture selection.
                    </p>
                    <div className="mt-4">
                      <Badge variant="outline">Space Planning</Badge>
                      <Badge variant="outline" className="ml-2">
                        Color Consultation
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        Furniture Design
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Get Design Quote</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="legal" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                      <CardTitle>Legal Documentation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Complete legal documentation services including contracts, permits, and compliance certificates.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Building permits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">NOC certificates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Completion certificates</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Get Legal Support</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-100 p-3 rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-teal-600" />
                      </div>
                      <CardTitle>Quality Assurance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Professional quality inspection services to ensure construction meets industry standards and
                      regulations.
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Material testing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Structural inspection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Safety compliance</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Schedule Inspection</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
