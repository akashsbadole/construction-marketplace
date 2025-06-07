"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Image360Viewer } from "@/components/ui/360-viewer";
import {
  Calendar,
  Upload,
  MapPin,
  Home,
  Building,
  Ruler,
  Camera,
  FileIcon,
  XIcon,
  PlusIcon,
  IndianRupeeIcon,
} from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  budget: {
    min: number;
    max: number;
    currency: string;
    isFlexible: boolean;
  };
  timeline: {
    startDate?: Date;
    expectedCompletion: string;
    urgency: "immediate" | "within_week" | "within_month" | "flexible";
  };
  requirements: string[];
  services: string[];
  images: string[];
  images360: string[];
  documents: string[];
  specifications: { name: string; value: string; unit?: string }[];
  paymentTerms: string;
  additionalNotes: string;
  visibility: "public" | "private" | "contractors_only";
}

const projectCategories = [
  { value: "residential", label: "Residential Construction", icon: Home },
  { value: "commercial", label: "Commercial Construction", icon: Building },
  { value: "renovation", label: "Renovation & Remodeling", icon: Ruler },
  { value: "interior", label: "Interior Design", icon: Home },
  { value: "landscaping", label: "Landscaping", icon: Home },
];

const serviceOptions = [
  "Architecture & Design",
  "Construction",
  "Interior Design",
  "Renovation",
  "Electrical Work",
  "Plumbing",
  "Roofing",
  "Flooring",
  "Painting",
  "HVAC",
  "Landscaping",
  "Project Management",
];

export default function PostProjectPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    category: "residential",
    subcategory: "",
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    budget: {
      min: 0,
      max: 0,
      currency: "INR",
      isFlexible: false,
    },
    timeline: {
      expectedCompletion: "",
      urgency: "flexible",
    },
    requirements: [],
    services: [],
    images: [],
    images360: [],
    documents: [],
    specifications: [],
    paymentTerms: "",
    additionalNotes: "",
    visibility: "public",
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newSpecification, setNewSpecification] = useState({
    name: "",
    value: "",
    unit: "",
  });

  // File upload handlers
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      const imageUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
    },
  });

  const {
    getRootProps: get360RootProps,
    getInputProps: get360InputProps,
    isDragActive: is360DragActive,
  } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 20,
    maxSize: 15 * 1024 * 1024, // 15MB
    onDrop: (acceptedFiles) => {
      const imageUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images360: [...prev.images360, ...imageUrls],
      }));
    },
  });

  const {
    getRootProps: getDocRootProps,
    getInputProps: getDocInputProps,
    isDragActive: isDocDragActive,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 5,
    maxSize: 25 * 1024 * 1024, // 25MB
    onDrop: (acceptedFiles) => {
      const docUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...docUrls],
      }));
    },
  });

  // Form handlers
  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (
    parent: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ProjectFormData],
        [field]: value,
      },
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (newSpecification.name.trim() && newSpecification.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...prev.specifications, { ...newSpecification }],
      }));
      setNewSpecification({ name: "", value: "", unit: "" });
    }
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const removeFile = (
    index: number,
    type: "images" | "images360" | "documents"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would submit to your API
      console.log("Submitting project:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to projects page
      router.push("/projects");
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            Post Your Construction Project
          </h1>
          <p className="text-muted-foreground mb-8">
            Fill in the details below to find the right contractors for your
            project. The more details you provide, the better matches you'll
            receive.
          </p>

          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="budget">Budget & Timeline</TabsTrigger>
              <TabsTrigger value="media">Media & Specs</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., 2BHK Apartment Renovation"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant={
                          projectType === "residential" ? "default" : "outline"
                        }
                        className="flex items-center justify-center gap-2 h-20"
                        onClick={() => setProjectType("residential")}
                      >
                        <Home className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-medium">Residential</div>
                          <div className="text-xs text-muted-foreground">
                            Homes, apartments, villas
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant={
                          projectType === "commercial" ? "default" : "outline"
                        }
                        className="flex items-center justify-center gap-2 h-20"
                        onClick={() => setProjectType("commercial")}
                      >
                        <Building className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-medium">Commercial</div>
                          <div className="text-xs text-muted-foreground">
                            Offices, shops, buildings
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Project Description
                    </label>
                    <Textarea
                      placeholder="Describe your project in detail..."
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <div className="flex gap-4">
                      <Select className="flex-1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="maharashtra">
                            Maharashtra
                          </SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
                          <SelectItem value="telangana">Telangana</SelectItem>
                          <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select className="flex-1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delhi">New Delhi</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="hyderabad">Hyderabad</SelectItem>
                          <SelectItem value="chennai">Chennai</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Detailed Address
                    </label>
                    <div className="flex items-center gap-2 border rounded-md p-3 bg-muted/50">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">
                        Use current location or enter address
                      </span>
                    </div>
                  </div>

                  <Button className="w-full">Continue to Requirements</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Size</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Area"
                        className="w-32"
                      />
                      <Select defaultValue="sqft">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sqft">sq.ft</SelectItem>
                          <SelectItem value="sqm">sq.m</SelectItem>
                          <SelectItem value="acres">acres</SelectItem>
                        </SelectContent>
                      </Select>
                      <Ruler className="h-5 w-5 text-muted-foreground ml-2" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Number of Floors
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select floors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Floor</SelectItem>
                        <SelectItem value="2">2 Floors</SelectItem>
                        <SelectItem value="3">3 Floors</SelectItem>
                        <SelectItem value="4">4 Floors</SelectItem>
                        <SelectItem value="5+">5+ Floors</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Required Services
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <input type="checkbox" className="h-4 w-4" />
                        <span>Architecture & Design</span>
                      </label>
                      <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <input type="checkbox" className="h-4 w-4" />
                        <span>Construction</span>
                      </label>
                      <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <input type="checkbox" className="h-4 w-4" />
                        <span>Interior Design</span>
                      </label>
                      <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <input type="checkbox" className="h-4 w-4" />
                        <span>Renovation</span>
                      </label>
                      <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <input type="checkbox" className="h-4 w-4" />
                        <span>Electrical Work</span>
                      </label>
                      <label className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <input type="checkbox" className="h-4 w-4" />
                        <span>Plumbing</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Upload Reference Images/Documents
                    </label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        (Floor plans, design references, etc.)
                      </p>
                      <Input type="file" className="hidden" multiple />
                    </div>
                  </div>

                  <Button className="w-full">
                    Continue to Budget & Timeline
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budget" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget & Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Estimated Budget (₹)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Minimum
                        </label>
                        <Input type="number" placeholder="Min Budget" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Maximum
                        </label>
                        <Input type="number" placeholder="Max Budget" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Project Timeline
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Start Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pl-9" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">
                          Expected Completion
                        </label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3">1-3 months</SelectItem>
                            <SelectItem value="3-6">3-6 months</SelectItem>
                            <SelectItem value="6-12">6-12 months</SelectItem>
                            <SelectItem value="12+">Over 12 months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Terms</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="milestone">
                          Milestone-based payments
                        </SelectItem>
                        <SelectItem value="monthly">
                          Monthly payments
                        </SelectItem>
                        <SelectItem value="advance">
                          Advance + Completion
                        </SelectItem>
                        <SelectItem value="custom">
                          Custom payment schedule
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Additional Requirements
                    </label>
                    <Textarea
                      placeholder="Any other specific requirements or notes..."
                      rows={3}
                    />
                  </div>

                  <div className="pt-4">
                    <Button className="w-full">Submit Project</Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      By submitting, you agree to our Terms of Service and
                      Privacy Policy
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
