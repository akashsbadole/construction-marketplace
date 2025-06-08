"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image360Viewer } from "@/components/ui/360-viewer";
import {
  StarIcon,
  CalendarIcon,
  MapPinIcon,
  IndianRupeeIcon,
  ExternalLinkIcon,
} from "lucide-react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  images360?: string[];
  projectType: string;
  location: string;
  completedAt: string;
  duration: string;
  projectValue?: number;
  clientName?: string;
  clientTestimonial?: string;
  clientRating?: number;
  technologies?: string[];
  challenges?: string;
  solutions?: string;
  beforeImages?: string[];
  afterImages?: string[];
}

interface ContractorPortfolioProps {
  portfolioItems: PortfolioItem[];
  contractorName: string;
  showFilters?: boolean;
}

export function ContractorPortfolio({
  portfolioItems,
  contractorName,
  showFilters = true,
}: ContractorPortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Get unique project types for filtering
  const projectTypes = Array.from(
    new Set(portfolioItems.map((item) => item.projectType))
  );

  // Filter portfolio items
  const filteredItems =
    selectedCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.projectType === selectedCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
    });
  };

  const prepareGalleryImages = (images: string[]) => {
    return images.map((image) => ({
      original: image,
      thumbnail: image,
      originalClass: "gallery-image",
      thumbnailClass: "gallery-thumbnail",
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <p className="text-muted-foreground">
            {filteredItems.length} project
            {filteredItems.length !== 1 ? "s" : ""} completed by{" "}
            {contractorName}
          </p>
        </div>

        {showFilters && projectTypes.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Projects
            </Button>
            {projectTypes.map((type) => (
              <Button
                key={type}
                variant={selectedCategory === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="group overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">{item.projectType}</Badge>
              </div>
              {item.images360 && item.images360.length > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="bg-blue-600">
                    360°
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {item.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="h-4 w-4" />
                <span>{item.location}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>Completed {formatDate(item.completedAt)}</span>
              </div>

              {item.projectValue && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IndianRupeeIcon className="h-4 w-4" />
                  <span>{formatCurrency(item.projectValue)}</span>
                </div>
              )}

              {item.clientRating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < item.clientRating!
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({item.clientRating}/5)
                  </span>
                </div>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedItem(item)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{item.title}</DialogTitle>
                    <DialogDescription>
                      View detailed information about this project including
                      images, specifications, and timeline.
                    </DialogDescription>
                  </DialogHeader>

                  {selectedItem && (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                        {selectedItem.images360 &&
                          selectedItem.images360.length > 0 && (
                            <TabsTrigger value="360">360° View</TabsTrigger>
                          )}
                        <TabsTrigger value="testimonial">
                          Client Feedback
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold">Project Details</h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedItem.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Type:</span>
                                <p className="text-muted-foreground">
                                  {selectedItem.projectType}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">Location:</span>
                                <p className="text-muted-foreground">
                                  {selectedItem.location}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span>
                                <p className="text-muted-foreground">
                                  {selectedItem.duration}
                                </p>
                              </div>
                              <div>
                                <span className="font-medium">Completed:</span>
                                <p className="text-muted-foreground">
                                  {formatDate(selectedItem.completedAt)}
                                </p>
                              </div>
                            </div>

                            {selectedItem.projectValue && (
                              <div>
                                <span className="font-medium">
                                  Project Value:
                                </span>
                                <p className="text-lg font-semibold text-green-600">
                                  {formatCurrency(selectedItem.projectValue)}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            {selectedItem.technologies &&
                              selectedItem.technologies.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">
                                    Technologies Used
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {selectedItem.technologies.map(
                                      (tech, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {tech}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                            {selectedItem.challenges && (
                              <div>
                                <h4 className="font-semibold">Challenges</h4>
                                <p className="text-sm text-muted-foreground">
                                  {selectedItem.challenges}
                                </p>
                              </div>
                            )}

                            {selectedItem.solutions && (
                              <div>
                                <h4 className="font-semibold">Solutions</h4>
                                <p className="text-sm text-muted-foreground">
                                  {selectedItem.solutions}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="gallery">
                        <div className="space-y-4">
                          <ImageGallery
                            items={prepareGalleryImages(selectedItem.images)}
                            showThumbnails={true}
                            showPlayButton={false}
                            showFullscreenButton={true}
                            showNav={true}
                            autoPlay={false}
                          />

                          {selectedItem.beforeImages &&
                            selectedItem.afterImages && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div>
                                  <h4 className="font-semibold mb-2">Before</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {selectedItem.beforeImages.map(
                                      (image, index) => (
                                        <img
                                          key={index}
                                          src={image}
                                          alt={`Before ${index + 1}`}
                                          className="w-full h-24 object-cover rounded"
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">After</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {selectedItem.afterImages.map(
                                      (image, index) => (
                                        <img
                                          key={index}
                                          src={image}
                                          alt={`After ${index + 1}`}
                                          className="w-full h-24 object-cover rounded"
                                        />
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </TabsContent>

                      {selectedItem.images360 &&
                        selectedItem.images360.length > 0 && (
                          <TabsContent value="360">
                            <Image360Viewer
                              images={selectedItem.images360}
                              title={selectedItem.title}
                              autoRotate={false}
                              width={800}
                              height={500}
                              showControls={true}
                            />
                          </TabsContent>
                        )}

                      <TabsContent value="testimonial" className="space-y-4">
                        {selectedItem.clientTestimonial ? (
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                {selectedItem.clientRating && (
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <StarIcon
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < selectedItem.clientRating!
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}
                                {selectedItem.clientName && (
                                  <span className="font-medium">
                                    - {selectedItem.clientName}
                                  </span>
                                )}
                              </div>
                              <p className="text-muted-foreground italic">
                                "{selectedItem.clientTestimonial}"
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              No client testimonial available for this project.
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
}
