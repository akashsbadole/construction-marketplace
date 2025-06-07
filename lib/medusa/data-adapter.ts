import type {
  MedusaProduct,
  MedusaProductCategory,
  MedusaCustomer,
  MedusaOrder,
  MedusaLineItem,
  MedusaCart,
} from "./medusa-client"

// Our application's data models
export interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  brand: string
  inStock: boolean
  delivery: string
  certified: boolean
  discount?: number
  image?: string
  vendor: string
  variantId?: string
  sku?: string
  weight?: number
  metadata?: Record<string, any>
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  image?: string
  subcategories?: Category[]
}

export interface Vendor {
  id: string
  name: string
  description?: string
  logo?: string
  rating: number
  projects: number
  location: string
  verified: boolean
  specialization: string[]
  contactInfo: {
    email: string
    phone?: string
    address?: string
  }
}

export interface Order {
  id: string
  displayId: number
  status: string
  items: {
    name: string
    quantity: number
    price: number
    image?: string
  }[]
  total: number
  orderDate: string
  deliveryDate: string
  vendor: string
  trackingSteps: {
    step: string
    completed: boolean
    date: string
  }[]
  shippingAddress?: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    phone?: string
  }
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
  image?: string
  vendor: string
  variantId: string
  lineItemId?: string
}

// Helper function to get the best price for a product variant
function getBestPrice(product: MedusaProduct, regionId?: string): number {
  if (!product.variants || product.variants.length === 0) {
    return 0
  }

  const variant = product.variants[0] // Use first variant as default
  if (!variant.prices || variant.prices.length === 0) {
    return 0
  }

  // Try to find price for specific region first
  if (regionId) {
    const regionPrice = variant.prices.find((price) => price.region_id === regionId)
    if (regionPrice) {
      return regionPrice.amount / 100 // Convert from cents
    }
  }

  // Fall back to first available price
  return variant.prices[0].amount / 100
}

// Helper function to extract unit from metadata or product attributes
function extractUnit(product: MedusaProduct): string {
  // Check metadata first
  if (product.metadata?.unit) {
    return product.metadata.unit as string
  }

  // Check if it's construction material and assign appropriate unit
  const title = product.title.toLowerCase()
  if (title.includes("cement") || title.includes("bag")) {
    return "per bag"
  }
  if (title.includes("steel") || title.includes("bar") || title.includes("rod")) {
    return "per kg"
  }
  if (title.includes("brick")) {
    return "per piece"
  }
  if (title.includes("sand") || title.includes("aggregate")) {
    return "per ton"
  }
  if (title.includes("tile") || title.includes("flooring")) {
    return "per sq.ft"
  }
  if (title.includes("paint")) {
    return "per liter"
  }

  return "per item"
}

// Helper function to extract brand from metadata or collection
function extractBrand(product: MedusaProduct): string {
  // Check metadata first
  if (product.metadata?.brand) {
    return product.metadata.brand as string
  }

  // Check collection name
  if (product.collection?.title) {
    return product.collection.title
  }

  // Check product type
  if (product.type?.value) {
    return product.type.value
  }

  return "Generic"
}

// Helper function to determine if product is certified
function isCertified(product: MedusaProduct): boolean {
  if (product.metadata?.certified === true || product.metadata?.certified === "true") {
    return true
  }

  // Check if product has quality-related tags
  const qualityTags = ["certified", "quality", "iso", "bis", "premium"]
  return (
    product.tags?.some((tag) => qualityTags.some((qualityTag) => tag.value.toLowerCase().includes(qualityTag))) || false
  )
}

// Helper function to estimate delivery time
function estimateDelivery(product: MedusaProduct): string {
  // Check metadata for delivery info
  if (product.metadata?.delivery) {
    return product.metadata.delivery as string
  }

  // Estimate based on weight and type
  const weight = product.weight || 0
  if (weight > 1000) {
    // Heavy items (>1kg)
    return "5-7 days"
  } else if (weight > 100) {
    // Medium items
    return "3-5 days"
  } else {
    return "1-3 days"
  }
}

// Adapter functions to transform MedusaJS data to our application format
export function adaptProduct(medusaProduct: MedusaProduct, regionId?: string): Product {
  const price = getBestPrice(medusaProduct, regionId)
  const unit = extractUnit(medusaProduct)
  const brand = extractBrand(medusaProduct)
  const certified = isCertified(medusaProduct)
  const delivery = estimateDelivery(medusaProduct)

  // Check if product is in stock
  const inStock =
    medusaProduct.variants?.some((variant) => variant.inventory_quantity > 0 || variant.allow_backorder) || false

  // Get first image or placeholder
  const image = medusaProduct.images?.[0]?.url || medusaProduct.thumbnail || "/placeholder.svg"

  // Get primary category
  const category = medusaProduct.categories?.[0]?.name || "Uncategorized"

  // Calculate discount if there's a compare at price
  let discount
  const variant = medusaProduct.variants?.[0]
  if (variant?.prices) {
    const currentPrice = variant.prices.find((p) => p.region_id === regionId) || variant.prices[0]
    const comparePrice = variant.prices.find((p) => p.price_list_id) // Assuming price list prices are compare prices

    if (comparePrice && comparePrice.amount > currentPrice.amount) {
      discount = Math.round(((comparePrice.amount - currentPrice.amount) / comparePrice.amount) * 100)
    }
  }

  return {
    id: medusaProduct.id,
    name: medusaProduct.title,
    description: medusaProduct.description || "",
    price,
    unit,
    category,
    brand,
    inStock,
    delivery,
    certified,
    discount,
    image,
    vendor: brand, // Using brand as vendor for now
    variantId: medusaProduct.variants?.[0]?.id,
    sku: medusaProduct.variants?.[0]?.sku,
    weight: medusaProduct.weight,
    metadata: medusaProduct.metadata,
  }
}

