import type {
  User,
  Product,
  Category,
  Vendor,
  Contractor,
  Cart,
  Order,
  MaterialRequirement,
  VendorResponse,
  SearchFilters,
  SearchResult,
  UserRole,
  UserLocation,
} from "@/lib/types/marketplace"
import { locationService } from "./location-service"
import { communicationService } from "./communication-service"

// Enhanced Mock database with location-based features
class MockDatabase {
  private users: Map<string, User> = new Map()
  private products: Map<string, Product> = new Map()
  private categories: Map<string, Category> = new Map()
  private vendors: Map<string, Vendor> = new Map()
  private contractors: Map<string, Contractor> = new Map()
  private carts: Map<string, Cart> = new Map()
  private orders: Map<string, Order> = new Map()
  private requirements: Map<string, MaterialRequirement> = new Map()
  private vendorResponses: Map<string, VendorResponse> = new Map()

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Seed categories
    const categories: Category[] = [
      {
        id: "cat_cement",
        name: "Cement & Concrete",
        slug: "cement-concrete",
        description: "High-quality cement and concrete materials",
        image: "/categories/cement.jpg",
        isActive: true,
        sortOrder: 1,
        metadata: {},
      },
      {
        id: "cat_steel",
        name: "Steel & Iron",
        slug: "steel-iron",
        description: "Steel bars, rods, and iron materials",
        image: "/categories/steel.jpg",
        isActive: true,
        sortOrder: 2,
        metadata: {},
      },
      {
        id: "cat_bricks",
        name: "Bricks & Blocks",
        slug: "bricks-blocks",
        description: "Clay bricks, concrete blocks, and masonry",
        image: "/categories/bricks.jpg",
        isActive: true,
        sortOrder: 3,
        metadata: {},
      },
      {
        id: "cat_sand",
        name: "Sand & Aggregates",
        slug: "sand-aggregates",
        description: "Construction sand, gravel, and aggregates",
        image: "/categories/sand.jpg",
        isActive: true,
        sortOrder: 4,
        metadata: {},
      },
      {
        id: "cat_tiles",
        name: "Tiles & Flooring",
        slug: "tiles-flooring",
        description: "Ceramic tiles, marble, and flooring materials",
        image: "/categories/tiles.jpg",
        isActive: true,
        sortOrder: 5,
        metadata: {},
      },
      {
        id: "cat_paint",
        name: "Paints & Coatings",
        slug: "paints-coatings",
        description: "Interior and exterior paints",
        image: "/categories/paint.jpg",
        isActive: true,
        sortOrder: 6,
        metadata: {},
      },
    ]

    categories.forEach((cat) => this.categories.set(cat.id, cat))

