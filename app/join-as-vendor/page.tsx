"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, CheckCircle, Package, TrendingUp, Globe } from "lucide-react"

export default function JoinAsVendorPage() {
  const benefits = [
    {
      icon: Globe,
      title: "Reach Millions",
      description: "Access to customers across 500+ cities in India",
    },
    {
      icon: TrendingUp,
      title: "Boost Sales",
      description: "Increase your revenue with our marketing tools",
    },
    {
      icon: Package,
      title: "Easy Management",
      description: "Simple inventory and order management system",
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
                <h1 className="text-4xl font-bold mb-4">Become a Vendor</h1>
                <p className="text-muted-foreground text-lg">
                  Sell your construction materials to thousands of customers across India. Join our growing marketplace
                  today.
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
                <h3 className="font-semibold mb-4">Vendor Benefits:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Free store setup and product listing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Integrated payment gateway</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Logistics and delivery support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Marketing and promotional tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Analytics and reporting dashboard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Business Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Business Information</h3>
                    <div>
                      <label className="text-sm font-medium">Business Name</label>
                      <Input placeholder="Enter business name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Business Type</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manufacturer">Manufacturer</SelectItem>
                            <SelectItem value="distributor">Distributor</SelectItem>
                            <SelectItem value="retailer">Retailer</SelectItem>
                            <SelectItem value="wholesaler">Wholesaler</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Years in Business</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select years" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">GST Number</label>
                      <Input placeholder="Enter GST number" />
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Contact Person</label>
                        <Input placeholder="Enter contact person name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Designation</label>
                        <Input placeholder="Enter designation" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Email Address</label>
                        <Input type="email" placeholder="Enter email address" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input placeholder="Enter phone number" />
                      </div>
                    </div>
                  </div>

                  {/* Business Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Business Address</h3>
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <Textarea placeholder="Enter complete business address" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">City</label>
                        <Input placeholder="City" />
                      </div>
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
                        <label className="text-sm font-medium">PIN Code</label>
                        <Input placeholder="PIN Code" />
                      </div>
                    </div>
                  </div>

                  {/* Product Categories */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Product Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Cement", "Steel", "Bricks", "Sand", "Tiles", "Paint", "Plumbing", "Electrical"].map(
                        (category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={category} />
                            <label htmlFor={category} className="text-sm">
                              {category}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Required Documents</h3>
                    <div className="space-y-3">
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload Business Registration Certificate</p>
                      </div>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload GST Certificate</p>
                      </div>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload Bank Account Details</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="vendor-terms" />
                    <label htmlFor="vendor-terms" className="text-sm">
                      I agree to the Vendor Terms and Conditions
                    </label>
                  </div>

                  <Button className="w-full" size="lg">
                    Submit Application
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
