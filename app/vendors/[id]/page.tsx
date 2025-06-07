'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReviewSystem } from '@/components/review-system'
import { 
  StarIcon, 
  PhoneIcon, 
  MailIcon, 
  GlobeIcon,
  MapPinIcon,
  TruckIcon,
  ClockIcon,
  VerifiedIcon,
  ShieldCheckIcon,
  CalendarIcon,
  PackageIcon,
  CreditCardIcon
} from 'lucide-react'
import Head from 'next/head'

interface VendorProfile {
  id: string
  businessName: string
  businessType: string
  description: string
  website?: string
  gstNumber?: string
  panNumber?: string
  businessAddress: {
    address: string
    city: string
    state: string
    pincode: string
  }
  serviceLocations: {
    id: string
    city: string
    state: string
    serviceRadius: number
    isActive: boolean
  }[]
  rating: number
  totalReviews: number
  categories: string[]
  products: {
    id: string
    name: string
    price: number
    unit: string
    image: string
    inStock: boolean
  }[]
  deliveryOptions: {
    id: string
    name: string
    description: string
    estimatedDays: number
    charge: number
    freeAboveAmount?: number
  }[]
  paymentMethods: string[]
  minimumOrderValue?: number
  businessHours: {
    [key: string]: { isOpen: boolean; openTime: string; closeTime: string }
  }
  joinedAt: string
  verifiedAt?: string
  isOnline: boolean
  responseTime: string
  completedOrders: number
  certifications: string[]
  awards: string[]
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
}

// Mock data - in real app, this would come from API
const mockVendorProfile: VendorProfile = {
  id: '1',
  businessName: 'Delhi Building Materials',
  businessType: 'Supplier & Distributor',
  description: 'Premium quality construction materials with fast delivery across Delhi NCR. We specialize in providing high-grade cement, steel, bricks, and aggregates for residential and commercial construction projects. With over 15 years of experience in the industry, we have built a reputation for reliability, quality, and competitive pricing.',
  website: 'https://delhimaterials.com',
  gstNumber: '07AABCD1234E1Z5',
  panNumber: 'AABCD1234E',
  businessAddress: {
    address: 'Plot No. 45, Sector 18, Industrial Area, Phase 1',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122015'
  },
  serviceLocations: [
    { id: '1', city: 'Delhi', state: 'Delhi', serviceRadius: 50, isActive: true },
    { id: '2', city: 'Gurgaon', state: 'Haryana', serviceRadius: 30, isActive: true },
    { id: '3', city: 'Noida', state: 'Uttar Pradesh', serviceRadius: 40, isActive: true }
  ],
  rating: 4.8,
  totalReviews: 245,
  categories: ['Cement', 'Steel & TMT Bars', 'Bricks & Blocks', 'Sand & Aggregates', 'Roofing Materials'],
  products: [
    { id: '1', name: 'ACC Cement OPC 53 Grade', price: 420, unit: 'bag', image: '/placeholder.jpg', inStock: true },
    { id: '2', name: 'TMT Steel Bars 12mm', price: 65, unit: 'kg', image: '/placeholder.jpg', inStock: true },
    { id: '3', name: 'Red Clay Bricks', price: 8, unit: 'piece', image: '/placeholder.jpg', inStock: false }
  ],
  deliveryOptions: [
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Order before 2 PM for same day delivery',
      estimatedDays: 0,
      charge: 500,
      freeAboveAmount: 10000
    },
    {
      id: 'next-day',
      name: 'Next Day Delivery',
      description: 'Standard delivery service',
      estimatedDays: 1,
      charge: 200,
      freeAboveAmount: 5000
    },
    {
      id: 'bulk',
      name: 'Bulk Delivery',
      description: 'For large orders (3-5 business days)',
      estimatedDays: 4,
      charge: 0,
      freeAboveAmount: 25000
    }
  ],
  paymentMethods: ['Cash on Delivery', 'UPI', 'Bank Transfer', 'Credit Card', 'Cheque'],
  minimumOrderValue: 1000,
  businessHours: {
    monday: { isOpen: true, openTime: '08:00', closeTime: '19:00' },
    tuesday: { isOpen: true, openTime: '08:00', closeTime: '19:00' },
    wednesday: { isOpen: true, openTime: '08:00', closeTime: '19:00' },
    thursday: { isOpen: true, openTime: '08:00', closeTime: '19:00' },
    friday: { isOpen: true, openTime: '08:00', closeTime: '19:00' },
    saturday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
    sunday: { isOpen: false, openTime: '', closeTime: '' }
  },
  joinedAt: '2023-01-15',
  verifiedAt: '2023-02-01',
  isOnline: true,
  responseTime: '< 2 hours',
  completedOrders: 1250,
  certifications: ['ISO 9001:2015', 'BIS Certification', 'Green Building Council Member'],
  awards: ['Best Supplier 2023', 'Customer Choice Award 2022'],
  seoTitle: 'Delhi Building Materials - Premium Construction Materials Supplier in Delhi NCR',
  seoDescription: 'Leading supplier of high-quality construction materials in Delhi NCR. Get cement, steel, bricks, and aggregates with fast delivery. ISO certified with 15+ years experience.',
  seoKeywords: ['construction materials delhi', 'cement supplier gurgaon', 'steel bars noida', 'building materials ncr', 'construction supplier india']
}

