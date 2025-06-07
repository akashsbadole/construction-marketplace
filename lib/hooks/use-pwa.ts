'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  isStandalone: boolean
  canInstall: boolean
  installPrompt: BeforeInstallPromptEvent | null
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: true,
    isStandalone: false,
    canInstall: false,
    installPrompt: null
  })

  useEffect(() => {
    // Check if app is running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://')

    // Check if app is already installed
    const isInstalled = isStandalone

    // Check online status
    const isOnline = navigator.onLine

    setPwaState(prev => ({
      ...prev,
      isStandalone,
      isInstalled,
      isOnline
    }))

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        canInstall: true,
        installPrompt: e
      }))
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        canInstall: false,
        installPrompt: null
      }))
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }))
    }

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }))
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const installApp = async () => {
    if (!pwaState.installPrompt) return false

    try {
      await pwaState.installPrompt.prompt()
      const choiceResult = await pwaState.installPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        setPwaState(prev => ({
          ...prev,
          isInstalled: true,
          isInstallable: false,
          canInstall: false,
          installPrompt: null
        }))
        return true
      }
      return false
    } catch (error) {
      console.error('Error installing app:', error)
      return false
    }
  }

  const shareApp = async (data?: {
    title?: string
    text?: string
    url?: string
  }) => {
    const shareData = {
      title: data?.title || 'BuildConnect - Construction Marketplace',
      text: data?.text || 'Check out BuildConnect for all your construction needs!',
      url: data?.url || window.location.origin
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return true
      } catch (error) {
        console.error('Error sharing:', error)
        return false
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url)
        return true
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        return false
      }
    }
  }

  return {
    ...pwaState,
    installApp,
    shareApp
  }
}

// Hook for managing offline data
export function useOfflineData<T>(key: string, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load data from localStorage on mount
    try {
      const stored = localStorage.getItem(`offline_${key}`)
      if (stored) {
        setData(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading offline data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [key])

  const updateData = (newData: T) => {
    setData(newData)
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(newData))
    } catch (error) {
      console.error('Error saving offline data:', error)
    }
  }

  const clearData = () => {
    setData(initialData)
    try {
      localStorage.removeItem(`offline_${key}`)
    } catch (error) {
      console.error('Error clearing offline data:', error)
    }
  }

  return {
    data,
    updateData,
    clearData,
    isLoading
  }
}

// Hook for background sync
export function useBackgroundSync() {
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const checkSupport = async () => {
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        setIsSupported(true)
        
        try {
          const registration = await navigator.serviceWorker.ready
          const tags = await registration.sync.getTags()
          setIsRegistered(tags.includes('background-sync-orders'))
        } catch (error) {
          console.error('Error checking sync registration:', error)
        }
      }
    }

    checkSupport()
  }, [])

  const registerSync = async (tag: string) => {
    if (!isSupported) return false

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register(tag)
      setIsRegistered(true)
      return true
    } catch (error) {
      console.error('Error registering sync:', error)
      return false
    }
  }

  const queueOfflineOrder = async (orderData: any) => {
    try {
      // Store order in IndexedDB or localStorage for sync later
      const offlineOrders = JSON.parse(localStorage.getItem('offline_orders') || '[]')
      offlineOrders.push({
        ...orderData,
        timestamp: Date.now(),
        synced: false
      })
      localStorage.setItem('offline_orders', JSON.stringify(offlineOrders))
      
      // Register background sync
      await registerSync('background-sync-orders')
      return true
    } catch (error) {
      console.error('Error queueing offline order:', error)
      return false
    }
  }

  return {
    isSupported,
    isRegistered,
    registerSync,
    queueOfflineOrder
  }
}

// Hook for push notifications
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
      setIsSupported(supported)
      
      if (supported) {
        setPermission(Notification.permission)
      }
    }

    checkSupport()
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      return permission === 'granted'
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  const subscribe = async () => {
    if (!isSupported || permission !== 'granted') return null

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })
      
      setSubscription(subscription)
      
      // Send subscription to server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
      
      return subscription
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      return null
    }
  }

  const unsubscribe = async () => {
    if (!subscription) return false

    try {
      await subscription.unsubscribe()
      setSubscription(null)
      
      // Remove subscription from server
      await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })
      
      return true
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
      return false
    }
  }

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe
  }
}
