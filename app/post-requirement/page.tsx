"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Package,
  IndianRupee,
  Upload,
  Plus,
  Minus,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react"
import type { RequiredMaterial, MaterialSpecification } from "@/lib/types/marketplace"

interface FormData {
  // Step 1: Basic Information
  title: string
  description: string
  category: string
  subcategory: string

  // Step 2: Materials
  materials: RequiredMaterial[]

  // Step 3: Location & Delivery
  location: {
    address: string
    city: string
    state: string
    pincode: string
    latitude?: number
    longitude?: number
    deliveryRadius: number
    accessDetails: string
  }

  // Step 4: Budget & Timeline
  budget: {
    min?: number
    max?: number
    currency: string
    isFlexible: boolean
  }
  timeline: {
    urgency: "immediate" | "within_week" | "within_month" | "flexible"
    preferredDeliveryDate?: string
    projectStartDate?: string
  }

  // Step 5: Specifications & Attachments
  specifications: MaterialSpecification[]
  attachments: File[]

  // Step 6: Contact Preferences
  contactPreferences: {
    preferredMethod: "email" | "phone" | "whatsapp"
    availableHours: string
    additionalNotes: string
  }
  visibility: "public" | "private" | "vendors_only"
}

const categories = [
  { id: "cement", name: "Cement & Concrete" },
  { id: "steel", name: "Steel & Iron" },
  { id: "bricks", name: "Bricks & Blocks" },
  { id: "sand", name: "Sand & Aggregates" },
  { id: "tiles", name: "Tiles & Flooring" },
  { id: "paint", name: "Paints & Coatings" },
  { id: "plumbing", name: "Plumbing Materials" },
  { id: "electrical", name: "Electrical Items" },
  { id: "hardware", name: "Hardware & Tools" },
  { id: "roofing", name: "Roofing Materials" },
]

const urgencyOptions = [
  { value: "immediate", label: "Immediate (Within 24 hours)", icon: "🚨" },
  { value: "within_week", label: "Within a week", icon: "⚡" },
  { value: "within_month", label: "Within a month", icon: "📅" },
  { value: "flexible", label: "Flexible timeline", icon: "🕐" },
]

