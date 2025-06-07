import { supabase } from '@/lib/supabase/client'

export interface AnalyticsEvent {
  id: string
  event_type: string
  user_id?: string
  session_id?: string
  entity_type?: string
  entity_id?: string
  properties: Record<string, any>
  user_agent?: string
  ip_address?: string
  referrer?: string
  created_at: string
}

export interface PerformanceMetric {
  id: string
  metric_type: string
  entity_type?: string
  entity_id?: string
  period_type: 'daily' | 'weekly' | 'monthly' | 'yearly'
  period_start: string
  period_end: string
  metric_value: number
  metadata: Record<string, any>
  created_at: string
}

export interface RevenueData {
  id: string
  order_id?: string
  vendor_id?: string
  contractor_id?: string
  revenue_type: 'product_sale' | 'service_fee' | 'commission' | 'subscription'
  gross_amount: number
  platform_fee: number
  net_amount: number
  currency: string
  transaction_date: string
  metadata: Record<string, any>
  created_at: string
}

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalVendors: number
  totalContractors: number
  conversionRate: number
  averageOrderValue: number
  revenueGrowth: number
  orderGrowth: number
  userGrowth: number
}

export interface VendorMetrics {
  vendorId: string
  vendorName: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  rating: number
  totalProducts: number
  revenueGrowth: number
  orderGrowth: number
}

class AnalyticsService {
  // Track analytics events
  async trackEvent(
    eventType: string,
    properties: Record<string, any> = {},
    userId?: string,
    entityType?: string,
    entityId?: string
  ): Promise<void> {
    try {
      const sessionId = this.getSessionId()
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : undefined
      const referrer = typeof window !== 'undefined' ? document.referrer : undefined

      await supabase
        .from('analytics_events')
        .insert({
          event_type: eventType,
          user_id: userId,
          session_id: sessionId,
          entity_type: entityType,
          entity_id: entityId,
          properties,
          user_agent: userAgent,
          referrer
        })
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }

  // Get or create session ID
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server-session'
    
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  // Track page views
  async trackPageView(page: string, userId?: string): Promise<void> {
    await this.trackEvent('page_view', { page }, userId)
  }

  // Track product views
  async trackProductView(productId: string, userId?: string): Promise<void> {
    await this.trackEvent('product_view', {}, userId, 'product', productId)
  }

  // Track order placement
  async trackOrderPlaced(orderId: string, orderValue: number, userId?: string): Promise<void> {
    await this.trackEvent('order_placed', { order_value: orderValue }, userId, 'order', orderId)
  }

  // Track search queries
  async trackSearch(query: string, filters: Record<string, any>, userId?: string): Promise<void> {
    await this.trackEvent('search', { query, filters }, userId)
  }

  // Record revenue data
  async recordRevenue(revenueData: Omit<RevenueData, 'id' | 'created_at'>): Promise<void> {
    try {
      await supabase
        .from('revenue_tracking')
        .insert(revenueData)
    } catch (error) {
      console.error('Error recording revenue:', error)
    }
  }

  // Get dashboard metrics
  async getDashboardMetrics(dateRange: { start: string; end: string }): Promise<DashboardMetrics> {
    try {
      const [
        revenueResult,
        ordersResult,
        usersResult,
        vendorsResult,
        contractorsResult
      ] = await Promise.all([
        this.getTotalRevenue(dateRange),
        this.getTotalOrders(dateRange),
        this.getTotalUsers(dateRange),
        this.getTotalVendors(dateRange),
        this.getTotalContractors(dateRange)
      ])

      const totalRevenue = revenueResult || 0
      const totalOrders = ordersResult || 0
      const totalUsers = usersResult || 0
      const totalVendors = vendorsResult || 0
      const totalContractors = contractorsResult || 0

      // Calculate derived metrics
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      const conversionRate = await this.getConversionRate(dateRange)

      // Calculate growth rates (compared to previous period)
      const previousPeriod = this.getPreviousPeriod(dateRange)
      const [prevRevenue, prevOrders, prevUsers] = await Promise.all([
        this.getTotalRevenue(previousPeriod),
        this.getTotalOrders(previousPeriod),
        this.getTotalUsers(previousPeriod)
      ])

      const revenueGrowth = this.calculateGrowthRate(totalRevenue, prevRevenue || 0)
      const orderGrowth = this.calculateGrowthRate(totalOrders, prevOrders || 0)
      const userGrowth = this.calculateGrowthRate(totalUsers, prevUsers || 0)

      return {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalVendors,
        totalContractors,
        conversionRate,
        averageOrderValue,
        revenueGrowth,
        orderGrowth,
        userGrowth
      }
    } catch (error) {
      console.error('Error getting dashboard metrics:', error)
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalVendors: 0,
        totalContractors: 0,
        conversionRate: 0,
        averageOrderValue: 0,
        revenueGrowth: 0,
        orderGrowth: 0,
        userGrowth: 0
      }
    }
  }

