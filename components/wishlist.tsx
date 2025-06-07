'use client'

import { useState } from 'react'
import { useWishlistStore, useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { 
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  IndianRupeeIcon,
  CalendarIcon
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function Wishlist() {
  const { items, removeItem, clearWishlist, moveToCart } = useWishlistStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMoving, setIsMoving] = useState<string | null>(null)

  const handleMoveToCart = async (productId: string) => {
    setIsMoving(productId)
    try {
      moveToCart(productId)
    } catch (error) {
      console.error('Error moving to cart:', error)
    } finally {
      setIsMoving(null)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <HeartIcon className="h-5 w-5" />
          {items.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HeartIcon className="h-5 w-5" />
            Wishlist ({items.length} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <HeartIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-4">Save items you love for later</p>
              <Button onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <Image
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.vendorName}</p>
                          
                          <div className="flex items-center gap-1 mt-2">
                            <IndianRupeeIcon className="h-3 w-3" />
                            <span className="font-semibold text-sm">
                              {item.price.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleMoveToCart(item.productId)}
                          disabled={isMoving === item.productId}
                          className="flex-1"
                        >
                          <ShoppingCartIcon className="h-4 w-4 mr-2" />
                          {isMoving === item.productId ? 'Moving...' : 'Move to Cart'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(item.productId)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Wishlist Actions */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{items.length} items in wishlist</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearWishlist}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
                
                <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Wishlist Icon for Navigation
export function WishlistIcon() {
  const { items } = useWishlistStore()

  return (
    <Button variant="ghost" size="sm" className="relative">
      <HeartIcon className="h-5 w-5" />
      {items.length > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {items.length}
        </Badge>
      )}
    </Button>
  )
}

// Add to Wishlist Button Component
interface AddToWishlistButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    vendorId: string
    vendorName: string
  }
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

export function AddToWishlistButton({ 
  product, 
  className,
  size = 'default',
  variant = 'outline'
}: AddToWishlistButtonProps) {
  const { addItem, removeItem, isItemInWishlist } = useWishlistStore()
  const [isToggling, setIsToggling] = useState(false)

  const isInWishlist = isItemInWishlist(product.id)

  const handleToggleWishlist = async () => {
    setIsToggling(true)
    try {
      if (isInWishlist) {
        removeItem(product.id)
      } else {
        addItem({
          productId: product.id,
          vendorId: product.vendorId,
          name: product.name,
          price: product.price,
          image: product.image,
          vendorName: product.vendorName
        })
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleToggleWishlist}
      disabled={isToggling}
      className={className}
    >
      <HeartIcon 
        className={`h-4 w-4 ${isInWishlist ? 'fill-current text-red-500' : ''}`} 
      />
      {size !== 'sm' && (
        <span className="ml-2">
          {isToggling ? 'Saving...' : isInWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  )
}

// Wishlist Page Component
export function WishlistPage() {
  const { items, removeItem, clearWishlist, moveToCart } = useWishlistStore()
  const [isMoving, setIsMoving] = useState<string | null>(null)

  const handleMoveToCart = async (productId: string) => {
    setIsMoving(productId)
    try {
      moveToCart(productId)
    } catch (error) {
      console.error('Error moving to cart:', error)
    } finally {
      setIsMoving(null)
    }
  }

  const handleMoveAllToCart = async () => {
    for (const item of items) {
      await handleMoveToCart(item.productId)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <HeartIcon className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your wishlist is empty</h1>
          <p className="text-muted-foreground mb-6">
            Save items you love to your wishlist and shop them later
          </p>
          <Link href="/materials">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-muted-foreground">{items.length} items saved</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleMoveAllToCart}
            disabled={isMoving !== null}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            Move All to Cart
          </Button>
          
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="text-red-600 hover:text-red-700"
          >
            Clear Wishlist
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => removeItem(item.productId)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium line-clamp-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.vendorName}</p>
                
                <div className="flex items-center gap-1">
                  <IndianRupeeIcon className="h-4 w-4" />
                  <span className="font-semibold">{item.price.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </div>
                
                <Button
                  className="w-full"
                  onClick={() => handleMoveToCart(item.productId)}
                  disabled={isMoving === item.productId}
                >
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  {isMoving === item.productId ? 'Moving...' : 'Move to Cart'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
