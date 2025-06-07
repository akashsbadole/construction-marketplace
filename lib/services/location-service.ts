import type { UserLocation, Vendor, ServiceLocation } from "@/lib/types/marketplace"

export class LocationService {
  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return Math.round(distance * 100) / 100 // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  // Find vendors within a specific radius
  async findNearbyVendors(
    location: UserLocation,
    radius: number,
    categories?: string[],
  ): Promise<{ vendor: Vendor; distance: number; serviceLocation: ServiceLocation }[]> {
    // In a real implementation, this would query a database with spatial indexing
    // For now, we'll use mock data and calculate distances

    const mockVendors = this.getMockVendors()
    const nearbyVendors: { vendor: Vendor; distance: number; serviceLocation: ServiceLocation }[] = []

    for (const vendor of mockVendors) {
      for (const serviceLocation of vendor.serviceLocations) {
        const distance = this.calculateDistance(
          location.latitude,
          location.longitude,
          serviceLocation.latitude,
          serviceLocation.longitude,
        )

        // Check if vendor is within radius and serves the required categories
        if (distance <= Math.min(radius, serviceLocation.serviceRadius)) {
          if (!categories || categories.some((cat) => vendor.categories.includes(cat))) {
            nearbyVendors.push({
              vendor,
              distance,
              serviceLocation,
            })
          }
        }
      }
    }

    // Sort by distance
    return nearbyVendors.sort((a, b) => a.distance - b.distance)
  }

  // Geocode address to coordinates
  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      // In a real implementation, you would use Google Maps API, Mapbox, or similar
      // For demo purposes, we'll return mock coordinates for major Indian cities
      const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
        mumbai: { latitude: 19.076, longitude: 72.8777 },
        delhi: { latitude: 28.7041, longitude: 77.1025 },
        bangalore: { latitude: 12.9716, longitude: 77.5946 },
        hyderabad: { latitude: 17.385, longitude: 78.4867 },
        chennai: { latitude: 13.0827, longitude: 80.2707 },
        kolkata: { latitude: 22.5726, longitude: 88.3639 },
        pune: { latitude: 18.5204, longitude: 73.8567 },
        ahmedabad: { latitude: 23.0225, longitude: 72.5714 },
        jaipur: { latitude: 26.9124, longitude: 75.7873 },
        lucknow: { latitude: 26.8467, longitude: 80.9462 },
      }

      const normalizedAddress = address.toLowerCase()
      for (const [city, coords] of Object.entries(cityCoordinates)) {
        if (normalizedAddress.includes(city)) {
          return coords
        }
      }

      // Default to Mumbai if no match found
      return cityCoordinates.mumbai
    } catch (error) {
      console.error("Geocoding failed:", error)
      return null
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      // In a real implementation, you would use a reverse geocoding service
      // For demo purposes, we'll return a mock address
      return `Address near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    } catch (error) {
      console.error("Reverse geocoding failed:", error)
      return null
    }
  }

  // Get user's current location
  async getCurrentLocation(): Promise<UserLocation | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const address = await this.reverseGeocode(latitude, longitude)

          resolve({
            latitude,
            longitude,
            address: address || "Unknown location",
            city: "Unknown",
            state: "Unknown",
            pincode: "000000",
            country: "India",
          })
        },
        (error) => {
          console.error("Geolocation error:", error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    })
  }

  // Calculate delivery charges based on distance
  calculateDeliveryCharges(distance: number, vendor: Vendor): number {
    const serviceLocation = vendor.serviceLocations[0] // Use first service location for simplicity
    if (!serviceLocation) return 0

    for (const charge of serviceLocation.deliveryCharges) {
      if (distance >= charge.minDistance && distance <= charge.maxDistance) {
        return charge.charge
      }
    }

    // Default charge for distances beyond defined ranges
    return Math.ceil(distance / 10) * 50 // ₹50 per 10km
  }

  // Check if location is serviceable by vendor
  isLocationServiceable(customerLocation: UserLocation, vendor: Vendor): boolean {
    return vendor.serviceLocations.some((serviceLocation) => {
      const distance = this.calculateDistance(
        customerLocation.latitude,
        customerLocation.longitude,
        serviceLocation.latitude,
        serviceLocation.longitude,
      )
      return distance <= serviceLocation.serviceRadius && serviceLocation.isActive
    })
  }

  // Mock vendors data for demonstration
  private getMockVendors(): Vendor[] {
    return [
      {
        id: "vendor_mumbai_materials",
        userId: "user_vendor_mumbai",
        businessName: "Mumbai Construction Materials",
        businessType: "distributor",
        description: "Leading supplier of construction materials in Mumbai",
        status: "approved",
        rating: 4.5,
        totalSales: 5000000,
        totalOrders: 250,
        responseRate: 95,
        averageResponseTime: 2,
        serviceLocations: [
          {
            id: "loc_mumbai_1",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            latitude: 19.076,
            longitude: 72.8777,
            serviceRadius: 50,
            deliveryCharges: [
              { minDistance: 0, maxDistance: 10, charge: 0, freeAboveAmount: 5000 },
              { minDistance: 10, maxDistance: 25, charge: 200 },
              { minDistance: 25, maxDistance: 50, charge: 500 },
            ],
            isActive: true,
          },
        ],
        specializations: ["cement", "steel", "bricks"],
        certifications: [],
        businessHours: {
          monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
          saturday: { isOpen: true, openTime: "09:00", closeTime: "16:00" },
          sunday: { isOpen: false },
        },
        contactInfo: {
          email: "mumbai@materials.com",
          phone: "+91-9876543210",
          whatsapp: "+91-9876543210",
        },
        businessInfo: {
          gstNumber: "27ABCDE1234F1Z5",
          businessAddress: {
            id: "addr_mumbai_vendor",
            type: "both",
            firstName: "Mumbai",
            lastName: "Materials",
            address1: "123 Industrial Estate",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            country: "India",
            location: { latitude: 19.076, longitude: 72.8777 },
            isDefault: true,
          },
        },
        commissionRate: 5,
        categories: ["cement", "steel", "bricks", "sand"],
        inventory: [],
        deliveryOptions: [
          {
            id: "standard",
            name: "Standard Delivery",
            description: "3-5 business days",
            estimatedDays: 4,
            charge: 200,
            freeAboveAmount: 5000,
            isActive: true,
          },
        ],
        paymentMethods: ["cod", "upi", "bank_transfer"],
        minimumOrderValue: 1000,
        joinedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        metadata: {},
      },
      // Add more mock vendors for other cities...
    ]
  }
}

export const locationService = new LocationService()
