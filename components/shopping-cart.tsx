"use client";

import { useState } from "react";
import { useCartStore, useWishlistStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  TrashIcon,
  HeartIcon,
  TruckIcon,
  IndianRupeeIcon,
  ShoppingBagIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ShoppingCart() {
  const {
    items,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    getCartSummary,
  } = useCartStore();
  const { addItem: addToWishlist } = useWishlistStore();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const summary = getCartSummary();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setIsUpdating(itemId);
    try {
      updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      // You could show a toast notification here
    } finally {
      setIsUpdating(null);
    }
  };

  const handleMoveToWishlist = (item: any) => {
    addToWishlist({
      productId: item.productId,
      vendorId: item.vendorId,
      name: item.name,
      price: item.price,
      image: item.image,
      vendorName: item.vendorName,
    });
    removeItem(item.id);
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCartIcon className="h-4 w-4" />
          {summary.totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {summary.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBagIcon className="h-5 w-5" />
            Shopping Cart ({summary.totalItems} items)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingCartIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">
                Add some products to get started
              </p>
              <Button onClick={toggleCart}>Continue Shopping</Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/placeholder-product.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {item.vendorName}
                          </p>

                          {item.variant && (
                            <div className="flex gap-1 mt-1">
                              {item.variant.size && (
                                <Badge variant="outline" className="text-xs">
                                  {item.variant.size}
                                </Badge>
                              )}
                              {item.variant.grade && (
                                <Badge variant="outline" className="text-xs">
                                  {item.variant.grade}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <IndianRupeeIcon className="h-3 w-3" />
                              <span className="font-semibold text-sm">
                                {item.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                /{item.unit}
                              </span>
                            </div>

                            <Badge
                              variant={
                                item.availability === "in_stock"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {item.availability === "in_stock"
                                ? "In Stock"
                                : "Out of Stock"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={
                              isUpdating === item.id || item.quantity <= 1
                            }
                          >
                            <MinusIcon className="h-3 w-3" />
                          </Button>

                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-16 text-center"
                            min={item.minOrderQuantity || 1}
                            max={item.maxOrderQuantity}
                            disabled={isUpdating === item.id}
                          />

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={
                              isUpdating === item.id ||
                              (item.maxOrderQuantity &&
                                item.quantity >= item.maxOrderQuantity)
                            }
                          >
                            <PlusIcon className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMoveToWishlist(item)}
                          >
                            <HeartIcon className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          {item.quantity} × ₹{item.price.toLocaleString()}
                        </span>
                        <span className="font-semibold">
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </span>
                      </div>

                      {item.deliveryCharges && item.deliveryCharges > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <TruckIcon className="h-3 w-3" />
                          Delivery: ₹{item.deliveryCharges}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({summary.totalQuantity} items)</span>
                    <span>₹{summary.subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>GST</span>
                    <span>₹{summary.gstAmount.toLocaleString()}</span>
                  </div>

                  {summary.deliveryCharges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Delivery Charges</span>
                      <span>₹{summary.deliveryCharges.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>₹{summary.platformFee.toLocaleString()}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{summary.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/checkout" onClick={toggleCart}>
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={toggleCart}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Cart Icon for Navigation
export function CartIcon() {
  const { toggleCart, getCartSummary } = useCartStore();
  const summary = getCartSummary();

  return (
    <Button variant="ghost" size="sm" onClick={toggleCart} className="relative">
      <ShoppingCartIcon className="h-5 w-5" />
      {summary.totalItems > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {summary.totalItems}
        </Badge>
      )}
    </Button>
  );
}

// Add to Cart Button Component
interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    unit: string;
    vendorId: string;
    vendorName: string;
    availability: "in_stock" | "out_of_stock" | "limited_stock";
    minOrderQuantity?: number;
    maxOrderQuantity?: number;
    gstRate?: number;
    deliveryCharges?: number;
  };
  variant?: {
    size?: string;
    grade?: string;
    brand?: string;
  };
  quantity?: number;
  className?: string;
}

export function AddToCartButton({
  product,
  variant,
  quantity = 1,
  className,
}: AddToCartButtonProps) {
  const { addItem, isItemInCart, getItemQuantity } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const isInCart = isItemInCart(product.id, variant);
  const currentQuantity = getItemQuantity(product.id, variant);

  const handleAddToCart = async () => {
    if (product.availability === "out_of_stock") return;

    setIsAdding(true);
    try {
      addItem({
        productId: product.id,
        vendorId: product.vendorId,
        name: product.name,
        price: product.price,
        quantity,
        unit: product.unit,
        image: product.image,
        variant,
        vendorName: product.vendorName,
        availability: product.availability,
        minOrderQuantity: product.minOrderQuantity,
        maxOrderQuantity: product.maxOrderQuantity,
        gstRate: product.gstRate,
        deliveryCharges: product.deliveryCharges,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Show error toast
    } finally {
      setIsAdding(false);
    }
  };

  if (product.availability === "out_of_stock") {
    return (
      <Button disabled className={className}>
        Out of Stock
      </Button>
    );
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding} className={className}>
      {isAdding
        ? "Adding..."
        : isInCart
        ? `In Cart (${currentQuantity})`
        : "Add to Cart"}
    </Button>
  );
}
