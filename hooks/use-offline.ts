"use client"

import * as React from "react"

export function useOffline() {
  const [isOffline, setIsOffline] = React.useState(false)

  React.useEffect(() => {
    // Initial check
    setIsOffline(!navigator.onLine)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return isOffline
}

// Hook for offline data queue
interface QueuedRequest {
  id: string
  type: string
  data: unknown
  timestamp: number
}

const QUEUE_KEY = "skyrelief_offline_queue"

export function useOfflineQueue() {
  const [queue, setQueue] = React.useState<QueuedRequest[]>([])
  const isOffline = useOffline()

  // Load queue from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(QUEUE_KEY)
    if (stored) {
      setQueue(JSON.parse(stored))
    }
  }, [])

  // Save queue to localStorage
  React.useEffect(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  }, [queue])

  // Add item to queue
  const addToQueue = React.useCallback(
    (type: string, data: unknown) => {
      const item: QueuedRequest = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        data,
        timestamp: Date.now(),
      }
      setQueue((prev) => [...prev, item])
      return item.id
    },
    []
  )

  // Remove item from queue
  const removeFromQueue = React.useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Clear entire queue
  const clearQueue = React.useCallback(() => {
    setQueue([])
  }, [])

  // Process queue when coming online
  React.useEffect(() => {
    if (!isOffline && queue.length > 0) {
      // Process queued requests
      console.log("Processing offline queue:", queue.length, "items")
      // In a real app, you would send these to your API
    }
  }, [isOffline, queue])

  return {
    queue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    isOffline,
  }
}