export function adaptCategory(medusaCategory: MedusaProductCategory): Category {
  return {
    id: medusaCategory.id,
    name: medusaCategory.name,
    slug: medusaCategory.handle,
    description: medusaCategory.description,
    parentId: medusaCategory.parent_category_id,
    subcategories: medusaCategory.category_children?.map(adaptCategory),
  }
}

export function adaptCustomerToVendor(medusaCustomer: MedusaCustomer): Vendor {
  // This is a placeholder - in a real scenario, vendors would be separate entities
  return {
    id: medusaCustomer.id,
    name: `${medusaCustomer.first_name || ""} ${medusaCustomer.last_name || ""}`.trim() || "Vendor",
    description: "Construction materials vendor",
    rating: 4.5, // Default rating
    projects: 0, // Would be calculated from order history
    location: medusaCustomer.billing_address?.city || "India",
    verified: medusaCustomer.has_account,
    specialization: ["Construction Materials"],
    contactInfo: {
      email: medusaCustomer.email,
      phone: medusaCustomer.phone,
      address: medusaCustomer.billing_address
        ? `${medusaCustomer.billing_address.address_1}, ${medusaCustomer.billing_address.city}`
        : undefined,
    },
  }
}

export function adaptOrder(medusaOrder: MedusaOrder): Order {
  // Map order status to tracking steps
  const getTrackingSteps = (status: string, fulfillmentStatus: string, paymentStatus: string) => {
    const steps = [
      {
        step: "Order Placed",
        completed: true,
        date: new Date(medusaOrder.created_at).toLocaleDateString("en-IN"),
      },
      {
        step: "Payment Confirmed",
        completed: paymentStatus === "captured" || paymentStatus === "authorized",
        date:
          paymentStatus === "captured" || paymentStatus === "authorized"
            ? new Date(medusaOrder.created_at).toLocaleDateString("en-IN")
            : "",
      },
      {
        step: "Order Confirmed",
        completed: status !== "pending" && status !== "canceled",
        date:
          status !== "pending" && status !== "canceled"
            ? new Date(medusaOrder.created_at).toLocaleDateString("en-IN")
            : "",
      },
      {
        step: "Shipped",
        completed: fulfillmentStatus === "shipped" || fulfillmentStatus === "fulfilled",
        date:
          fulfillmentStatus === "shipped" || fulfillmentStatus === "fulfilled"
            ? new Date(medusaOrder.updated_at).toLocaleDateString("en-IN")
            : "",
      },
      {
        step: "Delivered",
        completed: fulfillmentStatus === "fulfilled",
        date: fulfillmentStatus === "fulfilled" ? new Date(medusaOrder.updated_at).toLocaleDateString("en-IN") : "",
      },
    ]
    return steps
  }

  // Calculate estimated delivery date (7 days from order date)
  const orderDate = new Date(medusaOrder.created_at)
  const deliveryDate = new Date(orderDate)
  deliveryDate.setDate(deliveryDate.getDate() + 7)

  // Get vendor from first item (assuming single vendor per order)
  const vendor =
    medusaOrder.items[0]?.variant?.product?.collection?.title ||
    medusaOrder.items[0]?.variant?.product?.type?.value ||
    "Unknown Vendor"

  return {
    id: medusaOrder.id,
    displayId: medusaOrder.display_id,
    status: medusaOrder.status,
    items: medusaOrder.items.map((item: MedusaLineItem) => ({
      name: item.title,
      quantity: item.quantity,
      price: item.unit_price / 100, // Convert from cents
      image: item.thumbnail,
    })),
    total: medusaOrder.total / 100, // Convert from cents
    orderDate: orderDate.toLocaleDateString("en-IN"),
    deliveryDate: deliveryDate.toLocaleDateString("en-IN"),
    vendor,
    trackingSteps: getTrackingSteps(medusaOrder.status, medusaOrder.fulfillment_status, medusaOrder.payment_status),
    shippingAddress: medusaOrder.shipping_address
      ? {
          name: `${medusaOrder.shipping_address.first_name || ""} ${medusaOrder.shipping_address.last_name || ""}`.trim(),
          address: medusaOrder.shipping_address.address_1 || "",
          city: medusaOrder.shipping_address.city || "",
          state: medusaOrder.shipping_address.province || "",
          postalCode: medusaOrder.shipping_address.postal_code || "",
          phone: medusaOrder.shipping_address.phone,
        }
      : undefined,
  }
}

export function adaptCartItem(lineItem: MedusaLineItem): CartItem {
  const product = lineItem.variant?.product
  const unit = product ? extractUnit(product) : "per item"
  const brand = product ? extractBrand(product) : "Unknown"

  return {
    id: lineItem.id,
    name: lineItem.title,
    price: lineItem.unit_price / 100, // Convert from cents
    quantity: lineItem.quantity,
    unit,
    image: lineItem.thumbnail,
    vendor: brand,
    variantId: lineItem.variant_id || "",
    lineItemId: lineItem.id,
  }
}

export function adaptCart(medusaCart: MedusaCart): {
  items: CartItem[]
  total: number
  itemCount: number
  subtotal: number
  taxTotal: number
  shippingTotal: number
} {
  const items = medusaCart.items.map(adaptCartItem)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    total: medusaCart.total / 100, // Convert from cents
    itemCount,
    subtotal: medusaCart.subtotal / 100,
    taxTotal: medusaCart.tax_total / 100,
    shippingTotal: medusaCart.shipping_total / 100,
  }
}
