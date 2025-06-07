import { medusaClient } from "./medusa-client"
import { adaptCart, type CartItem } from "./data-adapter"
import type { MedusaCart } from "./medusa-client"

export class MedusaCartService {
  private static instance: MedusaCartService
  private cartId: string | null = null
  private regionId: string | null = null
  private cart: MedusaCart | null = null

  private constructor() {
    // Load cart from localStorage if available
    if (typeof window !== "undefined") {
      this.cartId = localStorage.getItem("medusa_cart_id")
      this.regionId = localStorage.getItem("medusa_cart_region")
    }
  }

  public static getInstance(): MedusaCartService {
    if (!MedusaCartService.instance) {
      MedusaCartService.instance = new MedusaCartService()
    }
    return MedusaCartService.instance
  }

  public async initializeCart(regionId?: string): Promise<void> {
    try {
      // If we have a cart ID, try to retrieve it
      if (this.cartId) {
        try {
          const response = await medusaClient.getCart(this.cartId)
          this.cart = response.cart
          return
        } catch (error) {
          // Cart doesn't exist anymore, create a new one
          console.warn("Existing cart not found, creating new cart")
          this.cartId = null
        }
      }

      // Create a new cart
      const createData: any = {}

      if (regionId) {
        createData.region_id = regionId
        this.regionId = regionId
      } else if (this.regionId) {
        createData.region_id = this.regionId
      }

      // Set country code for India
      createData.country_code = "in"

      const response = await medusaClient.createCart(createData)
      this.cart = response.cart
      this.cartId = response.cart.id
      this.regionId = response.cart.region_id

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("medusa_cart_id", this.cartId)
        localStorage.setItem("medusa_cart_region", this.regionId)
      }
    } catch (error) {
      console.error("Error initializing cart:", error)
      throw error
    }
  }

  public async addItem(item: {
    variantId: string
    quantity: number
    metadata?: Record<string, any>
  }): Promise<void> {
    try {
      await this.ensureCartExists()

      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      const response = await medusaClient.addLineItem(this.cartId, {
        variant_id: item.variantId,
        quantity: item.quantity,
        metadata: item.metadata,
      })

      this.cart = response.cart
    } catch (error) {
      console.error("Error adding item to cart:", error)
      throw error
    }
  }

  public async updateItemQuantity(lineItemId: string, quantity: number): Promise<void> {
    try {
      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await this.removeItem(lineItemId)
        return
      }

      const response = await medusaClient.updateLineItem(this.cartId, lineItemId, {
        quantity,
      })

      this.cart = response.cart
    } catch (error) {
      console.error("Error updating item quantity:", error)
      throw error
    }
  }

  public async removeItem(lineItemId: string): Promise<void> {
    try {
      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      const response = await medusaClient.deleteLineItem(this.cartId, lineItemId)
      this.cart = response.cart
    } catch (error) {
      console.error("Error removing item from cart:", error)
      throw error
    }
  }

  public async clearCart(): Promise<void> {
    try {
      // Create a new cart to replace the current one
      await this.initializeCart(this.regionId || undefined)
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }

  public async updateShippingAddress(address: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    province: string
    postalCode: string
    countryCode: string
    phone?: string
    company?: string
  }): Promise<void> {
    try {
      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      const response = await medusaClient.updateCart(this.cartId, {
        shipping_address: {
          first_name: address.firstName,
          last_name: address.lastName,
          address_1: address.address1,
          address_2: address.address2,
          city: address.city,
          province: address.province,
          postal_code: address.postalCode,
          country_code: address.countryCode,
          phone: address.phone,
          company: address.company,
        },
      })

      this.cart = response.cart
    } catch (error) {
      console.error("Error updating shipping address:", error)
      throw error
    }
  }

  public async updateBillingAddress(address: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    province: string
    postalCode: string
    countryCode: string
    phone?: string
    company?: string
  }): Promise<void> {
    try {
      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      const response = await medusaClient.updateCart(this.cartId, {
        billing_address: {
          first_name: address.firstName,
          last_name: address.lastName,
          address_1: address.address1,
          address_2: address.address2,
          city: address.city,
          province: address.province,
          postal_code: address.postalCode,
          country_code: address.countryCode,
          phone: address.phone,
          company: address.company,
        },
      })

      this.cart = response.cart
    } catch (error) {
      console.error("Error updating billing address:", error)
      throw error
    }
  }

  public async addShippingMethod(shippingOptionId: string): Promise<void> {
    try {
      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      const response = await medusaClient.addShippingMethod(this.cartId, {
        option_id: shippingOptionId,
      })

      this.cart = response.cart
    } catch (error) {
      console.error("Error adding shipping method:", error)
      throw error
    }
  }

  public async createPaymentSessions(): Promise<void> {
    try {
      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      const response = await medusaClient.createPaymentSessions(this.cartId)
      this.cart = response.cart
    } catch (error) {
      console.error("Error creating payment sessions:", error)
      throw error
    }
  }

  public async setPaymentSession(providerId: string): Promise<void> {
    try {
      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      const response = await medusaClient.setPaymentSession(this.cartId, {
        provider_id: providerId,
      })

      this.cart = response.cart
    } catch (error) {
      console.error("Error setting payment session:", error)
      throw error
    }
  }

  public async completeCart(): Promise<{ orderId: string }> {
    try {
      if (!this.cartId) {
        throw new Error("Cart not initialized")
      }

      const response = await medusaClient.completeCart(this.cartId)

      // Clear cart after successful completion
      this.clearCartData()

      return { orderId: response.data.id }
    } catch (error) {
      console.error("Error completing cart:", error)
      throw error
    }
  }

  public getCart(): {
    items: CartItem[]
    total: number
    itemCount: number
    subtotal: number
    taxTotal: number
    shippingTotal: number
  } | null {
    if (!this.cart) {
      return null
    }

    return adaptCart(this.cart)
  }

  public getCartId(): string | null {
    return this.cartId
  }

  public getRegionId(): string | null {
    return this.regionId
  }

  public async getShippingOptions(): Promise<any[]> {
    try {
      if (!this.cartId) {
        return []
      }

      const response = await medusaClient.getShippingOptions(this.cartId)
      return response.shipping_options
    } catch (error) {
      console.error("Error getting shipping options:", error)
      return []
    }
  }

  private async ensureCartExists(): Promise<void> {
    if (!this.cart || !this.cartId) {
      await this.initializeCart()
    }
  }

  private clearCartData(): void {
    this.cart = null
    this.cartId = null
    this.regionId = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("medusa_cart_id")
      localStorage.removeItem("medusa_cart_region")
    }
  }
}

export const medusaCart = MedusaCartService.getInstance()
