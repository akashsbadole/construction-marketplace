"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPinIcon,
  SearchIcon,
  CheckIcon,
  Navigation as CurrentLocationIcon,
  MapIcon,
  LoaderIcon,
} from "lucide-react";

interface LocationData {
  pincode: string;
  city: string;
  state: string;
  area: string;
}

interface LocationSelectorProps {
  onLocationSelect: (location: LocationData) => void;
  currentLocation?: LocationData | null;
}

// Sample locations for quick selection (will be replaced by full data when needed)
const SAMPLE_LOCATIONS: LocationData[] = [
  {
    pincode: "110001",
    city: "New Delhi",
    state: "Delhi",
    area: "Connaught Place",
  },
  { pincode: "400001", city: "Mumbai", state: "Maharashtra", area: "Fort" },
  {
    pincode: "560001",
    city: "Bangalore",
    state: "Karnataka",
    area: "Bangalore GPO",
  },
  { pincode: "600001", city: "Chennai", state: "Tamil Nadu", area: "Parrys" },
  {
    pincode: "700001",
    city: "Kolkata",
    state: "West Bengal",
    area: "Kolkata GPO",
  },
  {
    pincode: "500001",
    city: "Hyderabad",
    state: "Telangana",
    area: "Hyderabad GPO",
  },
  { pincode: "411001", city: "Pune", state: "Maharashtra", area: "Pune GPO" },
  {
    pincode: "380001",
    city: "Ahmedabad",
    state: "Gujarat",
    area: "Ahmedabad GPO",
  },
  { pincode: "302001", city: "Jaipur", state: "Rajasthan", area: "Jaipur GPO" },
  {
    pincode: "226001",
    city: "Lucknow",
    state: "Uttar Pradesh",
    area: "Lucknow GPO",
  },
];

// Major city coordinates for location detection
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "New Delhi": { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
};

export function LocationSelector({
  onLocationSelect,
  currentLocation,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [locations, setLocations] = useState<LocationData[]>(SAMPLE_LOCATIONS);
  const [filteredLocations, setFilteredLocations] =
    useState<LocationData[]>(SAMPLE_LOCATIONS);
  const [loading, setLoading] = useState(false);
  const [locationDetecting, setLocationDetecting] = useState(false);

  // Load full pincode data when dialog opens
  useEffect(() => {
    const loadFullData = async () => {
      if (isOpen && locations.length <= 20) {
        setLoading(true);
        try {
          const response = await fetch("/pincode_IN.json");
          if (response.ok) {
            const data = await response.json();
            const pincodeArray: LocationData[] = [];

            Object.entries(data).forEach(([state, districts]) => {
              if (typeof districts === "object" && districts !== null) {
                Object.entries(
                  districts as Record<string, Record<string, string>>
                ).forEach(([district, areas]) => {
                  if (typeof areas === "object" && areas !== null) {
                    Object.entries(areas).forEach(([area, pincode]) => {
                      if (typeof pincode === "string" && pincode.trim()) {
                        pincodeArray.push({
                          pincode: pincode.trim(),
                          city: district.trim(),
                          state: state.trim(),
                          area: area.trim(),
                        });
                      }
                    });
                  }
                });
              }
            });

            setLocations(pincodeArray);
            console.log(`Loaded ${pincodeArray.length} locations`);
          }
        } catch (error) {
          console.error("Error loading pincode data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadFullData();
  }, [isOpen, locations.length]);

  // Filter locations
  useEffect(() => {
    let filtered = locations;

    if (selectedState !== "all") {
      filtered = filtered.filter((loc) => loc.state === selectedState);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loc) =>
          loc.pincode.includes(searchQuery) ||
          loc.city.toLowerCase().includes(query) ||
          loc.area.toLowerCase().includes(query) ||
          loc.state.toLowerCase().includes(query)
      );
    }

    setFilteredLocations(filtered.slice(0, 100)); // Limit for performance
  }, [searchQuery, selectedState, locations]);

  const states = Array.from(new Set(locations.map((loc) => loc.state))).sort();

  const handleLocationSelect = (location: LocationData) => {
    onLocationSelect(location);
    setIsOpen(false);
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find nearest city
        let nearestCity = "New Delhi";
        let minDistance = Infinity;

        Object.entries(CITY_COORDS).forEach(([city, coords]) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            coords.lat,
            coords.lng
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
          }
        });

        // Find a location in the nearest city
        const nearestLocation =
          locations.find((loc) =>
            loc.city.toLowerCase().includes(nearestCity.toLowerCase())
          ) ||
          SAMPLE_LOCATIONS.find((loc) =>
            loc.city.toLowerCase().includes(nearestCity.toLowerCase())
          ) ||
          SAMPLE_LOCATIONS[0];

        handleLocationSelect(nearestLocation);
        setLocationDetecting(false);
      },
      (error) => {
        setLocationDetecting(false);
        console.error("Location error:", error);
        alert("Could not detect location. Please select manually.");
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 md:gap-2 max-w-32 md:max-w-48"
        >
          <MapPinIcon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate text-xs md:text-sm">
            {currentLocation ? (
              <>
                <span className="hidden md:inline">
                  {currentLocation.area},{" "}
                </span>
                <span className="md:hidden">{currentLocation.city}</span>
                <span className="hidden md:inline">
                  {currentLocation.pincode}
                </span>
              </>
            ) : (
              <>
                <span className="hidden md:inline">Select Location</span>
                <span className="md:hidden">Location</span>
              </>
            )}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden mx-4 md:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Choose Your Location
          </DialogTitle>
          <DialogDescription>
            Select your location to find vendors and services in your area.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={detectCurrentLocation}
            disabled={locationDetecting}
          >
            {locationDetecting ? (
              <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CurrentLocationIcon className="h-4 w-4 mr-2" />
            )}
            {locationDetecting ? "Detecting..." : "Use Current Location"}
          </Button>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by pincode, city, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div>
            <Label>State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.slice(0, 30).map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-4">
              <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
              <span>Loading locations...</span>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredLocations.map((location, index) => (
              <div
                key={`${location.pincode}-${index}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => handleLocationSelect(location)}
              >
                <div>
                  <div className="font-medium">{location.area}</div>
                  <div className="text-sm text-muted-foreground">
                    {location.city}, {location.state} - {location.pincode}
                  </div>
                </div>
                {currentLocation?.pincode === location.pincode && (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
