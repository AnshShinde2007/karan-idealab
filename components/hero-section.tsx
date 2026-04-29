"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Radio,
  Shield,
  MapPin,
  Bell,
  ArrowRight,
  Satellite,
  Signal,
} from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 pb-20 pt-12 md:pb-32 md:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-emergency/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      {/* Animated Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Status Badge */}
          <Badge
            variant="outline"
            className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-2 text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            HAPS Network Active - 99.9% Coverage
          </Badge>

          {/* Main Heading */}
          <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Emergency Rescue Network{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
              Powered by HAPS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
            Stay Connected. Stay Safe. Get Help Fast.
            <br className="hidden sm:block" />
            When traditional networks fail, SkyRelief Connect keeps you linked
            to rescue teams through High Altitude Platform Stations.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="gap-2 bg-emergency text-emergency-foreground shadow-lg shadow-emergency/25 transition-all hover:bg-emergency/90 hover:shadow-xl hover:shadow-emergency/30"
              asChild
            >
              <Link href="#request-help">
                <Shield className="h-5 w-5" />
                Request Help Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-primary/30 transition-all hover:bg-primary/5"
              asChild
            >
              <Link href="#camps">
                <MapPin className="h-5 w-5" />
                Find Rescue Camps
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              asChild
            >
              <Link href="#alerts">
                <Bell className="h-5 w-5" />
                Live Alerts
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4">
            <StatItem icon={Radio} value="50K+" label="People Rescued" />
            <StatItem icon={Satellite} value="24/7" label="HAPS Coverage" />
            <StatItem icon={MapPin} value="500+" label="Relief Camps" />
            <StatItem icon={Signal} value="< 30s" label="Response Time" />
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-success" />
              Government Authorized
            </span>
            <span className="flex items-center gap-2">
              <Signal className="h-4 w-4 text-primary" />
              Military-Grade Encryption
            </span>
            <span className="flex items-center gap-2">
              <Satellite className="h-4 w-4 text-primary" />
              Satellite Backup
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-2xl font-bold sm:text-3xl">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
