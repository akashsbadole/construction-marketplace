"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Filter, Truck, Package, ShieldCheck, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { ShoppingCartSheet } from "@/components/shopping-cart"
import { marketplaceService } from "@/lib/services/marketplace-service"
import type { Product, Category } from "@/lib/types/marketplace"

export default function MaterialsPage() {
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [materials, setMaterials] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>("all-categories")
  const [brand, setBrand] = useState<string>("all-brands")
  const [sortBy, setSortBy] = useState<string>("price-low")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { addItem } = useCart()

  useEffect(() => {
    async function loadInitialData() {
      try {
        const categoriesData = await marketplaceService.getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading categories:", error)
      }
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      try {
        const filters: any = {
          limit: 50,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          inStock: true,
        }

        if (category !== "all-categories") {
          filters.categoryId = category
        }

        if (searchQuery) {
          filters.search = searchQuery
        }

        const result = await marketplaceService.getProducts(filters)
        let products = result.products

        // Filter by brand if selected
        if (brand !== "all-brands") {
          products = products.filter((product) => product.brand.toLowerCase() === brand.toLowerCase())
        }

        // Sort products
        switch (sortBy) {
          case "price-low":
            products.sort((a, b) => {
              const aPrice = a.variants[0]?.price || 0
              const bPrice = b.variants[0]?.price || 0
              return aPrice - bPrice
            })
            break
          case "price-high":
            products.sort((a, b) => {
              const aPrice = a.variants[0]?.price || 0
              const bPrice = b.variants[0]?.price || 0
              return bPrice - aPrice
            })
            break
          case "popular":
            // Keep default order
            break
          case "delivery":
            // Sort by estimated delivery (mock implementation)
            products.sort((a, b) => a.name.localeCompare(b.name))
            break
        }

        setMaterials(products)
      } catch (error) {
        console.error("Error loading products:", error)
        setMaterials([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [category, brand, priceRange, sortBy, searchQuery])

  const handleSearch = () => {
    // The search is already handled by the useEffect
  }

  const handleAddToCart = (material: Product) => {
    const defaultVariant = material.variants.find((v) => v.isDefault) || material.variants[0]
    if (defaultVariant) {
      addItem(material.id, defaultVariant.id, 1)
    }
  }

  const getDeliveryEstimate = (product: Product) => {
    // Mock delivery estimation based on product weight
    const weight = product.weight || 0
    if (weight > 50) return "5-7 days"
    if (weight > 10) return "3-5 days"
    return "1-3 days"
  }

  const getUnit = (product: Product) => {
    const variant = product.variants[0]
    if (!variant) return "per item"

    // Extract unit from variant options or product name
    const weightOption = variant.options.find((opt) => opt.name.toLowerCase() === "weight")
    if (weightOption) return `per ${weightOption.value}`

    const name = product.name.toLowerCase()
    if (name.includes("cement") || name.includes("bag")) return "per bag"
    if (name.includes("steel") || name.includes("bar")) return "per kg"
    if (name.includes("brick")) return "per piece"
    if (name.includes("tile")) return "per sq.ft"
    if (name.includes("paint")) return "per liter"

    return "per item"
  }

  const isInStock = (product: Product) => {
    return product.variants.some((variant) => variant.inventory.quantity > 0 || variant.inventory.allowBackorder)
  }

  const isCertified = (product: Product) => {
    return product.tags.some((tag) => ["certified", "quality", "iso", "bis"].includes(tag.toLowerCase()))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-brands">All Brands</SelectItem>
                    <SelectItem value="ultratech">UltraTech</SelectItem>
                    <SelectItem value="tata">TATA Steel</SelectItem>
                    <SelectItem value="ambuja">Ambuja</SelectItem>
                    <SelectItem value="acc">ACC</SelectItem>
                    <SelectItem value="jsw">JSW</SelectItem>
                    <SelectItem value="kajaria">Kajaria</SelectItem>
                    <SelectItem value="somany">Somany</SelectItem>
                    <SelectItem value="asian">Asian Paints</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range (₹)</label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={100} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="delivery">Fastest Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t">
                <ShoppingCartSheet />
              </div>
            </div>
          </aside>

          {/* Materials Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search materials..."
                className="max-w-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading materials...</p>
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No materials found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => {
                  const defaultVariant = material.variants.find((v) => v.isDefault) || material.variants[0]
                  const price = defaultVariant?.price || 0
                  const comparePrice = defaultVariant?.compareAtPrice
                  const inStock = isInStock(material)
                  const certified = isCertified(material)
                  const delivery = getDeliveryEstimate(material)
                  const unit = getUnit(material)
                  const mainImage = material.images.find((img) => img.isMain) || material.images[0]

                  return (
                    <Card key={material.id} className="flex flex-col">
                      <CardHeader>
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                          <img
                            src={mainImage?.url || "/placeholder.svg"}
                            alt={mainImage?.alt || material.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardTitle className="flex justify-between items-start gap-2">
                          <span>{material.name}</span>
                          <Badge variant="secondary">
                            {categories.find((c) => c.id === material.categoryId)?.name || "Other"}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {material.shortDescription || material.description}
                        </p>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold">₹{price.toLocaleString()}</div>
                          {comparePrice && comparePrice > price && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₹{comparePrice.toLocaleString()}
                            </div>
                          )}
                          <span className="text-sm text-muted-foreground">{unit}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Brand: {material.brand}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Truck className="h-4 w-4" />
                          <span>Delivery: {delivery}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4" />
                          <span className={inStock ? "text-green-600" : "text-red-600"}>
                            {inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        {certified && (
                          <div className="flex items-center gap-2 text-green-600">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-sm font-medium">Quality Certified</span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Compare
                          </Button>
                          <Button size="sm" onClick={() => handleAddToCart(material)} disabled={!inStock}>
                            Add to Cart
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
