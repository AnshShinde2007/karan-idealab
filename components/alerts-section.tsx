"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  AlertTriangle,
  CloudRain,
  Wind,
  Thermometer,
  MapPin,
  Clock,
  ChevronRight,
  BellRing,
  Volume2,
  VolumeX,
} from "lucide-react"
import { toast } from "sonner"
import {
  requestNotificationPermission,
  getNotificationPermission,
  showEmergencyAlert,
  playAlertSound,
} from "@/lib/notifications"
import { announceEmergency } from "@/lib/speech"
import { useSOSRequests } from "@/lib/sos-store"

interface Alert {
  id: number | string
  type: "critical" | "warning" | "info"
  title: string
  location: string
  time: string
  description: string
  icon: React.ElementType
}

const initialAlerts: Alert[] = [
  {
    id: 1,
    type: "critical",
    title: "Flash Flood Warning",
    location: "Northern Valley Region",
    time: "2 minutes ago",
    description: "Severe flash flooding expected in low-lying areas. Evacuate immediately to higher ground.",
    icon: CloudRain,
  },
  {
    id: 2,
    type: "warning",
    title: "Cyclone Alert",
    location: "Coastal Districts",
    time: "15 minutes ago",
    description: "Category 3 cyclone approaching. Expected landfall in 6 hours. Secure property and prepare for evacuation.",
    icon: Wind,
  },
  {
    id: 3,
    type: "info",
    title: "Heat Wave Advisory",
    location: "Metropolitan Area",
    time: "1 hour ago",
    description: "Extreme temperatures expected for next 3 days. Stay hydrated and avoid outdoor activities.",
    icon: Thermometer,
  },
  {
    id: 4,
    type: "warning",
    title: "Earthquake Aftershock Warning",
    location: "Eastern Province",
    time: "2 hours ago",
    description: "Multiple aftershocks expected following 5.8 magnitude earthquake. Stay away from damaged structures.",
    icon: AlertTriangle,
  },
]

const weatherData = {
  temperature: "28C",
  humidity: "85%",
  windSpeed: "45 km/h",
  pressure: "1008 hPa",
  visibility: "8 km",
  uvIndex: "High",
}

