'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  SearchIcon,
  FilterIcon,
  MapPinIcon,
  IndianRupeeIcon,
  TagIcon,
  StarIcon,
  XIcon,
  SlidersIcon
} from 'lucide-react'

export interface SearchFilters {
  query: string
  location: {
    city?: string
    state?: string
    radius?: number // in km
    coordinates?: { lat: number; lng: number }
  }
  priceRange: {
    min: number
    max: number
  }
  categories: string[]
  availability: 'all' | 'in_stock' | 'out_of_stock'
  rating: {
    min: number
  }
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'distance' | 'newest'
  vendors: string[]
  features: string[]
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
  searchType: 'products' | 'contractors' | 'vendors'
}

const defaultFilters: SearchFilters = {
  query: '',
  location: {
    radius: 25
  },
  priceRange: {
    min: 0,
    max: 100000
  },
  categories: [],
  availability: 'all',
  rating: {
    min: 0
  },
  sortBy: 'relevance',
  vendors: [],
  features: []
}

const categories = [
  'Cement', 'Steel', 'Bricks', 'Sand', 'Aggregates', 'Tiles', 'Paint',
  'Electrical', 'Plumbing', 'Hardware', 'Roofing', 'Insulation', 'Doors & Windows'
]

const contractorCategories = [
  'Residential Construction', 'Commercial Construction', 'Renovation',
  'Interior Design', 'Electrical Work', 'Plumbing', 'Roofing', 'Painting',
  'Flooring', 'HVAC', 'Landscaping', 'Structural Work'
]

const features = [
  'Free Delivery', 'Bulk Discount', 'Quality Certified', 'Express Delivery',
  'Installation Service', 'Warranty Included', 'Return Policy', 'EMI Available'
]

const contractorFeatures = [
  'Licensed', 'Insured', 'Emergency Service', 'Free Estimate',
  'Warranty Provided', 'Eco-Friendly', 'Experienced Team', 'Quick Response'
]

const sortOptions = {
  products: [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ],
  contractors: [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'newest', label: 'Recently Joined' }
  ],
  vendors: [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'newest', label: 'Recently Joined' }
  ]
}

export function AdvancedSearch({ onFiltersChange, initialFilters, searchType }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    ...defaultFilters,
    ...initialFilters
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Update filters and notify parent
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.query) count++
    if (filters.location.city) count++
    if (filters.categories.length > 0) count++
    if (filters.priceRange.min > 0 || filters.priceRange.max < 100000) count++
    if (filters.availability !== 'all') count++
    if (filters.rating.min > 0) count++
    if (filters.vendors.length > 0) count++
    if (filters.features.length > 0) count++
    
    setActiveFiltersCount(count)
  }, [filters])

  // Clear all filters
  const clearFilters = () => {
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  // Toggle category
  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    updateFilters({ categories: newCategories })
  }

  // Toggle feature
  const toggleFeature = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature]
    
    updateFilters({ features: newFeatures })
  }

  const relevantCategories = searchType === 'contractors' ? contractorCategories : categories
  const relevantFeatures = searchType === 'contractors' ? contractorFeatures : features

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="h-5 w-5" />
            Search & Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount} active</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <SlidersIcon className="h-4 w-4 mr-2" />
              {isExpanded ? 'Less' : 'More'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder={`Search ${searchType}...`}
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            Location
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="City"
              value={filters.location.city || ''}
              onChange={(e) => updateFilters({ 
                location: { ...filters.location, city: e.target.value }
              })}
            />
            <Input
              placeholder="State"
              value={filters.location.state || ''}
              onChange={(e) => updateFilters({ 
                location: { ...filters.location, state: e.target.value }
              })}
            />
          </div>
          
          {filters.location.city && (
            <div className="space-y-2">
              <Label className="text-sm">Search Radius: {filters.location.radius}km</Label>
              <Slider
                value={[filters.location.radius || 25]}
                onValueChange={([value]) => updateFilters({ 
                  location: { ...filters.location, radius: value }
                })}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: any) => updateFilters({ sortBy: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions[searchType].map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isExpanded && (
          <>
            <Separator />

            {/* Price Range */}
            {searchType !== 'vendors' && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <IndianRupeeIcon className="h-4 w-4" />
                  Price Range
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Min Price</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.priceRange.min}
                      onChange={(e) => updateFilters({
                        priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Max Price</Label>
                    <Input
                      type="number"
                      placeholder="100000"
                      value={filters.priceRange.max}
                      onChange={(e) => updateFilters({
                        priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <TagIcon className="h-4 w-4" />
                Categories
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {relevantCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={category} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            {searchType === 'products' && (
              <div className="space-y-3">
                <Label>Availability</Label>
                <Select
                  value={filters.availability}
                  onValueChange={(value: any) => updateFilters({ availability: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="in_stock">In Stock Only</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Rating */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <StarIcon className="h-4 w-4" />
                Minimum Rating
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[filters.rating.min]}
                  onValueChange={([value]) => updateFilters({ 
                    rating: { min: value }
                  })}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Any Rating</span>
                  <span>{filters.rating.min}+ Stars</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label>Features</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {relevantFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <Label htmlFor={feature} className="text-sm cursor-pointer">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {filters.query && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {filters.query}
                  <XIcon 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ query: '' })}
                  />
                </Badge>
              )}
              
              {filters.location.city && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {filters.location.city}
                  <XIcon 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ location: { ...filters.location, city: '' } })}
                  />
                </Badge>
              )}
              
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <XIcon 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleCategory(category)}
                  />
                </Badge>
              ))}
              
              {filters.features.map((feature) => (
                <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <XIcon 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => toggleFeature(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
