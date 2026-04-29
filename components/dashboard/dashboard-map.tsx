"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  Tent,
  Users,
  Phone,
  ExternalLink,
} from "lucide-react"
import { useSOSRequests, type SOSRequest } from "@/lib/sos-store"
import { getDirectionsUrl } from "@/lib/location-utils"
import { formatDistanceToNow } from "date-fns"

interface MapMarker {
  id: string
  type: "sos" | "camp" | "team"
  lat: number
  lng: number
  label: string
  urgency?: number
  capacity?: number
  status?: SOSRequest["status"]
  phone?: string
  request?: SOSRequest
}

const staticMarkers: MapMarker[] = [
  { id: "camp-1", type: "camp", lat: 50, lng: 40, label: "Central Camp", capacity: 80 },
  { id: "camp-2", type: "camp", lat: 25, lng: 60, label: "North Shelter", capacity: 95 },
  { id: "team-1", type: "team", lat: 40, lng: 45, label: "Team Alpha" },
  { id: "team-2", type: "team", lat: 55, lng: 65, label: "Team Bravo" },
]

// Convert geo coordinates to map percentage positions
function geoToMapPosition(lat: number, lng: number): { x: number; y: number } {
  // Normalize around a center point (Delhi area for demo)
  const centerLat = 28.6
  const centerLng = 77.2
  const scale = 200 // Adjust for zoom level

  const x = 50 + (lng - centerLng) * scale
  const y = 50 - (lat - centerLat) * scale

  // Clamp to map bounds
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  }
}

export function DashboardMap() {
  const { requests } = useSOSRequests()
  const [selectedMarker, setSelectedMarker] = React.useState<MapMarker | null>(null)
  const [zoom, setZoom] = React.useState(1)

  // Convert SOS requests to map markers
  const sosMarkers: MapMarker[] = requests
    .filter((r) => r.status !== "rescued")
    .map((request) => {
      const pos = geoToMapPosition(request.location.lat, request.location.lng)
      return {
        id: request.id,
        type: "sos" as const,
        lat: pos.y,
        lng: pos.x,
        label: request.id,
        urgency: request.urgency,
        status: request.status,
        phone: request.phone,
        request,
      }
    })

  const allMarkers = [...sosMarkers, ...staticMarkers]

  const openInMaps = (marker: MapMarker) => {
    if (marker.request) {
      const from = { lat: 28.6129, lng: 77.2295 }
      const to = { lat: marker.request.location.lat, lng: marker.request.location.lng }
      window.open(getDirectionsUrl(from, to), "_blank")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Live Operations Map
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Live
            </Badge>
            <Badge variant="secondary">
              {sosMarkers.length} Active SOS
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
          {/* Map Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            <div
              className="absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
              }}
            />
          </div>

          {/* Map Markers */}
          {allMarkers.map((marker) => (
            <div
              key={marker.id}
              className="absolute z-10 cursor-pointer transition-transform hover:z-20 hover:scale-110"
              style={{
                left: `${marker.lng}%`,
                top: `${marker.lat}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => setSelectedMarker(marker)}
            >
              {marker.type === "sos" && (
                <div className="relative">
                  {marker.urgency && marker.urgency >= 4 && marker.status === "pending" && (
                    <div className="absolute -inset-2 animate-ping rounded-full bg-emergency/50" />
                  )}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg ${
                      marker.status === "in-progress"
                        ? "bg-warning"
                        : marker.urgency && marker.urgency >= 4
                        ? "bg-emergency"
                        : "bg-primary"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
              {marker.type === "camp" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success shadow-lg">
                  <Tent className="h-4 w-4 text-white" />
                </div>
              )}
              {marker.type === "team" && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Selected Marker Info */}
          {selectedMarker && (
            <div className="absolute left-4 top-4 z-30 max-w-xs rounded-lg border bg-card p-3 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {selectedMarker.type === "sos" && (
                    <AlertTriangle className="h-4 w-4 text-emergency" />
                  )}
                  {selectedMarker.type === "camp" && (
                    <Tent className="h-4 w-4 text-success" />
                  )}
                  {selectedMarker.type === "team" && (
                    <Users className="h-4 w-4 text-primary" />
                  )}
                  <span className="font-medium">{selectedMarker.label}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setSelectedMarker(null)}
                >
                  x
                </Button>
              </div>
              
              {selectedMarker.type === "sos" && selectedMarker.request && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${
                        selectedMarker.status === "in-progress"
                          ? "bg-warning"
                          : selectedMarker.urgency && selectedMarker.urgency >= 4
                          ? "bg-emergency"
                          : "bg-primary"
                      } text-white`}
                    >
                      {selectedMarker.status === "in-progress" ? "In Progress" : `Urgency ${selectedMarker.urgency}`}
                    </Badge>
                  </div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Name:</span> {selectedMarker.request.name}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Disaster:</span>{" "}
                    <span className="capitalize">{selectedMarker.request.disaster}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">People:</span> {selectedMarker.request.people}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(selectedMarker.request.createdAt, { addSuffix: true })}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" asChild>
                      <a href={`tel:${selectedMarker.phone}`}>
                        <Phone className="h-3 w-3" />
                        Call
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 gap-1 text-xs"
                      onClick={() => openInMaps(selectedMarker)}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Navigate
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedMarker.type === "camp" && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Capacity: {selectedMarker.capacity}%
                </p>
              )}
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8"
              onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Layers className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8"
              onClick={() => setZoom(1)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 rounded-lg border bg-card/95 p-3 backdrop-blur">
            <p className="mb-2 text-xs font-medium">Legend</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-emergency" />
                <span>Critical SOS</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span>Camps</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span>Teams</span>
              </div>
            </div>
          </div>

          {/* Coordinates Display */}
          <div className="absolute right-4 top-4 rounded bg-card/95 px-2 py-1 text-xs backdrop-blur">
            <Navigation className="mr-1 inline h-3 w-3" />
            28.6139 N, 77.2090 E
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