    // Seed users with locations
    const users: User[] = [
      {
        id: "user_customer_mumbai",
        email: "customer@mumbai.com",
        firstName: "Rajesh",
        lastName: "Sharma",
        phone: "+91-9876543210",
        role: "customer",
        status: "active",
        location: {
          latitude: 19.076,
          longitude: 72.8777,
          address: "Andheri West, Mumbai",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400058",
          country: "India",
        },
        addresses: [],
        preferences: {
          language: "en",
          currency: "INR",
          notifications: {
            email: true,
            sms: true,
            whatsapp: true,
            push: true,
          },
          privacy: {
            showProfile: true,
            showContact: false,
            shareLocation: true,
          },
          communication: {
            preferredMethod: "whatsapp",
            businessHours: {
              start: "09:00",
              end: "18:00",
              timezone: "Asia/Kolkata",
            },
          },
        },
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "user_vendor_mumbai",
        email: "vendor@mumbaimaterials.com",
        firstName: "Suresh",
        lastName: "Patel",
        phone: "+91-9876543211",
        role: "vendor",
        status: "active",
        location: {
          latitude: 19.0728,
          longitude: 72.8826,
          address: "Goregaon East, Mumbai",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400063",
          country: "India",
          radius: 50,
        },
        addresses: [],
        preferences: {
          language: "en",
          currency: "INR",
          notifications: {
            email: true,
            sms: true,
            whatsapp: true,
            push: true,
          },
          privacy: {
            showProfile: true,
            showContact: true,
            shareLocation: true,
          },
          communication: {
            preferredMethod: "phone",
            businessHours: {
              start: "08:00",
              end: "19:00",
              timezone: "Asia/Kolkata",
            },
          },
        },
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    users.forEach((user) => this.users.set(user.id, user))

    // Seed vendors with service locations
    const vendors: Vendor[] = [
      {
        id: "vendor_mumbai_materials",
        userId: "user_vendor_mumbai",
        businessName: "Mumbai Construction Materials",
        businessType: "distributor",
        description: "Leading supplier of construction materials in Mumbai and surrounding areas",
        status: "approved",
        rating: 4.5,
        totalSales: 5000000,
        totalOrders: 250,
        responseRate: 95,
        averageResponseTime: 2,
        serviceLocations: [
          {
            id: "loc_mumbai_central",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400063",
            latitude: 19.0728,
            longitude: 72.8826,
            serviceRadius: 50,
            deliveryCharges: [
              { minDistance: 0, maxDistance: 10, charge: 0, freeAboveAmount: 5000 },
              { minDistance: 10, maxDistance: 25, charge: 200 },
              { minDistance: 25, maxDistance: 50, charge: 500 },
            ],
            isActive: true,
          },
        ],
        specializations: ["cement", "steel", "bricks", "sand"],
        certifications: [
          {
            id: "cert_iso",
            name: "ISO 9001:2015",
            issuedBy: "Bureau Veritas",
            issuedAt: "2023-01-15",
            expiresAt: "2026-01-15",
          },
        ],
        businessHours: {
          monday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
          tuesday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
          wednesday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
          thursday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
          friday: { isOpen: true, openTime: "08:00", closeTime: "19:00" },
          saturday: { isOpen: true, openTime: "08:00", closeTime: "17:00" },
          sunday: { isOpen: false },
        },
        contactInfo: {
          email: "vendor@mumbaimaterials.com",
          phone: "+91-9876543211",
          whatsapp: "+91-9876543211",
          website: "https://mumbaimaterials.com",
        },
        businessInfo: {
          gstNumber: "27ABCDE1234F1Z5",
          panNumber: "ABCDE1234F",
          registrationNumber: "U12345MH2020PTC123456",
          businessAddress: {
            id: "addr_mumbai_vendor",
            type: "both",
            firstName: "Mumbai",
            lastName: "Materials",
            address1: "123 Industrial Estate, Goregaon East",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400063",
            country: "India",
            location: { latitude: 19.0728, longitude: 72.8826 },
            isDefault: true,
          },
          establishedYear: 2015,
        },
        bankInfo: {
          accountNumber: "1234567890",
          ifscCode: "HDFC0001234",
          accountHolderName: "Mumbai Construction Materials",
          bankName: "HDFC Bank",
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
          {
            id: "express",
            name: "Express Delivery",
            description: "1-2 business days",
            estimatedDays: 1,
            charge: 500,
            isActive: true,
          },
        ],
        paymentMethods: ["cod", "upi", "bank_transfer", "card"],
        minimumOrderValue: 1000,
        joinedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        metadata: {},
      },
    ]

    vendors.forEach((vendor) => this.vendors.set(vendor.id, vendor))
  }

  // Generic CRUD operations
  get<T>(collection: Map<string, T>, id: string): T | undefined {
    return collection.get(id)
  }

  getAll<T>(collection: Map<string, T>): T[] {
    return Array.from(collection.values())
  }

  create<T extends { id: string }>(collection: Map<string, T>, item: T): T {
    collection.set(item.id, item)
    return item
  }

  update<T extends { id: string }>(collection: Map<string, T>, id: string, updates: Partial<T>): T | undefined {
    const existing = collection.get(id)
    if (!existing) return undefined

    const updated = { ...existing, ...updates }
    collection.set(id, updated)
    return updated
  }

  delete<T>(collection: Map<string, T>, id: string): boolean {
    return collection.delete(id)
  }

  // Specific getters for each collection
  getUsers() {
    return this.users
  }
  getProducts() {
    return this.products
  }
  getCategories() {
    return this.categories
  }
  getVendors() {
    return this.vendors
  }
  getContractors() {
    return this.contractors
  }
  getCarts() {
    return this.carts
  }
  getOrders() {
    return this.orders
  }
  getRequirements() {
    return this.requirements
  }
  getVendorResponses() {
    return this.vendorResponses
  }
}

class MarketplaceService {
  private db = new MockDatabase()

