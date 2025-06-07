import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Package, MapPin, Clock, Shield } from "lucide-react"

export function MarketplaceStats() {
  const stats = [
    {
      icon: Users,
      title: "Active Users",
      value: "100K+",
      description: "Contractors, vendors & customers",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Package,
      title: "Products Listed",
      value: "50K+",
      description: "Construction materials & tools",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: TrendingUp,
      title: "Monthly Transactions",
      value: "₹50Cr+",
      description: "Total marketplace volume",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: MapPin,
      title: "Cities Covered",
      value: "500+",
      description: "Across India",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      icon: Clock,
      title: "Avg. Delivery",
      value: "2-3 Days",
      description: "For materials",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      icon: Shield,
      title: "Success Rate",
      value: "98%",
      description: "Project completion",
      color: "text-teal-600",
      bgColor: "bg-teal-100",
    },
  ]

  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Powering India's Construction Industry</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of contractors, vendors, and customers who trust our platform for their construction needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div
                  className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.title}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
