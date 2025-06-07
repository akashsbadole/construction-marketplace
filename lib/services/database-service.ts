import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'
import type { 
  User, 
  Product, 
  Category, 
  Vendor, 
  Contractor, 
  Project, 
  MaterialRequirement,
  VendorResponse,
  Review,
  SearchFilters,
  SearchResult
} from '@/lib/types/marketplace'

type Tables = Database['public']['Tables']

export class DatabaseService {
  // User operations
  async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email!,
          first_name: userData.firstName!,
          last_name: userData.lastName!,
          phone: userData.phone,
          role: userData.role || 'customer',
          location: userData.location || {},
          preferences: userData.preferences || {},
          metadata: userData.metadata || {}
        })
        .select()
        .single()

      if (error) throw error
      return this.mapUserFromDB(data)
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? this.mapUserFromDB(data) : null
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) throw error
      return data ? this.mapUserFromDB(data) : null
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          phone: updates.phone,
          role: updates.role,
          status: updates.status,
          avatar_url: updates.avatar,
          location: updates.location,
          addresses: updates.addresses,
          preferences: updates.preferences,
          metadata: updates.metadata,
          last_login_at: updates.lastLoginAt
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return this.mapUserFromDB(data)
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      return data.map(this.mapCategoryFromDB)
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? this.mapCategoryFromDB(data) : null
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name!,
          slug: categoryData.slug!,
          description: categoryData.description,
          parent_id: categoryData.parentId,
          image_url: categoryData.image,
          sort_order: categoryData.sortOrder || 0,
          metadata: categoryData.metadata || {}
        })
        .select()
        .single()

      if (error) throw error
      return this.mapCategoryFromDB(data)
    } catch (error) {
      console.error('Error creating category:', error)
      return null
    }
  }

  // Product operations
  async getProducts(filters?: SearchFilters): Promise<SearchResult<Product>> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(name),
          vendor:vendors(business_name, rating)
        `)
        .eq('status', 'published')
        .eq('visibility', 'public')

      // Apply filters
      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId)
      }
      
      if (filters?.vendorId) {
        query = query.eq('vendor_id', filters.vendorId)
      }

      if (filters?.query) {
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
      }

      // Apply sorting
      switch (filters?.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        case 'popular':
          query = query.order('metadata->views', { ascending: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      const limit = filters?.limit || 20
      const offset = filters?.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      const products = data.map(this.mapProductFromDB)
      
      return {
        items: products,
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
        filters: filters || {}
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      return {
        items: [],
        total: 0,
        hasMore: false,
        filters: filters || {}
      }
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name),
          vendor:vendors(business_name, rating, user_id)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? this.mapProductFromDB(data) : null
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  async createProduct(productData: Partial<Product>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name!,
          slug: productData.slug!,
          description: productData.description!,
          short_description: productData.shortDescription,
          category_id: productData.categoryId!,
          vendor_id: productData.vendorId!,
          brand: productData.brand!,
          sku: productData.sku!,
          status: productData.status || 'draft',
          visibility: productData.visibility || 'public',
          weight: productData.weight,
          dimensions: productData.dimensions,
          images: productData.images || [],
          variants: productData.variants || [],
          tags: productData.tags || [],
          metadata: productData.metadata || {},
          seo_title: productData.seoTitle,
          seo_description: productData.seoDescription
        })
        .select()
        .single()

      if (error) throw error
      return this.mapProductFromDB(data)
    } catch (error) {
      console.error('Error creating product:', error)
      return null
    }
  }

  // Vendor operations
  async getVendors(): Promise<Vendor[]> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          *,
          user:users(first_name, last_name, email, phone)
        `)
        .order('rating', { ascending: false })

      if (error) throw error
      return data.map(this.mapVendorFromDB)
    } catch (error) {
      console.error('Error fetching vendors:', error)
      return []
    }
  }

  async getVendorById(id: string): Promise<Vendor | null> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          *,
          user:users(first_name, last_name, email, phone, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? this.mapVendorFromDB(data) : null
    } catch (error) {
      console.error('Error fetching vendor:', error)
      return null
    }
  }

  async createVendor(vendorData: Partial<Vendor>): Promise<Vendor | null> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert({
          user_id: vendorData.userId!,
          business_name: vendorData.businessName!,
          business_type: vendorData.businessType!,
          description: vendorData.description,
          website: vendorData.website,
          gst_number: vendorData.gstNumber,
          pan_number: vendorData.panNumber,
          business_address: vendorData.businessAddress || {},
          service_locations: vendorData.serviceLocations || [],
          business_hours: vendorData.businessHours || {},
          categories: vendorData.categories || [],
          delivery_options: vendorData.deliveryOptions || [],
          payment_methods: vendorData.paymentMethods || [],
          minimum_order_value: vendorData.minimumOrderValue,
          metadata: vendorData.metadata || {}
        })
        .select()
        .single()

      if (error) throw error
      return this.mapVendorFromDB(data)
    } catch (error) {
      console.error('Error creating vendor:', error)
      return null
    }
  }

  // Contractor operations
  async getContractors(): Promise<Contractor[]> {
    try {
      const { data, error } = await supabase
        .from('contractors')
        .select(`
          *,
          user:users(first_name, last_name, email, phone, avatar_url)
        `)
        .eq('status', 'approved')
        .order('rating', { ascending: false })

      if (error) throw error
      return data.map(this.mapContractorFromDB)
    } catch (error) {
      console.error('Error fetching contractors:', error)
      return []
    }
  }

  async getContractorById(id: string): Promise<Contractor | null> {
    try {
      const { data, error } = await supabase
        .from('contractors')
        .select(`
          *,
          user:users(first_name, last_name, email, phone, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data ? this.mapContractorFromDB(data) : null
    } catch (error) {
      console.error('Error fetching contractor:', error)
      return null
    }
  }

  // Mapping functions
  private mapUserFromDB(data: Tables['users']['Row']): User {
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone || undefined,
      role: data.role,
      status: data.status,
      avatar: data.avatar_url || undefined,
      location: data.location as any,
      addresses: data.addresses as any,
      preferences: data.preferences as any,
      metadata: data.metadata as any,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lastLoginAt: data.last_login_at || undefined
    }
  }

  private mapCategoryFromDB(data: Tables['categories']['Row']): Category {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description || undefined,
      parentId: data.parent_id || undefined,
      image: data.image_url || undefined,
      sortOrder: data.sort_order,
      isActive: data.is_active,
      metadata: data.metadata as any,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  private mapProductFromDB(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.short_description || undefined,
      categoryId: data.category_id,
      vendorId: data.vendor_id,
      brand: data.brand,
      sku: data.sku,
      status: data.status,
      visibility: data.visibility,
      weight: data.weight || undefined,
      dimensions: data.dimensions as any,
      images: data.images as any,
      variants: data.variants as any,
      tags: data.tags,
      metadata: data.metadata as any,
      seoTitle: data.seo_title || undefined,
      seoDescription: data.seo_description || undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }

  private mapVendorFromDB(data: any): Vendor {
    return {
      id: data.id,
      userId: data.user_id,
      businessName: data.business_name,
      businessType: data.business_type,
      description: data.description || undefined,
      website: data.website || undefined,
      gstNumber: data.gst_number || undefined,
      panNumber: data.pan_number || undefined,
      businessAddress: data.business_address as any,
      serviceLocations: data.service_locations as any,
      businessHours: data.business_hours as any,
      rating: data.rating,
      totalReviews: data.total_reviews,
      commissionRate: data.commission_rate,
      categories: data.categories,
      deliveryOptions: data.delivery_options as any,
      paymentMethods: data.payment_methods,
      minimumOrderValue: data.minimum_order_value || undefined,
      joinedAt: data.joined_at,
      verifiedAt: data.verified_at || undefined,
      metadata: data.metadata as any
    }
  }

  private mapContractorFromDB(data: any): Contractor {
    return {
      id: data.id,
      userId: data.user_id,
      businessName: data.business_name,
      specializations: data.specializations,
      experienceYears: data.experience_years,
      description: data.description || undefined,
      website: data.website || undefined,
      licenseNumber: data.license_number || undefined,
      insuranceDetails: data.insurance_details as any,
      serviceLocations: data.service_locations as any,
      businessHours: data.business_hours as any,
      rating: data.rating,
      totalReviews: data.total_reviews,
      portfolio: data.portfolio as any,
      certifications: data.certifications as any,
      teamSize: data.team_size || undefined,
      equipment: data.equipment,
      status: data.status,
      verifiedAt: data.verified_at || undefined,
      metadata: data.metadata as any,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    }
  }
}

export const databaseService = new DatabaseService()
