import { supabase } from '@/lib/supabase/client'

export interface MaterialEstimate {
  category: string
  material: string
  quantity: number
  unit: string
  estimatedPrice: number
  priceRange: {
    min: number
    max: number
  }
  confidence: number
  alternatives: Array<{
    material: string
    quantity: number
    price: number
    savings: number
  }>
}

export interface ProjectEstimate {
  projectType: string
  area: number
  totalEstimate: number
  breakdown: MaterialEstimate[]
  laborCost: number
  timeline: {
    estimated: number // in days
    phases: Array<{
      name: string
      duration: number
      materials: string[]
    }>
  }
  confidence: number
}

export interface PricePrediction {
  productId: string
  currentPrice: number
  predictedPrice: number
  priceChange: number
  priceChangePercent: number
  confidence: number
  factors: string[]
  timeframe: string
}

export interface DemandForecast {
  productId: string
  productName: string
  currentDemand: number
  predictedDemand: number
  demandChange: number
  seasonality: 'high' | 'medium' | 'low'
  trendDirection: 'increasing' | 'stable' | 'decreasing'
  confidence: number
  recommendedStock: number
}

export interface SmartRecommendation {
  type: 'product' | 'vendor' | 'contractor' | 'bundle'
  id: string
  title: string
  description: string
  score: number
  reason: string
  metadata: Record<string, any>
}

class AIService {
  // Material Estimator
  async estimateMaterials(projectDetails: {
    type: 'residential' | 'commercial' | 'renovation'
    area: number // in sq ft
    floors: number
    rooms?: number
    specifications?: Record<string, any>
  }): Promise<ProjectEstimate> {
    try {
      // In a real implementation, this would call an AI model
      // For now, we'll use rule-based estimation
      
      const { type, area, floors, rooms = 0 } = projectDetails
      
      // Base material requirements per sq ft
      const materialRates = this.getMaterialRates(type)
      
      const breakdown: MaterialEstimate[] = []
      let totalEstimate = 0
      
      // Calculate cement requirement
      const cementBags = Math.ceil((area * materialRates.cement) / 50) // 50kg bags
      const cementEstimate = await this.estimateMaterial('cement', cementBags, 'bags')
      breakdown.push(cementEstimate)
      totalEstimate += cementEstimate.estimatedPrice
      
      // Calculate steel requirement
      const steelTons = (area * materialRates.steel) / 1000 // in tons
      const steelEstimate = await this.estimateMaterial('steel', steelTons, 'tons')
      breakdown.push(steelEstimate)
      totalEstimate += steelEstimate.estimatedPrice
      
      // Calculate brick requirement
      const bricks = Math.ceil(area * materialRates.bricks)
      const brickEstimate = await this.estimateMaterial('bricks', bricks, 'pieces')
      breakdown.push(brickEstimate)
      totalEstimate += brickEstimate.estimatedPrice
      
      // Calculate sand requirement
      const sandCubicFt = area * materialRates.sand
      const sandEstimate = await this.estimateMaterial('sand', sandCubicFt, 'cubic_ft')
      breakdown.push(sandEstimate)
      totalEstimate += sandEstimate.estimatedPrice
      
      // Labor cost (30-40% of material cost)
      const laborCost = totalEstimate * 0.35
      
      // Timeline estimation
      const timeline = this.estimateTimeline(type, area, floors)
      
      return {
        projectType: type,
        area,
        totalEstimate: totalEstimate + laborCost,
        breakdown,
        laborCost,
        timeline,
        confidence: 0.85 // 85% confidence
      }
    } catch (error) {
      console.error('Error estimating materials:', error)
      throw new Error('Failed to estimate materials')
    }
  }

  // Price Prediction
  async predictPrices(productIds: string[], timeframe: '1week' | '1month' | '3months' = '1month'): Promise<PricePrediction[]> {
    try {
      const predictions: PricePrediction[] = []
      
      for (const productId of productIds) {
        // Get historical price data
        const { data: priceHistory } = await supabase
          .from('products')
          .select('price, created_at, updated_at')
          .eq('id', productId)
          .order('updated_at', { ascending: false })
          .limit(30)
        
        if (!priceHistory || priceHistory.length === 0) continue
        
        const currentPrice = priceHistory[0].price
        
        // Simple trend analysis (in real implementation, use ML models)
        const priceChanges = this.analyzePriceTrends(priceHistory)
        const seasonalFactors = await this.getSeasonalFactors(productId)
        const marketFactors = await this.getMarketFactors()
        
        // Predict price change
        let predictedChange = 0
        const factors: string[] = []
        
        if (priceChanges.trend > 0.05) {
          predictedChange += 0.03 // 3% increase
          factors.push('Upward price trend')
        }
        
        if (seasonalFactors.isHighSeason) {
          predictedChange += 0.05 // 5% seasonal increase
          factors.push('High demand season')
        }
        
        if (marketFactors.inflation > 0.02) {
          predictedChange += marketFactors.inflation
          factors.push('Market inflation')
        }
        
        const predictedPrice = currentPrice * (1 + predictedChange)
        const priceChange = predictedPrice - currentPrice
        const priceChangePercent = (priceChange / currentPrice) * 100
        
        predictions.push({
          productId,
          currentPrice,
          predictedPrice,
          priceChange,
          priceChangePercent,
          confidence: 0.75,
          factors,
          timeframe
        })
      }
      
      return predictions
    } catch (error) {
      console.error('Error predicting prices:', error)
      return []
    }
  }