const mockReviews = [
  {
    id: 'r1',
    userId: 'customer1',
    userName: 'Rajesh Kumar',
    userAvatar: '/placeholder-user.jpg',
    rating: 5,
    title: 'Excellent quality and service',
    comment: 'Ordered cement and steel for my house construction. Quality was top-notch and delivery was on time. Highly recommended!',
    images: ['/placeholder.jpg'],
    isVerified: true,
    helpfulCount: 15,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    projectType: 'Residential',
    orderValue: 45000
  },
  {
    id: 'r2',
    userId: 'customer2',
    userName: 'Priya Sharma',
    userAvatar: '/placeholder-user.jpg',
    rating: 4,
    title: 'Good experience overall',
    comment: 'Professional team with good communication. Prices are competitive and delivery was prompt.',
    isVerified: true,
    helpfulCount: 8,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
    projectType: 'Commercial'
  }
]

export default function VendorProfilePage() {
  const params = useParams()
  const [vendor, setVendor] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVendor(mockVendorProfile)
      setLoading(false)
    }, 1000)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
            <p className="text-muted-foreground">The vendor you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const reviewStats = {
    averageRating: vendor.rating,
    totalReviews: vendor.totalReviews,
    ratingDistribution: {
      5: 180,
      4: 45,
      3: 15,
      2: 3,
      1: 2
    }
  }

  return (
    <>
      <Head>
        <title>{vendor.seoTitle}</title>
        <meta name="description" content={vendor.seoDescription} />
        <meta name="keywords" content={vendor.seoKeywords.join(', ')} />
        <meta property="og:title" content={vendor.seoTitle} />
        <meta property="og:description" content={vendor.seoDescription} />
        <meta property="og:type" content="business.business" />
        <meta property="business:contact_data:locality" content={vendor.businessAddress.city} />
        <meta property="business:contact_data:region" content={vendor.businessAddress.state} />
        <meta property="business:contact_data:country_name" content="India" />
        <link rel="canonical" href={`https://buildconnect.com/vendors/${vendor.id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": vendor.businessName,
            "description": vendor.description,
            "url": vendor.website,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": vendor.businessAddress.address,
              "addressLocality": vendor.businessAddress.city,
              "addressRegion": vendor.businessAddress.state,
              "postalCode": vendor.businessAddress.pincode,
              "addressCountry": "IN"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": vendor.rating,
              "reviewCount": vendor.totalReviews
            },
            "openingHours": Object.entries(vendor.businessHours)
              .filter(([_, hours]) => hours.isOpen)
              .map(([day, hours]) => `${day.substring(0, 2).toUpperCase()} ${hours.openTime}-${hours.closeTime}`)
          })}
        </script>
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 container py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-vendor.jpg" />
                <AvatarFallback className="text-2xl">
                  {vendor.businessName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{vendor.businessName}</h1>
                  {vendor.verifiedAt && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <VerifiedIcon className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${vendor.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-sm text-muted-foreground">
                      {vendor.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground mb-3">{vendor.businessType}</p>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{vendor.rating}</span>
                    <span className="text-muted-foreground">({vendor.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TruckIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{vendor.completedOrders} orders completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Response: {vendor.responseTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button size="lg">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" size="lg">
                  <MailIcon className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {vendor.businessName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{vendor.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {vendor.categories.map((category, index) => (
                          <div key={index} className="p-3 border rounded-lg text-center hover:bg-muted/50 transition-colors">
                            <PackageIcon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <div className="font-medium text-sm">{category}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Certifications & Awards</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <ShieldCheckIcon className="h-4 w-4" />
                          Certifications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {vendor.certifications.map((cert, index) => (
                            <Badge key={index} variant="secondary">{cert}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Awards & Recognition</h4>
                        <div className="flex flex-wrap gap-2">
                          {vendor.awards.map((award, index) => (
                            <Badge key={index} variant="outline">{award}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vendor.products.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h3 className="font-medium">{product.name}</h3>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-lg font-bold">₹{product.price}/{product.unit}</span>
                                <Badge variant={product.inStock ? "default" : "secondary"}>
                                  {product.inStock ? "In Stock" : "Out of Stock"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vendor.serviceLocations.map((location) => (
                          <div key={location.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{location.city}, {location.state}</div>
                                <div className="text-sm text-muted-foreground">
                                  Service radius: {location.serviceRadius} km
                                </div>
                              </div>
                              <Badge variant={location.isActive ? "default" : "secondary"}>
                                {location.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {vendor.deliveryOptions.map((option) => (
                          <div key={option.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{option.name}</div>
                                <div className="text-sm text-muted-foreground">{option.description}</div>
                                <div className="text-sm mt-1">
                                  Delivery: {option.estimatedDays === 0 ? 'Same day' : `${option.estimatedDays} day(s)`}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">₹{option.charge}</div>
                                {option.freeAboveAmount && (
                                  <div className="text-xs text-green-600">
                                    Free above ₹{option.freeAboveAmount.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <ReviewSystem
                    entityType="vendor"
                    entityId={vendor.id}
                    entityName={vendor.businessName}
                    reviews={mockReviews}
                    stats={reviewStats}
                    canReview={false}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">contact@delhimaterials.com</span>
                    </div>
                    {vendor.website && (
                      <div className="flex items-center gap-3">
                        <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                        <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          {vendor.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        {vendor.businessAddress.address}<br />
                        {vendor.businessAddress.city}, {vendor.businessAddress.state}<br />
                        {vendor.businessAddress.pincode}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(vendor.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize font-medium">{day}:</span>
                        <span className="text-muted-foreground">
                          {hours.isOpen ? `${hours.openTime} - ${hours.closeTime}` : 'Closed'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {vendor.paymentMethods.map((method, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{method}</span>
                      </div>
                    ))}
                  </div>
                  {vendor.minimumOrderValue && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="text-sm">
                        <span className="font-medium">Minimum Order: </span>
                        ₹{vendor.minimumOrderValue.toLocaleString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>GST Number:</span>
                    <span className="font-mono">{vendor.gstNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAN Number:</span>
                    <span className="font-mono">{vendor.panNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member Since:</span>
                    <span>{new Date(vendor.joinedAt).toLocaleDateString()}</span>
                  </div>
                  {vendor.verifiedAt && (
                    <div className="flex justify-between">
                      <span>Verified:</span>
                      <span className="text-green-600">✓ Verified</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
