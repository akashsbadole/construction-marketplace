import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, Users, Package, Star, Shield } from "lucide-react";
import { MarketplaceSearch } from "@/components/marketplace-search";

export function Hero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-6">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Shield className="h-3 w-3 mr-1" />
              Trusted Platform
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Users className="h-3 w-3 mr-1" />
              10,000+ Contractors
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">
              <Package className="h-3 w-3 mr-1" />
              50,000+ Materials
            </Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            India's Largest
            <span className="text-primary block">Construction Marketplace</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            Connect with verified contractors, buy quality materials, and manage
            your construction projects all in one place. From planning to
            completion, we've got you covered.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <MarketplaceSearch
              placeholder="Search contractors, materials, or services..."
              showFilters={true}
              className="w-full"
            />
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/post-project">
              <Button size="lg" className="rounded-full px-8">
                Post Your Project
              </Button>
            </Link>
            <Link href="/contractors">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Find Contractors
              </Button>
            </Link>
            <Link href="/materials">
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Buy Materials
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">
                Verified Contractors
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">
                Quality Materials
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">25K+</div>
              <div className="text-sm text-muted-foreground">
                Projects Completed
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