  // Get vendor metrics
  async getVendorMetrics(dateRange: { start: string; end: string }): Promise<VendorMetrics[]> {
    try {
      const { data: vendorData, error } = await supabase
        .from('vendors')
        .select(`
          id,
          business_name,
          revenue_tracking!vendor_id(
            gross_amount,
            transaction_date
          ),
          orders!vendor_id(
            id,
            total_amount,
            created_at
          ),
          products(id),
          reviews(rating)
        `)

      if (error) throw error

      const vendorMetrics: VendorMetrics[] = vendorData?.map(vendor => {
        const revenues = vendor.revenue_tracking?.filter((r: any) => 
          r.transaction_date >= dateRange.start && r.transaction_date <= dateRange.end
        ) || []
        
        const orders = vendor.orders?.filter((o: any) => 
          o.created_at >= dateRange.start && o.created_at <= dateRange.end
        ) || []

        const totalRevenue = revenues.reduce((sum: number, r: any) => sum + r.gross_amount, 0)
        const totalOrders = orders.length
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
        
        const ratings = vendor.reviews?.map((r: any) => r.rating) || []
        const rating = ratings.length > 0 ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length : 0

        return {
          vendorId: vendor.id,
          vendorName: vendor.business_name,
          totalRevenue,
          totalOrders,
          averageOrderValue,
          conversionRate: 0, // Calculate based on views vs orders
          rating,
          totalProducts: vendor.products?.length || 0,
          revenueGrowth: 0, // Calculate based on previous period
          orderGrowth: 0 // Calculate based on previous period
        }
      }) || []

      return vendorMetrics.sort((a, b) => b.totalRevenue - a.totalRevenue)
    } catch (error) {
      console.error('Error getting vendor metrics:', error)
      return []
    }
  }

  // Get revenue trends
  async getRevenueTrends(dateRange: { start: string; end: string }, groupBy: 'day' | 'week' | 'month' = 'day') {
    try {
      const { data, error } = await supabase
        .from('revenue_tracking')
        .select('transaction_date, gross_amount, revenue_type')
        .gte('transaction_date', dateRange.start)
        .lte('transaction_date', dateRange.end)
        .order('transaction_date')

      if (error) throw error

      // Group data by specified period
      const groupedData = this.groupDataByPeriod(data || [], groupBy)
      return groupedData
    } catch (error) {
      console.error('Error getting revenue trends:', error)
      return []
    }
  }

  // Get user activity analytics
  async getUserActivityAnalytics(dateRange: { start: string; end: string }) {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('event_type, created_at, properties')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)

      if (error) throw error

      // Process and group events
      const eventCounts = (data || []).reduce((acc: Record<string, number>, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1
        return acc
      }, {})

      return {
        totalEvents: data?.length || 0,
        eventBreakdown: eventCounts,
        topEvents: Object.entries(eventCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 10)
      }
    } catch (error) {
      console.error('Error getting user activity analytics:', error)
      return { totalEvents: 0, eventBreakdown: {}, topEvents: [] }
    }
  }

  // Helper methods
  private async getTotalRevenue(dateRange: { start: string; end: string }): Promise<number> {
    const { data, error } = await supabase
      .from('revenue_tracking')
      .select('gross_amount')
      .gte('transaction_date', dateRange.start)
      .lte('transaction_date', dateRange.end)

    if (error) return 0
    return data?.reduce((sum, item) => sum + item.gross_amount, 0) || 0
  }

  private async getTotalOrders(dateRange: { start: string; end: string }): Promise<number> {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end)

    if (error) return 0
    return count || 0
  }

  private async getTotalUsers(dateRange: { start: string; end: string }): Promise<number> {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end)

    if (error) return 0
    return count || 0
  }

  private async getTotalVendors(dateRange: { start: string; end: string }): Promise<number> {
    const { count, error } = await supabase
      .from('vendors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end)

    if (error) return 0
    return count || 0
  }

  private async getTotalContractors(dateRange: { start: string; end: string }): Promise<number> {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'contractor')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end)

    if (error) return 0
    return count || 0
  }

  private async getConversionRate(dateRange: { start: string; end: string }): Promise<number> {
    // Calculate conversion rate based on page views to orders
    const [pageViews, orders] = await Promise.all([
      supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end),
      supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'order_placed')
        .gte('created_at', dateRange.start)
        .lte('created_at', dateRange.end)
    ])

    const totalPageViews = pageViews.count || 0
    const totalOrders = orders.count || 0

    return totalPageViews > 0 ? (totalOrders / totalPageViews) * 100 : 0
  }

  private getPreviousPeriod(dateRange: { start: string; end: string }) {
    const start = new Date(dateRange.start)
    const end = new Date(dateRange.end)
    const duration = end.getTime() - start.getTime()

    const prevEnd = new Date(start.getTime() - 1)
    const prevStart = new Date(prevEnd.getTime() - duration)

    return {
      start: prevStart.toISOString().split('T')[0],
      end: prevEnd.toISOString().split('T')[0]
    }
  }

  private calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  private groupDataByPeriod(data: any[], groupBy: 'day' | 'week' | 'month') {
    // Implementation for grouping data by time periods
    const grouped: Record<string, number> = {}
    
    data.forEach(item => {
      const date = new Date(item.transaction_date)
      let key: string

      switch (groupBy) {
        case 'day':
          key = date.toISOString().split('T')[0]
          break
        case 'week':
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
          key = weekStart.toISOString().split('T')[0]
          break
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          break
        default:
          key = date.toISOString().split('T')[0]
      }

      grouped[key] = (grouped[key] || 0) + item.gross_amount
    })

    return Object.entries(grouped).map(([date, amount]) => ({ date, amount }))
  }
}

export const analyticsService = new AnalyticsService()
