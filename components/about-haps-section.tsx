"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Satellite,
  Radio,
  Wifi,
  Cloud,
  Zap,
  Shield,
  Globe,
  Signal,
} from "lucide-react"

const hapsFeatures = [
  {
    icon: Cloud,
    title: "Stratospheric Positioning",
    description: "Operating at 20km altitude, above weather systems and aircraft",
  },
  {
    icon: Radio,
    title: "Wide Coverage Area",
    description: "Single HAPS can cover areas up to 500km in diameter",
  },
  {
    icon: Zap,
    title: "Solar Powered",
    description: "Sustainable energy source for continuous 24/7 operation",
  },
  {
    icon: Shield,
    title: "Disaster Resilient",
    description: "Unaffected by ground-level disasters and infrastructure damage",
  },
]

export function AboutHapsSection() {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div>
            <Badge variant="outline" className="mb-4 gap-2">
              <Satellite className="h-3 w-3" />
              Advanced Technology
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              What is HAPS Technology?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              High Altitude Platform Stations (HAPS) are aerial communication
              systems positioned in the stratosphere, approximately 20 kilometers
              above Earth&apos;s surface. They serve as floating cell towers,
              providing internet and network connectivity during disasters when
              ground infrastructure fails.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {hapsFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Did you know?</strong> HAPS
                can maintain position for months without refueling, providing
                persistent coverage during extended disaster recovery operations.
              </p>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <Card className="overflow-hidden border-primary/20">
              <CardContent className="p-0">
                <div className="relative aspect-square bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8">
                  {/* HAPS Diagram */}
                  <div className="relative h-full w-full">
                    {/* Space Layer */}
                    <div className="absolute inset-x-0 top-0 h-1/4 rounded-t-lg bg-gradient-to-b from-foreground/5 to-transparent">
                      <div className="flex items-center justify-center pt-4">
                        <Badge variant="secondary" className="text-xs">
                          Space (100km+)
                        </Badge>
                      </div>
                    </div>

                    {/* Stratosphere Layer with HAPS */}
                    <div className="absolute inset-x-0 top-1/4 flex h-1/4 items-center justify-center">
                      <div className="relative">
                        <div className="absolute -inset-8 animate-pulse rounded-full bg-primary/20" />
                        <div className="absolute -inset-16 animate-ping rounded-full bg-primary/10" style={{ animationDuration: "2s" }} />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                          <Satellite className="h-12 w-12 text-primary-foreground" />
                        </div>
                        <Badge className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          HAPS (20km)
                        </Badge>
                      </div>
                    </div>

                    {/* Signal Lines */}
                    <svg
                      className="absolute inset-0 h-full w-full"
                      viewBox="0 0 400 400"
                      fill="none"
                    >
                      {/* Signal waves from HAPS */}
                      <path
                        d="M200 200 L100 350"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="8 4"
                        className="text-primary/40"
                      />
                      <path
                        d="M200 200 L200 350"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="8 4"
                        className="text-primary/40"
                      />
                      <path
                        d="M200 200 L300 350"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="8 4"
                        className="text-primary/40"
                      />
                    </svg>

                    {/* Troposphere/Weather Layer */}
                    <div className="absolute inset-x-0 top-1/2 h-1/4">
                      <div className="flex items-center justify-center">
                        <Badge variant="outline" className="gap-1 bg-background/80 text-xs">
                          <Cloud className="h-3 w-3" />
                          Weather Layer (10km)
                        </Badge>
                      </div>
                    </div>

                    {/* Ground Layer */}
                    <div className="absolute inset-x-0 bottom-0 h-1/4 rounded-b-lg bg-gradient-to-t from-success/20 to-transparent">
                      <div className="flex h-full items-end justify-around pb-4">
                        <div className="flex flex-col items-center gap-1">
                          <Signal className="h-6 w-6 text-success" />
                          <span className="text-xs text-muted-foreground">Rescue Team</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Wifi className="h-6 w-6 text-primary" />
                          <span className="text-xs text-muted-foreground">User</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Globe className="h-6 w-6 text-emergency" />
                          <span className="text-xs text-muted-foreground">Camp</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating Stats */}
            <div className="absolute -left-4 top-1/4 hidden rounded-lg border bg-card p-3 shadow-lg lg:block">
              <p className="text-2xl font-bold text-primary">500km</p>
              <p className="text-xs text-muted-foreground">Coverage Radius</p>
            </div>
            <div className="absolute -right-4 bottom-1/4 hidden rounded-lg border bg-card p-3 shadow-lg lg:block">
              <p className="text-2xl font-bold text-success">99.9%</p>
              <p className="text-xs text-muted-foreground">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