  // Authentication (existing methods remain the same)
  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    const users = Array.from(this.db.getUsers().values())
    const user = users.find((u) => u.email === email)

    if (!user) return null

    const token = `token_${user.id}_${Date.now()}`
    return { user, token }
  }

  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role: UserRole
    location?: UserLocation
  }): Promise<{ user: User; token: string }> {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const user: User = {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      status: "active",
      location: userData.location || {
        latitude: 19.076,
        longitude: 72.8777,
        address: "Mumbai, Maharashtra",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
      },
      addresses: [],
      preferences: {
        language: "en",
        currency: "INR",
        notifications: {
          email: true,
          sms: true,
          whatsapp: true,
          push: true,
        },
        privacy: {
          showProfile: true,
          showContact: false,
          shareLocation: true,
        },
        communication: {
          preferredMethod: "phone",
          businessHours: {
            start: "09:00",
            end: "18:00",
            timezone: "Asia/Kolkata",
          },
        },
      },
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.db.create(this.db.getUsers(), user)
    const token = `token_${user.id}_${Date.now()}`

    return { user, token }
  }

  // Material Requirements
  async createRequirement(
    requirementData: Omit<MaterialRequirement, "id" | "createdAt" | "updatedAt">,
  ): Promise<MaterialRequirement> {
    const requirementId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const requirement: MaterialRequirement = {
      ...requirementData,
      id: requirementId,
      createdAt: now,
      updatedAt: now,
    }

    this.db.create(this.db.getRequirements(), requirement)

    // Find nearby vendors and notify them
    await this.notifyNearbyVendors(requirement)

    return requirement
  }

  async getRequirement(id: string): Promise<MaterialRequirement | null> {
    return this.db.get(this.db.getRequirements(), id) || null
  }

  async getRequirements(filters?: {
    customerId?: string
    category?: string
    location?: UserLocation
    radius?: number
    status?: string
    limit?: number
    offset?: number
  }): Promise<{ requirements: MaterialRequirement[]; total: number }> {
    let requirements = Array.from(this.db.getRequirements().values())

    // Apply filters
    if (filters?.customerId) {
      requirements = requirements.filter((r) => r.customerId === filters.customerId)
    }

    if (filters?.category) {
      requirements = requirements.filter((r) => r.category === filters.category)
    }

    if (filters?.status) {
      requirements = requirements.filter((r) => r.status === filters.status)
    }

    if (filters?.location && filters?.radius) {
      requirements = requirements.filter((r) => {
        const distance = locationService.calculateDistance(
          filters.location!.latitude,
          filters.location!.longitude,
          r.location.latitude,
          r.location.longitude,
        )
        return distance <= filters.radius!
      })
    }

    const total = requirements.length

    // Apply pagination
    if (filters?.offset) {
      requirements = requirements.slice(filters.offset)
    }

    if (filters?.limit) {
      requirements = requirements.slice(0, filters.limit)
    }

    return { requirements, total }
  }

  // Vendor Response Management
  async createVendorResponse(responseData: Omit<VendorResponse, "id" | "submittedAt">): Promise<VendorResponse> {
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const response: VendorResponse = {
      ...responseData,
      id: responseId,
      submittedAt: new Date().toISOString(),
    }

    this.db.create(this.db.getVendorResponses(), response)

    // Notify customer about the response
    await this.notifyCustomerAboutResponse(response)

    return response
  }

  async getVendorResponses(requirementId: string): Promise<VendorResponse[]> {
    const responses = Array.from(this.db.getVendorResponses().values())
    return responses.filter((r) => r.requirementId === requirementId)
  }

  // Location-based vendor finding
  async findNearbyVendors(location: UserLocation, radius: number, categories?: string[]): Promise<Vendor[]> {
    const nearbyVendors = await locationService.findNearbyVendors(location, radius, categories)
    return nearbyVendors.map((nv) => nv.vendor)
  }

  // Notification methods
  private async notifyNearbyVendors(requirement: MaterialRequirement): Promise<void> {
    try {
      // Find vendors in the area
      const nearbyVendors = await this.findNearbyVendors(requirement.location, requirement.location.deliveryRadius, [
        requirement.category,
      ])

      // Get vendor users
      const vendorUsers: User[] = []
      for (const vendor of nearbyVendors) {
        const user = this.db.get(this.db.getUsers(), vendor.userId)
        if (user) {
          vendorUsers.push(user)
        }
      }

      // Send notifications
      await communicationService.notifyVendorsAboutRequirement(requirement, vendorUsers, ["email", "sms", "whatsapp"])
    } catch (error) {
      console.error("Error notifying vendors:", error)
    }
  }

  private async notifyCustomerAboutResponse(response: VendorResponse): Promise<void> {
    try {
      const requirement = await this.getRequirement(response.requirementId)
      const vendor = this.db.get(this.db.getVendors(), response.vendorId)
      const customer = this.db.get(this.db.getUsers(), requirement?.customerId || "")
      const vendorUser = vendor ? this.db.get(this.db.getUsers(), vendor.userId) : null

      if (requirement && customer && vendorUser) {
        await communicationService.notifyCustomerAboutVendorResponse(customer, requirement, response, vendorUser)
      }
    } catch (error) {
      console.error("Error notifying customer:", error)
    }
  }

  // Existing methods (products, cart, orders) remain the same...
  async getProducts(filters: SearchFilters = {}): Promise<SearchResult<Product>> {
    let products = Array.from(this.db.getProducts().values())

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (filters.categoryId) {
      products = products.filter((p) => p.categoryId === filters.categoryId)
    }

    if (filters.vendorId) {
      products = products.filter((p) => p.vendorId === filters.vendorId)
    }

    if (filters.inStock) {
      products = products.filter((p) => p.variants.some((v) => v.inventory.quantity > 0 || v.inventory.allowBackorder))
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      products = products.filter((p) => {
        const price = p.variants[0]?.price || 0
        return (
          (filters.minPrice === undefined || price >= filters.minPrice) &&
          (filters.maxPrice === undefined || price <= filters.maxPrice)
        )
      })
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          products.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0))
          break
        case "price_desc":
          products.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0))
          break
        case "newest":
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        default:
          break
      }
    }

    // Apply pagination
    const offset = filters.offset || 0
    const limit = filters.limit || 20
    const total = products.length
    const paginatedProducts = products.slice(offset, offset + limit)

    return {
      items: paginatedProducts,
      total,
      hasMore: offset + limit < total,
      filters,
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.db.get(this.db.getProducts(), id) || null
  }

  async getCategories(): Promise<Category[]> {
    return this.db.getAll(this.db.getCategories())
  }

  async getCategory(id: string): Promise<Category | null> {
    return this.db.get(this.db.getCategories(), id) || null
  }

  // Cart methods remain the same...
  async getOrCreateCart(sessionId: string, customerId?: string): Promise<Cart> {
    const carts = Array.from(this.db.getCarts().values())
    let cart = carts.find((c) => c.sessionId === sessionId)

    if (!cart) {
      const cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const now = new Date().toISOString()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

      cart = {
        id: cartId,
        sessionId,
        customerId,
        items: [],
        subtotal: 0,
        taxTotal: 0,
        shippingTotal: 0,
        discountTotal: 0,
        total: 0,
        currency: "INR",
        createdAt: now,
        updatedAt: now,
        expiresAt,
      }

      this.db.create(this.db.getCarts(), cart)
    }

    return cart
  }

  // Additional cart methods would go here...
}

export const marketplaceService = new MarketplaceService()
