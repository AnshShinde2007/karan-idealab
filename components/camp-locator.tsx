"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tent,
  MapPin,
  Users,
  Utensils,
  Heart,
  Navigation,
  Search,
  Phone,
  Clock,
  ChevronRight,
  Wifi,
  Droplets,
  Loader2,
  Filter,
} from "lucide-react"
import { toast } from "sonner"
import {
  getCurrentPosition,
  calculateDistance,
  formatDistance,
  getDirectionsUrl,
  type Coordinates,
} from "@/lib/location-utils"

const reliefCamps = [
  {
    id: 1,
    name: "Panvel Central Relief Camp",
    address: "Panvel Municipal Corporation School, Panvel, Raigad",
    distance: "12 km",
    capacity: { total: 500, occupied: 320 },
    facilities: ["food", "medical", "water", "wifi"],
    phone: "+91 22 2745 8040",
    status: "open",
    hours: "24/7",
    coordinates: { lat: 18.9894, lng: 73.1175 },
  },
  {
    id: 2,
    name: "Alibag Coastal Shelter",
    address: "Zilla Parishad High School, Near Beach Road, Alibag, Raigad",
    distance: "45 km",
    capacity: { total: 300, occupied: 280 },
    facilities: ["food", "medical", "water"],
    phone: "+91 2141 222 097",
    status: "open",
    hours: "24/7",
    coordinates: { lat: 18.6414, lng: 72.8722 },
  },
  {
    id: 3,
    name: "Pen Emergency Medical Center",
    address: "Sub District Hospital, Pen, Raigad",
    distance: "28 km",
    capacity: { total: 200, occupied: 150 },
    facilities: ["medical", "water"],
    phone: "+91 2143 252 233",
    status: "open",
    hours: "24/7",
    coordinates: { lat: 18.7369, lng: 73.0883 },
  },
  {
    id: 4,
    name: "Mahad Disaster Refuge",
    address: "Shivaji Chowk Community Hall, Mahad, Raigad",
    distance: "85 km",
    capacity: { total: 400, occupied: 400 },
    facilities: ["food", "water", "wifi"],
    phone: "+91 2145 222 144",
    status: "full",
    hours: "6 AM - 10 PM",
    coordinates: { lat: 18.0827, lng: 73.4217 },
  },
  {
    id: 5,
    name: "Roha Valley Shelter",
    address: "Roha Public School, Kundalika River Bank, Roha, Raigad",
    distance: "55 km",
    capacity: { total: 350, occupied: 200 },
    facilities: ["food", "medical", "water", "wifi"],
    phone: "+91 2144 232 555",
    status: "open",
    hours: "24/7",
    coordinates: { lat: 18.4394, lng: 73.1189 },
  },
]

const facilityIcons: Record<string, React.ElementType> = {
  food: Utensils,
  medical: Heart,
  water: Droplets,
  wifi: Wifi,
}

const facilityLabels: Record<string, string> = {
  food: "Food",
  medical: "Medical",
  water: "Water",
  wifi: "WiFi",
}

