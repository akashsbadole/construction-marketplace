"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { MarketplaceSearch } from "@/components/marketplace-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  StarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  TruckIcon,
  PackageIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
} from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/shopping-cart";

interface SearchResult {
  id: string;
  type: "product" | "contractor" | "vendor";
  title: string;
  description: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  price?: number;
  category?: string;
  verified?: boolean;
  tags?: string[];
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  const category = searchParams.get("category") || "all";
  const rating = searchParams.get("rating") || "0";
  const sort = searchParams.get("sort") || "relevance";

  useEffect(() => {
    // Simulate API call to fetch search results
    const fetchResults = async () => {
      setLoading(true);

      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "contractor",
          title: "ABC Construction Services",
          description:
            "Professional residential and commercial construction with 15+ years experience. Specializing in modern architecture and sustainable building practices.",
          image: "/placeholder.svg?height=200&width=300",
          rating: 4.8,
          reviewCount: 127,
          location: "Delhi, India",
          verified: true,
          category: "Construction",
          tags: ["Residential", "Commercial", "Renovation"],
        },
        {
          id: "2",
          type: "product",
          title: "Premium Portland Cement - 50kg",
          description:
            "High-quality Portland cement suitable for all construction needs. Meets IS standards and provides excellent strength.",
          image: "/placeholder.svg?height=200&width=300",
          price: 450,
          rating: 4.5,
          reviewCount: 89,
          location: "Delhi, India",
          category: "Cement",
          tags: ["Portland", "IS Standard", "High Strength"],
        },
        {
          id: "3",
          type: "vendor",
          title: "Delhi Building Materials Hub",
          description:
            "Wholesale supplier of construction materials with wide range of products. Serving Delhi NCR for over 20 years.",
          image: "/placeholder.svg?height=200&width=300",
          rating: 4.6,
          reviewCount: 203,
          location: "Delhi, India",
          verified: true,
          category: "Building Materials",
          tags: ["Wholesale", "Wide Range", "Trusted"],
        },
        {
          id: "4",
          type: "contractor",
          title: "Modern Interiors & Design",
          description:
            "Contemporary interior design and renovation services. Transform your space with our expert team.",
          image: "/placeholder.svg?height=200&width=300",
          rating: 4.9,
          reviewCount: 156,
          location: "Mumbai, India",
          verified: true,
          category: "Interior Design",
          tags: ["Modern", "Contemporary", "Renovation"],
        },
        {
          id: "5",
          type: "product",
          title: "Steel TMT Bars - Grade 500",
          description:
            "High-grade TMT steel bars for construction. Corrosion resistant and earthquake resistant properties.",
          image: "/placeholder.svg?height=200&width=300",
          price: 65000,
          rating: 4.7,
          reviewCount: 45,
          location: "Mumbai, India",
          category: "Steel",
          tags: ["TMT", "Grade 500", "Earthquake Resistant"],
        },
      ];

      // Filter results based on search parameters
      let filteredResults = mockResults;

      if (query) {
        filteredResults = filteredResults.filter(
          (result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase()) ||
            result.tags?.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase())
            )
        );
      }

      if (type !== "all") {
        const searchType = type.endsWith("s") ? type.slice(0, -1) : type;
        filteredResults = filteredResults.filter(
          (result) => result.type === searchType
        );
      }

      if (rating !== "0") {
        filteredResults = filteredResults.filter(
          (result) => (result.rating || 0) >= parseInt(rating)
        );
      }

      // Sort results
      switch (sort) {
        case "rating":
          filteredResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case "price_low":
          filteredResults.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "price_high":
          filteredResults.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        default:
          // Keep relevance order
          break;
      }

      setResults(filteredResults);
      setLoading(false);
    };

    fetchResults();
  }, [query, type, category, rating, sort]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case "contractor":
        return <UserIcon className="h-5 w-5" />;
      case "vendor":
        return <TruckIcon className="h-5 w-5" />;
      case "product":
        return <PackageIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case "contractor":
        return `/contractors/${result.id}`;
      case "vendor":
        return `/vendors/${result.id}`;
      case "product":
        return `/products/${result.id}`;
      default:
        return "#";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container py-6">
        {/* Search Header */}
        <div className="mb-6">
          <MarketplaceSearch
            placeholder="Search contractors, materials, or services..."
            showFilters={true}
            className="w-full max-w-2xl"
          />
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {query ? `Search results for "${query}"` : "Browse marketplace"}
            </h1>
            <p className="text-muted-foreground">
              {loading ? "Searching..." : `${results.length} results found`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted rounded" />
                    <div className="h-6 w-20 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {results.map((result) => (
              <Card
                key={result.id}
                className="hover:shadow-lg transition-shadow"
              >
                <Link href={getResultLink(result)}>
                  {viewMode === "grid" ? (
                    <>
                      <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                        {getResultIcon(result.type)}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold line-clamp-1">
                            {result.title}
                          </h3>
                          {result.verified && (
                            <Badge variant="secondary" className="ml-2">
                              Verified
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {result.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          {result.rating && (
                            <div className="flex items-center gap-1">
                              <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{result.rating}</span>
                              {result.reviewCount && (
                                <span>({result.reviewCount})</span>
                              )}
                            </div>
                          )}
                          {result.location && (
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="h-4 w-4" />
                              <span>{result.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="capitalize">
                            {result.type}
                          </Badge>
                          {result.price && (
                            <div className="font-semibold text-green-600">
                              ₹{result.price.toLocaleString()}
                            </div>
                          )}
                        </div>

                        {/* Add to Cart for products */}
                        {result.type === "product" && result.price && (
                          <div className="mt-3">
                            <AddToCartButton
                              product={{
                                id: result.id,
                                name: result.title,
                                price: result.price,
                                image: result.image || "/placeholder.svg",
                                unit: "piece",
                                vendorId: "vendor-1",
                                vendorName: "Search Vendor",
                                availability: "in_stock",
                                gstRate: 18,
                                deliveryCharges: 50,
                              }}
                              quantity={1}
                              className="w-full"
                            />
                          </div>
                        )}
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          {getResultIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{result.title}</h3>
                            <div className="flex items-center gap-2">
                              {result.verified && (
                                <Badge variant="secondary">Verified</Badge>
                              )}
                              <Badge variant="outline" className="capitalize">
                                {result.type}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {result.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {result.rating && (
                                <div className="flex items-center gap-1">
                                  <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>
                                    {result.rating} ({result.reviewCount})
                                  </span>
                                </div>
                              )}
                              {result.location && (
                                <div className="flex items-center gap-1">
                                  <MapPinIcon className="h-4 w-4" />
                                  <span>{result.location}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              {result.price && (
                                <div className="font-semibold text-green-600">
                                  ₹{result.price.toLocaleString()}
                                </div>
                              )}
                              {/* Add to Cart for products in list view */}
                              {result.type === "product" && result.price && (
                                <AddToCartButton
                                  product={{
                                    id: result.id,
                                    name: result.title,
                                    price: result.price,
                                    image: result.image || "/placeholder.svg",
                                    unit: "piece",
                                    vendorId: "vendor-1",
                                    vendorName: "Search Vendor",
                                    availability: "in_stock",
                                    gstRate: 18,
                                    deliveryCharges: 50,
                                  }}
                                  quantity={1}
                                  className="shrink-0"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <FilterIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button variant="outline">Clear all filters</Button>
          </div>
        )}
      </main>
    </div>
  );
}
