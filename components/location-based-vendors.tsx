'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MapPinIcon, 
  StarIcon, 
  PhoneIcon, 
  MailIcon, 
  GlobeIcon,
  TruckIcon,
  ClockIcon,
  VerifiedIcon,
  FilterIcon,
  SearchIcon
} from 'lucide-react'

interface VendorLocation {
  id: string
  city: string
  state: string
  pincode: string
  latitude: number
  longitude: number
  serviceRadius: number
  deliveryCharges: { minDistance: number; maxDistance: number; charge: number }[]
  isActive: boolean
}

interface Vendor {
  id: string
  businessName: string
  businessType: string
  description: string
  website?: string
  gstNumber?: string
  businessAddress: {
    address: string
    city: string
    state: string
    pincode: string
  }
  serviceLocations: VendorLocation[]
  rating: number
  totalReviews: number
  categories: string[]
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
  joinedAt: string
  verifiedAt?: string
  isOnline: boolean
  responseTime: string
  completedOrders: number
}

interface LocationBasedVendorsProps {
  userLocation?: {
    latitude: number
    longitude: number
    city: string
    state: string
  }
}

const mockVendors: Vendor[] = [
  {
    id: '1',
    businessName: 'Delhi Building Materials',
    businessType: 'Supplier',
    description: 'Premium quality construction materials with fast delivery across Delhi NCR',
    website: 'https://delhimaterials.com',
    gstNumber: '07AABCD1234E1Z5',
    businessAddress: {
      address: 'Sector 18, Industrial Area',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122015'
    },
    serviceLocations: [
      {
        id: '1',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        latitude: 28.6139,
        longitude: 77.2090,
        serviceRadius: 50,
        deliveryCharges: [
          { minDistance: 0, maxDistance: 10, charge: 200 },
          { minDistance: 10, maxDistance: 25, charge: 400 },
          { minDistance: 25, maxDistance: 50, charge: 800 }
        ],
        isActive: true
      }
    ],
    rating: 4.8,
    totalReviews: 245,
    categories: ['Cement', 'Steel', 'Bricks', 'Sand'],
    deliveryOptions: [
      {
        id: 'same-day',
        name: 'Same Day Delivery',
        description: 'Order before 2 PM',
        estimatedDays: 0,
        charge: 500,
        freeAboveAmount: 10000
      },
      {
        id: 'next-day',
        name: 'Next Day Delivery',
        description: 'Standard delivery',
        estimatedDays: 1,
        charge: 200,
        freeAboveAmount: 5000
      }
    ],
    paymentMethods: ['COD', 'UPI', 'Bank Transfer', 'Credit Card'],
    minimumOrderValue: 1000,
    joinedAt: '2023-01-15',
    verifiedAt: '2023-02-01',
    isOnline: true,
    responseTime: '< 2 hours',
    completedOrders: 1250
  },
  {
    id: '2',
    businessName: 'Mumbai Steel Works',
    businessType: 'Manufacturer',
    description: 'Direct manufacturer of TMT bars, structural steel, and reinforcement materials',
    businessAddress: {
      address: 'MIDC Industrial Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    serviceLocations: [
      {
        id: '2',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        latitude: 19.0760,
        longitude: 72.8777,
        serviceRadius: 100,
        deliveryCharges: [
          { minDistance: 0, maxDistance: 20, charge: 300 },
          { minDistance: 20, maxDistance: 50, charge: 600 },
          { minDistance: 50, maxDistance: 100, charge: 1200 }
        ],
        isActive: true
      }
    ],
    rating: 4.9,
    totalReviews: 189,
    categories: ['Steel', 'TMT Bars', 'Structural Steel'],
    deliveryOptions: [
      {
        id: 'bulk',
        name: 'Bulk Delivery',
        description: '3-5 business days',
        estimatedDays: 4,
        charge: 0,
        freeAboveAmount: 50000
      }
    ],
    paymentMethods: ['Bank Transfer', 'Cheque', 'LC'],
    minimumOrderValue: 25000,
    joinedAt: '2022-08-20',
    verifiedAt: '2022-09-15',
    isOnline: false,
    responseTime: '< 4 hours',
    completedOrders: 890
  }
]

