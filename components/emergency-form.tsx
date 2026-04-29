"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  MapPin,
  Phone,
  User,
  Upload,
  AlertTriangle,
  Mic,
  Navigation,
  CheckCircle2,
  Loader2,
  MicOff,
  WifiOff,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { addSOSRequest, type SOSRequest } from "@/lib/sos-store"
import { getCurrentPosition, type Coordinates } from "@/lib/location-utils"
import { startSpeechRecognition, isSpeechRecognitionSupported, speak } from "@/lib/speech"
import { showSOSNotification, playAlertSound } from "@/lib/notifications"
import { useOfflineQueue } from "@/hooks/use-offline"

const disasterTypes = [
  { value: "flood", label: "Flood" },
  { value: "earthquake", label: "Earthquake" },
  { value: "fire", label: "Fire / Wildfire" },
  { value: "cyclone", label: "Cyclone / Hurricane" },
  { value: "landslide", label: "Landslide" },
  { value: "tsunami", label: "Tsunami" },
  { value: "building-collapse", label: "Building Collapse" },
  { value: "industrial", label: "Industrial Accident" },
  { value: "other", label: "Other Emergency" },
]

const urgencyLevels = [
  { value: 1, label: "Low", color: "bg-success text-success-foreground" },
  { value: 2, label: "Medium", color: "bg-warning text-warning-foreground" },
  { value: 3, label: "High", color: "bg-emergency/70 text-emergency-foreground" },
  { value: 4, label: "Critical", color: "bg-emergency text-emergency-foreground" },
  { value: 5, label: "Life Threatening", color: "bg-emergency text-emergency-foreground animate-pulse" },
]

