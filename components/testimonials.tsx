import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Homeowner",
    location: "Delhi",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "BuildConnect made my home renovation so easy! Found a great contractor, ordered all materials online, and tracked everything in one place. Highly recommended!",
  },
  {
    name: "Priya Sharma",
    role: "Interior Designer",
    location: "Mumbai",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "As a designer, I need reliable suppliers. This platform has the best material vendors with competitive prices and fast delivery. Game changer for my business!",
  },
  {
    name: "Amit Patel",
    role: "Contractor",
    location: "Bangalore",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "I've grown my contracting business 3x using this platform. Quality leads, fair bidding process, and secure payments. Best decision I made for my business.",
  },
  {
    name: "Sunita Reddy",
    role: "Property Developer",
    location: "Hyderabad",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    content:
      "Managing multiple construction projects is now seamless. The vendor network is extensive and the quality control is excellent. Saves me time and money.",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers, contractors, and vendors who trust our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/20 mb-4" />

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">"{testimonial.content}"</p>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
