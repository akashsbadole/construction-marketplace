'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  StarIcon,
  TruckIcon,
  UserIcon,
  PackageIcon,
  LoaderIcon,
  XIcon
} from 'lucide-react'
import { useLocation } from '@/lib/contexts/location-context'
import { marketplaceService } from '@/lib/services/marketplace-service'

interface SearchResult {
  id: string
  type: 'product' | 'contractor' | 'vendor'
  title: string
  description: string
  image?: string
  rating?: number
  location?: string
  price?: number
  category?: string
  verified?: boolean
}

interface SearchFilters {
  type: 'all' | 'products' | 'contractors' | 'vendors'
  category: string
  location: string
  priceRange: [number, number]
  rating: number
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'distance'
}

interface MarketplaceSearchProps {
  placeholder?: string
  showFilters?: boolean
  onSearch?: (query: string, filters: SearchFilters) => void
  className?: string
}

const defaultFilters: SearchFilters = {
  type: 'all',
  category: 'all',
  location: 'all',
  priceRange: [0, 100000],
  rating: 0,
  sortBy: 'relevance'
}

export function MarketplaceSearch({ 
  placeholder = "Search contractors, materials, services...",
  showFilters = true,
  onSearch,
  className = ""
}: MarketplaceSearchProps) {
  const router = useRouter()
  const { currentLocation } = useLocation()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showFiltersDialog, setShowFiltersDialog] = useState(false)

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    try {
      // Mock search results - replace with actual API calls
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'contractor',
          title: 'ABC Construction',
          description: 'Professional residential and commercial construction services',
          rating: 4.8,
          location: 'Delhi, India',
          verified: true,
          category: 'Construction'
        },
        {
          id: '2',
          type: 'product',
          title: 'Premium Cement - 50kg',
          description: 'High-quality Portland cement for construction',
          price: 450,
          rating: 4.5,
          location: 'Delhi, India',
          category: 'Cement'
        },
        {
          id: '3',
          type: 'vendor',
          title: 'Delhi Building Materials',
          description: 'Wholesale supplier of construction materials',
          rating: 4.6,
          location: 'Delhi, India',
          verified: true,
          category: 'Building Materials'
        }
      ]

      // Filter results based on search query and filters
      let filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (searchFilters.type !== 'all') {
        filteredResults = filteredResults.filter(result => 
          result.type === searchFilters.type.slice(0, -1) // Remove 's' from 'products', 'contractors', 'vendors'
        )
      }

      if (searchFilters.rating > 0) {
        filteredResults = filteredResults.filter(result => 
          (result.rating || 0) >= searchFilters.rating
        )
      }

      setResults(filteredResults)
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        performSearch(query, filters)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, filters, performSearch])

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, filters)
    } else {
      // Navigate to search results page
      const searchParams = new URLSearchParams({
        q: query,
        type: filters.type,
        category: filters.category,
        location: filters.location,
        rating: filters.rating.toString(),
        sort: filters.sortBy
      })
      router.push(`/search?${searchParams.toString()}`)
    }
    setShowResults(false)
  }

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false)
    
    // Navigate to appropriate page based on result type
    switch (result.type) {
      case 'contractor':
        router.push(`/contractors/${result.id}`)
        break
      case 'vendor':
        router.push(`/vendors/${result.id}`)
        break
      case 'product':
        router.push(`/products/${result.id}`)
        break
    }
  }

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'contractor':
        return <UserIcon className="h-4 w-4" />
      case 'vendor':
        return <TruckIcon className="h-4 w-4" />
      case 'product':
        return <PackageIcon className="h-4 w-4" />
      default:
        return <SearchIcon className="h-4 w-4" />
    }
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'all' && value !== 0 && value !== 'relevance' && 
    !(Array.isArray(value) && value[0] === 0 && value[1] === 100000)
  ).length

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
          {isLoading && (
            <LoaderIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        
        {showFilters && (
          <Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Search Filters</DialogTitle>
                <DialogDescription>
                  Refine your search results
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Search Type</label>
                  <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="contractors">Contractors</SelectItem>
                      <SelectItem value="vendors">Vendors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="materials">Building Materials</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <Select value={filters.rating.toString()} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value: any) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="distance">Nearest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters(defaultFilters)}
                    className="flex-1"
                  >
                    Clear All
                  </Button>
                  <Button 
                    onClick={() => setShowFiltersDialog(false)}
                    className="flex-1"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-4 hover:bg-accent cursor-pointer border-b last:border-b-0"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getResultIcon(result.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{result.title}</h4>
                      {result.verified && (
                        <Badge variant="secondary" className="text-xs">Verified</Badge>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {result.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {result.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {result.rating && (
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{result.rating}</span>
                        </div>
                      )}
                      {result.location && (
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{result.location}</span>
                        </div>
                      )}
                      {result.price && (
                        <div className="font-medium text-green-600">
                          ₹{result.price.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-3 border-t bg-muted/50">
              <Button variant="ghost" size="sm" onClick={handleSearch} className="w-full">
                View all results for "{query}"
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click outside to close results */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}
