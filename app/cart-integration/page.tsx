'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart-store'
import { 
  ShoppingCartIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InfoIcon,
  PackageIcon,
  TruckIcon,
  UserIcon,
  SearchIcon,
  HeartIcon,
  CalculatorIcon,
  ExternalLinkIcon
} from 'lucide-react'
import Link from 'next/link'

export default function CartIntegrationPage() {
  const { items, getCartSummary } = useCartStore()
  const summary = getCartSummary()

  const integrationPoints = [
    {
      name: 'Homepage - Featured Materials',
      description: 'Cart buttons on featured product cards',
      status: 'integrated',
      location: '/components/featured-materials.tsx',
      testUrl: '/',
      features: ['Product cards', 'Add to cart buttons', 'Price display', 'Discount badges']
    },
    {
      name: 'Materials Page',
      description: 'Full product catalog with cart functionality',
      status: 'integrated',
      location: '/app/materials/page.tsx',
      testUrl: '/materials',
      features: ['Product grid', 'Filters', 'Cart buttons', 'Cart summary sidebar']
    },
    {
      name: 'Vendor Products',
      description: 'Vendor-specific product listings',
      status: 'integrated',
      location: '/app/vendors/[id]/page.tsx',
      testUrl: '/vendors/vendor-1',
      features: ['Vendor products', 'Multi-vendor cart', 'Product details']
    },
    {
      name: 'Search Results',
      description: 'Product search with cart integration',
      status: 'integrated',
      location: '/app/search/page.tsx',
      testUrl: '/search?q=cement',
      features: ['Search results', 'Grid/list view', 'Cart buttons', 'Filters']
    },
    {
      name: 'Wishlist',
      description: 'Move wishlist items to cart',
      status: 'integrated',
      location: '/app/wishlist/page.tsx',
      testUrl: '/wishlist',
      features: ['Wishlist items', 'Move to cart', 'Bulk actions']
    },
    {
      name: 'Material Estimator',
      description: 'AI-powered material estimation with cart',
      status: 'integrated',
      location: '/components/material-estimator.tsx',
      testUrl: '/test-cart',
      features: ['AI estimates', 'Individual item cart', 'Bulk add to cart']
    },
    {
      name: 'Navigation Cart',
      description: 'Global cart access and management',
      status: 'integrated',
      location: '/components/navigation.tsx',
      testUrl: '/',
      features: ['Cart icon', 'Item count badge', 'Cart sidebar', 'Quick access']
    }
  ]

  const cartFeatures = [
    {
      name: 'Zustand State Management',
      description: 'Modern state management with persistence',
      status: 'working',
      details: 'LocalStorage persistence, real-time updates, TypeScript support'
    },
    {
      name: 'Multi-vendor Support',
      description: 'Items from different vendors in same cart',
      status: 'working',
      details: 'Vendor grouping, separate delivery charges, vendor-specific policies'
    },
    {
      name: 'Smart Pricing',
      description: 'Comprehensive price calculations',
      status: 'working',
      details: 'Subtotal, GST, delivery charges, platform fee, discounts'
    },
    {
      name: 'Quantity Management',
      description: 'Min/max quantity validation',
      status: 'working',
      details: 'Stock validation, bulk quantity support, unit conversions'
    },
    {
      name: 'Cart Persistence',
      description: 'Cart survives browser sessions',
      status: 'working',
      details: 'LocalStorage integration, cross-tab sync, data recovery'
    },
    {
      name: 'Responsive Design',
      description: 'Works on all device sizes',
      status: 'working',
      details: 'Mobile-first design, touch-friendly, adaptive layouts'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCartIcon className="h-6 w-6" />
                Cart Integration Status - Complete!
              </CardTitle>
              <CardDescription>
                Shopping cart functionality has been successfully integrated across the entire BuildConnect marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Current Cart Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{summary.totalItems}</div>
                    <div className="text-sm text-muted-foreground">Items in Cart</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">₹{summary.total.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{integrationPoints.length}</div>
                    <div className="text-sm text-muted-foreground">Integration Points</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">100%</div>
                    <div className="text-sm text-muted-foreground">Coverage</div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="font-medium">Integration Complete!</span>
                </div>
                <p className="text-sm text-green-600">
                  Cart functionality has been successfully added to all product displays across the marketplace. 
                  Users can now add items to cart from any page and manage their purchases seamlessly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Integration Points */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Points</CardTitle>
              <CardDescription>
                All pages and components where cart functionality has been implemented
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrationPoints.map((point, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{point.name}</h4>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          {point.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {point.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {point.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{point.location}</span>
                        <Link href={point.testUrl} className="flex items-center gap-1 hover:text-primary">
                          <span>Test</span>
                          <ExternalLinkIcon className="h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cart Features */}
          <Card>
            <CardHeader>
              <CardTitle>Cart Features</CardTitle>
              <CardDescription>
                Core cart functionality and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cartFeatures.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{feature.name}</h4>
                      <Badge variant="default">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {feature.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {feature.details}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Test Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Test Links</CardTitle>
              <CardDescription>
                Test cart functionality across different pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <PackageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">Homepage</div>
                      <div className="text-sm text-muted-foreground">Featured materials</div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/materials" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <TruckIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">Materials</div>
                      <div className="text-sm text-muted-foreground">Full catalog</div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/search?q=cement" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <SearchIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">Search</div>
                      <div className="text-sm text-muted-foreground">Product search</div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/wishlist" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <HeartIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">Wishlist</div>
                      <div className="text-sm text-muted-foreground">Saved items</div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/test-cart" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <CalculatorIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">Estimator</div>
                      <div className="text-sm text-muted-foreground">AI materials</div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/vendors/vendor-1" className="block">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <UserIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">Vendors</div>
                      <div className="text-sm text-muted-foreground">Vendor products</div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Recommended enhancements for the cart system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">Recommended Enhancements</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                      <li>Implement checkout flow with payment integration</li>
                      <li>Add cart analytics and tracking</li>
                      <li>Implement saved carts and cart sharing</li>
                      <li>Add bulk pricing and quantity discounts</li>
                      <li>Integrate with inventory management system</li>
                      <li>Add cart abandonment recovery</li>
                      <li>Implement guest checkout functionality</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
