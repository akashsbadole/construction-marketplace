import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, ShoppingCart, Truck, Star, Shield } from "lucide-react"
import Link from "next/link"

export function HowItWorks() {
  const customerSteps = [
    {
      icon: Search,
      title: "Search & Compare",
      description: "Find contractors and materials with detailed profiles, ratings, and competitive pricing",
    },
    {
      icon: MessageCircle,
      title: "Connect & Negotiate",
      description: "Chat directly with contractors, get quotes, and negotiate terms through our platform",
    },
    {
      icon: ShoppingCart,
      title: "Book & Buy",
      description: "Secure payments, place orders for materials, and book contractor services",
    },
    {
      icon: Truck,
      title: "Track & Receive",
      description: "Monitor project progress and material deliveries in real-time",
    },
  ]

  const contractorSteps = [
    {
      icon: Shield,
      title: "Get Verified",
      description: "Complete verification process to build trust with customers",
    },
    {
      icon: Search,
      title: "Find Projects",
      description: "Browse and bid on projects that match your expertise",
    },
    {
      icon: MessageCircle,
      title: "Submit Proposals",
      description: "Send detailed proposals and communicate with project owners",
    },
    {
      icon: Star,
      title: "Deliver & Earn",
      description: "Complete projects, get paid securely, and build your reputation",
    },
  ]

  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How Our Marketplace Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and efficient process for all your construction needs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Customers */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">For Customers</h3>
              <p className="text-muted-foreground">Get your construction project done hassle-free</p>
            </div>

            <div className="space-y-6">
              {customerSteps.map((step, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-8 top-16 w-px h-6 bg-border" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/post-project">
                <Button size="lg">Start Your Project</Button>
              </Link>
            </div>
          </div>

          {/* For Contractors */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">For Contractors</h3>
              <p className="text-muted-foreground">Grow your business with quality projects</p>
            </div>

            <div className="space-y-6">
              {contractorSteps.map((step, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 text-green-600 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{step.title}</h4>
                        <p className="text-muted-foreground text-sm">{step.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-8 top-16 w-px h-6 bg-border" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/join-as-contractor">
                <Button size="lg" variant="outline">
                  Join as Contractor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
