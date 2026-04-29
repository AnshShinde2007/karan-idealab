"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Mic,
  AlertTriangle,
  MapPin,
  Phone,
  Loader2,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  quickReplies?: string[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    content:
      "Hello! I'm SkyRelief AI Assistant. I can help you with emergency requests, finding rescue camps, and disaster information. How can I assist you today?",
    timestamp: new Date(),
    quickReplies: [
      "Request Emergency Help",
      "Find Nearest Camp",
      "Check Weather Alerts",
      "Speak to Human",
    ],
  },
]

const botResponses: Record<string, { content: string; quickReplies?: string[] }> = {
  "request emergency help": {
    content:
      "I understand you need emergency help. To send an SOS signal quickly:\n\n1. Click the 'Request Help' button below\n2. Allow location access when prompted\n3. Fill in basic details\n\nOr call 112 directly for immediate assistance. Would you like me to help you with the SOS form?",
    quickReplies: ["Open SOS Form", "Call 112", "Share Location"],
  },
  "find nearest camp": {
    content:
      "I can help you find the nearest relief camp. Based on typical locations, here are options nearby:\n\n1. Central Relief Camp A - 2.3 km\n2. North District Shelter - 4.7 km\n3. Emergency Medical Center - 5.2 km\n\nWould you like directions to any of these?",
    quickReplies: ["Get Directions", "View All Camps", "Filter by Facilities"],
  },
  "check weather alerts": {
    content:
      "Current Active Alerts:\n\n⚠️ Flash Flood Warning - Northern Valley Region\n⚠️ Cyclone Alert - Coastal Districts\n\nStay safe and follow local authority guidelines. Would you like more details on any alert?",
    quickReplies: ["Flood Details", "Cyclone Details", "Subscribe to Alerts"],
  },
  "speak to human": {
    content:
      "I'll connect you with a human operator. Our emergency helpline is available 24/7.\n\n📞 Call: 112 (National Emergency)\n📞 Call: 1070 (Disaster Management)\n\nOr you can request a callback and an operator will reach you within 5 minutes.",
    quickReplies: ["Request Callback", "Call 112", "Email Support"],
  },
  default: {
    content:
      "I'm here to help with emergency and disaster-related queries. Could you please tell me more about what you need? You can ask about:\n\n• Emergency help requests\n• Rescue camp locations\n• Weather alerts\n• Safety guidelines",
    quickReplies: [
      "Request Help",
      "Find Camps",
      "Weather Alerts",
      "Safety Tips",
    ],
  },
}

export function ChatBot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [input, setInput] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const [isRecording, setIsRecording] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const lowerText = text.toLowerCase()
      let response = botResponses.default

      for (const key of Object.keys(botResponses)) {
        if (lowerText.includes(key)) {
          response = botResponses[key]
          break
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.content,
        timestamp: new Date(),
        quickReplies: response.quickReplies,
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleVoice = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        setIsRecording(false)
        handleSend("I need emergency help")
      }, 2000)
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all hover:scale-105 ${
          isOpen ? "bg-muted text-muted-foreground" : "bg-primary"
        }`}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emergency text-xs text-emergency-foreground">
              1
            </span>
          </>
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] shadow-2xl">
          <CardHeader className="border-b bg-primary p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base">SkyRelief Assistant</CardTitle>
                  <div className="flex items-center gap-1 text-xs opacity-80">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                    </span>
                    Online 24/7
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div
                      className={`flex gap-2 ${
                        message.type === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.type === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>

                    {/* Quick Replies */}
                    {message.type === "bot" && message.quickReplies && (
                      <div className="mt-2 flex flex-wrap gap-2 pl-10">
                        {message.quickReplies.map((reply) => (
                          <Button
                            key={reply}
                            variant="outline"
                            size="sm"
                            className="h-auto px-3 py-1 text-xs"
                            onClick={() => handleSend(reply)}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-lg bg-muted px-4 py-2">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex w-full gap-2"
            >
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoice}
                className="shrink-0"
              >
                <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
              </Button>
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>

          {/* Emergency Quick Actions */}
          <div className="border-t bg-muted/50 p-2">
            <div className="flex items-center justify-center gap-2 text-xs">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-emergency hover:bg-emergency/10 hover:text-emergency"
                asChild
              >
                <a href="#request-help">
                  <AlertTriangle className="h-3 w-3" />
                  SOS
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                asChild
              >
                <a href="#camps">
                  <MapPin className="h-3 w-3" />
                  Camps
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs"
                asChild
              >
                <a href="tel:112">
                  <Phone className="h-3 w-3" />
                  Call 112
                </a>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
