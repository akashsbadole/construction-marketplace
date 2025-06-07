/**
 * MedusaJS API Client for BuildConnect Marketplace
 * Handles communication with MedusaJS backend
 */

export interface MedusaConfig {
  baseUrl: string
  apiKey?: string
  publishableKey?: string
}

// MedusaJS Product Types
export interface MedusaProduct {
  id: string
  title: string
  subtitle?: string
  description?: string
  handle: string
  is_giftcard: boolean
  status: string
  images: MedusaImage[]
  thumbnail?: string
  options: MedusaProductOption[]
  variants: MedusaProductVariant[]
  categories?: MedusaProductCategory[]
  collection?: MedusaProductCollection
  tags?: MedusaProductTag[]
  type?: MedusaProductType
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MedusaProductVariant {
  id: string
  title: string
  product_id: string
  sku?: string
  barcode?: string
  ean?: string
  upc?: string
  variant_rank?: number
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, any>
  prices: MedusaMoneyAmount[]
  options: MedusaProductOptionValue[]
  created_at: string
  updated_at: string
}

export interface MedusaMoneyAmount {
  id: string
  currency_code: string
  amount: number
  min_quantity?: number
  max_quantity?: number
  price_list_id?: string
  variant_id: string
  region_id?: string
  created_at: string
  updated_at: string
}

export interface MedusaProductOption {
  id: string
  title: string
  values: MedusaProductOptionValue[]
  product_id: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MedusaProductOptionValue {
  id: string
  value: string
  option_id: string
  variant_id: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MedusaProductCategory {
  id: string
  name: string
  description?: string
  handle: string
  mpath?: string
  is_active: boolean
  is_internal: boolean
  parent_category_id?: string
  parent_category?: MedusaProductCategory
  category_children: MedusaProductCategory[]
  products?: MedusaProduct[]
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MedusaProductCollection {
  id: string
  title: string
  handle: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MedusaProductTag {
  id: string
  value: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MedusaProductType {
  id: string
  value: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MedusaImage {
  id: string
  url: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

// Cart Types
export interface MedusaCart {
  id: string
  email?: string
  billing_address_id?: string
  billing_address?: MedusaAddress
  shipping_address_id?: string
  shipping_address?: MedusaAddress
  items: MedusaLineItem[]
  region_id: string
  region: MedusaRegion
  discounts: MedusaDiscount[]
  gift_cards: MedusaGiftCard[]
  customer_id?: string
  payment_session?: MedusaPaymentSession
  payment_sessions: MedusaPaymentSession[]
  payment_id?: string
  payment?: MedusaPayment
  shipping_methods: MedusaShippingMethod[]
  type: string
  completed_at?: string
  payment_authorized_at?: string
  idempotency_key?: string
  context?: Record<string, any>
  metadata?: Record<string, any>
  sales_channel_id?: string
  created_at: string
  updated_at: string
  subtotal: number
  discount_total: number
  item_tax_total: number
  shipping_total: number
  shipping_tax_total: number
  tax_total: number
  refunded_total: number
  total: number
  refundable_amount: number
  gift_card_total: number
  gift_card_tax_total: number
}

export interface MedusaLineItem {
  id: string
  cart_id: string
  order_id?: string
  swap_id?: string
  claim_order_id?: string
  tax_lines: MedusaTaxLine[]
  adjustments: MedusaLineItemAdjustment[]
  original_item_id?: string
  order_edit_id?: string
  title: string
  description?: string
  thumbnail?: string
  is_return: boolean
  is_giftcard: boolean
  should_merge: boolean
  allow_discounts: boolean
  has_shipping?: boolean
  unit_price: number
  variant_id?: string
  variant?: MedusaProductVariant
  quantity: number
  fulfilled_quantity?: number
  returned_quantity?: number
  shipped_quantity?: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  subtotal: number
  tax_total: number
  total: number
  original_total: number
  original_tax_total: number
  discount_total: number
  raw_discount_total: number
  gift_card_total: number
}

export interface MedusaAddress {
  id: string
  customer_id?: string
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  country?: MedusaCountry
  province?: string
  postal_code?: string
  phone?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface MedusaRegion {
  id: string
  name: string
  currency_code: string
  currency: MedusaCurrency
  tax_rate: number
  tax_rates: MedusaTaxRate[]
  tax_code?: string
  gift_cards_taxable: boolean
  automatic_taxes: boolean
  countries: MedusaCountry[]
  payment_providers: MedusaPaymentProvider[]
  fulfillment_providers: MedusaFulfillmentProvider[]
  includes_tax: boolean
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaCountry {
  id: number
  iso_2: string
  iso_3: string
  num_code: number
  name: string
  display_name: string
  region_id?: string
}

export interface MedusaCurrency {
  code: string
  symbol: string
  symbol_native: string
  name: string
  includes_tax?: boolean
}

export interface MedusaTaxRate {
  id: string
  rate?: number
  code?: string
  name: string
  region_id: string
  products?: MedusaProduct[]
  product_types?: MedusaProductType[]
  shipping_options?: MedusaShippingOption[]
  product_count?: number
  product_type_count?: number
  shipping_option_count?: number
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaTaxLine {
  id: string
  rate: number
  name: string
  code?: string
  item_id?: string
  shipping_method_id?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaLineItemAdjustment {
  id: string
  item_id: string
  description: string
  discount_id?: string
  amount: number
  metadata?: Record<string, any>
}

export interface MedusaDiscount {
  id: string
  code: string
  is_dynamic: boolean
  rule_id: string
  rule: MedusaDiscountRule
  is_disabled: boolean
  parent_discount_id?: string
  starts_at: string
  ends_at?: string
  valid_duration?: string
  regions: MedusaRegion[]
  usage_limit?: number
  usage_count: number
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaDiscountRule {
  id: string
  description?: string
  type: string
  value: number
  allocation?: string
  conditions: MedusaDiscountCondition[]
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaDiscountCondition {
  id: string
  type: string
  operator: string
  discount_rule_id: string
  products?: MedusaProduct[]
  product_types?: MedusaProductType[]
  product_tags?: MedusaProductTag[]
  product_collections?: MedusaProductCollection[]
  customer_groups?: MedusaCustomerGroup[]
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaCustomerGroup {
  id: string
  name: string
  customers?: MedusaCustomer[]
  price_lists?: MedusaPriceList[]
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaPriceList {
  id: string
  name: string
  description: string
  type: string
  status: string
  starts_at?: string
  ends_at?: string
  customer_groups: MedusaCustomerGroup[]
  prices: MedusaMoneyAmount[]
  includes_tax: boolean
  created_at: string
  updated_at: string
}

export interface MedusaGiftCard {
  id: string
  code: string
  value: number
  balance: number
  region_id: string
  region: MedusaRegion
  order_id?: string
  is_disabled: boolean
  ends_at?: string
  tax_rate?: number
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaPaymentSession {
  id: string
  cart_id?: string
  provider_id: string
  is_selected?: boolean
  is_initiated: boolean
  status: string
  data: Record<string, any>
  amount: number
  payment_authorized_at?: string
  idempotency_key?: string
  created_at: string
  updated_at: string
}

export interface MedusaPayment {
  id: string
  swap_id?: string
  cart_id?: string
  order_id?: string
  amount: number
  currency_code: string
  amount_refunded: number
  provider_id: string
  data: Record<string, any>
  captured_at?: string
  canceled_at?: string
  idempotency_key?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaPaymentProvider {
  id: string
  is_installed: boolean
}

export interface MedusaShippingMethod {
  id: string
  shipping_option_id: string
  order_id?: string
  cart_id?: string
  swap_id?: string
  return_id?: string
  shipping_option: MedusaShippingOption
  tax_lines: MedusaTaxLine[]
  price: number
  data: Record<string, any>
  includes_tax: boolean
  subtotal: number
  total: number
  tax_total: number
}

export interface MedusaShippingOption {
  id: string
  name: string
  region_id: string
  profile_id: string
  provider_id: string
  price_type: string
  amount?: number
  is_return: boolean
  admin_only: boolean
  requirements: MedusaShippingOptionRequirement[]
  data: Record<string, any>
  includes_tax: boolean
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaShippingOptionRequirement {
  id: string
  shipping_option_id: string
  type: string
  amount: number
}

export interface MedusaFulfillmentProvider {
  id: string
  is_installed: boolean
}

export interface MedusaCustomer {
  id: string
  email: string
  first_name?: string
  last_name?: string
  billing_address_id?: string
  billing_address?: MedusaAddress
  shipping_addresses: MedusaAddress[]
  password_hash?: string
  phone?: string
  has_account: boolean
  orders?: MedusaOrder[]
  groups?: MedusaCustomerGroup[]
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaOrder {
  id: string
  status: string
  fulfillment_status: string
  payment_status: string
  display_id: number
  cart_id?: string
  cart?: MedusaCart
  customer_id: string
  customer: MedusaCustomer
  email: string
  billing_address_id?: string
  billing_address?: MedusaAddress
  shipping_address_id?: string
  shipping_address?: MedusaAddress
  region_id: string
  region: MedusaRegion
  currency_code: string
  currency: MedusaCurrency
  tax_rate?: number
  discounts: MedusaDiscount[]
  gift_cards: MedusaGiftCard[]
  shipping_methods: MedusaShippingMethod[]
  payments: MedusaPayment[]
  fulfillments: MedusaFulfillment[]
  returns: MedusaReturn[]
  claims: MedusaClaim[]
  refunds: MedusaRefund[]
  swaps: MedusaSwap[]
  draft_order_id?: string
  items: MedusaLineItem[]
  edits: MedusaOrderEdit[]
  gift_card_transactions: MedusaGiftCardTransaction[]
  canceled_at?: string
  no_notification?: boolean
  idempotency_key?: string
  external_id?: string
  sales_channel_id?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  gift_card_total: number
  gift_card_tax_total: number
  refunded_total: number
  total: number
  paid_total: number
  refundable_amount: number
  items_returned: number
}

export interface MedusaFulfillment {
  id: string
  claim_order_id?: string
  swap_id?: string
  order_id?: string
  provider_id: string
  location_id?: string
  shipped_at?: string
  canceled_at?: string
  data: Record<string, any>
  items: MedusaFulfillmentItem[]
  tracking_links: MedusaTrackingLink[]
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  idempotency_key?: string
  no_notification?: boolean
}

export interface MedusaFulfillmentItem {
  fulfillment_id: string
  item_id: string
  quantity: number
}

export interface MedusaTrackingLink {
  id: string
  url?: string
  tracking_number: string
  fulfillment_id: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  idempotency_key?: string
}

export interface MedusaReturn {
  id: string
  status: string
  items: MedusaReturnItem[]
  swap_id?: string
  claim_order_id?: string
  order_id?: string
  shipping_method?: MedusaShippingMethod
  shipping_data?: Record<string, any>
  location_id?: string
  refund_amount: number
  no_notification?: boolean
  idempotency_key?: string
  received_at?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaReturnItem {
  return_id: string
  item_id: string
  quantity: number
  is_requested: boolean
  requested_quantity?: number
  received_quantity?: number
  reason_id?: string
  reason?: MedusaReturnReason
  note?: string
  metadata?: Record<string, any>
}

export interface MedusaReturnReason {
  id: string
  value: string
  label: string
  description?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaClaim {
  id: string
  type: string
  payment_status: string
  fulfillment_status: string
  claim_items: MedusaClaimItem[]
  additional_items: MedusaLineItem[]
  order_id: string
  return_order?: MedusaReturn
  shipping_address_id?: string
  shipping_address?: MedusaAddress
  shipping_methods: MedusaShippingMethod[]
  fulfillments: MedusaFulfillment[]
  refund_amount?: number
  canceled_at?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  no_notification?: boolean
  idempotency_key?: string
}

export interface MedusaClaimItem {
  id: string
  images: MedusaClaimImage[]
  claim_order_id: string
  item_id: string
  variant_id: string
  reason: string
  note?: string
  quantity: number
  tags: MedusaClaimTag[]
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaClaimImage {
  id: string
  claim_item_id: string
  url: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaClaimTag {
  id: string
  value: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface MedusaRefund {
  id: string
  order_id?: string
  amount: number
  note?: string
  reason: string
  payment_id?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  idempotency_key?: string
}

export interface MedusaSwap {
  id: string
  fulfillment_status: string
  payment_status: string
  order_id: string
  difference_due?: number
  shipping_address_id?: string
  shipping_address?: MedusaAddress
  shipping_methods: MedusaShippingMethod[]
  cart_id?: string
  cart?: MedusaCart
  return_order?: MedusaReturn
  fulfillments: MedusaFulfillment[]
  payment?: MedusaPayment
  additional_items: MedusaLineItem[]
  canceled_at?: string
  confirmed_at?: string
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
  idempotency_key?: string
  no_notification?: boolean
  allow_backorder: boolean
}

export interface MedusaOrderEdit {
  id: string
  order_id: string
  internal_note?: string
  created_by: string
  requested_by?: string
  requested_at?: string
  confirmed_by?: string
  confirmed_at?: string
  declined_by?: string
  declined_reason?: string
  declined_at?: string
  canceled_by?: string
  canceled_at?: string
  payment_collection_id?: string
  items: MedusaLineItem[]
  changes: MedusaOrderItemChange[]
  created_at: string
  updated_at: string
}

export interface MedusaOrderItemChange {
  id: string
  order_edit_id: string
  original_line_item_id?: string
  line_item_id?: string
  type: string
  created_at: string
  updated_at: string
}

export interface MedusaGiftCardTransaction {
  id: string
  gift_card_id: string
  order_id: string
  amount: number
  created_at: string
  is_taxable?: boolean
  tax_rate?: number
}

export class MedusaClient {
  private config: MedusaConfig
  private baseHeaders: Record<string, string>

  constructor(config: MedusaConfig) {
    this.config = config
    this.baseHeaders = {
      "Content-Type": "application/json",
    }

    if (config.publishableKey) {
      this.baseHeaders["x-publishable-api-key"] = config.publishableKey
    }

    if (config.apiKey) {
      this.baseHeaders["x-medusa-access-token"] = config.apiKey
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers = {
      ...this.baseHeaders,
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`MedusaJS API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response.json()
  }

  // Products API
  async getProducts(
    params: Record<string, string> = {},
  ): Promise<{ products: MedusaProduct[]; count: number; offset: number; limit: number }> {
    const queryString = new URLSearchParams(params).toString()
    return this.request<{ products: MedusaProduct[]; count: number; offset: number; limit: number }>(
      `/store/products?${queryString}`,
    )
  }

  async getProduct(id: string): Promise<{ product: MedusaProduct }> {
    return this.request<{ product: MedusaProduct }>(`/store/products/${id}`)
  }

  async searchProducts(query: string): Promise<{ hits: any[] }> {
    return this.request<{ hits: any[] }>(`/store/products/search?q=${encodeURIComponent(query)}`)
  }

  // Categories API
  async getProductCategories(
    params: Record<string, string> = {},
  ): Promise<{ product_categories: MedusaProductCategory[]; count: number; offset: number; limit: number }> {
    const queryString = new URLSearchParams(params).toString()
    return this.request<{ product_categories: MedusaProductCategory[]; count: number; offset: number; limit: number }>(
      `/store/product-categories?${queryString}`,
    )
  }

  async getProductCategory(id: string): Promise<{ product_category: MedusaProductCategory }> {
    return this.request<{ product_category: MedusaProductCategory }>(`/store/product-categories/${id}`)
  }

  // Collections API
  async getCollections(
    params: Record<string, string> = {},
  ): Promise<{ collections: MedusaProductCollection[]; count: number; offset: number; limit: number }> {
    const queryString = new URLSearchParams(params).toString()
    return this.request<{ collections: MedusaProductCollection[]; count: number; offset: number; limit: number }>(
      `/store/collections?${queryString}`,
    )
  }

  async getCollection(id: string): Promise<{ collection: MedusaProductCollection }> {
    return this.request<{ collection: MedusaProductCollection }>(`/store/collections/${id}`)
  }

  // Regions API
  async getRegions(): Promise<{ regions: MedusaRegion[] }> {
    return this.request<{ regions: MedusaRegion[] }>("/store/regions")
  }

  async getRegion(id: string): Promise<{ region: MedusaRegion }> {
    return this.request<{ region: MedusaRegion }>(`/store/regions/${id}`)
  }

  // Cart API
  async createCart(
    data: {
      region_id?: string
      sales_channel_id?: string
      country_code?: string
      items?: { variant_id: string; quantity: number }[]
    } = {},
  ): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>("/store/carts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCart(id: string): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${id}`)
  }

  async updateCart(id: string, data: Partial<MedusaCart>): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${id}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async addLineItem(
    cartId: string,
    data: { variant_id: string; quantity: number; metadata?: Record<string, any> },
  ): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateLineItem(cartId: string, lineId: string, data: { quantity: number }): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteLineItem(cartId: string, lineId: string): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/line-items/${lineId}`, {
      method: "DELETE",
    })
  }

  // Checkout API
  async addShippingMethod(
    cartId: string,
    data: { option_id: string; data?: Record<string, any> },
  ): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createPaymentSessions(cartId: string): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/payment-sessions`, {
      method: "POST",
    })
  }

  async setPaymentSession(cartId: string, data: { provider_id: string }): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/payment-session`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updatePaymentSession(
    cartId: string,
    providerId: string,
    data: Record<string, any>,
  ): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/payment-sessions/${providerId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async completeCart(cartId: string): Promise<{ type: string; data: MedusaOrder }> {
    return this.request<{ type: string; data: MedusaOrder }>(`/store/carts/${cartId}/complete`, {
      method: "POST",
    })
  }

  // Customer API
  async createCustomer(data: {
    first_name: string
    last_name: string
    email: string
    password: string
    phone?: string
  }): Promise<{ customer: MedusaCustomer }> {
    return this.request<{ customer: MedusaCustomer }>("/store/customers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async loginCustomer(data: { email: string; password: string }): Promise<{ customer: MedusaCustomer }> {
    return this.request<{ customer: MedusaCustomer }>("/store/auth", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCustomer(): Promise<{ customer: MedusaCustomer }> {
    return this.request<{ customer: MedusaCustomer }>("/store/customers/me")
  }

  async updateCustomer(data: Partial<MedusaCustomer>): Promise<{ customer: MedusaCustomer }> {
    return this.request<{ customer: MedusaCustomer }>("/store/customers/me", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async addCustomerAddress(
    data: Omit<MedusaAddress, "id" | "customer_id" | "created_at" | "updated_at">,
  ): Promise<{ customer: MedusaCustomer }> {
    return this.request<{ customer: MedusaCustomer }>("/store/customers/me/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCustomerAddress(addressId: string, data: Partial<MedusaAddress>): Promise<{ customer: MedusaCustomer }> {
    return this.request<{ customer: MedusaCustomer }>(`/store/customers/me/addresses/${addressId}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteCustomerAddress(addressId: string): Promise<{ customer: MedusaCustomer }> {
    return this.request<{ customer: MedusaCustomer }>(`/store/customers/me/addresses/${addressId}`, {
      method: "DELETE",
    })
  }

  // Orders API
  async getCustomerOrders(
    params: Record<string, string> = {},
  ): Promise<{ orders: MedusaOrder[]; count: number; offset: number; limit: number }> {
    const queryString = new URLSearchParams(params).toString()
    return this.request<{ orders: MedusaOrder[]; count: number; offset: number; limit: number }>(
      `/store/customers/me/orders?${queryString}`,
    )
  }

  async getOrder(id: string): Promise<{ order: MedusaOrder }> {
    return this.request<{ order: MedusaOrder }>(`/store/orders/${id}`)
  }

  async lookupOrder(data: { display_id: number; email: string }): Promise<{ order: MedusaOrder }> {
    return this.request<{ order: MedusaOrder }>("/store/orders/customer/confirm", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Shipping Options API
  async getShippingOptions(cartId: string): Promise<{ shipping_options: MedusaShippingOption[] }> {
    return this.request<{ shipping_options: MedusaShippingOption[] }>(`/store/shipping-options/${cartId}`)
  }

  // Payment Collections API (for order edits)
  async authorizePaymentSession(cartId: string): Promise<{ cart: MedusaCart }> {
    return this.request<{ cart: MedusaCart }>(`/store/carts/${cartId}/payment-session/authorize`, {
      method: "POST",
    })
  }
}

// Create and export a singleton instance with environment variables
export const medusaClient = new MedusaClient({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
})