export default function PostRequirementPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    materials: [],
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      deliveryRadius: 25,
      accessDetails: "",
    },
    budget: {
      currency: "INR",
      isFlexible: false,
    },
    timeline: {
      urgency: "within_week",
    },
    specifications: [],
    attachments: [],
    contactPreferences: {
      preferredMethod: "phone",
      availableHours: "9 AM - 6 PM",
      additionalNotes: "",
    },
    visibility: "public",
  })

  const totalSteps = 6
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Here you would submit the form data to your API
      console.log("Submitting requirement:", formData)

      // Show success message and redirect
      alert("Requirement posted successfully! Nearby vendors will be notified.")
      // router.push("/requirements")
    } catch (error) {
      console.error("Error submitting requirement:", error)
      alert("Error posting requirement. Please try again.")
    }
  }

  const addMaterial = () => {
    const newMaterial: RequiredMaterial = {
      id: `material_${Date.now()}`,
      name: "",
      category: formData.category,
      quantity: 1,
      unit: "pieces",
      priority: "medium",
    }
    setFormData({
      ...formData,
      materials: [...formData.materials, newMaterial],
    })
  }

  const updateMaterial = (index: number, updates: Partial<RequiredMaterial>) => {
    const updatedMaterials = [...formData.materials]
    updatedMaterials[index] = { ...updatedMaterials[index], ...updates }
    setFormData({ ...formData, materials: updatedMaterials })
  }

  const removeMaterial = (index: number) => {
    const updatedMaterials = formData.materials.filter((_, i) => i !== index)
    setFormData({ ...formData, materials: updatedMaterials })
  }

  const addSpecification = () => {
    const newSpec: MaterialSpecification = {
      name: "",
      value: "",
      isRequired: false,
    }
    setFormData({
      ...formData,
      specifications: [...formData.specifications, newSpec],
    })
  }

  const updateSpecification = (index: number, updates: Partial<MaterialSpecification>) => {
    const updatedSpecs = [...formData.specifications]
    updatedSpecs[index] = { ...updatedSpecs[index], ...updates }
    setFormData({ ...formData, specifications: updatedSpecs })
  }

  const removeSpecification = (index: number) => {
    const updatedSpecs = formData.specifications.filter((_, i) => i !== index)
    setFormData({ ...formData, specifications: updatedSpecs })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Requirement Title *</label>
                <Input
                  placeholder="e.g., Need cement and steel for 2BHK construction"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Primary Category *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Detailed Description *</label>
                <Textarea
                  placeholder="Describe your material requirements in detail. Include project type, quality expectations, and any specific needs..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Project Type</label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential Construction</SelectItem>
                    <SelectItem value="commercial">Commercial Building</SelectItem>
                    <SelectItem value="renovation">Renovation/Repair</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure Project</SelectItem>
                    <SelectItem value="interior">Interior Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Material Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.materials.map((material, index) => (
                <div key={material.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Material {index + 1}</h4>
                    <Button variant="outline" size="sm" onClick={() => removeMaterial(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Material Name *</label>
                      <Input
                        placeholder="e.g., Portland Cement"
                        value={material.name}
                        onChange={(e) => updateMaterial(index, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={material.category}
                        onValueChange={(value) => updateMaterial(index, { category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Quantity *</label>
                      <Input
                        type="number"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(index, { quantity: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Unit</label>
                      <Select value={material.unit} onValueChange={(value) => updateMaterial(index, { unit: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="sqft">Square Feet</SelectItem>
                          <SelectItem value="cubic_ft">Cubic Feet</SelectItem>
                          <SelectItem value="liters">Liters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={material.priority}
                        onValueChange={(value) =>
                          updateMaterial(index, { priority: value as "high" | "medium" | "low" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Specifications</label>
                    <Textarea
                      placeholder="Any specific requirements, quality grade, preferred brands..."
                      value={material.specifications || ""}
                      onChange={(e) => updateMaterial(index, { specifications: e.target.value })}
                    />
                  </div>
                </div>
              ))}

              <Button onClick={addMaterial} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Delivery Address *</label>
                <Textarea
                  placeholder="Enter complete delivery address"
                  value={formData.location.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, address: e.target.value },
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">City *</label>
                  <Input
                    placeholder="City"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State *</label>
                  <Select
                    value={formData.location.state}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, state: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                      <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="westbengal">West Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">PIN Code *</label>
                  <Input
                    placeholder="PIN Code"
                    value={formData.location.pincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, pincode: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Delivery Radius (km)</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={formData.location.deliveryRadius}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, deliveryRadius: Number.parseInt(e.target.value) || 25 },
                      })
                    }
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">Vendors within this radius will be notified</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Access Details</label>
                <Textarea
                  placeholder="Truck access, crane required, floor details, any delivery constraints..."
                  value={formData.location.accessDetails}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, accessDetails: e.target.value },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Budget Range</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Minimum Budget (₹)</label>
                    <Input
                      type="number"
                      placeholder="Min budget"
                      value={formData.budget.min || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budget: { ...formData.budget, min: Number.parseInt(e.target.value) || undefined },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Maximum Budget (₹)</label>
                    <Input
                      type="number"
                      placeholder="Max budget"
                      value={formData.budget.max || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budget: { ...formData.budget, max: Number.parseInt(e.target.value) || undefined },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="flexible-budget"
                    checked={formData.budget.isFlexible}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        budget: { ...formData.budget, isFlexible: checked as boolean },
                      })
                    }
                  />
                  <label htmlFor="flexible-budget" className="text-sm">
                    Budget is flexible based on quality and service
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Urgency *</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {urgencyOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        formData.timeline.urgency === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          timeline: { ...formData.timeline, urgency: option.value as any },
                        })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{option.icon}</span>
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Preferred Delivery Date</label>
                  <Input
                    type="date"
                    value={formData.timeline.preferredDeliveryDate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeline: { ...formData.timeline, preferredDeliveryDate: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Project Start Date</label>
                  <Input
                    type="date"
                    value={formData.timeline.projectStartDate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeline: { ...formData.timeline, projectStartDate: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Specifications & Attachments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Technical Specifications</label>
                  <Button onClick={addSpecification} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Spec
                  </Button>
                </div>

                {formData.specifications.map((spec, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Specification {index + 1}</h5>
                      <Button variant="outline" size="sm" onClick={() => removeSpecification(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        placeholder="Property name"
                        value={spec.name}
                        onChange={(e) => updateSpecification(index, { name: e.target.value })}
                      />
                      <Input
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) => updateSpecification(index, { value: e.target.value })}
                      />
                      <Input
                        placeholder="Unit (optional)"
                        value={spec.unit || ""}
                        onChange={(e) => updateSpecification(index, { unit: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={spec.isRequired}
                        onCheckedChange={(checked) => updateSpecification(index, { isRequired: checked as boolean })}
                      />
                      <label className="text-sm">Required specification</label>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium">Attachments</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload drawings, specifications, or reference images
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      setFormData({ ...formData, attachments: files })
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose Files
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: PDF, JPG, PNG, DWG, DOC, DOCX (Max 10MB each)
                  </p>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Selected Files:</p>
                    <div className="space-y-1">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Contact Preferences & Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Preferred Contact Method *</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.contactPreferences.preferredMethod === "phone"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        contactPreferences: { ...formData.contactPreferences, preferredMethod: "phone" },
                      })
                    }
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Phone className="h-5 w-5" />
                      <span className="text-sm font-medium">Phone Call</span>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.contactPreferences.preferredMethod === "whatsapp"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        contactPreferences: { ...formData.contactPreferences, preferredMethod: "whatsapp" },
                      })
                    }
                  >
                    <div className="flex flex-col items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="text-sm font-medium">WhatsApp</span>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.contactPreferences.preferredMethod === "email"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        contactPreferences: { ...formData.contactPreferences, preferredMethod: "email" },
                      })
                    }
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Mail className="h-5 w-5" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Available Hours</label>
                <Input
                  placeholder="e.g., 9 AM - 6 PM, Monday to Saturday"
                  value={formData.contactPreferences.availableHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPreferences: { ...formData.contactPreferences, availableHours: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Additional Notes</label>
                <Textarea
                  placeholder="Any additional information for vendors..."
                  value={formData.contactPreferences.additionalNotes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPreferences: { ...formData.contactPreferences, additionalNotes: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Requirement Visibility</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.visibility === "public"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, visibility: "public" })}
                  >
                    <div className="text-center">
                      <h4 className="font-medium">Public</h4>
                      <p className="text-xs text-muted-foreground">Visible to all vendors</p>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.visibility === "vendors_only"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, visibility: "vendors_only" })}
                  >
                    <div className="text-center">
                      <h4 className="font-medium">Vendors Only</h4>
                      <p className="text-xs text-muted-foreground">Only verified vendors</p>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.visibility === "private"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, visibility: "private" })}
                  >
                    <div className="text-center">
                      <h4 className="font-medium">Private</h4>
                      <p className="text-xs text-muted-foreground">Invite specific vendors</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Nearby vendors will be notified via your preferred channels</li>
                  <li>• Interested vendors will respond with quotes and availability</li>
                  <li>• You can compare responses and choose the best vendor</li>
                  <li>• Direct communication with selected vendors</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">Post Material Requirement</h1>
              <Badge variant="outline">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Basic Info</span>
              <span>Materials</span>
              <span>Location</span>
              <span>Budget</span>
              <span>Specifications</span>
              <span>Contact</span>
            </div>
          </div>

          {/* Form Content */}
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Post Requirement
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
