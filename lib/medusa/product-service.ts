import { medusaClient } from "./medusa-client"
import { adaptProduct, adaptCategory, type Product, type Category } from "./data-adapter"
import type { MedusaProduct, MedusaProductCategory } from "./medusa-client"

export class MedusaProductService {
  private static instance: MedusaProductService
  private cache: Map<string, Product> = new Map()
  private categoryCache: Map<string, Product[]> = new Map()
  private categoriesCache: Category[] | null = null
  private regionId: string | null = null

  private constructor() {
    // Load region from localStorage if available
    if (typeof window !== "undefined") {
      this.regionId = localStorage.getItem("medusa_cart_region")
    }
  }

  public static getInstance(): MedusaProductService {
    if (!MedusaProductService.instance) {
      MedusaProductService.instance = new MedusaProductService()
    }
    return MedusaProductService.instance
  }

  public setRegion(regionId: string): void {
    this.regionId = regionId
    // Clear cache when region changes as prices might be different
    this.clearCache()
  }

  public async getProducts(params: Record<string, string> = {}): Promise<Product[]> {
    // Create cache key from params
    const cacheKey = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join("&")

    // Check if we have cached results
    if (this.categoryCache.has(cacheKey)) {
      return this.categoryCache.get(cacheKey)!
    }

    try {
      // Add region to params if available
      const queryParams = { ...params }
      if (this.regionId) {
        queryParams.region_id = this.regionId
      }

      const response = await medusaClient.getProducts(queryParams)
      const products = response.products.map((product: MedusaProduct) =>
        adaptProduct(product, this.regionId || undefined),
      )

      // Cache results
      this.categoryCache.set(cacheKey, products)

      // Also cache individual products
      products.forEach((product) => {
        this.cache.set(product.id, product)
      })

      return products
    } catch (error) {
      console.error("Error fetching products from MedusaJS:", error)
      return []
    }
  }

  public async getProduct(id: string): Promise<Product | null> {
    // Check if product is in cache
    if (this.cache.has(id)) {
      return this.cache.get(id)!
    }

    try {
      const response = await medusaClient.getProduct(id)
      const product = adaptProduct(response.product, this.regionId || undefined)

      // Cache product
      this.cache.set(id, product)

      return product
    } catch (error) {
      console.error(`Error fetching product ${id} from MedusaJS:`, error)
      return null
    }
  }

  public async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.getProducts({ category_id: categoryId })
  }

  public async searchProducts(query: string): Promise<Product[]> {
    try {
      // Use MedusaJS search if available
      const searchResponse = await medusaClient.searchProducts(query)

      // If search returns hits, extract product IDs and fetch full products
      if (searchResponse.hits && searchResponse.hits.length > 0) {
        const productIds = searchResponse.hits.map((hit: any) => hit.id || hit.objectID)
        const products: Product[] = []

        for (const id of productIds) {
          const product = await this.getProduct(id)
          if (product) {
            products.push(product)
          }
        }

        return products
      }

      // Fallback to regular product search with query
      return this.getProducts({ q: query })
    } catch (error) {
      console.error("Error searching products:", error)
      // Fallback to regular product search
      return this.getProducts({ q: query })
    }
  }

  public async getFeaturedProducts(): Promise<Product[]> {
    // Get products from a featured collection or with featured metadata
    try {
      // First try to get from a "featured" collection
      const collectionsResponse = await medusaClient.getCollections({ handle: "featured" })

      if (collectionsResponse.collections.length > 0) {
        return this.getProducts({ collection_id: collectionsResponse.collections[0].id })
      }

      // Fallback to products with featured metadata
      return this.getProducts({ "metadata[featured]": "true" })
    } catch (error) {
      console.error("Error fetching featured products:", error)
      // Fallback to first few products
      return this.getProducts({ limit: "8" })
    }
  }

  public async getCategories(): Promise<Category[]> {
    // Check if categories are cached
    if (this.categoriesCache) {
      return this.categoriesCache
    }

    try {
      const response = await medusaClient.getProductCategories()
      const categories = response.product_categories.map((category: MedusaProductCategory) => adaptCategory(category))

      // Cache categories
      this.categoriesCache = categories

      return categories
    } catch (error) {
      console.error("Error fetching categories from MedusaJS:", error)
      return []
    }
  }

  public async getCategory(id: string): Promise<Category | null> {
    try {
      const response = await medusaClient.getProductCategory(id)
      return adaptCategory(response.product_category)
    } catch (error) {
      console.error(`Error fetching category ${id} from MedusaJS:`, error)
      return null
    }
  }

  public async getProductsByCollection(collectionId: string): Promise<Product[]> {
    return this.getProducts({ collection_id: collectionId })
  }

  public async getProductsByTag(tag: string): Promise<Product[]> {
    return this.getProducts({ tags: tag })
  }

  public async getProductsByType(type: string): Promise<Product[]> {
    return this.getProducts({ type_id: type })
  }

  public clearCache(): void {
    this.cache.clear()
    this.categoryCache.clear()
    this.categoriesCache = null
  }
}

export const medusaProducts = MedusaProductService.getInstance()
