"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Plane,
  AlertCircle,
  Tent,
  Bell,
  Globe,
  Wifi,
  Shield,
  Clock,
} from "lucide-react"

const features = [
  {
    icon: MapPin,
    title: "Live GPS Location Sharing",
    description:
      "Share your exact coordinates with rescue teams in real-time. Works even in remote areas with HAPS connectivity.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Plane,
    title: "HAPS Emergency Connectivity",
    description:
      "High Altitude Platform Stations provide network coverage when ground infrastructure fails during disasters.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: AlertCircle,
    title: "Instant Rescue Requests",
    description:
      "Send SOS signals with one tap. Your request reaches multiple rescue agencies simultaneously.",
    color: "text-emergency",
    bgColor: "bg-emergency/10",
  },
  {
    icon: Tent,
    title: "Nearby Relief Camp Locator",
    description:
      "Find the closest shelters, their capacity, available resources, and get directions instantly.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Bell,
    title: "Disaster Alerts & Updates",
    description:
      "Receive real-time warnings about approaching disasters, evacuation orders, and safety guidelines.",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description:
      "Access the platform in your preferred language. Currently supporting 15+ languages worldwide.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Wifi,
    title: "Offline Mode Sync",
    description:
      "App works offline and syncs data automatically when connection is restored. Never lose critical information.",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  {
    icon: Shield,
    title: "Secure Communication",
    description:
      "End-to-end encrypted messages ensure your sensitive location data stays protected.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description:
      "Our command center operates round the clock with trained professionals ready to coordinate rescues.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Life-Saving Features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cutting-edge technology designed to save lives when every second
            counts. Our platform combines HAPS connectivity with intelligent
            rescue coordination.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <CardHeader>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
