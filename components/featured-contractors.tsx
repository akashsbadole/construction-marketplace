"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractorPortfolio } from "@/components/contractor-portfolio";
import { ReviewSystem } from "@/components/review-system";
import {
  StarIcon,
  MapPinIcon,
  BriefcaseIcon,
  AwardIcon,
  PhoneIcon,
  MailIcon,
} from "lucide-react";
import { databaseService } from "@/lib/services/database-service";
import type { Contractor } from "@/lib/types/marketplace";

// Mock data for demonstration - in real app, this would come from the database
const mockContractors = [
  {
    id: "1",
    userId: "user1",
    businessName: "Sharma Construction",
    specializations: ["Residential", "Commercial"],
    experienceYears: 15,
    description:
      "Specializing in residential buildings with 15+ years of experience. We deliver quality construction with attention to detail and timely completion.",
    website: "https://sharmaconstruction.com",
    licenseNumber: "CON-2024-001",
    serviceLocations: [
      {
        id: "1",
        city: "Delhi",
        state: "Delhi",
        pincode: "110001",
        latitude: 28.6139,
        longitude: 77.209,
        serviceRadius: 50,
        deliveryCharges: [],
        isActive: true,
      },
    ],
    businessHours: {
      monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
      saturday: { isOpen: true, openTime: "09:00", closeTime: "16:00" },
      sunday: { isOpen: false, openTime: "", closeTime: "" },
    },
    rating: 4.8,
    totalReviews: 120,
    portfolio: [
      {
        id: "p1",
        title: "Modern Residential Complex",
        description:
          "A 50-unit residential complex with modern amenities and sustainable design.",
        images: ["/placeholder.jpg", "/placeholder.jpg"],
        images360: ["/placeholder.jpg"],
        projectType: "Residential",
        location: "Gurgaon, Haryana",
        completedAt: "2024-01-15",
        duration: "18 months",
        projectValue: 25000000,
        clientName: "ABC Developers",
        clientTestimonial:
          "Excellent work quality and timely delivery. Highly recommended!",
        clientRating: 5,
        technologies: ["RCC", "Steel Structure", "Green Building"],
        challenges: "Complex foundation work due to soil conditions",
        solutions: "Implemented deep pile foundation with soil stabilization",
      },
    ],
    certifications: [
      {
        id: "c1",
        name: "Green Building Certification",
        issuedBy: "IGBC",
        issuedAt: "2023-06-01",
        expiresAt: "2026-06-01",
        certificateUrl: "/certificates/green-building.pdf",
      },
    ],
    teamSize: 25,
    equipment: ["Excavators", "Cranes", "Concrete Mixers"],
    status: "approved" as const,
    verifiedAt: "2024-01-01",
    metadata: {},
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    userId: "user2",
    businessName: "Patel Brothers",
    specializations: ["Commercial", "Industrial"],
    experienceYears: 12,
    description:
      "Commercial construction experts with focus on modern office spaces and industrial facilities.",
    website: "https://patelbrothers.com",
    licenseNumber: "CON-2024-002",
    serviceLocations: [
      {
        id: "2",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        latitude: 19.076,
        longitude: 72.8777,
        serviceRadius: 40,
        deliveryCharges: [],
        isActive: true,
      },
    ],
    businessHours: {
      monday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
      tuesday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
      wednesday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
      thursday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
      friday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
      saturday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
      sunday: { isOpen: false, openTime: "", closeTime: "" },
    },
    rating: 4.9,
    totalReviews: 85,
    portfolio: [
      {
        id: "p2",
        title: "Corporate Office Tower",
        description:
          "A 20-story corporate office building with state-of-the-art facilities.",
        images: ["/placeholder.jpg", "/placeholder.jpg"],
        projectType: "Commercial",
        location: "BKC, Mumbai",
        completedAt: "2023-12-01",
        duration: "24 months",
        projectValue: 45000000,
        clientName: "XYZ Corp",
        clientTestimonial:
          "Professional team with excellent project management skills.",
        clientRating: 5,
        technologies: ["Steel Frame", "Glass Facade", "Smart Building Systems"],
      },
    ],
    certifications: [],
    teamSize: 40,
    equipment: ["Tower Cranes", "Concrete Pumps", "Scaffolding"],
    status: "approved" as const,
    verifiedAt: "2024-01-01",
    metadata: {},
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "3",
    userId: "user3",
    businessName: "Reddy Interiors",
    specializations: ["Interior", "Renovation"],
    experienceYears: 8,
    description:
      "Interior renovation specialists with attention to detail and creative design solutions.",
    serviceLocations: [
      {
        id: "3",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        latitude: 12.9716,
        longitude: 77.5946,
        serviceRadius: 30,
        deliveryCharges: [],
        isActive: true,
      },
    ],
    businessHours: {
      monday: { isOpen: true, openTime: "10:00", closeTime: "18:00" },
      tuesday: { isOpen: true, openTime: "10:00", closeTime: "18:00" },
      wednesday: { isOpen: true, openTime: "10:00", closeTime: "18:00" },
      thursday: { isOpen: true, openTime: "10:00", closeTime: "18:00" },
      friday: { isOpen: true, openTime: "10:00", closeTime: "18:00" },
      saturday: { isOpen: true, openTime: "10:00", closeTime: "16:00" },
      sunday: { isOpen: false, openTime: "", closeTime: "" },
    },
    rating: 4.7,
    totalReviews: 200,
    portfolio: [
      {
        id: "p3",
        title: "Luxury Home Interior",
        description:
          "Complete interior design and renovation of a 4BHK luxury apartment.",
        images: ["/placeholder.jpg", "/placeholder.jpg"],
        images360: ["/placeholder.jpg"],
        projectType: "Interior",
        location: "Whitefield, Bangalore",
        completedAt: "2024-02-01",
        duration: "3 months",
        projectValue: 1500000,
        clientName: "Mr. & Mrs. Kumar",
        clientTestimonial:
          "Amazing transformation! The team understood our vision perfectly.",
        clientRating: 5,
        technologies: [
          "Modular Furniture",
          "Smart Lighting",
          "Automated Systems",
        ],
      },
    ],
    certifications: [],
    teamSize: 15,
    equipment: [
      "Design Software",
      "Measurement Tools",
      "Installation Equipment",
    ],
    status: "approved" as const,
    verifiedAt: "2024-01-01",
    metadata: {},
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

const mockReviews = [
  {
    id: "r1",
    userId: "customer1",
    userName: "Rajesh Kumar",
    userAvatar: "/placeholder-user.jpg",
    rating: 5,
    title: "Excellent work quality",
    comment:
      "The team delivered exceptional quality work within the promised timeline. Highly professional and skilled workers.",
    images: ["/placeholder.jpg"],
    isVerified: true,
    helpfulCount: 15,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    projectType: "Residential",
    orderValue: 2500000,
  },
  {
    id: "r2",
    userId: "customer2",
    userName: "Priya Sharma",
    userAvatar: "/placeholder-user.jpg",
    rating: 4,
    title: "Good experience overall",
    comment:
      "Professional team with good communication. Minor delays but quality was maintained.",
    isVerified: true,
    helpfulCount: 8,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
    projectType: "Commercial",
  },
];

export function FeaturedContractors() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContractor, setSelectedContractor] =
    useState<Contractor | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from the database
    // For now, we'll use mock data
    setTimeout(() => {
      setContractors(mockContractors);
      setLoading(false);
    }, 1000);
  }, []);

  const getReviewStats = (contractorId: string) => {
    // Mock review stats - in real app, this would be calculated from actual reviews
    return {
      averageRating:
        contractors.find((c) => c.id === contractorId)?.rating || 0,
      totalReviews:
        contractors.find((c) => c.id === contractorId)?.totalReviews || 0,
      ratingDistribution: {
        5: 80,
        4: 25,
        3: 10,
        2: 3,
        1: 2,
      },
    };
  };

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Top Rated Contractors
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Top Rated Contractors
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contractors.map((contractor) => (
            <Card
              key={contractor.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {contractor.businessName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {contractor.businessName}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {contractor.description}
                      </CardDescription>
                    </div>
                  </div>
                  {contractor.verifiedAt && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <AwardIcon className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {contractor.specializations.slice(0, 2).map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {contractor.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{contractor.specializations.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1 text-yellow-500">
                  <StarIcon className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">
                    {contractor.rating}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({contractor.totalReviews} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BriefcaseIcon className="h-4 w-4" />
                  <span>{contractor.experienceYears} years experience</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="h-4 w-4" />
                  <span>
                    {contractor.serviceLocations[0]?.city},{" "}
                    {contractor.serviceLocations[0]?.state}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedContractor(contractor)}
                    >
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {contractor.businessName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-xl font-bold">
                            {contractor.businessName}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {contractor.specializations.join(" • ")}
                          </p>
                        </div>
                      </DialogTitle>
                    </DialogHeader>

                    {selectedContractor && (
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                          <TabsTrigger value="reviews">Reviews</TabsTrigger>
                          <TabsTrigger value="contact">Contact</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">About</h3>
                                <p className="text-muted-foreground">
                                  {selectedContractor.description}
                                </p>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">
                                  Specializations
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedContractor.specializations.map(
                                    (spec, index) => (
                                      <Badge key={index} variant="secondary">
                                        {spec}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">
                                  Equipment
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedContractor.equipment.map(
                                    (item, index) => (
                                      <Badge key={index} variant="outline">
                                        {item}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">
                                    Experience:
                                  </span>
                                  <p className="text-muted-foreground">
                                    {selectedContractor.experienceYears} years
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Team Size:
                                  </span>
                                  <p className="text-muted-foreground">
                                    {selectedContractor.teamSize} members
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium">License:</span>
                                  <p className="text-muted-foreground">
                                    {selectedContractor.licenseNumber}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-medium">Rating:</span>
                                  <p className="text-muted-foreground">
                                    {selectedContractor.rating}/5 (
                                    {selectedContractor.totalReviews} reviews)
                                  </p>
                                </div>
                              </div>

                              {selectedContractor.certifications.length > 0 && (
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    Certifications
                                  </h3>
                                  <div className="space-y-2">
                                    {selectedContractor.certifications.map(
                                      (cert, index) => (
                                        <div
                                          key={index}
                                          className="p-3 border rounded-lg"
                                        >
                                          <div className="font-medium">
                                            {cert.name}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            Issued by {cert.issuedBy} •{" "}
                                            {new Date(
                                              cert.issuedAt
                                            ).getFullYear()}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="portfolio">
                          <ContractorPortfolio
                            portfolioItems={selectedContractor.portfolio}
                            contractorName={selectedContractor.businessName}
                            showFilters={false}
                          />
                        </TabsContent>

                        <TabsContent value="reviews">
                          <ReviewSystem
                            entityType="contractor"
                            entityId={selectedContractor.id}
                            entityName={selectedContractor.businessName}
                            reviews={mockReviews}
                            stats={getReviewStats(selectedContractor.id)}
                            canReview={false}
                          />
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="font-semibold">
                                Contact Information
                              </h3>

                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>+91 98765 43210</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>
                                    contact@
                                    {selectedContractor.businessName
                                      .toLowerCase()
                                      .replace(/\s+/g, "")}
                                    .com
                                  </span>
                                </div>
                                {selectedContractor.website && (
                                  <div className="flex items-center gap-3">
                                    <span className="h-4 w-4 text-muted-foreground">
                                      🌐
                                    </span>
                                    <a
                                      href={selectedContractor.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      {selectedContractor.website}
                                    </a>
                                  </div>
                                )}
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">
                                  Service Areas
                                </h4>
                                <div className="space-y-1">
                                  {selectedContractor.serviceLocations.map(
                                    (location, index) => (
                                      <div
                                        key={index}
                                        className="text-sm text-muted-foreground"
                                      >
                                        {location.city}, {location.state}{" "}
                                        (within {location.serviceRadius}km)
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold">Business Hours</h3>
                              <div className="space-y-2 text-sm">
                                {Object.entries(
                                  selectedContractor.businessHours
                                ).map(([day, hours]) => (
                                  <div
                                    key={day}
                                    className="flex justify-between"
                                  >
                                    <span className="capitalize font-medium">
                                      {day}:
                                    </span>
                                    <span className="text-muted-foreground">
                                      {hours.isOpen
                                        ? `${hours.openTime} - ${hours.closeTime}`
                                        : "Closed"}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              <div className="pt-4">
                                <Button className="w-full">
                                  <PhoneIcon className="h-4 w-4 mr-2" />
                                  Contact Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </DialogContent>
                </Dialog>
                <Button>
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
