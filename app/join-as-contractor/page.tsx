"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, CheckCircle, Star, TrendingUp, Users } from "lucide-react"

export default function JoinAsContractorPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access to thousands of quality projects every month",
    },
    {
      icon: Users,
      title: "Build Your Network",
      description: "Connect with customers and other professionals",
    },
    {
      icon: Star,
      title: "Build Reputation",
      description: "Showcase your work and build a strong online presence",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Benefits Section */}
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Join as a Contractor</h1>
                <p className="text-muted-foreground text-lg">
                  Grow your construction business with India's largest marketplace. Get access to quality projects and
                  customers.
                </p>
              </div>

              <div className="space-y-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">What You Get:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Free profile creation and verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Access to project bidding system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Customer review and rating system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 customer support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contractor Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="Enter first name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Enter last name" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input type="email" placeholder="Enter email address" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input placeholder="Enter phone number" />
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Business Information</h3>
                    <div>
                      <label className="text-sm font-medium">Business Name</label>
                      <Input placeholder="Enter business name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Years of Experience</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Team Size</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 members</SelectItem>
                            <SelectItem value="6-15">6-15 members</SelectItem>
                            <SelectItem value="16-50">16-50 members</SelectItem>
                            <SelectItem value="50+">50+ members</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Specialization</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Residential", "Commercial", "Interior", "Renovation", "Electrical", "Plumbing"].map(
                          (spec) => (
                            <div key={spec} className="flex items-center space-x-2">
                              <Checkbox id={spec} />
                              <label htmlFor={spec} className="text-sm">
                                {spec}
                              </label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Service Location</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">State</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="telangana">Telangana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">City</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delhi">New Delhi</SelectItem>
                            <SelectItem value="mumbai">Mumbai</SelectItem>
                            <SelectItem value="bangalore">Bangalore</SelectItem>
                            <SelectItem value="hyderabad">Hyderabad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Service Areas</label>
                      <Textarea placeholder="List areas where you provide services..." />
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Documents & Verification</h3>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload Business License</p>
                      </div>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload GST Certificate</p>
                      </div>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload Portfolio Images</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <label htmlFor="terms" className="text-sm">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>

                  <Button className="w-full" size="lg">
                    Submit Registration
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
