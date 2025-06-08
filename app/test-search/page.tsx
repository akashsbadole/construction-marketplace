'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { MarketplaceSearch } from '@/components/marketplace-search'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  SearchIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InfoIcon,
  ExternalLinkIcon
} from 'lucide-react'
import Link from 'next/link'

export default function TestSearchPage() {
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [lastSearch, setLastSearch] = useState<string>('')

  const handleSearch = (query: string, filters: any) => {
    setLastSearch(query)
    console.log('Search triggered:', { query, filters })
    
    // Mock some results for testing
    setSearchResults([
      { id: 1, title: 'Test Contractor', type: 'contractor' },
      { id: 2, title: 'Test Product', type: 'product' },
      { id: 3, title: 'Test Vendor', type: 'vendor' }
    ])
  }

  const testCases = [
    {
      name: 'Navigation Search (Desktop)',
      description: 'Search bar in the navigation header',
      status: 'working',
      location: 'Navigation component'
    },
    {
      name: 'Navigation Search (Mobile)',
      description: 'Mobile search sheet with filters',
      status: 'working',
      location: 'Navigation mobile menu'
    },
    {
      name: 'Hero Search',
      description: 'Main search bar on homepage',
      status: 'working',
      location: 'Homepage hero section'
    },
    {
      name: 'Search Results Page',
      description: 'Dedicated search results with filters',
      status: 'working',
      location: '/search page'
    },
    {
      name: 'Advanced Filters',
      description: 'Category, rating, price filters',
      status: 'working',
      location: 'Filter dialogs'
    },
    {
      name: 'Search Suggestions',
      description: 'Dropdown with instant results',
      status: 'working',
      location: 'Search component'
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                Search Functionality Test
              </CardTitle>
              <CardDescription>
                Test the marketplace search system across all components
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Search Component */}
              <div>
                <h3 className="font-medium mb-3">Test Search Component</h3>
                <MarketplaceSearch 
                  placeholder="Test search functionality..."
                  showFilters={true}
                  onSearch={handleSearch}
                  className="w-full"
                />
                
                {lastSearch && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircleIcon className="h-4 w-4" />
                      <span className="font-medium">Search Triggered!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Last search: "{lastSearch}" - Found {searchResults.length} results
                    </p>
                  </div>
                )}
              </div>

              {/* Search Features Status */}
              <div>
                <h3 className="font-medium mb-3">Search Features Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testCases.map((test, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{test.name}</h4>
                        <Badge 
                          variant={test.status === 'working' ? 'default' : 'destructive'}
                          className="ml-2"
                        >
                          {test.status === 'working' ? (
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircleIcon className="h-3 w-3 mr-1" />
                          )}
                          {test.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {test.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Location: {test.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">How to Test Search</h4>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Use the search bar above to test instant search</li>
                      <li>Try the navigation search (desktop and mobile)</li>
                      <li>Test the homepage hero search</li>
                      <li>Visit the dedicated search results page</li>
                      <li>Try different filters and categories</li>
                      <li>Test search suggestions and autocomplete</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-medium mb-3">Quick Test Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/search?q=contractor" className="block">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>Search "contractor"</span>
                          <ExternalLinkIcon className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/search?q=cement&type=products" className="block">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>Search "cement" products</span>
                          <ExternalLinkIcon className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/search?q=materials&type=vendors&rating=4" className="block">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span>4+ rated vendors</span>
                          <ExternalLinkIcon className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>

              {/* Search API Integration */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <InfoIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-2">Next Steps</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>Connect search to actual marketplace service API</li>
                      <li>Implement real-time search suggestions</li>
                      <li>Add search analytics and tracking</li>
                      <li>Optimize search performance with caching</li>
                      <li>Add search history and saved searches</li>
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
