"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Package, TrendingUp, ShoppingCart, Star, Plus, Edit, Eye, Truck, AlertCircle, CheckCircle } from "lucide-react"

export default function VendorDashboard() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Manage your products, orders, and business analytics</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Sales</p>
                    <p className="text-2xl font-bold">₹2.4L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">4.7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Product Inventory</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid gap-4">
                {[
                  {
                    name: "Premium Portland Cement",
                    category: "Cement",
                    price: 350,
                    stock: 500,
                    status: "active",
                    orders: 45,
                  },
                  {
                    name: "TMT Steel Bars",
                    category: "Steel",
                    price: 65,
                    stock: 0,
                    status: "out_of_stock",
                    orders: 32,
                  },
                  {
                    name: "Clay Bricks",
                    category: "Bricks",
                    price: 7,
                    stock: 10000,
                    status: "active",
                    orders: 78,
                  },
                ].map((product, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            <Badge variant={product.status === "active" ? "default" : "destructive"}>
                              {product.status === "active" ? "Active" : "Out of Stock"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">Category: {product.category}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Price: ₹{product.price}</span>
                            <span>Stock: {product.stock}</span>
                            <span>Orders: {product.orders}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>

                {[
                  {
                    id: "ORD-001",
                    customer: "Rajesh Kumar",
                    items: "Premium Cement (10 bags)",
                    amount: 3500,
                    status: "pending",
                    date: "2024-01-15",
                  },
                  {
                    id: "ORD-002",
                    customer: "Priya Sharma",
                    items: "TMT Steel Bars (50 kg)",
                    amount: 3250,
                    status: "shipped",
                    date: "2024-01-14",
                  },
                  {
                    id: "ORD-003",
                    customer: "Amit Patel",
                    items: "Clay Bricks (1000 pieces)",
                    amount: 7000,
                    status: "delivered",
                    date: "2024-01-13",
                  },
                ].map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{order.id}</h3>
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : order.status === "shipped"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {order.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {order.status === "shipped" && <Truck className="h-3 w-3 mr-1" />}
                              {order.status === "delivered" && <CheckCircle className="h-3 w-3 mr-1" />}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">Customer: {order.customer}</p>
                          <p className="text-sm mb-2">{order.items}</p>
                          <p className="text-sm text-muted-foreground">Date: {order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{order.amount.toLocaleString()}</p>
                          <Button size="sm" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>This Month</span>
                        <span className="font-bold">₹2,40,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Month</span>
                        <span className="font-bold">₹1,85,000</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Growth</span>
                        <span className="font-bold">+29.7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Premium Cement", sales: 78 },
                        { name: "TMT Steel Bars", sales: 65 },
                        { name: "Clay Bricks", sales: 52 },
                      ].map((product, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{product.name}</span>
                          <span className="font-medium">{product.sales} orders</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="max-w-2xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Business Name</label>
                      <Input defaultValue="Premium Building Materials" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">GST Number</label>
                      <Input defaultValue="27AABCI1234Z1ZA" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Business Address</label>
                      <Textarea defaultValue="123 Industrial Area, Sector 15, Gurgaon, Haryana - 122001" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact Number</label>
                      <Input defaultValue="+91 98765 43210" />
                    </div>
                    <Button>Update Information</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Bank Account</label>
                      <Input defaultValue="HDFC Bank - ****1234" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">UPI ID</label>
                      <Input defaultValue="vendor@paytm" />
                    </div>
                    <Button>Update Payment Details</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