export function CampLocator() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCamp, setSelectedCamp] = React.useState<typeof reliefCamps[0] | null>(null)
  const [isLocating, setIsLocating] = React.useState(false)
  const [filterStatus, setFilterStatus] = React.useState("all")
  const [userLocation, setUserLocation] = React.useState<Coordinates | null>(null)
  const [camps, setCamps] = React.useState(reliefCamps)

  const filteredCamps = camps.filter((camp) => {
    const matchesSearch =
      camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === "all" || camp.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleLocateMe = async () => {
    setIsLocating(true)
    try {
      const coords = await getCurrentPosition()
      setUserLocation(coords)
      
      const updatedCamps = [...reliefCamps].map(camp => {
        const distKm = calculateDistance(coords, camp.coordinates)
        return {
          ...camp,
          distance: formatDistance(distKm),
          _distKm: distKm
        }
      }).sort((a, b) => a._distKm - b._distKm).map(({ _distKm, ...camp }) => camp)
      
      setCamps(updatedCamps)
      toast.success("Location found", {
        description: "Camps have been sorted by distance from your location."
      })
    } catch (error) {
      toast.error("Could not get location", {
        description: "Please check your browser permissions or manually search."
      })
    } finally {
      setIsLocating(false)
    }
  }

  return (
    <section id="camps" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 gap-2">
            <Tent className="h-3 w-3" />
            Relief Services
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find Nearby Rescue Camps
          </h2>
          <p className="mt-4 text-muted-foreground">
            Locate the nearest relief camps and shelters. View real-time
            capacity, available facilities, and get directions instantly.
          </p>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="list" className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-[300px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search camps..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Camps</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="gap-2"
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Locate Me</span>
                </Button>
              </div>
            </div>

            <TabsContent value="list" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Camp List */}
                <div className="lg:col-span-2">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {filteredCamps.map((camp) => (
                        <CampCard
                          key={camp.id}
                          camp={camp}
                          isSelected={selectedCamp?.id === camp.id}
                          onSelect={() => setSelectedCamp(camp)}
                        />
                      ))}
                      {filteredCamps.length === 0 && (
                        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                          <p className="text-muted-foreground">
                            No camps found matching your criteria
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Selected Camp Details */}
                <div className="hidden lg:block">
                  {selectedCamp ? (
                    <CampDetails camp={selectedCamp} userLocation={userLocation} />
                  ) : (
                    <Card className="flex h-[600px] items-center justify-center">
                      <CardContent className="text-center">
                        <Tent className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Select a camp to view details
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="map" className="mt-6">
              <Card className="overflow-hidden">
                <div className="relative aspect-[16/9] w-full bg-muted">
                  {/* Interactive Map Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10">
                    <div
                      className="absolute inset-0 opacity-[0.15]"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, currentColor 1px, transparent 1px),
                          linear-gradient(to bottom, currentColor 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                      }}
                    />

                    {/* Map Markers */}
                    {reliefCamps.map((camp, index) => (
                      <div
                        key={camp.id}
                        className="absolute cursor-pointer transition-transform hover:scale-110"
                        style={{
                          left: `${20 + index * 15}%`,
                          top: `${30 + (index % 3) * 20}%`,
                        }}
                        onClick={() => setSelectedCamp(camp)}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                            camp.status === "full"
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        >
                          <Tent className="h-5 w-5 text-white" />
                        </div>
                        <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-card px-2 py-1 text-xs shadow">
                          {camp.name}
                        </div>
                      </div>
                    ))}

                    {/* User Location */}
                    {userLocation ? (
                      <div
                        className="absolute"
                        style={{ left: "50%", top: "50%" }}
                      >
                        <div className="relative">
                          <div className="absolute -inset-4 animate-ping rounded-full bg-primary/30" />
                          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                            <Navigation className="h-4 w-4 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-xs text-primary-foreground shadow">
                          Your Location
                        </div>
                      </div>
                    ) : null}

                    {/* Map Controls */}
                    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                      <Button size="icon" variant="secondary">
                        +
                      </Button>
                      <Button size="icon" variant="secondary">
                        -
                      </Button>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <Card className="p-3">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-success" />
                            <span>Open</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-warning" />
                            <span>Full</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            <span>You</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Camp List Below Map */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCamps.slice(0, 3).map((camp) => (
                  <CampCard
                    key={camp.id}
                    camp={camp}
                    isSelected={selectedCamp?.id === camp.id}
                    onSelect={() => setSelectedCamp(camp)}
                    compact
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

function CampCard({
  camp,
  isSelected,
  onSelect,
  compact = false,
}: {
  camp: typeof reliefCamps[0]
  isSelected: boolean
  onSelect: () => void
  compact?: boolean
}) {
  const occupancyPercent = (camp.capacity.occupied / camp.capacity.total) * 100
  const occupancyColor =
    occupancyPercent >= 90
      ? "bg-emergency"
      : occupancyPercent >= 70
      ? "bg-warning"
      : "bg-success"

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary ring-1 ring-primary" : ""
      }`}
      onClick={onSelect}
    >
      <CardContent className={compact ? "p-4" : "p-5"}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{camp.name}</h4>
              <Badge
                variant={camp.status === "open" ? "default" : "secondary"}
                className={
                  camp.status === "open"
                    ? "bg-success text-success-foreground"
                    : "bg-warning text-warning-foreground"
                }
              >
                {camp.status === "open" ? "Open" : "Full"}
              </Badge>
            </div>

            {!compact && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {camp.address}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-primary">
                <Navigation className="h-3 w-3" />
                {camp.distance}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                {camp.capacity.occupied}/{camp.capacity.total}
              </span>
              {!compact && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {camp.hours}
                </span>
              )}
            </div>

            {/* Capacity Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full ${occupancyColor} transition-all`}
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>

            {/* Facilities */}
            <div className="flex gap-2">
              {camp.facilities.map((facility) => {
                const Icon = facilityIcons[facility]
                return (
                  <Badge
                    key={facility}
                    variant="outline"
                    className="gap-1 text-xs"
                  >
                    <Icon className="h-3 w-3" />
                    {facilityLabels[facility]}
                  </Badge>
                )
              })}
            </div>
          </div>

          <Button variant="ghost" size="icon" className="shrink-0">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function CampDetails({ camp, userLocation }: { camp: typeof reliefCamps[0], userLocation?: Coordinates | null }) {
  const occupancyPercent = (camp.capacity.occupied / camp.capacity.total) * 100

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{camp.name}</CardTitle>
          <Badge
            variant={camp.status === "open" ? "default" : "secondary"}
            className={
              camp.status === "open"
                ? "bg-success text-success-foreground"
                : "bg-warning text-warning-foreground"
            }
          >
            {camp.status === "open" ? "Open" : "Full"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location */}
        <div>
          <h5 className="mb-2 text-sm font-medium text-muted-foreground">
            Location
          </h5>
          <p className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {camp.address}
          </p>
          <p className="mt-1 text-sm text-primary">{camp.distance} away</p>
        </div>

        {/* Capacity */}
        <div>
          <h5 className="mb-2 text-sm font-medium text-muted-foreground">
            Capacity
          </h5>
          <div className="flex items-center justify-between text-sm">
            <span>
              {camp.capacity.occupied} / {camp.capacity.total} occupied
            </span>
            <span className="font-medium">{Math.round(occupancyPercent)}%</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${
                occupancyPercent >= 90
                  ? "bg-emergency"
                  : occupancyPercent >= 70
                  ? "bg-warning"
                  : "bg-success"
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {camp.capacity.total - camp.capacity.occupied} spots available
          </p>
        </div>

        {/* Facilities */}
        <div>
          <h5 className="mb-2 text-sm font-medium text-muted-foreground">
            Available Facilities
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {camp.facilities.map((facility) => {
              const Icon = facilityIcons[facility]
              return (
                <div
                  key={facility}
                  className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 text-sm"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {facilityLabels[facility]}
                </div>
              )
            })}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h5 className="mb-2 text-sm font-medium text-muted-foreground">
            Contact
          </h5>
          <a
            href={`tel:${camp.phone}`}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            {camp.phone}
          </a>
        </div>

        {/* Hours */}
        <div>
          <h5 className="mb-2 text-sm font-medium text-muted-foreground">
            Operating Hours
          </h5>
          <p className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {camp.hours}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button 
            className="w-full gap-2"
            onClick={() => {
              if (userLocation) {
                window.open(getDirectionsUrl(userLocation, camp.coordinates), '_blank')
              } else {
                window.open(`https://www.google.com/maps/search/?api=1&query=${camp.coordinates.lat},${camp.coordinates.lng}`, '_blank')
              }
            }}
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </Button>
          <Button variant="outline" className="w-full gap-2" asChild>
            <a href={`tel:${camp.phone}`}>
              <Phone className="h-4 w-4" />
              Call Camp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
