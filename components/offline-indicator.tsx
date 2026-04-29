"use client"

import { useOffline } from "@/hooks/use-offline"
import { WifiOff, Wifi } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function OfflineIndicator() {
  const isOffline = useOffline()
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (isOffline && !wasOffline) {
      setWasOffline(true)
      toast.warning("You are offline", {
        description: "Some features may be limited. Data will sync when you reconnect.",
        duration: 5000,
        icon: <WifiOff className="h-4 w-4" />,
      })
    } else if (!isOffline && wasOffline) {
      setWasOffline(false)
      toast.success("Back online", {
        description: "Your connection has been restored.",
        duration: 3000,
        icon: <Wifi className="h-4 w-4" />,
      })
    }
  }, [isOffline, wasOffline])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-warning p-2 text-center text-sm font-medium text-warning-foreground">
      <WifiOff className="mr-2 inline h-4 w-4" />
      You are currently offline. Some features may be limited.
    </div>
  )
}
