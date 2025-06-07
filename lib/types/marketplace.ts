// Core marketplace types and interfaces

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  status: UserStatus
  avatar?: string
  location: UserLocation
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  addresses: Address[]
  defaultAddressId?: string
  preferences: UserPreferences
  metadata: Record<string, any>
}

export type UserRole = "customer" | "vendor" | "contractor" | "admin"
export type UserStatus = "active" | "inactive" | "pending" | "suspended"

export interface UserLocation {
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  pincode: string
  country: string
  radius?: number // Service radius in km for vendors/contractors
}

export interface UserPreferences {
  language: string
  currency: string
  notifications: {
    email: boolean
    sms: boolean
    whatsapp: boolean
    push: boolean
  }
  privacy: {
    showProfile: boolean
    showContact: boolean
    shareLocation: boolean
  }
  communication: {
    preferredMethod: "email" | "sms" | "whatsapp" | "phone"
    businessHours: {
      start: string
      end: string
      timezone: string
    }
  }
}

export interface Address {
  id: string
  type: "shipping" | "billing" | "both"
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  pincode: string
  country: string
  phone?: string
  location: {
    latitude: number
    longitude: number
  }
  isDefault: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  categoryId: string
  vendorId: string
  brand: string
  sku: string
  status: ProductStatus
  visibility: ProductVisibility
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  images: ProductImage[]
  variants: ProductVariant[]
  tags: string[]
  metadata: Record<string, any>
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

export type ProductStatus = "draft" | "published" | "archived"
export type ProductVisibility = "public" | "private" | "vendor-only"

export interface ProductImage {
  id: string
  url: string
  alt: string
  isMain: boolean
  sortOrder: number
}

export interface ProductVariant {
  id: string
  title: string
  sku: string
  price: number
  compareAtPrice?: number
  isDefault: boolean
  options: VariantOption[]
  inventory: InventoryInfo
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

export interface VariantOption {
  name: string
  value: string
}

export interface InventoryInfo {
  quantity: number
  allowBackorder: boolean
  trackQuantity: boolean
  lowStockThreshold?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  image?: string
  isActive: boolean
  sortOrder: number
  children?: Category[]
  metadata: Record<string, any>
}

export interface Vendor {
  id: string
  userId: string
  businessName: string
  businessType: string
  description?: string
  logo?: string
  banner?: string
  status: VendorStatus
  rating: number
  totalSales: number
  totalOrders: number
  responseRate: number
  averageResponseTime: number // in hours
  serviceLocations: ServiceLocation[]
  specializations: string[]
  certifications: Certification[]
  businessHours: BusinessHours
  contactInfo: {
    email: string
    phone: string
    whatsapp?: string
    website?: string
  }
  businessInfo: {
    gstNumber?: string
    panNumber?: string
    registrationNumber?: string
    businessAddress: Address
    establishedYear?: number
  }
  bankInfo?: {
    accountNumber: string
    ifscCode: string
    accountHolderName: string
    bankName: string
  }
  commissionRate: number
  categories: string[]
  inventory: VendorInventory[]
  deliveryOptions: DeliveryOption[]
  paymentMethods: string[]
  minimumOrderValue?: number
  joinedAt: string
  verifiedAt?: string
  metadata: Record<string, any>
}

export interface ServiceLocation {
  id: string
  city: string
  state: string
  pincode: string
  latitude: number
  longitude: number
  serviceRadius: number // km
  deliveryCharges: DeliveryCharge[]
  isActive: boolean
}

export interface DeliveryCharge {
  minDistance: number
  maxDistance: number
  charge: number
  freeAboveAmount?: number
}

export interface BusinessHours {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

export interface DayHours {
  isOpen: boolean
  openTime?: string
  closeTime?: string
  breaks?: { start: string; end: string }[]
}

export interface VendorInventory {
  productId: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  reorderLevel: number
  lastUpdated: string
}

export interface DeliveryOption {
  id: string
  name: string
  description: string
  estimatedDays: number
  charge: number
  freeAboveAmount?: number
  isActive: boolean
}

export type VendorStatus = "pending" | "approved" | "suspended" | "rejected"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  channels: NotificationChannel[]
  status: NotificationStatus
  scheduledAt?: string
  sentAt?: string
  readAt?: string
  createdAt: string
}

export type NotificationType =
  | "requirement_posted"
  | "vendor_response"
  | "quote_received"
  | "order_confirmed"
  | "order_shipped"
  | "order_delivered"
  | "payment_received"
  | "low_stock"
  | "new_vendor_nearby"
  | "requirement_expiring"
  | "system_update"

export type NotificationChannel = "email" | "sms" | "whatsapp" | "push" | "in_app"
export type NotificationStatus = "pending" | "sent" | "delivered" | "failed" | "read"

export interface CommunicationLog {
  id: string
  fromUserId: string
  toUserId: string
  channel: NotificationChannel
  type: "requirement_notification" | "quote_response" | "order_update" | "general"
  subject?: string
  message: string
  status: "sent" | "delivered" | "failed" | "read"
  metadata: Record<string, any>
  sentAt: string
  deliveredAt?: string
  readAt?: string
}

export interface LocationService {
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number
  findNearbyVendors(location: UserLocation, radius: number, categories?: string[]): Promise<Vendor[]>
  geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null>
  reverseGeocode(latitude: number, longitude: number): Promise<string | null>
}

export interface MaterialRequirement {
  id: string
  customerId: string
  title: string
  description: string
  category: string
  subcategory?: string
  materials: RequiredMaterial[]
  location: RequirementLocation
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
  specifications: MaterialSpecification[]
  attachments: RequirementAttachment[]
  status: RequirementStatus
  visibility: "public" | "private" | "vendors_only"
  responses: VendorResponse[]
  selectedVendors: string[]
  createdAt: string
  updatedAt: string
  expiresAt?: string
  metadata: Record<string, any>
}

export interface RequiredMaterial {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  specifications?: string
  preferredBrands?: string[]
  qualityGrade?: string
  priority: "high" | "medium" | "low"
}

export interface RequirementLocation {
  latitude: number
  longitude: number
  address: string
  city: string
  state: string
  pincode: string
  deliveryRadius: number // km radius for delivery
  accessDetails?: string // truck access, crane required, etc.
}

export interface MaterialSpecification {
  name: string
  value: string
  unit?: string
  isRequired: boolean
}

export interface RequirementAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  description?: string
}

export type RequirementStatus = "draft" | "published" | "in_progress" | "completed" | "cancelled" | "expired"

export interface VendorResponse {
  id: string
  requirementId: string
  vendorId: string
  status: "interested" | "quoted" | "selected" | "rejected" | "withdrawn"
  message?: string
  quote?: VendorQuote
  estimatedDelivery?: string
  contactPreference: "email" | "phone" | "whatsapp" | "visit"
  submittedAt: string
  respondedAt?: string
  metadata: Record<string, any>
}

export interface VendorQuote {
  items: QuoteItem[]
  subtotal: number
  taxes: number
  delivery: number
  total: number
  currency: string
  validUntil: string
  terms?: string
  paymentTerms?: string
  deliveryTerms?: string
}

export interface QuoteItem {
  materialId: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
  brand?: string
  specifications?: string
  availability: "in_stock" | "order_basis" | "not_available"
  deliveryTime?: string
}

export interface Contractor {
  id: string
  userId: string
  businessName: string
  specializations: string[]
  experience: number
  description?: string
  portfolio: PortfolioItem[]
  certifications: Certification[]
  rating: number
  totalProjects: number
  completedProjects: number
  status: ContractorStatus
  serviceAreas: string[]
  pricing: {
    hourlyRate?: number
    projectBased: boolean
    minimumProject?: number
  }
  availability: {
    isAvailable: boolean
    nextAvailableDate?: string
  }
  metadata: Record<string, any>
}

export type ContractorStatus = "pending" | "approved" | "suspended" | "rejected"

export interface PortfolioItem {
  id: string
  title: string
  description: string
  images: string[]
  projectType: string
  completedAt: string
  clientTestimonial?: string
  projectValue?: number
}

export interface Certification {
  id: string
  name: string
  issuedBy: string
  issuedAt: string
  expiresAt?: string
  certificateUrl?: string
}

export interface Cart {
  id: string
  sessionId: string
  customerId?: string
  items: CartItem[]
  subtotal: number
  taxTotal: number
  shippingTotal: number
  discountTotal: number
  total: number
  currency: string
  createdAt: string
  updatedAt: string
  expiresAt: string
}

export interface CartItem {
  id: string
  productId: string
  variantId: string
  quantity: number
  unitPrice: number
  total: number
  product: {
    name: string
    slug: string
    image?: string
    vendor: string
  }
  variant: {
    title: string
    sku: string
    options: VariantOption[]
  }
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  taxTotal: number
  shippingTotal: number
  discountTotal: number
  total: number
  currency: string
  paymentMethod: string
  notes?: string
  trackingInfo?: TrackingInfo
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  metadata: Record<string, any>
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded"
export type FulfillmentStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export interface OrderItem {
  id: string
  productId: string
  variantId: string
  vendorId: string
  quantity: number
  unitPrice: number
  total: number
  product: {
    name: string
    slug: string
    image?: string
  }
  variant: {
    title: string
    sku: string
    options: VariantOption[]
  }
  fulfillmentStatus: FulfillmentStatus
}

export interface TrackingInfo {
  carrier: string
  trackingNumber: string
  trackingUrl?: string
  estimatedDelivery?: string
  updates: TrackingUpdate[]
}

export interface TrackingUpdate {
  status: string
  description: string
  location?: string
  timestamp: string
}

export interface Project {
  id: string
  customerId: string
  title: string
  description: string
  category: string
  location: {
    city: string
    state: string
    pincode: string
    address?: string
  }
  budget: {
    min: number
    max: number
    currency: string
  }
  timeline: {
    startDate?: string
    endDate?: string
    duration?: string
  }
  requirements: string[]
  attachments: ProjectAttachment[]
  status: ProjectStatus
  bids: Bid[]
  selectedBidId?: string
  createdAt: string
  updatedAt: string
  metadata: Record<string, any>
}

export type ProjectStatus = "draft" | "published" | "in_progress" | "completed" | "cancelled"

export interface ProjectAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Bid {
  id: string
  projectId: string
  contractorId: string
  amount: number
  currency: string
  timeline: string
  description: string
  attachments: ProjectAttachment[]
  status: BidStatus
  submittedAt: string
  respondedAt?: string
  metadata: Record<string, any>
}

export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn"

export interface Review {
  id: string
  entityType: "product" | "vendor" | "contractor"
  entityId: string
  userId: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  isVerified: boolean
  isHelpful: number
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  query?: string
  categoryId?: string
  vendorId?: string
  location?: UserLocation
  radius?: number
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  rating?: number
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular" | "distance"
  limit?: number
  offset?: number
}

export interface SearchResult<T> {
  items: T[]
  total: number
  hasMore: boolean
  filters: SearchFilters
}
