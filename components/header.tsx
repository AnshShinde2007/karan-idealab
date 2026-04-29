"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  Moon,
  Sun,
  Radio,
  Phone,
  Globe,
  AlertTriangle,
  Check,
} from "lucide-react"
import { useLanguage, languages, type LanguageCode } from "@/lib/i18n"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#request-help", label: "Request Help" },
  { href: "#camps", label: "Rescue Camps" },
  { href: "#alerts", label: "Alerts" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "#about", label: "About HAPS" },
]

export function Header() {
  const { setTheme, theme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
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

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Select language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.entries(languages) as [LanguageCode, string][]).map(([code, label]) => (
                <DropdownMenuItem 
                  key={code}
                  onClick={() => setLanguage(code)}
                  className="flex items-center justify-between"
                >
                  {label}
                  {language === code && <Check className="ml-2 h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            className="hidden gap-2 sm:flex"
            asChild
          >
            <Link href="#request-help">
              <AlertTriangle className="h-4 w-4" />
              SOS
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden gap-2 md:flex"
            asChild
          >
            <a href="tel:112">
              <Phone className="h-4 w-4" />
              Emergency: 112
            </a>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-4" />
                
                {/* Language Selection in Mobile */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Language</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.entries(languages) as [LanguageCode, string][]).map(([code, label]) => (
                      <Button
                        key={code}
                        variant={language === code ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLanguage(code)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <hr className="my-4" />
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  asChild
                >
                  <Link href="#request-help" onClick={() => setIsOpen(false)}>
                    <AlertTriangle className="h-4 w-4" />
                    Request Emergency Help
                  </Link>
                </Button>
                <Button variant="outline" className="w-full gap-2" asChild>
                  <a href="tel:112">
                    <Phone className="h-4 w-4" />
                    Call Emergency: 112
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