export function EmergencyForm() {
  const [isLocating, setIsLocating] = React.useState(false)
  const [location, setLocation] = React.useState<Coordinates | null>(null)
  const [locationText, setLocationText] = React.useState("")
  const [urgency, setUrgency] = React.useState([3])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(false)
  const [voiceTranscript, setVoiceTranscript] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)
  const [submittedRequest, setSubmittedRequest] = React.useState<SOSRequest | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const stopRecognitionRef = React.useRef<(() => void) | null>(null)
  
  // Form state
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [disasterType, setDisasterType] = React.useState("")
  const [peopleCount, setPeopleCount] = React.useState("")
  const [description, setDescription] = React.useState("")

  const { isOffline, addToQueue } = useOfflineQueue()

  const detectLocation = async () => {
    setIsLocating(true)
    try {
      const coords = await getCurrentPosition()
      setLocation(coords)
      setLocationText(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`)
      toast.success("Location detected successfully")
    } catch (error) {
      console.error("Error getting location:", error)
      toast.error("Could not detect location. Please enter manually.")
    } finally {
      setIsLocating(false)
    }
  }

  const handleVoiceRecord = () => {
    if (!isSpeechRecognitionSupported()) {
      toast.error("Voice recording not supported in your browser")
      return
    }

    if (isRecording && stopRecognitionRef.current) {
      stopRecognitionRef.current()
      setIsRecording(false)
      if (voiceTranscript) {
        setDescription((prev) => prev ? `${prev} ${voiceTranscript}` : voiceTranscript)
      }
      return
    }

    setIsRecording(true)
    setVoiceTranscript("")
    toast.info("Listening... Describe your emergency")

    const stop = startSpeechRecognition(
      (result) => {
        setVoiceTranscript(result.transcript)
        if (result.isFinal) {
          setDescription((prev) => prev ? `${prev} ${result.transcript}` : result.transcript)
          setIsRecording(false)
          toast.success("Voice message captured")
        }
      },
      (error) => {
        setIsRecording(false)
        if (error.message === 'not-allowed') {
          toast.error("Microphone access denied. Please check permissions.")
        } else if (error.message === 'network') {
          toast.error("Network error during speech recognition. Try again.")
        } else {
          toast.error("Voice recognition failed. Please try again.")
        }
      },
      () => {
        setIsRecording(false)
      }
    )

    stopRecognitionRef.current = stop
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB")
        return
      }
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      toast.success(`Photo selected: ${file.name}`)
    }
  }

  const clearPhoto = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !phone || !locationText || !disasterType || !peopleCount || !description) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    const requestData = {
      name,
      phone,
      location: {
        lat: location?.lat || 0,
        lng: location?.lng || 0,
        text: locationText,
      },
      disaster: disasterType,
      people: parseInt(peopleCount, 10),
      urgency: urgency[0],
      description,
      voiceMessage: voiceTranscript || undefined,
      photo: previewUrl || undefined,
    }

    try {
      if (isOffline) {
        // Queue for later submission
        addToQueue("sos-request", requestData)
        toast.warning("You are offline. Your request will be sent when connection is restored.", {
          duration: 5000,
        })
        setSubmittedRequest({
          ...requestData,
          id: "PENDING",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      } else {
        // Submit immediately
        const newRequest = await addSOSRequest(requestData)
        setSubmittedRequest(newRequest)
        
        // Play alert sound
        playAlertSound("sos")
        
        // Show notification (simulating notification to rescue teams)
        showSOSNotification(name, disasterType, urgency[0])
        
        // Speak confirmation
        speak("Your SOS request has been submitted. Help is on the way.")
      }

      setSubmitted(true)
      toast.success("SOS Request Submitted! Help is on the way.", {
        description: "Rescue teams have been notified of your location.",
      })
    } catch (error) {
      console.error("Error submitting SOS:", error)
      toast.error("Failed to submit request. Please try again or call 112.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setSubmittedRequest(null)
    setName("")
    setPhone("")
    setLocation(null)
    setLocationText("")
    setDisasterType("")
    setPeopleCount("")
    setDescription("")
    setVoiceTranscript("")
    setUrgency([3])
    clearPhoto()
  }

  if (submitted && submittedRequest) {
    return (
      <section id="request-help" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl border-success/50 bg-success/5">
            <CardContent className="flex flex-col items-center gap-6 py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">SOS Request Received</h3>
                <p className="mt-2 text-muted-foreground">
                  Your emergency request has been submitted successfully.
                  <br />
                  Rescue teams have been notified and are on their way.
                </p>
              </div>
              <div className="rounded-lg bg-card p-4 text-center shadow-sm">
                <p className="text-sm text-muted-foreground">Your Request ID</p>
                <p className="font-mono text-2xl font-bold text-primary">
                  {submittedRequest.id}
                </p>
              </div>
              
              {/* Request Summary */}
              <div className="w-full max-w-md rounded-lg border bg-card p-4">
                <h4 className="mb-3 font-semibold">Request Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{submittedRequest.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disaster Type:</span>
                    <span className="capitalize">{submittedRequest.disaster}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">People:</span>
                    <span>{submittedRequest.people}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Urgency:</span>
                    <Badge className={urgencyLevels.find(u => u.value === submittedRequest.urgency)?.color}>
                      Level {submittedRequest.urgency}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-right">{submittedRequest.location.text}</span>
                  </div>
                </div>
              </div>

              {isOffline && (
                <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-2 text-warning">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm">Request queued - will send when online</span>
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={resetForm}>
                  Submit Another Request
                </Button>
                <Button asChild>
                  <a href="tel:112">Call Emergency: 112</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  const currentUrgency = urgencyLevels.find((u) => u.value === urgency[0])

  return (
    <section id="request-help" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="destructive" className="mb-4 gap-2">
            <AlertTriangle className="h-3 w-3" />
            Emergency Services
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Request Emergency Help
          </h2>
          <p className="mt-4 text-muted-foreground">
            Fill out the form below to send an SOS signal. Your request will be
            immediately dispatched to nearby rescue teams.
          </p>
        </div>

        {isOffline && (
          <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 rounded-lg bg-warning/10 p-3 text-warning">
            <WifiOff className="h-5 w-5" />
            <span>You are offline. Requests will be queued and sent when connection is restored.</span>
          </div>
        )}

        <Card className="mx-auto mt-12 max-w-2xl border-emergency/20 shadow-xl shadow-emergency/5">
          <CardHeader className="border-b bg-emergency/5">
            <CardTitle className="flex items-center gap-2 text-emergency">
              <AlertTriangle className="h-5 w-5" />
              SOS Emergency Request Form
            </CardTitle>
            <CardDescription>
              All fields marked with * are required. Your information is encrypted
              and secure.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-emergency">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-emergency">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Current Location <span className="text-emergency">*</span>
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="Auto-detect or enter manually"
                      className="pl-10"
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="gap-2"
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {isLocating ? "Detecting..." : "Auto Detect"}
                    </span>
                  </Button>
                </div>
                {location && (
                  <p className="text-xs text-success">
                    GPS coordinates captured: {location.lat.toFixed(6)},{" "}
                    {location.lng.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Disaster Type & People Count */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="disaster-type">
                    Disaster Type <span className="text-emergency">*</span>
                  </Label>
                  <Select value={disasterType} onValueChange={setDisasterType} required>
                    <SelectTrigger id="disaster-type">
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent>
                      {disasterTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="people-count">
                    Number of People <span className="text-emergency">*</span>
                  </Label>
                  <Input
                    id="people-count"
                    type="number"
                    min={1}
                    placeholder="How many people need help?"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Situation Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Describe Your Situation <span className="text-emergency">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please describe your emergency situation, any injuries, and immediate needs..."
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <div className="flex items-center justify-between">
                  {isRecording && voiceTranscript && (
                    <p className="text-sm text-muted-foreground italic">
                      &quot;{voiceTranscript}&quot;
                    </p>
                  )}
                  <div className="ml-auto">
                    <Button
                      type="button"
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={handleVoiceRecord}
                      className="gap-2"
                    >
                      {isRecording ? (
                        <MicOff className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                      {isRecording ? "Stop Recording" : "Voice Message"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Urgency Level */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    Urgency Level <span className="text-emergency">*</span>
                  </Label>
                  <Badge className={currentUrgency?.color}>
                    {currentUrgency?.label}
                  </Badge>
                </div>
                <Slider
                  value={urgency}
                  onValueChange={setUrgency}
                  min={1}
                  max={5}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Critical</span>
                  <span>Life Threat</span>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Upload Photo (Optional)</Label>
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-48 w-full rounded-lg border object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2"
                      onClick={clearPhoto}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50 hover:bg-muted/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 bg-emergency text-emergency-foreground shadow-lg shadow-emergency/25 hover:bg-emergency/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="h-5 w-5" />
                    Sending SOS Signal...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5" />
                    Submit SOS Request
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By submitting, you confirm that this is a genuine emergency.
                False reports may result in legal action.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
