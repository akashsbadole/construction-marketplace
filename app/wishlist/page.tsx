"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Share } from "lucide-react"

const wishlistItems = [
  {
    id: "1",
    name: "Premium Portland Cement",
    price: 350,
    unit: "per bag",
    category: "Cement",
    brand: "UltraTech",
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
    savedDate: "2024-01-10",
  },
  {
    id: "2",
    name: "TMT Steel Bars",
    price: 65,
    unit: "per kg",
    category: "Steel",
    brand: "TATA Steel",
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
    savedDate: "2024-01-08",
  },
  {
    id: "3",
    name: "Ceramic Floor Tiles",
    price: 45,
    unit: "per sq.ft",
    category: "Tiles",
    brand: "Kajaria",
    image: "/placeholder.svg?height=200&width=200",
    inStock: false,
    savedDate: "2024-01-05",
  },
]

export default function WishlistPage() {
  const removeFromWishlist = (id: string) => {
    console.log("Removing from wishlist:", id)
  }

  const addToCart = (item: any) => {
    console.log("Adding to cart:", item)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-muted-foreground">Save items you're interested in for later</p>
            </div>
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share Wishlist
            </Button>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Start adding items you love to your wishlist</p>
              <Button>Browse Materials</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group relative">
                  <CardHeader className="pb-3">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">{item.category}</Badge>
                        <span className={`text-sm ${item.inStock ? "text-green-600" : "text-red-600"}`}>
                          {item.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                      <div className="text-lg font-bold">
                        ₹{item.price} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Brand: {item.brand}</div>
                      <div className="text-xs text-muted-foreground">Saved on {item.savedDate}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" disabled={!item.inStock}>
                      View Details
                    </Button>
                    <Button className="flex-1" disabled={!item.inStock} onClick={() => addToCart(item)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
