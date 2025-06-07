'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { orderService, Order } from '@/lib/services/order-service'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  PackageIcon,
  TruckIcon,
  MapPinIcon,
  IndianRupeeIcon,
  CalendarIcon,
  PhoneIcon,
  DownloadIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon, label: 'Confirmed' },
  processing: { color: 'bg-purple-100 text-purple-800', icon: PackageIcon, label: 'Processing' },
  shipped: { color: 'bg-indigo-100 text-indigo-800', icon: TruckIcon, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircleIcon, label: 'Cancelled' },
  refunded: { color: 'bg-gray-100 text-gray-800', icon: XCircleIcon, label: 'Refunded' }
}

const paymentStatusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Payment Pending' },
  paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
  failed: { color: 'bg-red-100 text-red-800', label: 'Payment Failed' },
  refunded: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
  partially_refunded: { color: 'bg-orange-100 text-orange-800', label: 'Partially Refunded' }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusHistory, setStatusHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params.id) return
      
      try {
        const orderData = await orderService.getOrder(params.id as string)
        if (orderData) {
          setOrder(orderData)
          
          // Fetch status history
          const history = await orderService.getOrderStatusHistory(params.id as string)
          setStatusHistory(history)
        } else {
          router.push('/orders')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        router.push('/orders')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id, router])

  const handleCancelOrder = async () => {
    if (!order || !confirm('Are you sure you want to cancel this order?')) return
    
    try {
      const success = await orderService.cancelOrder(order.id, 'Cancelled by customer')
      if (success) {
        // Refresh order data
        const updatedOrder = await orderService.getOrder(order.id)
        if (updatedOrder) setOrder(updatedOrder)
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Failed to cancel order. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
            <Link href="/orders">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusInfo = statusConfig[order.status]
  const paymentInfo = paymentStatusConfig[order.payment_status]
  const StatusIcon = statusInfo.icon

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
              <p className="text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              {order.status === 'pending' && (
                <Button variant="destructive" size="sm" onClick={handleCancelOrder}>
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                    <Badge className={paymentInfo.color}>
                      {paymentInfo.label}
                    </Badge>
                  </div>
                  
                  {order.estimated_delivery_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        Estimated delivery: {new Date(order.estimated_delivery_date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                        <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <Image
                            src="/placeholder-product.jpg"
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product_name}</h4>
                          <p className="text-sm text-muted-foreground">{item.vendor_name}</p>
                          
                          {item.variant && (
                            <div className="flex gap-1 mt-1">
                              {Object.entries(item.variant).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {value}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <div className="text-right">
                              <div className="font-semibold">₹{item.total_price.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">
                                ₹{item.unit_price.toLocaleString()} each
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <Badge className={statusConfig[item.status]?.color || 'bg-gray-100 text-gray-800'}>
                              {statusConfig[item.status]?.label || item.status}
                            </Badge>
                            
                            {item.tracking_number && (
                              <div className="text-xs text-muted-foreground">
                                Tracking: {item.tracking_number}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status History */}
              {statusHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statusHistory.map((entry, index) => (
                        <div key={entry.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted'}`}></div>
                            {index < statusHistory.length - 1 && (
                              <div className="w-0.5 h-8 bg-muted mt-2"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={statusConfig[entry.status]?.color || 'bg-gray-100 text-gray-800'}>
                                {statusConfig[entry.status]?.label || entry.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(entry.created_at).toLocaleString('en-IN')}
                              </span>
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-muted-foreground">{entry.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>GST</span>
                    <span>₹{order.gst_amount.toLocaleString()}</span>
                  </div>
                  
                  {order.delivery_charges > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Delivery Charges</span>
                      <span>₹{order.delivery_charges.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>₹{order.platform_fee.toLocaleString()}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{order.total_amount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium">{order.delivery_address.name}</div>
                    <div>{order.delivery_address.address_line_1}</div>
                    {order.delivery_address.address_line_2 && (
                      <div>{order.delivery_address.address_line_2}</div>
                    )}
                    <div>
                      {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postal_code}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <PhoneIcon className="h-3 w-3" />
                      {order.delivery_address.phone}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupeeIcon className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="capitalize">{order.payment_method}</span>
                    </div>
                    
                    {order.payment_id && (
                      <div className="flex justify-between">
                        <span>Payment ID:</span>
                        <span className="font-mono text-xs">{order.payment_id}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={paymentInfo.color}>
                        {paymentInfo.label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Track Shipment
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Return/Exchange
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