export function AlertsSection() {
  const [alerts, setAlerts] = React.useState<Alert[]>(initialAlerts)
  const [notificationEnabled, setNotificationEnabled] = React.useState(false)
  const [soundEnabled, setSoundEnabled] = React.useState(true)
  const [expandedAlert, setExpandedAlert] = React.useState<number | string | null>(null)
  
  const { requests } = useSOSRequests()

  // Merge SOS requests from Firebase with simulated weather alerts
  const combinedAlerts = React.useMemo(() => {
    const sosAlerts: Alert[] = requests.map(req => ({
      id: req.id,
      type: req.urgency >= 4 ? "critical" : req.urgency >= 3 ? "warning" : "info",
      title: `User SOS: ${req.name} (${req.disaster})`,
      location: req.location.text,
      time: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: `Status: ${req.status.toUpperCase()} | People affected: ${req.people}. ${req.description}`,
      icon: AlertTriangle,
    }))
    
    return [...sosAlerts, ...alerts]
  }, [requests, alerts])

  // Check notification permission on mount
  React.useEffect(() => {
    const permission = getNotificationPermission()
    setNotificationEnabled(permission === "granted")
  }, [])

  // Simulate real-time alerts
  React.useEffect(() => {
    const simulateNewAlert = () => {
      const newAlerts: Alert[] = [
        {
          id: Date.now(),
          type: "critical",
          title: "Tsunami Warning",
          location: "Coastal Zone A",
          time: "Just now",
          description: "Tsunami warning issued. Move to higher ground immediately.",
          icon: AlertTriangle,
        },
        {
          id: Date.now(),
          type: "warning",
          title: "Landslide Risk",
          location: "Mountain District",
          time: "Just now",
          description: "Heavy rainfall increasing landslide risk. Avoid hill roads.",
          icon: CloudRain,
        },
      ]

      const randomAlert = newAlerts[Math.floor(Math.random() * newAlerts.length)]
      
      setAlerts((prev) => [randomAlert, ...prev.slice(0, 9)])
      
      if (notificationEnabled) {
        showEmergencyAlert(randomAlert.title, randomAlert.description, randomAlert.location)
      }
      
      if (soundEnabled) {
        playAlertSound(randomAlert.type === "critical" ? "sos" : "alert")
      }

      toast.warning(`New Alert: ${randomAlert.title}`, {
        description: randomAlert.location,
      })
    }

    // Simulate new alert every 30-60 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulateNewAlert()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [notificationEnabled, soundEnabled])

  const enableNotifications = async () => {
    try {
      const permission = await requestNotificationPermission()
      if (permission === "granted") {
        setNotificationEnabled(true)
        toast.success("Push notifications enabled")
        showEmergencyAlert("Notifications Enabled", "You will receive disaster alerts for your area")
      } else {
        toast.error("Notification permission denied")
      }
    } catch {
      toast.error("Notifications not supported in your browser")
    }
  }

  const testAlert = () => {
    if (soundEnabled) {
      playAlertSound("alert")
    }
    announceEmergency("Test", "This is a test emergency announcement")
    toast.info("Test alert triggered")
  }

  return (
    <section id="alerts" className="bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 gap-2">
            <Bell className="h-3 w-3" />
            Real-Time Updates
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Live Disaster Alerts
          </h2>
          <p className="mt-4 text-muted-foreground">
            Stay informed with real-time alerts and weather updates from
            official disaster management authorities.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Active Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-emergency" />
                  Active Alerts
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    title={soundEnabled ? "Mute sounds" : "Enable sounds"}
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                  <Badge variant="destructive" className="gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                    </span>
                    {combinedAlerts.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {combinedAlerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        expanded={expandedAlert === alert.id}
                        onToggle={() =>
                          setExpandedAlert(expandedAlert === alert.id ? null : alert.id)
                        }
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Weather Widget & Notifications */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Thermometer className="h-5 w-5 text-primary" />
                  Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <WeatherItem label="Temperature" value={weatherData.temperature} />
                  <WeatherItem label="Humidity" value={weatherData.humidity} />
                  <WeatherItem label="Wind Speed" value={weatherData.windSpeed} />
                  <WeatherItem label="Pressure" value={weatherData.pressure} />
                  <WeatherItem label="Visibility" value={weatherData.visibility} />
                  <WeatherItem label="UV Index" value={weatherData.uvIndex} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    {notificationEnabled ? (
                      <BellRing className="h-6 w-6 text-primary" />
                    ) : (
                      <Bell className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {notificationEnabled
                        ? "Notifications Enabled"
                        : "Enable Push Notifications"}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notificationEnabled
                        ? "You will receive instant alerts for your area."
                        : "Get instant alerts for your area directly on your device."}
                    </p>
                  </div>
                  {notificationEnabled ? (
                    <Button variant="outline" onClick={testAlert} className="w-full gap-2">
                      <Bell className="h-4 w-4" />
                      Test Alert
                    </Button>
                  ) : (
                    <Button onClick={enableNotifications} className="w-full gap-2">
                      <Bell className="h-4 w-4" />
                      Enable Alerts
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="tel:112"
                  className="flex items-center justify-between rounded-lg bg-emergency/10 p-3 transition-colors hover:bg-emergency/20"
                >
                  <div>
                    <p className="font-semibold text-emergency">112</p>
                    <p className="text-xs text-muted-foreground">National Emergency</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-emergency" />
                </a>
                <a
                  href="tel:1070"
                  className="flex items-center justify-between rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80"
                >
                  <div>
                    <p className="font-semibold">1070</p>
                    <p className="text-xs text-muted-foreground">Disaster Management</p>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="tel:108"
                  className="flex items-center justify-between rounded-lg bg-muted p-3 transition-colors hover:bg-muted/80"
                >
                  <div>
                    <p className="font-semibold">108</p>
                    <p className="text-xs text-muted-foreground">Ambulance</p>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function AlertCard({
  alert,
  expanded,
  onToggle,
}: {
  alert: Alert
  expanded: boolean
  onToggle: () => void
}) {
  const typeStyles = {
    critical: {
      badge: "bg-emergency text-emergency-foreground",
      border: "border-l-emergency",
      icon: "text-emergency",
    },
    warning: {
      badge: "bg-warning text-warning-foreground",
      border: "border-l-warning",
      icon: "text-warning",
    },
    info: {
      badge: "bg-primary text-primary-foreground",
      border: "border-l-primary",
      icon: "text-primary",
    },
  }

  const styles = typeStyles[alert.type]

  return (
    <div
      className={`cursor-pointer rounded-lg border border-l-4 ${styles.border} bg-card p-4 transition-all hover:shadow-md`}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className={`mt-0.5 ${styles.icon}`}>
            <alert.icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold">{alert.title}</h4>
              <Badge className={`text-xs ${styles.badge}`}>
                {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
              </Badge>
            </div>
            <p className={`text-sm text-muted-foreground ${expanded ? "" : "line-clamp-2"}`}>
              {alert.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {alert.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {alert.time}
              </span>
            </div>
            {expanded && (
              <div className="mt-3 flex gap-2 border-t pt-3">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Share Alert
                </Button>
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <ChevronRight
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
        </Button>
      </div>
    </div>
  )
}

function WeatherItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