export function LocationBasedVendors({ userLocation }: LocationBasedVendorsProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('distance')
  const [loading, setLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVendors(mockVendors)
      setFilteredVendors(mockVendors)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = vendors

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(vendor =>
        vendor.serviceLocations.some(loc => 
          `${loc.city}, ${loc.state}`.toLowerCase().includes(selectedLocation.toLowerCase())
        )
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(vendor =>
        vendor.categories.some(cat => 
          cat.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      )
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort vendors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'orders':
          return b.completedOrders - a.completedOrders
        case 'name':
          return a.businessName.localeCompare(b.businessName)
        default:
          return 0
      }
    })

    setFilteredVendors(filtered)
  }, [vendors, selectedLocation, selectedCategory, searchQuery, sortBy])

  const calculateDistance = (vendor: Vendor) => {
    if (!userLocation) return 'N/A'
    
    const vendorLoc = vendor.serviceLocations[0]
    if (!vendorLoc) return 'N/A'

    // Simple distance calculation (in real app, use proper geolocation)
    const distance = Math.sqrt(
      Math.pow(userLocation.latitude - vendorLoc.latitude, 2) +
      Math.pow(userLocation.longitude - vendorLoc.longitude, 2)
    ) * 111 // Rough conversion to km

    return `${distance.toFixed(1)} km`
  }

  const getDeliveryCharge = (vendor: Vendor, distance: number) => {
    const location = vendor.serviceLocations[0]
    if (!location) return 'N/A'

    const charge = location.deliveryCharges.find(
      dc => distance >= dc.minDistance && distance <= dc.maxDistance
    )
    
    return charge ? `₹${charge.charge}` : 'Contact for pricing'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Vendors Near You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Vendors Near You</h2>
          <p className="text-muted-foreground">
            {userLocation ? `Showing vendors in ${userLocation.city}, ${userLocation.state}` : 'Find vendors in your area'}
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <MapPinIcon className="h-3 w-3" />
          {filteredVendors.length} vendors found
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All locations</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                <SelectItem value="Cement">Cement</SelectItem>
                <SelectItem value="Steel">Steel</SelectItem>
                <SelectItem value="Bricks">Bricks</SelectItem>
                <SelectItem value="Sand">Sand</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder-vendor.jpg" />
                    <AvatarFallback>
                      {vendor.businessName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {vendor.businessName}
                      {vendor.verifiedAt && (
                        <VerifiedIcon className="h-4 w-4 text-blue-500" />
                      )}
                    </CardTitle>
                    <CardDescription>{vendor.businessType}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${vendor.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-xs text-muted-foreground">
                    {vendor.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {vendor.description}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{vendor.rating}</span>
                  <span className="text-muted-foreground">({vendor.totalReviews})</span>
                </div>
                <div className="flex items-center gap-1">
                  <TruckIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{vendor.completedOrders} orders</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {vendor.serviceLocations[0]?.city}, {vendor.serviceLocations[0]?.state}
                </span>
                {userLocation && (
                  <Badge variant="outline" className="text-xs">
                    {calculateDistance(vendor)}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Response: {vendor.responseTime}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {vendor.categories.slice(0, 3).map((category, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
                {vendor.categories.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{vendor.categories.length - 3} more
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Min order: </span>
                  <span className="font-medium">₹{vendor.minimumOrderValue?.toLocaleString()}</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder-vendor.jpg" />
                          <AvatarFallback>
                            {vendor.businessName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-xl font-bold flex items-center gap-2">
                            {vendor.businessName}
                            {vendor.verifiedAt && (
                              <VerifiedIcon className="h-5 w-5 text-blue-500" />
                            )}
                          </h2>
                          <p className="text-sm text-muted-foreground">{vendor.businessType}</p>
                        </div>
                      </DialogTitle>
                    </DialogHeader>

                    {selectedVendor && (
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="services">Services</TabsTrigger>
                          <TabsTrigger value="delivery">Delivery</TabsTrigger>
                          <TabsTrigger value="contact">Contact</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">About</h3>
                                <p className="text-muted-foreground">{selectedVendor.description}</p>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Business Details</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Business Type:</span>
                                    <span>{selectedVendor.businessType}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>GST Number:</span>
                                    <span>{selectedVendor.gstNumber || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Joined:</span>
                                    <span>{new Date(selectedVendor.joinedAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Verified:</span>
                                    <span>{selectedVendor.verifiedAt ? 'Yes' : 'No'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-2">Performance</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Rating:</span>
                                    <div className="flex items-center gap-1">
                                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span>{selectedVendor.rating}/5</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Total Reviews:</span>
                                    <span>{selectedVendor.totalReviews}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Completed Orders:</span>
                                    <span>{selectedVendor.completedOrders}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">Response Time:</span>
                                    <span>{selectedVendor.responseTime}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-semibold mb-2">Payment Methods</h3>
                                <div className="flex flex-wrap gap-2">
                                  {selectedVendor.paymentMethods.map((method, index) => (
                                    <Badge key={index} variant="outline">{method}</Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="services" className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-3">Product Categories</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {selectedVendor.categories.map((category, index) => (
                                <Card key={index} className="p-3 text-center">
                                  <div className="font-medium">{category}</div>
                                </Card>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3">Service Areas</h3>
                            <div className="space-y-3">
                              {selectedVendor.serviceLocations.map((location, index) => (
                                <Card key={index} className="p-4">
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
                                </Card>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="delivery" className="space-y-4">
                          <div>
                            <h3 className="font-semibold mb-3">Delivery Options</h3>
                            <div className="space-y-3">
                              {selectedVendor.deliveryOptions.map((option, index) => (
                                <Card key={index} className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="font-medium">{option.name}</div>
                                      <div className="text-sm text-muted-foreground">{option.description}</div>
                                      <div className="text-sm">
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
                                </Card>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-3">Delivery Charges</h3>
                            <div className="space-y-2">
                              {selectedVendor.serviceLocations[0]?.deliveryCharges.map((charge, index) => (
                                <div key={index} className="flex justify-between items-center p-3 border rounded">
                                  <span>{charge.minDistance}-{charge.maxDistance} km</span>
                                  <span className="font-medium">₹{charge.charge}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="contact" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h3 className="font-semibold">Contact Information</h3>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>+91 98765 43210</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>contact@{selectedVendor.businessName.toLowerCase().replace(/\s+/g, '')}.com</span>
                                </div>
                                {selectedVendor.website && (
                                  <div className="flex items-center gap-3">
                                    <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                                    <a href={selectedVendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      {selectedVendor.website}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="font-semibold">Business Address</h3>
                              <div className="text-sm text-muted-foreground">
                                {selectedVendor.businessAddress.address}<br />
                                {selectedVendor.businessAddress.city}, {selectedVendor.businessAddress.state}<br />
                                {selectedVendor.businessAddress.pincode}
                              </div>

                              <div className="pt-4 space-y-2">
                                <Button className="w-full">
                                  <PhoneIcon className="h-4 w-4 mr-2" />
                                  Call Now
                                </Button>
                                <Button variant="outline" className="w-full">
                                  <MailIcon className="h-4 w-4 mr-2" />
                                  Send Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No vendors found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSelectedLocation('')
              setSelectedCategory('')
              setSearchQuery('')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
