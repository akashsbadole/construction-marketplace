'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { orderService, Address } from '@/lib/services/order-service'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  CreditCardIcon,
  TruckIcon,
  MapPinIcon,
  IndianRupeeIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartSummary, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Address, 2: Payment, 3: Review
  
  const [deliveryAddress, setDeliveryAddress] = useState<Address>({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    landmark: ''
  })
  
  const [billingAddress, setBillingAddress] = useState<Address>({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    landmark: ''
  })
  
  const [sameAsDelivery, setSameAsDelivery] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [notes, setNotes] = useState('')

  const summary = getCartSummary()

  useEffect(() => {
    if (items.length === 0) {
      router.push('/materials')
    }
  }, [items, router])

  const handleAddressSubmit = () => {
    if (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.address_line_1 || 
        !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.postal_code) {
      alert('Please fill all required fields')
      return
    }
    setStep(2)
  }

  const handlePaymentSubmit = () => {
    if (!paymentMethod) {
      alert('Please select a payment method')
      return
    }
    setStep(3)
  }

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    try {
      // Mock user ID - in real app, get from auth context
      const customerId = 'mock-customer-id'
      
      const order = await orderService.createOrder({
        items,
        delivery_address: deliveryAddress,
        billing_address: sameAsDelivery ? deliveryAddress : billingAddress,
        payment_method: paymentMethod,
        notes
      }, customerId)

      // Clear cart after successful order
      clearCart()
      
      // Redirect to order confirmation
      router.push(`/orders/${order.id}`)
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/materials">
              <Button variant="ghost" size="sm">
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  {step > 1 ? <CheckCircleIcon className="h-4 w-4" /> : '1'}
                </div>
                <span className="ml-2 font-medium">Address</span>
              </div>
              
              <div className={`w-8 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
              
              <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  {step > 2 ? <CheckCircleIcon className="h-4 w-4" /> : '2'}
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
              
              <div className={`w-8 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
              
              <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-muted'}`}>
                  3
                </div>
                <span className="ml-2 font-medium">Review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Address */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={deliveryAddress.name}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, name: e.target.value})}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={deliveryAddress.phone}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address1">Address Line 1 *</Label>
                      <Input
                        id="address1"
                        value={deliveryAddress.address_line_1}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, address_line_1: e.target.value})}
                        placeholder="House/Flat/Office No., Building Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        value={deliveryAddress.address_line_2}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, address_line_2: e.target.value})}
                        placeholder="Area, Street, Sector, Village"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={deliveryAddress.city}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={deliveryAddress.state}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                          placeholder="Enter state"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal">PIN Code *</Label>
                        <Input
                          id="postal"
                          value={deliveryAddress.postal_code}
                          onChange={(e) => setDeliveryAddress({...deliveryAddress, postal_code: e.target.value})}
                          placeholder="Enter PIN code"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        value={deliveryAddress.landmark}
                        onChange={(e) => setDeliveryAddress({...deliveryAddress, landmark: e.target.value})}
                        placeholder="Nearby landmark (optional)"
                      />
                    </div>
                    
                    <Button onClick={handleAddressSubmit} className="w-full">
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCardIcon className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Razorpay</div>
                              <div className="text-sm text-muted-foreground">Credit/Debit Card, UPI, Net Banking</div>
                            </div>
                            <Badge>Recommended</Badge>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer">
                          <div>
                            <div className="font-medium">UPI</div>
                            <div className="text-sm text-muted-foreground">Pay using UPI apps</div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                        <RadioGroupItem value="cod" id="cod" disabled />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-muted-foreground">Not available for construction materials</div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="billing-same" 
                        checked={sameAsDelivery}
                        onCheckedChange={(checked) => setSameAsDelivery(checked as boolean)}
                      />
                      <Label htmlFor="billing-same">Billing address same as delivery address</Label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button onClick={handlePaymentSubmit} className="flex-1">
                        Review Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold mb-4">Order Items</h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex gap-3 p-4 border rounded-lg">
                            <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden">
                              <Image
                                src={item.image || '/placeholder-product.jpg'}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.vendorName}</p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm">Qty: {item.quantity}</span>
                                <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions for your order"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                        Back
                      </Button>
                      <Button 
                        onClick={handlePlaceOrder} 
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? 'Placing Order...' : 'Place Order'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹{summary.total.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TruckIcon className="h-4 w-4" />
                    <span>Estimated delivery: 3-7 business days</span>
                  </div>
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
