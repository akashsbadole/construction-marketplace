'use client'

import { useCartStore } from '@/lib/store/cart-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCartIcon, 
  IndianRupeeIcon,
  PackageIcon,
  TruckIcon
} from 'lucide-react'

export function CartSummary() {
  const { items, getCartSummary, toggleCart } = useCartStore()
  const summary = getCartSummary()

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShoppingCartIcon className="h-4 w-4" />
            Cart Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <ShoppingCartIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="h-4 w-4" />
            Cart Summary
          </div>
          <Badge variant="secondary">{summary.totalItems}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick item preview */}
        <div className="space-y-2">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-xs">
              <PackageIcon className="h-3 w-3 text-muted-foreground" />
              <span className="flex-1 truncate">{item.name}</span>
              <span className="text-muted-foreground">×{item.quantity}</span>
            </div>
          ))}
          {items.length > 3 && (
            <div className="text-xs text-muted-foreground text-center">
              +{items.length - 3} more items
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <div className="flex items-center gap-1">
              <IndianRupeeIcon className="h-3 w-3" />
              <span>{summary.subtotal.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>GST:</span>
            <div className="flex items-center gap-1">
              <IndianRupeeIcon className="h-3 w-3" />
              <span>{summary.gstAmount.toFixed(0)}</span>
            </div>
          </div>
          
          {summary.deliveryCharges > 0 && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Delivery:</span>
              <div className="flex items-center gap-1">
                <IndianRupeeIcon className="h-3 w-3" />
                <span>{summary.deliveryCharges}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between font-semibold text-sm pt-2 border-t">
            <span>Total:</span>
            <div className="flex items-center gap-1">
              <IndianRupeeIcon className="h-3 w-3" />
              <span>{summary.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button 
            onClick={toggleCart} 
            className="w-full" 
            size="sm"
          >
            View Cart ({summary.totalItems})
          </Button>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground justify-center">
            <TruckIcon className="h-3 w-3" />
            <span>Free delivery above ₹5,000</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for smaller spaces
export function CartSummaryCompact() {
  const { items, getCartSummary, toggleCart } = useCartStore()
  const summary = getCartSummary()

  if (items.length === 0) {
    return (
      <div className="p-3 border rounded-lg text-center">
        <ShoppingCartIcon className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
        <p className="text-xs text-muted-foreground">Cart is empty</p>
      </div>
    )
  }

  return (
    <div className="p-3 border rounded-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon className="h-4 w-4" />
          <span className="text-sm font-medium">Cart</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {summary.totalItems}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span>Total:</span>
        <div className="flex items-center gap-1 font-semibold">
          <IndianRupeeIcon className="h-3 w-3" />
          <span>{summary.total.toLocaleString()}</span>
        </div>
      </div>
      
      <Button 
        onClick={toggleCart} 
        className="w-full" 
        size="sm"
        variant="outline"
      >
        View Cart
      </Button>
    </div>
  )
}
