import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  vendorId: string
  name: string
  price: number
  quantity: number
  unit: string
  image: string
  variant?: {
    size?: string
    grade?: string
    brand?: string
  }
  specifications?: Record<string, string>
  deliveryCharges?: number
  gstRate?: number
  vendorName: string
  availability: 'in_stock' | 'out_of_stock' | 'limited_stock'
  minOrderQuantity?: number
  maxOrderQuantity?: number
}

export interface CartSummary {
  subtotal: number
  gstAmount: number
  deliveryCharges: number
  platformFee: number
  total: number
  totalItems: number
  totalQuantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  
  // Getters
  getCartSummary: () => CartSummary
  getItemsByVendor: () => Record<string, CartItem[]>
  isItemInCart: (productId: string, variant?: CartItem['variant']) => boolean
  getItemQuantity: (productId: string, variant?: CartItem['variant']) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        const items = get().items
        const existingItemIndex = items.findIndex(
          item => 
            item.productId === newItem.productId && 
            JSON.stringify(item.variant) === JSON.stringify(newItem.variant)
        )

        if (existingItemIndex >= 0) {
          // Update quantity if item already exists
          const updatedItems = [...items]
          const existingItem = updatedItems[existingItemIndex]
          const newQuantity = existingItem.quantity + newItem.quantity
          
          // Check max order quantity
          if (newItem.maxOrderQuantity && newQuantity > newItem.maxOrderQuantity) {
            throw new Error(`Maximum order quantity is ${newItem.maxOrderQuantity}`)
          }
          
          updatedItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity
          }
          
          set({ items: updatedItems })
        } else {
          // Add new item
          const itemWithId: CartItem = {
            ...newItem,
            id: `${newItem.productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }
          
          set({ items: [...items, itemWithId] })
        }
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) })
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        const items = get().items
        const itemIndex = items.findIndex(item => item.id === itemId)
        
        if (itemIndex >= 0) {
          const updatedItems = [...items]
          const item = updatedItems[itemIndex]
          
          // Check min/max order quantities
          if (item.minOrderQuantity && quantity < item.minOrderQuantity) {
            throw new Error(`Minimum order quantity is ${item.minOrderQuantity}`)
          }
          
          if (item.maxOrderQuantity && quantity > item.maxOrderQuantity) {
            throw new Error(`Maximum order quantity is ${item.maxOrderQuantity}`)
          }
          
          updatedItems[itemIndex] = { ...item, quantity }
          set({ items: updatedItems })
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },

      getCartSummary: () => {
        const items = get().items
        
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        
        const gstAmount = items.reduce((sum, item) => {
          const itemTotal = item.price * item.quantity
          const gstRate = item.gstRate || 18 // Default 18% GST
          return sum + (itemTotal * gstRate / 100)
        }, 0)
        
        const deliveryCharges = items.reduce((sum, item) => sum + (item.deliveryCharges || 0), 0)
        
        // Platform fee (2% of subtotal, max ₹100)
        const platformFee = Math.min(subtotal * 0.02, 100)
        
        const total = subtotal + gstAmount + deliveryCharges + platformFee
        
        const totalItems = items.length
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
        
        return {
          subtotal,
          gstAmount,
          deliveryCharges,
          platformFee,
          total,
          totalItems,
          totalQuantity
        }
      },

      getItemsByVendor: () => {
        const items = get().items
        return items.reduce((acc, item) => {
          if (!acc[item.vendorId]) {
            acc[item.vendorId] = []
          }
          acc[item.vendorId].push(item)
          return acc
        }, {} as Record<string, CartItem[]>)
      },

      isItemInCart: (productId, variant) => {
        const items = get().items
        return items.some(
          item => 
            item.productId === productId && 
            JSON.stringify(item.variant) === JSON.stringify(variant)
        )
      },

      getItemQuantity: (productId, variant) => {
        const items = get().items
        const item = items.find(
          item => 
            item.productId === productId && 
            JSON.stringify(item.variant) === JSON.stringify(variant)
        )
        return item?.quantity || 0
      }
    }),
    {
      name: 'buildconnect-cart',
      partialize: (state) => ({ items: state.items })
    }
  )
)

// Wishlist Store
interface WishlistItem {
  id: string
  productId: string
  vendorId: string
  name: string
  price: number
  image: string
  vendorName: string
  addedAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isItemInWishlist: (productId: string) => boolean
  moveToCart: (productId: string) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items
        const exists = items.some(item => item.productId === newItem.productId)
        
        if (!exists) {
          const itemWithId: WishlistItem = {
            ...newItem,
            id: `wishlist-${newItem.productId}-${Date.now()}`,
            addedAt: new Date().toISOString()
          }
          
          set({ items: [...items, itemWithId] })
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(item => item.productId !== productId) })
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      isItemInWishlist: (productId) => {
        return get().items.some(item => item.productId === productId)
      },

      moveToCart: (productId) => {
        const items = get().items
        const wishlistItem = items.find(item => item.productId === productId)
        
        if (wishlistItem) {
          // Add to cart
          const cartStore = useCartStore.getState()
          cartStore.addItem({
            productId: wishlistItem.productId,
            vendorId: wishlistItem.vendorId,
            name: wishlistItem.name,
            price: wishlistItem.price,
            quantity: 1,
            unit: 'piece', // Default unit
            image: wishlistItem.image,
            vendorName: wishlistItem.vendorName,
            availability: 'in_stock' // Assume in stock
          })
          
          // Remove from wishlist
          get().removeItem(productId)
        }
      }
    }),
    {
      name: 'buildconnect-wishlist'
    }
  )
)
