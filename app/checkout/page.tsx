"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/contexts/cart-context"
import { CreditCard, Truck, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { marketplaceService } from "@/lib/services/marketplace-service"
import { useAuth } from "@/contexts/auth-context"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryOption, setDeliveryOption] = useState("standard")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "delhi",
    pinCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
  })
  const router = useRouter()

  const deliveryCharges = deliveryOption === "express" ? 500 : 200
  const gstAmount = Math.round(state.total * 0.18)
  const finalTotal = state.total + deliveryCharges + gstAmount

  const { state: authState } = useAuth()

  useEffect(() => {
    if (authState.user && authState.user.addresses.length > 0) {
      const defaultAddress = authState.user.addresses.find((addr) => addr.isDefault) || authState.user.addresses[0]

      if (defaultAddress) {
        setFormData({
          ...formData,
          firstName: defaultAddress.firstName,
          lastName: defaultAddress.lastName,
          phone: defaultAddress.phone || "",
          address: defaultAddress.address1,
          city: defaultAddress.city,
          state: defaultAddress.state.toLowerCase(),
          pinCode: defaultAddress.postalCode,
        })
      }
    }
  }, [authState.user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Validate form data
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.pinCode
      ) {
        alert("Please fill in all required fields")
        setIsProcessing(false)
        return
      }

      // Validate payment method specific fields
      if (paymentMethod === "card" && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv)) {
        alert("Please fill in all card details")
        setIsProcessing(false)
        return
      }

      if (paymentMethod === "upi" && !formData.upiId) {
        alert("Please enter your UPI ID")
        setIsProcessing(false)
        return
      }

      // Create address object
      const address = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address1: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pinCode,
        country: "India",
        phone: formData.phone,
      }

      // Get cart ID
      const cartId = sessionStorage.getItem("mercury_cart_id")

      if (!cartId) {
        throw new Error("Cart ID not found")
      }

      const getSessionId = () => {
        const sessionId = sessionStorage.getItem("mercury_cart_id")
        if (!sessionId) {
          throw new Error("Session ID not found")
        }
        return sessionId
      }

      const clearCart = () => {
        dispatch({ type: "CLEAR_CART" })
      }

      // Create order using our marketplace service
      const orderResponse = await marketplaceService.createOrder(getSessionId(), {
        customerId: authState.user?.id,
        shippingAddress: address,
        billingAddress: address,
        paymentMethod: paymentMethod,
      })

      // Clear cart and redirect to success page
      clearCart()
      router.push(`/order-confirmation?orderId=${orderResponse.id}`)
    } catch (error) {
      console.error("Error processing checkout:", error)
      alert("There was an error processing your order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">First Name</label>
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Last Name</label>
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House/Building number, Street name"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">City</label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">State</label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => setFormData({ ...formData, state: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delhi">Delhi</SelectItem>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">PIN Code</label>
                        <Input
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          placeholder="PIN Code"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Delivery Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${deliveryOption === "standard" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => setDeliveryOption("standard")}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Standard Delivery</h4>
                          <p className="text-sm text-muted-foreground">5-7 business days</p>
                        </div>
                        <span className="font-medium">₹200</span>
                      </div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${deliveryOption === "express" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => setDeliveryOption("express")}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Express Delivery</h4>
                          <p className="text-sm text-muted-foreground">2-3 business days</p>
                        </div>
                        <span className="font-medium">₹500</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer text-center ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm font-medium">Card</span>
                      </div>
                      <div
                        className={`border rounded-lg p-4 cursor-pointer text-center ${paymentMethod === "upi" ? "border-primary bg-primary/5" : ""}`}
                        onClick={() => setPaymentMethod("upi")}
                      >
                        <div className="h-6 w-6 mx-auto mb-2 bg-primary rounded text-white flex items-center justify-center text-xs font-bold">
                          UPI
                        </div>
                        <span className="text-sm font-medium">UPI</span>
                      </div>
                      <div
                        className={`border rounded-lg p-4 cursor-pointer text-center ${paymentMethod === "cod" ? "border-primary bg-primary/5" : ""}`}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <div className="h-6 w-6 mx-auto mb-2 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">
                          ₹
                        </div>
                        <span className="text-sm font-medium">COD</span>
                      </div>
                    </div>

                    {paymentMethod === "card" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Card Number</label>
                          <Input
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium">Expiry Date</label>
                            <Input
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">CVV</label>
                            <Input
                              name="cardCvv"
                              value={formData.cardCvv}
                              onChange={handleInputChange}
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "upi" && (
                      <div>
                        <label className="text-sm font-medium">UPI ID</label>
                        <Input
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleInputChange}
                          placeholder="yourname@bank"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal</span>
                      <span>₹{state.total}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Delivery</span>
                      <span>₹{deliveryCharges}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>GST (18%)</span>
                      <span>₹{gstAmount}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </CardContent>
                </Card>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground rounded-md py-3 font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ₹${finalTotal}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
