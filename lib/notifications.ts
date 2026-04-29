// Push notification utilities

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: Record<string, unknown>
}

// Check if notifications are supported
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window
}

// Get current notification permission
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported"
  return Notification.permission
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    throw new Error("Notifications not supported")
  }
  
  return await Notification.requestPermission()
}

// Show a notification
export function showNotification(payload: NotificationPayload): Notification | null {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return null
  }

  const notification = new Notification(payload.title, {
    body: payload.body,
    icon: payload.icon || "/icon.svg",
    badge: payload.badge,
    tag: payload.tag,
    data: payload.data,
  })

  notification.onclick = () => {
    window.focus()
    notification.close()
  }

  return notification
}

// Show emergency alert notification
export function showEmergencyAlert(
  title: string,
  body: string,
  location?: string
) {
  return showNotification({
    title: `ALERT: ${title}`,
    body: location ? `${body}\nLocation: ${location}` : body,
    tag: "emergency-alert",
    icon: "/icon.svg",
  })
}

// Show SOS received notification (for rescue teams)
export function showSOSNotification(
  name: string,
  disaster: string,
  urgency: number
) {
  const urgencyText = urgency >= 4 ? "CRITICAL" : "Standard"
  return showNotification({
    title: `SOS: ${urgencyText}`,
    body: `New request from ${name} - ${disaster}`,
    tag: "sos-request",
  })
}

// Play alert sound
export function playAlertSound(type: "sos" | "alert" | "success" = "alert") {
  if (typeof window === "undefined") return

  const frequencies: Record<typeof type, number[]> = {
    sos: [800, 600, 800, 600],
    alert: [523, 659, 784],
    success: [523, 659, 784, 1046],
  }

  const durations: Record<typeof type, number> = {
    sos: 200,
    alert: 150,
    success: 100,
  }

  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const freqs = frequencies[type]
    const duration = durations[type]

    freqs.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = freq
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration / 1000
      )

      oscillator.start(audioContext.currentTime + (index * duration) / 1000)
      oscillator.stop(audioContext.currentTime + ((index + 1) * duration) / 1000)
    })
  } catch (e) {
    console.error("Failed to play alert sound:", e)
  }
}
