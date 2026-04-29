// Speech recognition and synthesis utilities

export interface SpeechRecognitionResult {
  transcript: string
  confidence: number
  isFinal: boolean
}

// Check if speech recognition is supported
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false
  return (
    "SpeechRecognition" in window ||
    "webkitSpeechRecognition" in window
  )
}

// Check if speech synthesis is supported
export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false
  return "speechSynthesis" in window
}

// Create speech recognition instance
export function createSpeechRecognition(): any {
  if (!isSpeechRecognitionSupported()) return null

  const SpeechRecognitionConstructor =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition

  const recognition = new SpeechRecognitionConstructor()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = "en-US"

  return recognition
}

// Start speech recognition with callbacks
export function startSpeechRecognition(
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (error: Error) => void,
  onEnd: () => void
): (() => void) | null {
  const recognition = createSpeechRecognition()
  if (!recognition) {
    onError(new Error("Speech recognition not supported"))
    return null
  }

  recognition.onresult = (event: any) => {
    const result = event.results[event.results.length - 1]
    onResult({
      transcript: result[0].transcript,
      confidence: result[0].confidence,
      isFinal: result.isFinal,
    })
  }

  recognition.onerror = (event: any) => {
    onError(new Error(event.error))
  }

  recognition.onend = onEnd

  recognition.start()

  return () => {
    recognition.stop()
  }
}

// Speak text using speech synthesis
export function speak(
  text: string,
  options?: {
    lang?: string
    rate?: number
    pitch?: number
    volume?: number
    onEnd?: () => void
  }
): SpeechSynthesisUtterance | null {
  if (!isSpeechSynthesisSupported()) return null

  // Cancel any ongoing speech
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = options?.lang || "en-US"
  utterance.rate = options?.rate || 1
  utterance.pitch = options?.pitch || 1
  utterance.volume = options?.volume || 1

  if (options?.onEnd) {
    utterance.onend = options.onEnd
  }

  window.speechSynthesis.speak(utterance)
  return utterance
}

// Emergency voice commands for quick actions
export const VOICE_COMMANDS = {
  "help": "request-help",
  "sos": "request-help",
  "emergency": "request-help",
  "rescue": "request-help",
  "find camp": "find-camp",
  "find shelter": "find-camp",
  "nearby camp": "find-camp",
  "weather": "weather-alert",
  "alert": "weather-alert",
  "call": "emergency-call",
} as const

// Parse voice command
export function parseVoiceCommand(
  transcript: string
): keyof typeof VOICE_COMMANDS | null {
  const lower = transcript.toLowerCase()
  for (const [phrase, command] of Object.entries(VOICE_COMMANDS)) {
    if (lower.includes(phrase)) {
      return phrase as keyof typeof VOICE_COMMANDS
    }
  }
  return null
}

// Announce emergency message
export function announceEmergency(type: string, message: string) {
  speak(`Emergency ${type} alert. ${message}`, {
    rate: 0.9,
    pitch: 1.1,
    volume: 1,
  })
}
