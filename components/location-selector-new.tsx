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
import { Badge } from "@/components/ui/badge";
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

// Function to load and parse pincode data with caching
let pincodeCache: LocationData[] | null = null;
let pincodeLoadPromise: Promise<LocationData[]> | null = null;

const loadPincodeData = async (): Promise<LocationData[]> => {
  // Return cached data if available
  if (pincodeCache) {
    return pincodeCache;
  }

  // Return existing promise if already loading
  if (pincodeLoadPromise) {
    return pincodeLoadPromise;
  }

  // Create new loading promise
  pincodeLoadPromise = (async () => {
    try {
      const response = await fetch("/pincode_IN.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const pincodeArray: LocationData[] = [];

      // Parse the nested JSON structure with error handling
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

      // Cache the result
      pincodeCache = pincodeArray;
      console.log(`Loaded ${pincodeArray.length} pincodes`);
      return pincodeArray;
    } catch (error) {
      console.error("Error loading pincode data:", error);
      pincodeLoadPromise = null; // Reset promise on error
      return [];
    }
  })();

  return pincodeLoadPromise;
};

export function LocationSelector({
  onLocationSelect,
  currentLocation,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [allPincodes, setAllPincodes] = useState<LocationData[]>([]);
  const [filteredPincodes, setFilteredPincodes] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [locationDetecting, setLocationDetecting] = useState(false);

  // Load pincode data when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (!dataLoaded) {
        setLoading(true);
        const data = await loadPincodeData();
        setAllPincodes(data);
        setFilteredPincodes(data.slice(0, 100)); // Show first 100 initially
        setDataLoaded(true);
        setLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen, dataLoaded]);

  // Get unique states and cities
  const states = Array.from(
    new Set(allPincodes.map((item) => item.state))
  ).sort();
  const cities =
    selectedState === "all"
      ? Array.from(new Set(allPincodes.map((item) => item.city))).sort()
      : Array.from(
          new Set(
            allPincodes
              .filter((item) => item.state === selectedState)
              .map((item) => item.city)
          )
        ).sort();

  // Filter pincodes based on search and selections
  useEffect(() => {
    if (!dataLoaded) return;

    let filtered = allPincodes;

    // Filter by state
    if (selectedState !== "all") {
      filtered = filtered.filter((item) => item.state === selectedState);
    }

    // Filter by city
    if (selectedCity !== "all") {
      filtered = filtered.filter((item) => item.city === selectedCity);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.pincode.includes(searchQuery) ||
          item.city.toLowerCase().includes(query) ||
          item.area.toLowerCase().includes(query) ||
          item.state.toLowerCase().includes(query)
      );
    }

    // Limit results for performance (show max 200 results)
    setFilteredPincodes(filtered.slice(0, 200));
  }, [searchQuery, selectedState, selectedCity, allPincodes, dataLoaded]);

  const handleLocationSelect = (location: LocationData) => {
    onLocationSelect(location);
    setIsOpen(false);
  };

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Helper function to find nearest location by coordinates
  const findNearestLocationByCoords = (latitude: number, longitude: number) => {
    if (allPincodes.length === 0) return null;

    // Essential coordinates for major Indian cities (optimized for performance)
    const cityCoordinates: Record<string, { lat: number; lng: number }> = {
      // Metro Cities
      "New Delhi": { lat: 28.6139, lng: 77.209 },
      Mumbai: { lat: 19.076, lng: 72.8777 },
      Bangalore: { lat: 12.9716, lng: 77.5946 },
      Chennai: { lat: 13.0827, lng: 80.2707 },
      Kolkata: { lat: 22.5726, lng: 88.3639 },
      Hyderabad: { lat: 17.385, lng: 78.4867 },
      Pune: { lat: 18.5204, lng: 73.8567 },

      // Major Cities
      Ahmedabad: { lat: 23.0225, lng: 72.5714 },
      Jaipur: { lat: 26.9124, lng: 75.7873 },
      Lucknow: { lat: 26.8467, lng: 80.9462 },
      Kanpur: { lat: 26.4499, lng: 80.3319 },
      Nagpur: { lat: 21.1458, lng: 79.0882 },
      Indore: { lat: 22.7196, lng: 75.8577 },
      Bhopal: { lat: 23.2599, lng: 77.4126 },
      Patna: { lat: 25.5941, lng: 85.1376 },
      Vadodara: { lat: 22.3072, lng: 73.1812 },
      Ludhiana: { lat: 30.901, lng: 75.8573 },
      Agra: { lat: 27.1767, lng: 78.0081 },
      Nashik: { lat: 19.9975, lng: 73.7898 },
      Rajkot: { lat: 22.3039, lng: 70.8022 },
      Varanasi: { lat: 25.3176, lng: 82.9739 },
      Srinagar: { lat: 34.0837, lng: 74.7973 },
      Amritsar: { lat: 31.634, lng: 74.8723 },
      Allahabad: { lat: 25.4358, lng: 81.8463 },
      Ranchi: { lat: 23.3441, lng: 85.3096 },
      Coimbatore: { lat: 11.0168, lng: 76.9558 },
      Jodhpur: { lat: 26.2389, lng: 73.0243 },
      Madurai: { lat: 9.9252, lng: 78.1198 },
      Chandigarh: { lat: 30.7333, lng: 76.7794 },
      Guwahati: { lat: 26.1445, lng: 91.7362 },
      Mysore: { lat: 12.2958, lng: 76.6394 },
      Noida: { lat: 28.5355, lng: 77.391 },
      Kochi: { lat: 9.9312, lng: 76.2673 },
      Dehradun: { lat: 30.3165, lng: 78.0322 },
      Thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
      Bhubaneswar: { lat: 20.2961, lng: 85.8245 },
    };

    let nearestLocation = null;
    let minDistance = Infinity;

    // Find the nearest city
    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      const distance = calculateDistance(
        latitude,
        longitude,
        coords.lat,
        coords.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        // Find a location in this city
        nearestLocation = allPincodes.find(
          (loc) =>
            loc.city.toLowerCase().includes(cityName.toLowerCase()) ||
            cityName.toLowerCase().includes(loc.city.toLowerCase())
        );
      }
    }

    return nearestLocation || allPincodes[0];
  };

  // Helper function to find matching location from geocoding data
  const findNearestLocation = (
    latitude: number,
    longitude: number,
    geocodeData: any
  ) => {
    const { postcode, city, locality, principalSubdivision } = geocodeData;

    console.log("Searching for location with:", {
      postcode,
      city,
      locality,
      principalSubdivision,
    });

    // Try to find exact pincode match (remove spaces and normalize)
    if (postcode) {
      const normalizedPostcode = postcode.toString().replace(/\s+/g, "").trim();
      const exactMatch = allPincodes.find(
        (loc) => loc.pincode.replace(/\s+/g, "").trim() === normalizedPostcode
      );
      if (exactMatch) {
        console.log("Found exact pincode match:", exactMatch);
        return exactMatch;
      }
    }

    // Try to find city match with better fuzzy matching
    const searchTerms = [city, locality].filter(Boolean);
    for (const searchTerm of searchTerms) {
      if (!searchTerm) continue;

      const normalizedSearch = searchTerm.toLowerCase().trim();

      // Exact city match
      let cityMatch = allPincodes.find(
        (loc) => loc.city.toLowerCase().trim() === normalizedSearch
      );

      if (!cityMatch) {
        // Partial city match
        cityMatch = allPincodes.find(
          (loc) =>
            loc.city.toLowerCase().includes(normalizedSearch) ||
            normalizedSearch.includes(loc.city.toLowerCase()) ||
            loc.area.toLowerCase().includes(normalizedSearch) ||
            normalizedSearch.includes(loc.area.toLowerCase())
        );
      }

      if (cityMatch) {
        console.log("Found city match:", cityMatch);
        return cityMatch;
      }
    }

    // Try to find state match and then pick a major city in that state
    if (principalSubdivision) {
      const normalizedState = principalSubdivision.toLowerCase().trim();
      const stateMatches = allPincodes.filter(
        (loc) => loc.state.toLowerCase().trim() === normalizedState
      );

      if (stateMatches.length > 0) {
        // Prefer major cities in the state
        const majorCities = [
          "New Delhi",
          "Mumbai",
          "Bangalore",
          "Chennai",
          "Kolkata",
          "Hyderabad",
          "Pune",
        ];
        for (const majorCity of majorCities) {
          const majorCityMatch = stateMatches.find((loc) =>
            loc.city.toLowerCase().includes(majorCity.toLowerCase())
          );
          if (majorCityMatch) {
            console.log("Found major city in state:", majorCityMatch);
            return majorCityMatch;
          }
        }

        // If no major city found, return first match in state
        console.log("Found state match:", stateMatches[0]);
        return stateMatches[0];
      }
    }

    // Fallback to coordinate-based search
    console.log("Falling back to coordinate-based search");
    return findNearestLocationByCoords(latitude, longitude);
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Current position:", {
          latitude,
          longitude,
          accuracy: position.coords.accuracy,
        });

        try {
          // Try multiple geocoding services for better accuracy
          let geocodeData = null;

          // First try: BigDataCloud (free, no API key required)
          try {
            const response1 = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (response1.ok) {
              geocodeData = await response1.json();
              console.log("BigDataCloud geocoding data:", geocodeData);
            }
          } catch (e) {
            console.warn("BigDataCloud geocoding failed:", e);
          }

          // Second try: OpenStreetMap Nominatim (if first fails)
          if (!geocodeData) {
            try {
              const response2 = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
              );
              if (response2.ok) {
                const osmData = await response2.json();
                console.log("OSM geocoding data:", osmData);

                // Convert OSM format to our expected format
                geocodeData = {
                  postcode: osmData.address?.postcode,
                  city:
                    osmData.address?.city ||
                    osmData.address?.town ||
                    osmData.address?.village,
                  locality:
                    osmData.address?.suburb || osmData.address?.neighbourhood,
                  principalSubdivision: osmData.address?.state,
                  countryName: osmData.address?.country,
                };
              }
            } catch (e) {
              console.warn("OSM geocoding failed:", e);
            }
          }

          if (geocodeData) {
            // Try to find matching location in our pincode data
            const matchedLocation = findNearestLocation(
              latitude,
              longitude,
              geocodeData
            );

            if (matchedLocation) {
              console.log("Found matching location:", matchedLocation);
              handleLocationSelect(matchedLocation);
            } else {
              // If no exact match, create a location from geocoding data
              const detectedLocation: LocationData = {
                pincode: geocodeData.postcode || "000000",
                city:
                  geocodeData.city || geocodeData.locality || "Unknown City",
                state: geocodeData.principalSubdivision || "Unknown State",
                area:
                  geocodeData.localityInfo?.administrative?.[3]?.name ||
                  geocodeData.locality ||
                  geocodeData.city ||
                  "Unknown Area",
              };
              console.log("Created location from geocoding:", detectedLocation);
              handleLocationSelect(detectedLocation);
            }
          } else {
            throw new Error("All geocoding services failed");
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);

          // Fallback: try to find nearest location by coordinates
          const nearestLocation = findNearestLocationByCoords(
            latitude,
            longitude
          );
          if (nearestLocation) {
            handleLocationSelect(nearestLocation);
          } else {
            alert("Could not determine your location. Please select manually.");
          }
        } finally {
          setLocationDetecting(false);
        }
      },
      (error) => {
        setLocationDetecting(false);
        console.error("Error getting location:", error);

        let errorMessage = "Could not get your location. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }

        alert(errorMessage + " Please select your location manually.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const clearFilters = () => {
    setSelectedState("all");
    setSelectedCity("all");
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 max-w-48">
          <MapPinIcon className="h-4 w-4" />
          <span className="truncate">
            {currentLocation
              ? `${currentLocation.area}, ${currentLocation.pincode}`
              : "Select Location"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Choose Your Location
          </DialogTitle>
          <DialogDescription>
            Select your location to find vendors and services in your area. You
            can search by pincode, city, or area name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Location Button */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={detectCurrentLocation}
            disabled={loading || locationDetecting}
          >
            {locationDetecting ? (
              <LoaderIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CurrentLocationIcon className="h-4 w-4 mr-2" />
            )}
            {locationDetecting
              ? "Detecting Location..."
              : "Use Current Location"}
          </Button>

          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by pincode, city, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              disabled={loading}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>State</Label>
              <Select
                value={selectedState}
                onValueChange={setSelectedState}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>City</Label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.slice(0, 50).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedState !== "all" ||
            selectedCity !== "all" ||
            searchQuery) && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <LoaderIcon className="h-6 w-6 animate-spin mr-2" />
              <span>Loading pincode data...</span>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredPincodes.length > 0 ? (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    Showing {filteredPincodes.length} locations
                    {filteredPincodes.length === 200 &&
                      " (limited to 200 results)"}
                  </div>
                  {filteredPincodes.map((location, index) => (
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
                </>
              ) : dataLoaded ? (
                <div className="text-center py-8 text-muted-foreground">
                  No locations found matching your search
                </div>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
