import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { MarketplaceStats } from "@/components/marketplace-stats";
import { FeaturedContractors } from "@/components/featured-contractors";
import { FeaturedMaterials } from "@/components/featured-materials";
import { LocationBasedVendors } from "@/components/location-based-vendors";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { TrustIndicators } from "@/components/trust-indicators";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <MarketplaceStats />
        <HowItWorks />
        <FeaturedContractors />
        <div className="container py-16">
          <LocationBasedVendors />
        </div>
        <FeaturedMaterials />
        <Testimonials />
        <TrustIndicators />
      </main>
      <Footer />
    </div>
  );
}
