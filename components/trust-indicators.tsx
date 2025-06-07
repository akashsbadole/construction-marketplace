import { Card, CardContent } from "@/components/ui/card"
import { Shield, Award, Clock, Headphones, CreditCard, Truck } from "lucide-react"

export function TrustIndicators() {
  const indicators = [
    {
      icon: Shield,
      title: "Verified Contractors",
      description: "All contractors are background verified and certified",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% quality guarantee on all materials and services",
    },
    {
      icon: Clock,
      title: "On-Time Delivery",
      description: "98% on-time delivery rate across all orders",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Bank-grade security for all transactions",
    },
    {
      icon: Truck,
      title: "Pan-India Delivery",
      description: "Delivery to 500+ cities across India",
    },
  ]

  return (
    <section className="py-16 px-6 bg-primary/5">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose BuildConnect?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner for all construction needs with industry-leading standards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indicators.map((indicator, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <indicator.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">{indicator.title}</h3>
                <p className="text-muted-foreground text-sm">{indicator.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
