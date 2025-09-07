"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { MarketplaceSearch } from "@/components/marketplace-search";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  StarIcon,
  MapPinIcon,
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

// ✅ Force this page to render dynamically (avoids static build error)
export const dynamic = "force-dynamic";

function SearchContent() {
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
    const fetchResults = async () => {
      setLoading(true);

      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: "1",
          type: "contractor",
          title: "ABC Construction Services",
          description:
            "Professional residential and commercial construction with 15+ years experience.",
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
            "High-quality Portland cement suitable for all construction needs.",
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
            "Wholesale supplier of construction materials with wide range of products.",
          image: "/placeholder.svg?height=200&width=300",
          rating: 4.6,
          reviewCount: 203,
          location: "Delhi, India",
          verified: true,
          category: "Building Materials",
          tags: ["Wholesale", "Wide Range", "Trusted"],
        },
      ];

      // Filtering
      let filteredResults = mockResults;

      if (query) {
        filteredResults = filteredResults.filter(
          (r) =>
            r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.description.toLowerCase().includes(query.toLowerCase()) ||
            r.tags?.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase())
            )
        );
      }

      if (type !== "all") {
        const searchType = type.endsWith("s") ? type.slice(0, -1) : type;
        filteredResults = filteredResults.filter((r) => r.type === searchType);
      }

      if (rating !== "0") {
        filteredResults = filteredResults.filter(
          (r) => (r.rating || 0) >= parseInt(rating)
        );
      }

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

  const getResultLink = (r: SearchResult) => {
    switch (r.type) {
      case "contractor":
        return `/contractors/${r.id}`;
      case "vendor":
        return `/vendors/${r.id}`;
      case "product":
        return `/products/${r.id}`;
      default:
        return "#";
    }
  };

  return (
    <main className="flex-1 container py-6">
      {/* Search Header */}
      <div className="mb-6">
        <MarketplaceSearch
          placeholder="Search contractors, materials, or services..."
          showFilters
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
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {results.map((r) => (
            <Card key={r.id} className="hover:shadow-lg transition-shadow">
              <Link href={getResultLink(r)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{r.title}</h3>
                    {r.verified && (
                      <Badge variant="secondary" className="ml-2">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {r.description}
                  </p>
                  {r.price && (
                    <div className="font-semibold text-green-600">
                      ₹{r.price.toLocaleString()}
                    </div>
                  )}
                  {r.type === "product" && r.price && (
                    <AddToCartButton
                      product={{
                        id: r.id,
                        name: r.title,
                        price: r.price,
                        image: r.image || "/placeholder.svg",
                        unit: "piece",
                        vendorId: "vendor-1",
                        vendorName: "Search Vendor",
                        availability: "in_stock",
                        gstRate: 18,
                        deliveryCharges: 50,
                      }}
                      quantity={1}
                      className="mt-2"
                    />
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FilterIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <Button variant="outline">Clear all filters</Button>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {/* ✅ Wrap search content in Suspense */}
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
