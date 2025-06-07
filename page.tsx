import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { FeaturedContractors } from "@/components/featured-contractors"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <FeaturedContractors />
      </main>
      <Footer />
    </div>
  )
}
