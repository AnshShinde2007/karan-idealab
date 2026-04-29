"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "lucide-react";

/* ================= TYPES ================= */

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

type Intent =
  | "emergency"
  | "camp"
  | "weather"
  | "greeting"
  | "directions"
  | "unknown";

/* ================= INTENT ENGINE ================= */

const detectIntent = (text: string): Intent => {
  const t = text.toLowerCase();

  if (t.includes("help") || t.includes("emergency") || t.includes("sos"))
    return "emergency";

  if (t.includes("camp") || t.includes("shelter"))
    return "camp";

  if (t.includes("weather") || t.includes("rain") || t.includes("cyclone"))
    return "weather";

  if (t.includes("direction") || t.includes("route"))
    return "directions";

  if (t.includes("hi") || t.includes("hello"))
    return "greeting";

  return "unknown";
};

const getResponse = (intent: Intent): string => {
  switch (intent) {
    case "emergency":
      return `🚨 Emergency detected.

• Call 112 immediately
• Share your location
• Stay in a safe place

Do you want step-by-step guidance?`;

    case "camp":
      return `🏕️ Nearby relief camps:

1. Central Camp – 2.3 km  
2. North Shelter – 4.7 km  

Say "directions" to navigate.`;

    case "weather":
      return `🌧️ Weather Alert:

• Heavy rainfall expected  
• Flood risk in low areas  

Avoid travel unless necessary.`;

    case "directions":
      return `🧭 Directions:

Opening map for nearest safe camp...  
(Integrate Google Maps here next)`;

    case "greeting":
      return `Hey 👋

I can help you with:
• Emergency support  
• Finding camps  
• Weather alerts  

What do you need?`;

    default:
      return `I didn’t understand that.

Try:
• "Emergency help"  
• "Find camps"  
• "Weather update"`;
  }
};

/* ================= INITIAL ================= */

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    content:
      "Hello! I'm SkyRelief Assistant. Ask me anything about emergencies, camps, or weather.",
    timestamp: new Date(),
  },
];

/* ================= COMPONENT ================= */

export function ChatBot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const recognitionRef = React.useRef<any>(null);

  /* ================= INIT VOICE ================= */

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
      }
    }
  }, []);

  /* ================= AUTO SCROLL ================= */

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  /* ================= SPEAK ================= */

  const speak = (text: string) => {
    if (typeof window === "undefined") return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  /* ================= SEND ================= */

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const intent = detectIntent(text);
      const responseText = getResponse(intent);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      speak(responseText);
      setIsTyping(false);
    }, 600);
  };

  /* ================= VOICE ================= */

  const handleVoice = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.lang = "en-IN";
    recognition.start();
    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };
  };

  /* ================= UI ================= */

  return (
    <>
      {/* Toggle */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-primary"
        size="icon"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </Button>

      {/* Chat */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[380px] shadow-2xl">
          <CardHeader className="bg-primary text-white flex justify-between">
            <CardTitle>SkyRelief Assistant</CardTitle>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              <X />
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-2">
                    {msg.type === "user" ? <User /> : <Bot />}
                    <div className="bg-muted p-2 rounded text-sm">
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-sm">Typing...</div>}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 w-full"
            >
              <Button
                type="button"
                onClick={handleVoice}
                variant={isRecording ? "destructive" : "outline"}
              >
                <Mic />
              </Button>

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type message..."
              />

              <Button type="submit">
                <Send />
              </Button>
            </form>
          </CardFooter>

          {/* Quick Actions */}
          <div className="border-t p-2 flex justify-center gap-2 text-xs">
            <a href="#request-help">
              <AlertTriangle /> SOS
            </a>
            <a href="#camps">
              <MapPin /> Camps
            </a>
            <a href="tel:112">
              <Phone /> Call 112
            </a>
          </div>
        </Card>
      )}
    </>
  );
}