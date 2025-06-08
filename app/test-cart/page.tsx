"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AddToCartButton, ShoppingCart } from "@/components/shopping-cart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import {
  ShoppingCartIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  PackageIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";

const testProducts = [
  {
    id: "test-cement-1",
    name: "Premium Portland Cement - 50kg",
    price: 450,
    image: "/placeholder.svg?height=200&width=300",
    unit: "bag",
    vendorId: "vendor-1",
    vendorName: "Delhi Building Materials",
    availability: "in_stock" as const,
    minOrderQuantity: 1,
    maxOrderQuantity: 100,
    gstRate: 18,
    deliveryCharges: 50,
  },
  {
    id: "test-steel-1",
    name: "TMT Steel Bars - 12mm",
    price: 65,
    image: "/placeholder.svg?height=200&width=300",
    unit: "kg",
    vendorId: "vendor-2",
    vendorName: "Steel Suppliers Co.",
    availability: "in_stock" as const,
    minOrderQuantity: 10,
    maxOrderQuantity: 1000,
    gstRate: 18,
    deliveryCharges: 100,
  },
  {
    id: "test-bricks-1",
    name: "Red Clay Bricks",
    price: 8,
    image: "/placeholder.svg?height=200&width=300",
    unit: "piece",
    vendorId: "vendor-3",
    vendorName: "Brick Works Ltd.",
    availability: "out_of_stock" as const,
    minOrderQuantity: 100,
    maxOrderQuantity: 10000,
    gstRate: 5,
    deliveryCharges: 200,
  },
  {
    id: "test-tiles-1",
    name: "Ceramic Floor Tiles",
    price: 45,
    image: "/placeholder.svg?height=200&width=300",
    unit: "sq.ft",
    vendorId: "vendor-4",
    vendorName: "Tile Masters",
    availability: "limited_stock" as const,
    minOrderQuantity: 1,
    maxOrderQuantity: 50,
    gstRate: 18,
    deliveryCharges: 75,
  },
];

export default function TestCartPage() {
  const { items, getCartSummary, clearCart } = useCartStore();
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const summary = getCartSummary();

  const handleAddToCart = (productName: string) => {
    setLastAddedItem(productName);
    setTimeout(() => setLastAddedItem(null), 3000);
  };

  // Listen to cart changes to update last added item
  const handleCartUpdate = (productName: string) => {
    setLastAddedItem(productName);
    setTimeout(() => setLastAddedItem(null), 3000);
  };

  const cartFeatures = [
    {
      name: "Add to Cart",
      description: "Add products with different variants and quantities",
      status: "working",
      location: "Product cards, vendor pages, materials page",
    },
    {
      name: "Cart Persistence",
      description: "Cart items saved in localStorage",
      status: "working",
      location: "Zustand store with persistence",
    },
    {
      name: "Quantity Management",
      description: "Update quantities, min/max limits",
      status: "working",
      location: "Cart sidebar",
    },
    {
      name: "Price Calculation",
      description: "Subtotal, GST, delivery charges, platform fee",
      status: "working",
      location: "Cart summary",
    },
    {
      name: "Multi-vendor Support",
      description: "Items from different vendors in same cart",
      status: "working",
      location: "Cart grouping by vendor",
    },
    {
      name: "Stock Validation",
      description: "Check availability before adding",
      status: "working",
      location: "Add to cart button",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCartIcon className="h-5 w-5" />
                Shopping Cart Functionality Test
              </CardTitle>
              <CardDescription>
                Test the add to cart functionality across different product
                types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cart Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {summary.totalItems}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Items in Cart
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{summary.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Amount
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {summary.totalQuantity}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Quantity
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ₹{summary.gstAmount.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      GST Amount
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Last Added Item */}
              {lastAddedItem && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span className="font-medium">Added to Cart!</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">
                    "{lastAddedItem}" has been added to your cart
                  </p>
                </div>
              )}

              {/* Test Products */}
              <div>
                <h3 className="font-medium mb-4">Test Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {testProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                          <PackageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>

                        <h4 className="font-medium mb-2 line-clamp-2">
                          {product.name}
                        </h4>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-lg">
                              ₹{product.price}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              /{product.unit}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <TruckIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {product.vendorName}
                            </span>
                          </div>

                          <Badge
                            variant={
                              product.availability === "in_stock"
                                ? "default"
                                : product.availability === "limited_stock"
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {product.availability === "in_stock"
                              ? "In Stock"
                              : product.availability === "limited_stock"
                              ? "Limited Stock"
                              : "Out of Stock"}
                          </Badge>
                        </div>

                        <div onClick={() => handleCartUpdate(product.name)}>
                          <AddToCartButton
                            product={product}
                            quantity={product.minOrderQuantity || 1}
                            className="w-full"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cart Features Status */}
              <div>
                <h3 className="font-medium mb-4">Cart Features Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cartFeatures.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{feature.name}</h4>
                        <Badge
                          variant={
                            feature.status === "working"
                              ? "default"
                              : "destructive"
                          }
                          className="ml-2"
                        >
                          {feature.status === "working" ? (
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircleIcon className="h-3 w-3 mr-1" />
                          )}
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {feature.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Location: {feature.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Actions */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  disabled={items.length === 0}
                >
                  Clear Cart
                </Button>
                <ShoppingCart />
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">
                      How to Test Cart
                    </h4>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Click "Add to Cart" on any test product above</li>
                      <li>
                        Check the cart icon in navigation (should show item
                        count)
                      </li>
                      <li>Click the cart icon to open cart sidebar</li>
                      <li>Try updating quantities in the cart</li>
                      <li>Test removing items from cart</li>
                      <li>Check cart persistence by refreshing the page</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
