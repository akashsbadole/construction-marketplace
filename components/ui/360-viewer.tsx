"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Play,
  Pause,
  RotateCcwIcon,
} from "lucide-react";

interface Image360ViewerProps {
  images: string[];
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
  width?: number;
  height?: number;
  showControls?: boolean;
  title?: string;
}

export function Image360Viewer({
  images,
  autoRotate = false,
  autoRotateSpeed = 2,
  className = "",
  width = 600,
  height = 400,
  showControls = true,
  title,
}: Image360ViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<HTMLImageElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const animationRef = useRef<number>();

  // Load all images
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      setLoadedImages([]); // Reset loaded images

      if (images.length === 0) {
        setIsLoading(false);
        return;
      }

      const imagePromises = images.map((src, index) => {
        return new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.warn(`Failed to load 360 image ${index + 1}: ${src}`);
            resolve(null); // Return null instead of rejecting
          };
          img.src = src;
        });
      });

      try {
        const results = await Promise.all(imagePromises);
        const validImages = results.filter(
          (img): img is HTMLImageElement => img !== null
        );

        if (validImages.length === 0) {
          console.warn("No 360 images could be loaded");
          setLoadedImages([]);
        } else {
          setLoadedImages(validImages);
          if (validImages.length < images.length) {
            console.warn(
              `Only ${validImages.length} out of ${images.length} 360 images loaded successfully`
            );
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Unexpected error loading 360 images:", error);
        setLoadedImages([]);
        setIsLoading(false);
      }
    };

    loadImages();
  }, [images]);

  // Draw current image on canvas
  useEffect(() => {
    if (!canvasRef.current || loadedImages.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = loadedImages[currentImageIndex];
    if (!img) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions to maintain aspect ratio
    const imgAspect = img.width / img.height;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth = canvas.width * zoom;
    let drawHeight = canvas.height * zoom;
    let drawX = (canvas.width - drawWidth) / 2;
    let drawY = (canvas.height - drawHeight) / 2;

    if (imgAspect > canvasAspect) {
      drawHeight = drawWidth / imgAspect;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = drawHeight * imgAspect;
      drawX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  }, [currentImageIndex, loadedImages, zoom]);

  // Auto rotation
  useEffect(() => {
    if (!isAutoRotating || loadedImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % loadedImages.length);
    }, 1000 / autoRotateSpeed);

    return () => clearInterval(interval);
  }, [isAutoRotating, loadedImages.length, autoRotateSpeed]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouseX(e.clientX);
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || loadedImages.length === 0) return;

    const deltaX = e.clientX - lastMouseX;
    const sensitivity = 2;
    const imageChange = Math.floor(Math.abs(deltaX) / sensitivity);

    if (imageChange > 0) {
      if (deltaX > 0) {
        setCurrentImageIndex(
          (prev) => (prev + imageChange) % loadedImages.length
        );
      } else {
        setCurrentImageIndex(
          (prev) =>
            (prev - imageChange + loadedImages.length) % loadedImages.length
        );
      }
      setLastMouseX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setLastMouseX(e.touches[0].clientX);
    setIsAutoRotating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || loadedImages.length === 0) return;

    const deltaX = e.touches[0].clientX - lastMouseX;
    const sensitivity = 3;
    const imageChange = Math.floor(Math.abs(deltaX) / sensitivity);

    if (imageChange > 0) {
      if (deltaX > 0) {
        setCurrentImageIndex(
          (prev) => (prev + imageChange) % loadedImages.length
        );
      } else {
        setCurrentImageIndex(
          (prev) =>
            (prev - imageChange + loadedImages.length) % loadedImages.length
        );
      }
      setLastMouseX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Control functions
  const rotateLeft = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + loadedImages.length) % loadedImages.length
    );
    setIsAutoRotating(false);
  };

  const rotateRight = () => {
    setCurrentImageIndex((prev) => (prev + 1) % loadedImages.length);
    setIsAutoRotating(false);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (images.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
            <RotateCw className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground font-medium">
            No 360° images available
          </p>
          <p className="text-sm text-muted-foreground">
            360° view will be shown here when images are uploaded
          </p>
        </div>
      </Card>
    );
  }

  // Show fallback if images failed to load
  if (!isLoading && loadedImages.length === 0 && images.length > 0) {
    return (
      <Card className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-red-200 rounded-full flex items-center justify-center">
            <RotateCw className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-red-700 font-medium">Failed to load 360° images</p>
          <p className="text-sm text-red-600">
            The 360° images could not be loaded. Please try again later.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`relative overflow-hidden ${className} ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {title && (
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="bg-black/50 text-white">
            360° View: {title}
          </Badge>
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={isFullscreen ? window.innerWidth : width}
          height={isFullscreen ? window.innerHeight : height}
          className={`cursor-grab ${isDragging ? "cursor-grabbing" : ""} ${
            isLoading ? "opacity-50" : ""
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {showControls && !isLoading && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-black/70 rounded-lg p-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={rotateLeft}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={toggleAutoRotate}
              >
                {isAutoRotating ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={rotateRight}
              >
                <RotateCw className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-white/30 mx-1" />

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={resetZoom}
              >
                <RotateCcwIcon className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-white/30 mx-1" />

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Image counter */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-black/50 text-white">
            {currentImageIndex + 1} / {loadedImages.length}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
