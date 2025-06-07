import { supabase } from '@/lib/supabase/client'
import { CartItem, CartSummary } from '@/lib/store/cart-store'

export interface Order {
  id: string
  customer_id: string
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  subtotal: number
  gst_amount: number
  delivery_charges: number
  platform_fee: number
  total_amount: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  payment_method?: string
  payment_id?: string
  delivery_address: Address
  billing_address?: Address
  notes?: string
  estimated_delivery_date?: string
  actual_delivery_date?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  vendor_id?: string
  product_name: string
  vendor_name: string
  quantity: number
  unit_price: number
  total_price: number
  variant?: any
  specifications?: any
  gst_rate: number
  delivery_charges: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  tracking_number?: string
  estimated_delivery?: string
  actual_delivery?: string
  created_at: string
  updated_at: string
}

export interface Address {
  name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  landmark?: string
}

export interface CreateOrderRequest {
  items: CartItem[]
  delivery_address: Address
  billing_address?: Address
  payment_method: string
  notes?: string
}

export interface OrderStatusUpdate {
  status: Order['status']
  notes?: string
  updated_by?: string
}

class OrderService {
  // Generate unique order number
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `BC${timestamp}${random}`.toUpperCase()
  }

  // Calculate order summary from cart items
  private calculateOrderSummary(items: CartItem[]): CartSummary {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    const gstAmount = items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      const gstRate = item.gstRate || 18
      return sum + (itemTotal * gstRate / 100)
    }, 0)
    
    const deliveryCharges = items.reduce((sum, item) => sum + (item.deliveryCharges || 0), 0)
    const platformFee = Math.min(subtotal * 0.02, 100) // 2% of subtotal, max ₹100
    const total = subtotal + gstAmount + deliveryCharges + platformFee
    
    return {
      subtotal,
      gstAmount,
      deliveryCharges,
      platformFee,
      total,
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0)
    }
  }

  // Create new order
  async createOrder(request: CreateOrderRequest, customerId: string): Promise<Order> {
    try {
      const orderNumber = this.generateOrderNumber()
      const summary = this.calculateOrderSummary(request.items)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          order_number: orderNumber,
          status: 'pending',
          subtotal: summary.subtotal,
          gst_amount: summary.gstAmount,
          delivery_charges: summary.deliveryCharges,
          platform_fee: summary.platformFee,
          total_amount: summary.total,
          payment_status: 'pending',
          payment_method: request.payment_method,
          delivery_address: request.delivery_address,
          billing_address: request.billing_address || request.delivery_address,
          notes: request.notes
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = request.items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        vendor_id: item.vendorId,
        product_name: item.name,
        vendor_name: item.vendorName,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        variant: item.variant,
        specifications: item.specifications,
        gst_rate: item.gstRate || 18,
        delivery_charges: item.deliveryCharges || 0,
        status: 'pending'
      }))

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select()

      if (itemsError) throw itemsError

      // Create initial status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: order.id,
          status: 'pending',
          notes: 'Order created',
          updated_by: customerId
        })

      return { ...order, items }
    } catch (error) {
      console.error('Error creating order:', error)
      throw new Error('Failed to create order')
    }
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError
      return order
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    }
  }

  // Get orders for customer
  async getCustomerOrders(customerId: string, limit = 20, offset = 0): Promise<Order[]> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return orders || []
    } catch (error) {
      console.error('Error fetching customer orders:', error)
      return []
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, update: OrderStatusUpdate): Promise<boolean> {
    try {
      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: update.status })
        .eq('id', orderId)

      if (orderError) throw orderError

      // Add status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: update.status,
          notes: update.notes,
          updated_by: update.updated_by
        })

      return true
    } catch (error) {
      console.error('Error updating order status:', error)
      return false
    }
  }

  // Update payment status
  async updatePaymentStatus(
    orderId: string, 
    paymentStatus: Order['payment_status'],
    paymentId?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: paymentStatus,
          payment_id: paymentId
        })
        .eq('id', orderId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating payment status:', error)
      return false
    }
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string, userId?: string): Promise<boolean> {
    try {
      // Update order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)

      if (orderError) throw orderError

      // Update all order items
      await supabase
        .from('order_items')
        .update({ status: 'cancelled' })
        .eq('order_id', orderId)

      // Add status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          status: 'cancelled',
          notes: reason || 'Order cancelled',
          updated_by: userId
        })

      return true
    } catch (error) {
      console.error('Error cancelling order:', error)
      return false
    }
  }

  // Get order status history
  async getOrderStatusHistory(orderId: string) {
    try {
      const { data, error } = await supabase
        .from('order_status_history')
        .select(`
          *,
          updated_by_user:users!updated_by(first_name, last_name)
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching order status history:', error)
      return []
    }
  }

  // Search orders
  async searchOrders(query: string, customerId?: string): Promise<Order[]> {
    try {
      let queryBuilder = supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .or(`order_number.ilike.%${query}%,notes.ilike.%${query}%`)

      if (customerId) {
        queryBuilder = queryBuilder.eq('customer_id', customerId)
      }

      const { data: orders, error } = await queryBuilder
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return orders || []
    } catch (error) {
      console.error('Error searching orders:', error)
      return []
    }
  }
}

export const orderService = new OrderService()
