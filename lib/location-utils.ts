export interface Coordinates {
  lat: number
  lng: number
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(point2.lat - point1.lat)
  const dLng = toRad(point2.lng - point1.lng)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`
  }
  return `${km.toFixed(1)} km`
}

// Get user's current position
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  })
}

// Watch user's position
export function watchPosition(
  onUpdate: (coords: Coordinates) => void,
  onError: (error: GeolocationPositionError) => void
): number | null {
  if (!navigator.geolocation) {
    return null
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onUpdate({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    },
    onError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    }
  )
}

// Stop watching position
export function clearWatch(watchId: number | null) {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}

// Reverse geocode coordinates to address (mock)
export async function reverseGeocode(coords: Coordinates): Promise<string> {
  // In production, this would call a geocoding API
  return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
}

// Generate Google Maps direction URL
export function getDirectionsUrl(
  from: Coordinates,
  to: Coordinates
): string {
  return `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.lat},${to.lng}`
}

// Generate a static map image URL
export function getStaticMapUrl(
  coords: Coordinates,
  width: number = 400,
  height: number = 200
): string {
  // Using OpenStreetMap static image API
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${coords.lat},${coords.lng}&zoom=14&size=${width}x${height}&maptype=mapnik&markers=${coords.lat},${coords.lng},red`
}
