"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Radio,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  ExternalLink,
  Shield,
} from "lucide-react"

const emergencyNumbers = [
  { label: "National Emergency", number: "112" },
  { label: "Disaster Management", number: "1070" },
  { label: "Fire Services", number: "101" },
  { label: "Medical Emergency", number: "108" },
  { label: "Police", number: "100" },
]

const quickLinks = [
  { label: "Request Help", href: "#request-help" },
  { label: "Find Rescue Camps", href: "#camps" },
  { label: "Live Alerts", href: "#alerts" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About HAPS", href: "#about" },
]

const resources = [
  { label: "Disaster Preparedness Guide", href: "#" },
  { label: "Emergency Kit Checklist", href: "#" },
  { label: "First Aid Training", href: "#" },
  { label: "Volunteer Registration", href: "#" },
  { label: "Partner Organizations", href: "#" },
]

const governmentLinks = [
  { label: "National Disaster Management Authority", href: "#" },
  { label: "State Emergency Services", href: "#" },
  { label: "Weather Department", href: "#" },
  { label: "Health Ministry", href: "#" },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      {/* Emergency Banner */}
      <div className="bg-emergency py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center text-sm text-emergency-foreground">
            <span className="font-semibold">24/7 Emergency Helpline:</span>
            {emergencyNumbers.slice(0, 3).map((item, index) => (
              <React.Fragment key={item.number}>
                {index > 0 && <span className="hidden sm:inline">|</span>}
                <a
                  href={`tel:${item.number}`}
                  className="font-bold underline-offset-2 hover:underline"
                >
                  {item.label}: {item.number}
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Radio className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight tracking-tight">
                  SkyRelief
                </span>
                <span className="text-xs text-muted-foreground">Connect</span>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Emergency rescue platform powered by High Altitude Platform
              Stations (HAPS). Connecting disaster-affected communities with
              rescue teams when traditional networks fail.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">
                Subscribe to Emergency Updates
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-[250px]"
                />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h4 className="mb-4 font-semibold">Government Authorities</h4>
            <ul className="space-y-2">
              {governmentLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <h4 className="font-semibold">Contact Us</h4>
              <a
                href="mailto:help@skyrelief.org"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                help@skyrelief.org
              </a>
              <a
                href="tel:+1800123456"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                1-800-123-456
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <span>&copy; {new Date().getFullYear()} SkyRelief Connect</span>
            <Link href="#" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary">
              Accessibility
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-success" />
            <span>Government Authorized Platform</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
