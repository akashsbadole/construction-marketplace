"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  StarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  MessageCircleIcon,
  ImageIcon,
  CalendarIcon,
  VerifiedIcon,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
  projectType?: string;
  orderValue?: number;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

interface ReviewSystemProps {
  entityType: "product" | "vendor" | "contractor";
  entityId: string;
  entityName: string;
  reviews: Review[];
  stats: ReviewStats;
  canReview?: boolean;
  onSubmitReview?: (review: Partial<Review>) => Promise<void>;
  onHelpfulClick?: (reviewId: string, helpful: boolean) => Promise<void>;
}

export function ReviewSystem({
  entityType,
  entityId,
  entityName,
  reviews,
  stats,
  canReview = false,
  onSubmitReview,
  onHelpfulClick,
}: ReviewSystemProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    images: [] as string[],
  });
  const [selectedFilter, setSelectedFilter] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "helpful"
  >("newest");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      // In a real app, you'd upload these files and get URLs
      const imageUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setNewReview((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
    },
  });

  const handleSubmitReview = async () => {
    if (!onSubmitReview || newReview.rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmitReview({
        rating: newReview.rating,
        title: newReview.title,
        comment: newReview.comment,
        images: newReview.images,
      });

      // Reset form
      setNewReview({
        rating: 0,
        title: "",
        comment: "",
        images: [],
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string, helpful: boolean) => {
    if (onHelpfulClick) {
      await onHelpfulClick(reviewId, helpful);
    }
  };

  const filteredReviews = reviews.filter(
    (review) => selectedFilter === "all" || review.rating === selectedFilter
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "helpful":
        return b.helpfulCount - a.helpfulCount;
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return texts[rating as keyof typeof texts] || "";
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            {canReview && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Write a Review</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Write a Review for {entityName}</DialogTitle>
                    <DialogDescription>
                      Share your experience and help others make informed
                      decisions.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Rating */}
                    <div>
                      <Label>Overall Rating</Label>
                      <div className="flex items-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setNewReview((prev) => ({
                                ...prev,
                                rating: star,
                              }))
                            }
                            className="focus:outline-none"
                          >
                            <StarIcon
                              className={`h-8 w-8 ${
                                star <= newReview.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                        {newReview.rating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {getRatingText(newReview.rating)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <Label htmlFor="review-title">
                        Review Title (Optional)
                      </Label>
                      <Input
                        id="review-title"
                        placeholder="Summarize your experience"
                        value={newReview.title}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Comment */}
                    <div>
                      <Label htmlFor="review-comment">Your Review</Label>
                      <Textarea
                        id="review-comment"
                        placeholder="Share your experience with others..."
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <Label>Add Photos (Optional)</Label>
                      <div
                        {...getRootProps()}
                        className={`mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          isDragActive
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25"
                        }`}
                      >
                        <input {...getInputProps()} />
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {isDragActive
                            ? "Drop the images here..."
                            : "Drag & drop images here, or click to select"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Up to 5 images, max 5MB each
                        </p>
                      </div>

                      {newReview.images.length > 0 && (
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {newReview.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Review image ${index + 1}`}
                                className="w-full h-16 object-cover rounded"
                              />
                              <button
                                onClick={() =>
                                  setNewReview((prev) => ({
                                    ...prev,
                                    images: prev.images.filter(
                                      (_, i) => i !== index
                                    ),
                                  }))
                                }
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button
                        onClick={handleSubmitReview}
                        disabled={newReview.rating === 0 || isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(stats.averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {stats.totalReviews} review
                {stats.totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage =
                  stats.totalReviews > 0
                    ? (count / stats.totalReviews) * 100
                    : 0;

                return (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8">{rating}★</span>
                    <Progress value={percentage} className="flex-1" />
                    <span className="w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
          >
            All Reviews
          </Button>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating] || 0;
            if (count === 0) return null;

            return (
              <Button
                key={rating}
                variant={selectedFilter === rating ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(rating)}
              >
                {rating}★ ({count})
              </Button>
            );
          })}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-1 border rounded-md text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.userAvatar} />
                  <AvatarFallback>
                    {review.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.userName}</span>
                        {review.isVerified && (
                          <VerifiedIcon className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>

                    {review.projectType && (
                      <Badge variant="outline">{review.projectType}</Badge>
                    )}
                  </div>

                  {review.title && (
                    <h4 className="font-medium">{review.title}</h4>
                  )}

                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <button
                      onClick={() => handleHelpful(review.id, true)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <ThumbsUpIcon className="h-4 w-4" />
                      Helpful ({review.helpfulCount})
                    </button>

                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <MessageCircleIcon className="h-4 w-4" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {selectedFilter === "all"
              ? "No reviews yet. Be the first to leave a review!"
              : `No ${selectedFilter}-star reviews found.`}
          </p>
        </div>
      )}
    </div>
  );
}
