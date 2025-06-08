'use client'

import { useState } from 'react'
import { Navigation } from "@/components/navigation"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPinIcon, CheckIcon, XIcon } from 'lucide-react'
import { useLocation } from '@/lib/contexts/location-context'

export default function TestLocationPage() {
  const { currentLocation } = useLocation()
  const [testResult, setTestResult] = useState<string | null>(null)

  const testLocationDetection = () => {
    if (!navigator.geolocation) {
      setTestResult('❌ Geolocation not supported')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setTestResult(`✅ Location detected: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`)
      },
      (error) => {
        setTestResult(`❌ Location error: ${error.message}`)
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Location System Test
              </CardTitle>
              <CardDescription>
                Test the location detection and selection functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Current Selected Location</h3>
                {currentLocation ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckIcon className="h-4 w-4" />
                      <span className="font-medium">Location Set</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <div><strong>Area:</strong> {currentLocation.area}</div>
                      <div><strong>City:</strong> {currentLocation.city}</div>
                      <div><strong>State:</strong> {currentLocation.state}</div>
                      <div><strong>Pincode:</strong> {currentLocation.pincode}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <XIcon className="h-4 w-4" />
                      <span className="font-medium">No Location Selected</span>
                    </div>
                    <p className="text-sm text-yellow-600 mt-1">
                      Use the location selector in the navigation to choose your location.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">GPS Detection Test</h3>
                <Button onClick={testLocationDetection} className="w-full">
                  Test GPS Location Detection
                </Button>
                {testResult && (
                  <div className="mt-2 p-3 bg-gray-50 border rounded-lg">
                    <code className="text-sm">{testResult}</code>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Navigation Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Badge variant="outline">✅ Location Selector</Badge>
                  <Badge variant="outline">✅ Mobile Search</Badge>
                  <Badge variant="outline">✅ Shopping Cart</Badge>
                  <Badge variant="outline">✅ User Menu</Badge>
                  <Badge variant="outline">✅ Responsive Design</Badge>
                  <Badge variant="outline">✅ Pincode Database</Badge>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Instructions:</strong></p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Click the location button in the navigation</li>
                  <li>Try "Use Current Location" or search manually</li>
                  <li>Test the mobile responsive features</li>
                  <li>Verify the location is saved and displayed</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
