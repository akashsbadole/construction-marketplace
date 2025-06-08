'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface LocationData {
  pincode: string
  city: string
  state: string
  area: string
}

interface LocationContextType {
  currentLocation: LocationData | null
  setCurrentLocation: (location: LocationData | null) => void
  isLocationSet: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

interface LocationProviderProps {
  children: ReactNode
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [currentLocation, setCurrentLocationState] = useState<LocationData | null>(null)

  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('buildconnect-location')
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation)
        setCurrentLocationState(location)
      } catch (error) {
        console.error('Error parsing saved location:', error)
        localStorage.removeItem('buildconnect-location')
      }
    }
  }, [])

  // Save location to localStorage when it changes
  const setCurrentLocation = (location: LocationData | null) => {
    setCurrentLocationState(location)
    if (location) {
      localStorage.setItem('buildconnect-location', JSON.stringify(location))
    } else {
      localStorage.removeItem('buildconnect-location')
    }
  }

  const isLocationSet = currentLocation !== null

  return (
    <LocationContext.Provider value={{
      currentLocation,
      setCurrentLocation,
      isLocationSet
    }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

// Hook for location-based filtering
export function useLocationFilter<T extends { serviceLocations?: any[], location?: any }>(
  items: T[],
  radiusKm: number = 50
): T[] {
  const { currentLocation } = useLocation()

  if (!currentLocation) {
    return items
  }

  return items.filter(item => {
    // Check if item has serviceLocations (for vendors)
    if (item.serviceLocations) {
      return item.serviceLocations.some((loc: any) => 
        loc.city === currentLocation.city || 
        loc.state === currentLocation.state
      )
    }

    // Check if item has location (for other entities)
    if (item.location) {
      return item.location.city === currentLocation.city || 
             item.location.state === currentLocation.state
    }

    // If no location data, include the item
    return true
  })
}
