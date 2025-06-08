import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Truck } from "lucide-react";
import Link from "next/link";
import { AddToCartButton } from "@/components/shopping-cart";

const featuredMaterials = [
  {
    id: 1,
    name: "Premium Portland Cement",
    description: "High-quality cement suitable for all construction needs.",
    price: 350,
    unit: "per bag",
    category: "Cement",
    brand: "UltraTech",
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
    delivery: "2-3 days",
    discount: 10,
  },
  {
    id: 2,
    name: "TMT Steel Bars",
    description:
      "Corrosion-resistant steel bars for reinforced concrete structures.",
    price: 65,
    unit: "per kg",
    category: "Steel",
    brand: "TATA Steel",
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
    delivery: "3-5 days",
    discount: 0,
  },
  {
    id: 3,
    name: "Ceramic Floor Tiles",
    description: "Durable and stylish ceramic tiles for flooring.",
    price: 45,
    unit: "per sq.ft",
    category: "Tiles",
    brand: "Kajaria",
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
    delivery: "5-7 days",
    discount: 15,
  },
  {
    id: 4,
    name: "Exterior Paint",
    description: "Weather-resistant paint for exterior walls.",
    price: 280,
    unit: "per liter",
    category: "Paint",
    brand: "Asian Paints",
    image: "/placeholder.svg?height=200&width=200",
    inStock: true,
    delivery: "1-2 days",
    discount: 5,
  },
];

export function FeaturedMaterials() {
  return (
    <section className="py-16 px-6 bg-muted/30">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Featured Materials
            </h2>
            <p className="text-muted-foreground">
              Quality construction materials at competitive prices
            </p>
          </div>
          <Link href="/materials">
            <Button variant="outline">View All Materials</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredMaterials.map((material) => (
            <Card
              key={material.id}
              className="group relative overflow-hidden transition-all hover:shadow-lg"
            >
              {material.discount > 0 && (
                <Badge className="absolute top-3 left-3 z-10 bg-red-500">
                  {material.discount}% OFF
                </Badge>
              )}

              <div className="aspect-square bg-muted overflow-hidden">
                <img
                  src={material.image || "/placeholder.svg"}
                  alt={material.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="mb-2">
                    {material.category}
                  </Badge>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg">{material.name}</CardTitle>
                <CardDescription className="text-sm">
                  {material.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {material.discount > 0 ? (
                      <>
                        <span className="text-lg font-bold">
                          ₹
                          {Math.round(
                            material.price * (1 - material.discount / 100)
                          )}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{material.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        ₹{material.price}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {material.unit}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Brand: {material.brand}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <Truck className="h-3 w-3" />
                    <span>Delivery: {material.delivery}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <AddToCartButton
                  product={{
                    id: `featured-${material.id}`,
                    name: material.name,
                    price:
                      material.discount > 0
                        ? Math.round(
                            material.price * (1 - material.discount / 100)
                          )
                        : material.price,
                    image: material.image,
                    unit: material.unit.replace("per ", ""),
                    vendorId: `vendor-${material.brand
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`,
                    vendorName: material.brand,
                    availability: material.inStock
                      ? "in_stock"
                      : "out_of_stock",
                    gstRate: 18,
                    deliveryCharges: 50,
                  }}
                  quantity={1}
                  className="flex-1"
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