  // Demand Forecasting
  async forecastDemand(vendorId?: string): Promise<DemandForecast[]> {
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          category,
          order_items!inner(
            quantity,
            created_at
          )
        `)
      
      if (vendorId) {
        query = query.eq('vendor_id', vendorId)
      }
      
      const { data: products } = await query.limit(50)
      
      if (!products) return []
      
      const forecasts: DemandForecast[] = []
      
      for (const product of products) {
        const orderItems = product.order_items || []
        
        // Calculate current demand (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const recentOrders = orderItems.filter(item => 
          new Date(item.created_at) >= thirtyDaysAgo
        )
        
        const currentDemand = recentOrders.reduce((sum, item) => sum + item.quantity, 0)
        
        // Analyze trends
        const demandTrend = this.analyzeDemandTrend(orderItems)
        const seasonality = this.getSeasonality(product.category)
        
        // Predict future demand
        let predictedDemand = currentDemand
        let trendDirection: 'increasing' | 'stable' | 'decreasing' = 'stable'
        
        if (demandTrend > 0.1) {
          predictedDemand *= 1.2
          trendDirection = 'increasing'
        } else if (demandTrend < -0.1) {
          predictedDemand *= 0.8
          trendDirection = 'decreasing'
        }
        
        // Apply seasonal adjustments
        if (seasonality === 'high') {
          predictedDemand *= 1.3
        } else if (seasonality === 'low') {
          predictedDemand *= 0.7
        }
        
        const demandChange = predictedDemand - currentDemand
        const recommendedStock = Math.ceil(predictedDemand * 1.2) // 20% buffer
        
        forecasts.push({
          productId: product.id,
          productName: product.name,
          currentDemand,
          predictedDemand: Math.round(predictedDemand),
          demandChange: Math.round(demandChange),
          seasonality,
          trendDirection,
          confidence: 0.7,
          recommendedStock
        })
      }
      
      return forecasts.sort((a, b) => b.predictedDemand - a.predictedDemand)
    } catch (error) {
      console.error('Error forecasting demand:', error)
      return []
    }
  }

  // Smart Recommendations
  async getSmartRecommendations(userId: string, context: {
    type: 'product_view' | 'cart' | 'order_history' | 'search'
    entityId?: string
    metadata?: Record<string, any>
  }): Promise<SmartRecommendation[]> {
    try {
      const recommendations: SmartRecommendation[] = []
      
      // Get user's order history
      const { data: userOrders } = await supabase
        .from('orders')
        .select(`
          order_items(
            product_id,
            product_name,
            quantity
          )
        `)
        .eq('customer_id', userId)
        .limit(10)
      
      // Get user's viewed products
      const { data: viewedProducts } = await supabase
        .from('analytics_events')
        .select('entity_id, properties')
        .eq('user_id', userId)
        .eq('event_type', 'product_view')
        .limit(20)
      
      // Collaborative filtering recommendations
      const collaborativeRecs = await this.getCollaborativeRecommendations(userId)
      recommendations.push(...collaborativeRecs)
      
      // Content-based recommendations
      if (context.entityId) {
        const contentRecs = await this.getContentBasedRecommendations(context.entityId)
        recommendations.push(...contentRecs)
      }
      
      // Trending products
      const trendingRecs = await this.getTrendingRecommendations()
      recommendations.push(...trendingRecs)
      
      // Bundle recommendations
      const bundleRecs = await this.getBundleRecommendations(userId)
      recommendations.push(...bundleRecs)
      
      // Sort by score and return top 10
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    } catch (error) {
      console.error('Error getting recommendations:', error)
      return []
    }
  }

  // Helper methods
  private getMaterialRates(projectType: string) {
    const rates = {
      residential: {
        cement: 0.4, // bags per sq ft
        steel: 4, // kg per sq ft
        bricks: 8, // pieces per sq ft
        sand: 1.2 // cubic ft per sq ft
      },
      commercial: {
        cement: 0.5,
        steel: 6,
        bricks: 10,
        sand: 1.5
      },
      renovation: {
        cement: 0.2,
        steel: 2,
        bricks: 4,
        sand: 0.8
      }
    }
    
    return rates[projectType as keyof typeof rates] || rates.residential
  }

  private async estimateMaterial(material: string, quantity: number, unit: string): Promise<MaterialEstimate> {
    // Get current market prices
    const { data: products } = await supabase
      .from('products')
      .select('price, name')
      .ilike('name', `%${material}%`)
      .limit(10)
    
    const prices = products?.map(p => p.price) || [1000] // Default price
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    return {
      category: material,
      material: material,
      quantity,
      unit,
      estimatedPrice: quantity * avgPrice,
      priceRange: {
        min: quantity * minPrice,
        max: quantity * maxPrice
      },
      confidence: 0.8,
      alternatives: []
    }
  }

  private estimateTimeline(type: string, area: number, floors: number) {
    const baseTime = type === 'renovation' ? 30 : 90 // days
    const areaFactor = area / 1000 // per 1000 sq ft
    const floorFactor = floors * 0.2
    
    const estimated = Math.ceil(baseTime * (1 + areaFactor + floorFactor))
    
    return {
      estimated,
      phases: [
        { name: 'Foundation', duration: Math.ceil(estimated * 0.2), materials: ['cement', 'steel', 'sand'] },
        { name: 'Structure', duration: Math.ceil(estimated * 0.4), materials: ['cement', 'steel', 'bricks'] },
        { name: 'Finishing', duration: Math.ceil(estimated * 0.4), materials: ['tiles', 'paint', 'fixtures'] }
      ]
    }
  }

  private analyzePriceTrends(priceHistory: any[]) {
    if (priceHistory.length < 2) return { trend: 0 }
    
    const recent = priceHistory.slice(0, 5)
    const older = priceHistory.slice(5, 10)
    
    const recentAvg = recent.reduce((sum, p) => sum + p.price, 0) / recent.length
    const olderAvg = older.reduce((sum, p) => sum + p.price, 0) / older.length
    
    const trend = olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0
    
    return { trend }
  }

  private async getSeasonalFactors(productId: string) {
    // Simplified seasonal analysis
    const month = new Date().getMonth()
    const isHighSeason = month >= 9 || month <= 2 // Oct-Feb (construction season in India)
    
    return { isHighSeason }
  }

  private async getMarketFactors() {
    // Simplified market factors
    return { inflation: 0.02 } // 2% annual inflation
  }

  private analyzeDemandTrend(orderItems: any[]) {
    if (orderItems.length < 4) return 0
    
    // Simple linear trend analysis
    const recent = orderItems.slice(0, orderItems.length / 2)
    const older = orderItems.slice(orderItems.length / 2)
    
    const recentSum = recent.reduce((sum, item) => sum + item.quantity, 0)
    const olderSum = older.reduce((sum, item) => sum + item.quantity, 0)
    
    return olderSum > 0 ? (recentSum - olderSum) / olderSum : 0
  }

  private getSeasonality(category: string): 'high' | 'medium' | 'low' {
    const highSeasonCategories = ['cement', 'steel', 'bricks']
    const lowSeasonCategories = ['paint', 'tiles']
    
    if (highSeasonCategories.some(cat => category.toLowerCase().includes(cat))) {
      return 'high'
    } else if (lowSeasonCategories.some(cat => category.toLowerCase().includes(cat))) {
      return 'low'
    }
    
    return 'medium'
  }

  private async getCollaborativeRecommendations(userId: string): Promise<SmartRecommendation[]> {
    // Simplified collaborative filtering
    return [
      {
        type: 'product',
        id: 'rec-1',
        title: 'Customers also bought',
        description: 'Based on similar customer purchases',
        score: 0.9,
        reason: 'Users with similar purchase history also bought these items',
        metadata: {}
      }
    ]
  }

  private async getContentBasedRecommendations(entityId: string): Promise<SmartRecommendation[]> {
    // Simplified content-based filtering
    return [
      {
        type: 'product',
        id: 'rec-2',
        title: 'Similar products',
        description: 'Products similar to what you viewed',
        score: 0.8,
        reason: 'Similar category and specifications',
        metadata: {}
      }
    ]
  }

  private async getTrendingRecommendations(): Promise<SmartRecommendation[]> {
    return [
      {
        type: 'product',
        id: 'rec-3',
        title: 'Trending now',
        description: 'Popular products this week',
        score: 0.7,
        reason: 'High demand and positive reviews',
        metadata: {}
      }
    ]
  }

  private async getBundleRecommendations(userId: string): Promise<SmartRecommendation[]> {
    return [
      {
        type: 'bundle',
        id: 'rec-4',
        title: 'Complete project bundle',
        description: 'Everything you need for your project',
        score: 0.85,
        reason: 'Save 15% when buying together',
        metadata: { discount: 15 }
      }
    ]
  }
}

export const aiService = new AIService()
