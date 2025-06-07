"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { marketplaceService } from "@/lib/services/marketplace-service"
import type { User, UserRole } from "@/lib/types/marketplace"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; token: string } }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGOUT" }

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role: UserRole
  }) => Promise<boolean>
  logout: () => void
} | null>(null)

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("auth_user")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({ type: "SET_USER", payload: { user, token } })
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
      }
    }

    dispatch({ type: "SET_LOADING", payload: false })
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const result = await marketplaceService.login(email, password)

      if (result) {
        // Store auth data
        localStorage.setItem("auth_token", result.token)
        localStorage.setItem("auth_user", JSON.stringify(result.user))

        dispatch({ type: "SET_USER", payload: result })
        return true
      } else {
        dispatch({ type: "SET_ERROR", payload: "Invalid email or password" })
        return false
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Login failed. Please try again." })
      return false
    }
  }

  const register = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    role: UserRole
  }): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const result = await marketplaceService.register(userData)

      // Store auth data
      localStorage.setItem("auth_token", result.token)
      localStorage.setItem("auth_user", JSON.stringify(result.user))

      dispatch({ type: "SET_USER", payload: result })
      return true
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Registration failed. Please try again." })
      return false
    }
  }

  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")

    dispatch({ type: "LOGOUT" })
  }

  return <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
