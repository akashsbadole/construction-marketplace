import { medusaClient } from "./medusa-client"
import type { MedusaCustomer } from "./medusa-client"

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  hasAccount: boolean
}

export class MedusaAuthService {
  private static instance: MedusaAuthService
  private user: AuthUser | null = null
  private isAuthenticated = false

  private constructor() {
    // Check if user is logged in on initialization
    this.checkAuthStatus()
  }

  public static getInstance(): MedusaAuthService {
    if (!MedusaAuthService.instance) {
      MedusaAuthService.instance = new MedusaAuthService()
    }
    return MedusaAuthService.instance
  }

  private async checkAuthStatus(): Promise<void> {
    try {
      // Try to get current customer from MedusaJS
      const response = await medusaClient.getCustomer()
      if (response.customer) {
        this.setUser(response.customer)
      }
    } catch (error) {
      // User is not authenticated
      this.clearUser()
    }
  }

  public async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await medusaClient.loginCustomer({ email, password })

      if (response.customer) {
        this.setUser(response.customer)
        return true
      }

      return false
    } catch (error) {
      console.error("MedusaJS login error:", error)
      return false
    }
  }

  public async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
  }): Promise<boolean> {
    try {
      const response = await medusaClient.createCustomer({
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
      })

      if (response.customer) {
        this.setUser(response.customer)
        return true
      }

      return false
    } catch (error) {
      console.error("MedusaJS registration error:", error)
      return false
    }
  }

  public async logout(): Promise<void> {
    try {
      // MedusaJS doesn't have a specific logout endpoint for customers
      // The session is managed by cookies, so we just clear local state
      this.clearUser()

      // Clear any stored cart data
      if (typeof window !== "undefined") {
        localStorage.removeItem("medusa_cart_id")
        localStorage.removeItem("medusa_cart_region")
      }
    } catch (error) {
      console.error("MedusaJS logout error:", error)
    }
  }

  public async updateProfile(userData: {
    firstName?: string
    lastName?: string
    phone?: string
  }): Promise<boolean> {
    if (!this.isAuthenticated) {
      return false
    }

    try {
      const updateData: any = {}

      if (userData.firstName !== undefined) {
        updateData.first_name = userData.firstName
      }

      if (userData.lastName !== undefined) {
        updateData.last_name = userData.lastName
      }

      if (userData.phone !== undefined) {
        updateData.phone = userData.phone
      }

      const response = await medusaClient.updateCustomer(updateData)

      if (response.customer) {
        this.setUser(response.customer)
        return true
      }

      return false
    } catch (error) {
      console.error("MedusaJS profile update error:", error)
      return false
    }
  }

  public async addAddress(addressData: {
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
  }): Promise<boolean> {
    if (!this.isAuthenticated) {
      return false
    }

    try {
      const response = await medusaClient.addCustomerAddress({
        first_name: addressData.firstName,
        last_name: addressData.lastName,
        address_1: addressData.address1,
        address_2: addressData.address2,
        city: addressData.city,
        province: addressData.province,
        postal_code: addressData.postalCode,
        country_code: addressData.countryCode,
        phone: addressData.phone,
        company: addressData.company,
      })

      if (response.customer) {
        this.setUser(response.customer)
        return true
      }

      return false
    } catch (error) {
      console.error("MedusaJS add address error:", error)
      return false
    }
  }

  public getUser(): AuthUser | null {
    return this.user
  }

  public getUserId(): string | null {
    return this.user?.id || null
  }

  public isUserAuthenticated(): boolean {
    return this.isAuthenticated
  }

  public getAuthHeaders(): Record<string, string> {
    // MedusaJS uses cookies for authentication, so no additional headers needed
    return {}
  }

  private setUser(customer: MedusaCustomer): void {
    this.user = {
      id: customer.id,
      email: customer.email,
      firstName: customer.first_name || "",
      lastName: customer.last_name || "",
      phone: customer.phone,
      hasAccount: customer.has_account,
    }
    this.isAuthenticated = true
  }

  private clearUser(): void {
    this.user = null
    this.isAuthenticated = false
  }
}

export const medusaAuth = MedusaAuthService.getInstance()
