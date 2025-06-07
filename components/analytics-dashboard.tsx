'use client'

import { useState, useEffect } from 'react'
import { analyticsService, DashboardMetrics, VendorMetrics } from '@/lib/services/analytics-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUpIcon,
  TrendingDownIcon,
  IndianRupeeIcon,
  ShoppingCartIcon,
  UsersIcon,
  StoreIcon,
  HardHatIcon,
  PercentIcon,
  BarChart3Icon,
  PieChartIcon,
  CalendarIcon,
  DownloadIcon
} from 'lucide-react'

interface AnalyticsDashboardProps {
  userRole: 'admin' | 'vendor' | 'contractor'
  userId?: string
}

export function AnalyticsDashboard({ userRole, userId }: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [vendorMetrics, setVendorMetrics] = useState<VendorMetrics[]>([])
  const [revenueTrends, setRevenueTrends] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30d')
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day')

  useEffect(() => {
    loadAnalytics()
  }, [dateRange, userRole, userId])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const range = getDateRange(dateRange)
      
      if (userRole === 'admin') {
        const [dashboardMetrics, vendorData, trends] = await Promise.all([
          analyticsService.getDashboardMetrics(range),
          analyticsService.getVendorMetrics(range),
          analyticsService.getRevenueTrends(range, selectedPeriod)
        ])
        
        setMetrics(dashboardMetrics)
        setVendorMetrics(vendorData)
        setRevenueTrends(trends)
      } else if (userRole === 'vendor' && userId) {
        // Load vendor-specific metrics
        const vendorData = await analyticsService.getVendorMetrics(range)
        const currentVendor = vendorData.find(v => v.vendorId === userId)
        
        if (currentVendor) {
          setVendorMetrics([currentVendor])
        }
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDateRange = (period: string) => {
    const end = new Date()
    const start = new Date()
    
    switch (period) {
      case '7d':
        start.setDate(end.getDate() - 7)
        break
      case '30d':
        start.setDate(end.getDate() - 30)
        break
      case '90d':
        start.setDate(end.getDate() - 90)
        break
      case '1y':
        start.setFullYear(end.getFullYear() - 1)
        break
      default:
        start.setDate(end.getDate() - 30)
    }
    
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUpIcon className="h-3 w-3" /> : <TrendingDownIcon className="h-3 w-3" />}
        <span className="text-xs font-medium">{Math.abs(growth).toFixed(1)}%</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            {userRole === 'admin' ? 'Platform overview and insights' : 'Your performance metrics'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Admin Dashboard */}
      {userRole === 'admin' && metrics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</div>
                {formatGrowth(metrics.revenueGrowth)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalOrders.toLocaleString()}</div>
                {formatGrowth(metrics.orderGrowth)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
                {formatGrowth(metrics.userGrowth)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <PercentIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(2)}%</div>
                <p className="text-xs text-muted-foreground">
                  Avg Order: {formatCurrency(metrics.averageOrderValue)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StoreIcon className="h-5 w-5" />
                  Vendors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{metrics.totalVendors}</div>
                <p className="text-sm text-muted-foreground">Active vendors on platform</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardHatIcon className="h-5 w-5" />
                  Contractors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{metrics.totalContractors}</div>
                <p className="text-sm text-muted-foreground">Verified contractors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5" />
                  Platform Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Order Fulfillment</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Satisfaction</span>
                      <span>4.6/5</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Vendors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Top Performing Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorMetrics.slice(0, 10).map((vendor, index) => (
                  <div key={vendor.vendorId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <h4 className="font-medium">{vendor.vendorName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {vendor.totalOrders} orders • {vendor.totalProducts} products
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(vendor.totalRevenue)}</div>
                      <div className="text-sm text-muted-foreground">
                        ⭐ {vendor.rating.toFixed(1)} • AOV: {formatCurrency(vendor.averageOrderValue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Vendor Dashboard */}
      {userRole === 'vendor' && vendorMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(vendorMetrics[0].totalRevenue)}</div>
              {formatGrowth(vendorMetrics[0].revenueGrowth)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vendorMetrics[0].totalOrders}</div>
              {formatGrowth(vendorMetrics[0].orderGrowth)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(vendorMetrics[0].averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">Per order average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <PercentIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">⭐ {vendorMetrics[0].rating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">{vendorMetrics[0].totalProducts} products</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
