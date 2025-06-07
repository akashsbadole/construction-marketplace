"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Download, MessageCircle, Star } from "lucide-react"

const orders = [
  {
    id: "ORD-2024-001",
    status: "delivered",
    items: [
      { name: "Premium Portland Cement", quantity: 10, price: 350 },
      { name: "TMT Steel Bars", quantity: 50, price: 65 },
    ],
    total: 6750,
    orderDate: "2024-01-10",
    deliveryDate: "2024-01-15",
    vendor: "Premium Building Materials",
    trackingSteps: [
      { step: "Order Placed", completed: true, date: "Jan 10, 2:30 PM" },
      { step: "Order Confirmed", completed: true, date: "Jan 10, 4:15 PM" },
      { step: "Shipped", completed: true, date: "Jan 12, 10:00 AM" },
      { step: "Out for Delivery", completed: true, date: "Jan 15, 8:30 AM" },
      { step: "Delivered", completed: true, date: "Jan 15, 2:45 PM" },
    ],
  },
  {
    id: "ORD-2024-002",
    status: "shipped",
    items: [{ name: "Ceramic Floor Tiles", quantity: 100, price: 45 }],
    total: 4500,
    orderDate: "2024-01-12",
    deliveryDate: "2024-01-18",
    vendor: "Tile World",
    trackingSteps: [
      { step: "Order Placed", completed: true, date: "Jan 12, 11:20 AM" },
      { step: "Order Confirmed", completed: true, date: "Jan 12, 1:45 PM" },
      { step: "Shipped", completed: true, date: "Jan 14, 9:15 AM" },
      { step: "Out for Delivery", completed: false, date: "" },
      { step: "Delivered", completed: false, date: "" },
    ],
  },
  {
    id: "ORD-2024-003",
    status: "processing",
    items: [{ name: "Clay Bricks", quantity: 1000, price: 7 }],
    total: 7000,
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-20",
    vendor: "Local Brick Works",
    trackingSteps: [
      { step: "Order Placed", completed: true, date: "Jan 14, 3:10 PM" },
      { step: "Order Confirmed", completed: true, date: "Jan 14, 5:30 PM" },
      { step: "Shipped", completed: false, date: "" },
      { step: "Out for Delivery", completed: false, date: "" },
      { step: "Delivered", completed: false, date: "" },
    ],
  },
]

export default function OrdersPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressValue = (steps: any[]) => {
    const completedSteps = steps.filter((step) => step.completed).length
    return (completedSteps / steps.length) * 100
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-6">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-3">
                            {order.id}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Ordered on {order.orderDate} • Expected delivery: {order.deliveryDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{order.total.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-medium mb-3">Order Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                <div>
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="text-sm font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm text-muted-foreground">Vendor: {order.vendor}</p>
                          </div>
                        </div>

                        {/* Tracking */}
                        <div>
                          <h4 className="font-medium mb-3">Order Tracking</h4>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{Math.round(getProgressValue(order.trackingSteps))}%</span>
                            </div>
                            <Progress value={getProgressValue(order.trackingSteps)} />
                          </div>
                          <div className="space-y-3">
                            {order.trackingSteps.map((step, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div
                                  className={`h-3 w-3 rounded-full ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                                />
                                <div className="flex-1">
                                  <p
                                    className={`text-sm font-medium ${
                                      step.completed ? "text-foreground" : "text-muted-foreground"
                                    }`}
                                  >
                                    {step.step}
                                  </p>
                                  {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6 pt-4 border-t">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Vendor
                        </Button>
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          Track Package
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-2" />
                            Rate & Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="processing" className="mt-6">
              <div className="space-y-6">
                {orders
                  .filter((order) => order.status === "processing")
                  .map((order) => (
                    <Card key={order.id}>
                      {/* Same card structure as above */}
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Processing orders will appear here</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="shipped" className="mt-6">
              <div className="space-y-6">
                {orders
                  .filter((order) => order.status === "shipped")
                  .map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Shipped orders will appear here</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="delivered" className="mt-6">
              <div className="space-y-6">
                {orders
                  .filter((order) => order.status === "delivered")
                  .map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Delivered orders will appear here</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
