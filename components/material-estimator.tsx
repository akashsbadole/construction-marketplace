"use client";

import { useState } from "react";
import { aiService, ProjectEstimate } from "@/lib/services/ai-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  CalculatorIcon,
  HomeIcon,
  BuildingIcon,
  WrenchIcon,
  IndianRupeeIcon,
  ClockIcon,
  TrendingUpIcon,
  PackageIcon,
  AlertCircleIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { AddToCartButton } from "@/components/shopping-cart";

export function MaterialEstimator() {
  const [projectDetails, setProjectDetails] = useState({
    type: "residential" as "residential" | "commercial" | "renovation",
    area: "",
    floors: "1",
    rooms: "",
    specifications: {},
  });
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { addItem } = useCartStore();

  const handleEstimate = async () => {
    if (!projectDetails.area) {
      setError("Please enter the project area");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await aiService.estimateMaterials({
        type: projectDetails.type,
        area: Number(projectDetails.area),
        floors: Number(projectDetails.floors),
        rooms: projectDetails.rooms ? Number(projectDetails.rooms) : undefined,
      });

      setEstimate(result);
    } catch (err) {
      setError("Failed to generate estimate. Please try again.");
      console.error("Estimation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProjectIcon = (type: string) => {
    switch (type) {
      case "residential":
        return <HomeIcon className="h-5 w-5" />;
      case "commercial":
        return <BuildingIcon className="h-5 w-5" />;
      case "renovation":
        return <WrenchIcon className="h-5 w-5" />;
      default:
        return <HomeIcon className="h-5 w-5" />;
    }
  };

  const handleAddAllToCart = () => {
    if (!estimate) return;

    estimate.breakdown.forEach((material, index) => {
      addItem({
        productId: `estimate-${material.material}-${index}`,
        vendorId: "ai-estimator",
        name: `${material.material} (Estimated)`,
        price: material.estimatedPrice / material.quantity, // Price per unit
        quantity: material.quantity,
        unit: material.unit,
        image: "/placeholder.svg?height=200&width=200",
        vendorName: "AI Material Estimator",
        availability: "in_stock",
        gstRate: 18,
        deliveryCharges: 50,
      });
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalculatorIcon className="h-6 w-6" />
            AI Material Estimator
          </CardTitle>
          <p className="text-muted-foreground">
            Get accurate material estimates for your construction project using
            AI-powered calculations
          </p>
        </CardHeader>
      </Card>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Type */}
            <div className="space-y-2">
              <Label htmlFor="project-type">Project Type</Label>
              <Select
                value={projectDetails.type}
                onValueChange={(value: any) =>
                  setProjectDetails((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">
                    <div className="flex items-center gap-2">
                      <HomeIcon className="h-4 w-4" />
                      Residential Construction
                    </div>
                  </SelectItem>
                  <SelectItem value="commercial">
                    <div className="flex items-center gap-2">
                      <BuildingIcon className="h-4 w-4" />
                      Commercial Construction
                    </div>
                  </SelectItem>
                  <SelectItem value="renovation">
                    <div className="flex items-center gap-2">
                      <WrenchIcon className="h-4 w-4" />
                      Renovation Project
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <Label htmlFor="area">Total Area (sq ft) *</Label>
              <Input
                id="area"
                type="number"
                placeholder="e.g., 1200"
                value={projectDetails.area}
                onChange={(e) =>
                  setProjectDetails((prev) => ({
                    ...prev,
                    area: e.target.value,
                  }))
                }
              />
            </div>

            {/* Floors */}
            <div className="space-y-2">
              <Label htmlFor="floors">Number of Floors</Label>
              <Select
                value={projectDetails.floors}
                onValueChange={(value) =>
                  setProjectDetails((prev) => ({ ...prev, floors: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Floor</SelectItem>
                  <SelectItem value="2">2 Floors</SelectItem>
                  <SelectItem value="3">3 Floors</SelectItem>
                  <SelectItem value="4">4+ Floors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rooms */}
            <div className="space-y-2">
              <Label htmlFor="rooms">Number of Rooms (Optional)</Label>
              <Input
                id="rooms"
                type="number"
                placeholder="e.g., 3"
                value={projectDetails.rooms}
                onChange={(e) =>
                  setProjectDetails((prev) => ({
                    ...prev,
                    rooms: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircleIcon className="h-4 w-4" />
              {error}
            </div>
          )}

          <Button
            onClick={handleEstimate}
            disabled={isLoading || !projectDetails.area}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generating Estimate...
              </>
            ) : (
              <>
                <CalculatorIcon className="h-4 w-4 mr-2" />
                Generate AI Estimate
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {estimate && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getProjectIcon(estimate.projectType)}
                Project Estimate Summary
                <Badge variant="secondary" className="ml-auto">
                  {Math.round(estimate.confidence * 100)}% Confidence
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatCurrency(estimate.totalEstimate)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Project Cost
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {estimate.timeline.estimated}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Days to Complete
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {estimate.area.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Square Feet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupeeIcon className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estimate.breakdown.map((material, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <PackageIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium capitalize">
                          {material.material}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {material.quantity} {material.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(material.estimatedPrice)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(material.priceRange.min)} -{" "}
                          {formatCurrency(material.priceRange.max)}
                        </div>
                      </div>

                      <AddToCartButton
                        product={{
                          id: `estimate-${material.material}-${index}`,
                          name: `${material.material} (Estimated)`,
                          price: material.estimatedPrice / material.quantity,
                          image: "/placeholder.svg?height=200&width=200",
                          unit: material.unit,
                          vendorId: "ai-estimator",
                          vendorName: "AI Material Estimator",
                          availability: "in_stock",
                          gstRate: 18,
                          deliveryCharges: 50,
                        }}
                        quantity={material.quantity}
                        className="shrink-0"
                      />
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <WrenchIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Labor Cost</h4>
                      <p className="text-sm text-muted-foreground">
                        Professional installation & work
                      </p>
                    </div>
                  </div>

                  <div className="font-semibold">
                    {formatCurrency(estimate.laborCost)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                Project Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estimate.timeline.phases.map((phase, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{phase.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {phase.duration} days
                      </span>
                    </div>

                    <Progress
                      value={
                        (phase.duration / estimate.timeline.estimated) * 100
                      }
                      className="h-2"
                    />

                    <div className="flex flex-wrap gap-1">
                      {phase.materials.map((material, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button className="flex-1" onClick={handleAddAllToCart}>
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Add All Materials to Cart
                </Button>

                <Button variant="outline" className="flex-1">
                  <TrendingUpIcon className="h-4 w-4 mr-2" />
                  Get Price Predictions
                </Button>

                <Button variant="outline">Download PDF</Button>

                <Button variant="outline">Share Estimate</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
