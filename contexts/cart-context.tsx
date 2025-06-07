"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { marketplaceService } from "@/lib/services/marketplace-service"
import type { Cart } from "@/lib/types/marketplace"

interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}

type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ITEM"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "UPDATE_ITEM"; payload: { itemId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  refreshCart: () => Promise<void>
  getSessionId: () => string
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        error: null,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case "ADD_ITEM":
    case "UPDATE_ITEM":
    case "REMOVE_ITEM":
    case "CLEAR_CART":
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    isLoading: true,
    error: null,
  })

  // Generate or get session ID
  const getSessionId = (): string => {
    let sessionId = localStorage.getItem("cart_session_id")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("cart_session_id", sessionId)
    }
    return sessionId
  }

  // Initialize cart
  useEffect(() => {
    refreshCart()
  }, [])

  const refreshCart = async () => {
    try {
      const sessionId = getSessionId()
      const cart = await marketplaceService.getOrCreateCart(sessionId)
      dispatch({ type: "SET_CART", payload: cart })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load cart" })
    }
  }

  // Handle cart actions
  useEffect(() => {
    if (!state.isLoading) return

    async function handleCartAction() {
      try {
        const lastAction = sessionStorage.getItem("lastCartAction")
        if (!lastAction) {
          dispatch({ type: "SET_LOADING", payload: false })
          return
        }

        const action: CartAction = JSON.parse(lastAction)
        sessionStorage.removeItem("lastCartAction")

        const sessionId = getSessionId()

        switch (action.type) {
          case "ADD_ITEM":
            await marketplaceService.addToCart(
              sessionId,
              action.payload.productId,
              action.payload.variantId,
              action.payload.quantity,
            )
            break
          case "UPDATE_ITEM":
            await marketplaceService.updateCartItem(sessionId, action.payload.itemId, action.payload.quantity)
            break
          case "REMOVE_ITEM":
            await marketplaceService.removeFromCart(sessionId, action.payload)
            break
          case "CLEAR_CART":
            await marketplaceService.clearCart(sessionId)
            break
          default:
            dispatch({ type: "SET_LOADING", payload: false })
            return
        }

        // Refresh cart after action
        await refreshCart()
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to update cart" })
      }
    }

    handleCartAction()
  }, [state.isLoading])

  return <CartContext.Provider value={{ state, dispatch, refreshCart, getSessionId }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }

  const { state, dispatch: originalDispatch, refreshCart, getSessionId } = context

  // Wrap dispatch to save action to sessionStorage
  const dispatch = (action: CartAction) => {
    // Save action to sessionStorage for persistence
    if (action.type !== "SET_CART" && action.type !== "SET_LOADING" && action.type !== "SET_ERROR") {
      sessionStorage.setItem("lastCartAction", JSON.stringify(action))
    }
    originalDispatch(action)
  }

  // Helper methods for easier cart management
  const addItem = (productId: string, variantId: string, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { productId, variantId, quantity } })
  }

  const updateItem = (itemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_ITEM", payload: { itemId, quantity } })
  }

  const removeItem = (itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  // Computed values
  const itemCount = state.cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const total = state.cart?.total || 0
  const subtotal = state.cart?.subtotal || 0
  const taxTotal = state.cart?.taxTotal || 0
  const shippingTotal = state.cart?.shippingTotal || 0

  return {
    cart: state.cart,
    items: state.cart?.items || [],
    itemCount,
    total,
    subtotal,
    taxTotal,
    shippingTotal,
    isLoading: state.isLoading,
    error: state.error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
    getSessionId,
  }
}
