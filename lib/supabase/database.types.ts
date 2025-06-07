export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          role: 'customer' | 'vendor' | 'contractor' | 'admin'
          status: 'active' | 'inactive' | 'pending' | 'suspended'
          avatar_url: string | null
          location: Json
          addresses: Json[]
          preferences: Json
          metadata: Json
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role?: 'customer' | 'vendor' | 'contractor' | 'admin'
          status?: 'active' | 'inactive' | 'pending' | 'suspended'
          avatar_url?: string | null
          location?: Json
          addresses?: Json[]
          preferences?: Json
          metadata?: Json
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: 'customer' | 'vendor' | 'contractor' | 'admin'
          status?: 'active' | 'inactive' | 'pending' | 'suspended'
          avatar_url?: string | null
          location?: Json
          addresses?: Json[]
          preferences?: Json
          metadata?: Json
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          short_description: string | null
          category_id: string
          vendor_id: string
          brand: string
          sku: string
          status: 'draft' | 'published' | 'archived'
          visibility: 'public' | 'private' | 'vendor-only'
          weight: number | null
          dimensions: Json | null
          images: Json[]
          variants: Json[]
          tags: string[]
          metadata: Json
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          short_description?: string | null
          category_id: string
          vendor_id: string
          brand: string
          sku: string
          status?: 'draft' | 'published' | 'archived'
          visibility?: 'public' | 'private' | 'vendor-only'
          weight?: number | null
          dimensions?: Json | null
          images?: Json[]
          variants?: Json[]
          tags?: string[]
          metadata?: Json
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string | null
          category_id?: string
          vendor_id?: string
          brand?: string
          sku?: string
          status?: 'draft' | 'published' | 'archived'
          visibility?: 'public' | 'private' | 'vendor-only'
          weight?: number | null
          dimensions?: Json | null
          images?: Json[]
          variants?: Json[]
          tags?: string[]
          metadata?: Json
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vendors: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string
          description: string | null
          website: string | null
          gst_number: string | null
          pan_number: string | null
          business_address: Json
          service_locations: Json[]
          business_hours: Json
          rating: number
          total_reviews: number
          commission_rate: number
          categories: string[]
          delivery_options: Json[]
          payment_methods: string[]
          minimum_order_value: number | null
          joined_at: string
          verified_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type: string
          description?: string | null
          website?: string | null
          gst_number?: string | null
          pan_number?: string | null
          business_address: Json
          service_locations?: Json[]
          business_hours?: Json
          rating?: number
          total_reviews?: number
          commission_rate?: number
          categories?: string[]
          delivery_options?: Json[]
          payment_methods?: string[]
          minimum_order_value?: number | null
          joined_at?: string
          verified_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: string
          description?: string | null
          website?: string | null
          gst_number?: string | null
          pan_number?: string | null
          business_address?: Json
          service_locations?: Json[]
          business_hours?: Json
          rating?: number
          total_reviews?: number
          commission_rate?: number
          categories?: string[]
          delivery_options?: Json[]
          payment_methods?: string[]
          minimum_order_value?: number | null
          joined_at?: string
          verified_at?: string | null
          metadata?: Json
        }
      }
      contractors: {
        Row: {
          id: string
          user_id: string
          business_name: string
          specializations: string[]
          experience_years: number
          description: string | null
          website: string | null
          license_number: string | null
          insurance_details: Json | null
          service_locations: Json[]
          business_hours: Json
          rating: number
          total_reviews: number
          portfolio: Json[]
          certifications: Json[]
          team_size: number | null
          equipment: string[]
          status: 'pending' | 'approved' | 'suspended' | 'rejected'
          verified_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          specializations: string[]
          experience_years: number
          description?: string | null
          website?: string | null
          license_number?: string | null
          insurance_details?: Json | null
          service_locations?: Json[]
          business_hours?: Json
          rating?: number
          total_reviews?: number
          portfolio?: Json[]
          certifications?: Json[]
          team_size?: number | null
          equipment?: string[]
          status?: 'pending' | 'approved' | 'suspended' | 'rejected'
          verified_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          specializations?: string[]
          experience_years?: number
          description?: string | null
          website?: string | null
          license_number?: string | null
          insurance_details?: Json | null
          service_locations?: Json[]
          business_hours?: Json
          rating?: number
          total_reviews?: number
          portfolio?: Json[]
          certifications?: Json[]
          team_size?: number | null
          equipment?: string[]
          status?: 'pending' | 'approved' | 'suspended' | 'rejected'
          verified_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
