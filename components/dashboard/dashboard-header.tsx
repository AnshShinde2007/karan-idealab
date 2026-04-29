"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Radio,
  Bell,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function DashboardHeader() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [notifications] = React.useState(5)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <nav className="flex flex-col gap-4 pt-8">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  <Home className="h-5 w-5" />
                  Back to Home
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-lg font-medium text-primary"
                >
                  <Radio className="h-5 w-5" />
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Radio className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-bold leading-tight">SkyRelief</span>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </div>
          </Link>

          <Badge variant="outline" className="ml-4 hidden gap-1 border-success/50 bg-success/10 text-success sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            System Online
          </Badge>
        </div>

        <div className="flex items-center gap-2">
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
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emergency p-0 text-xs text-emergency-foreground">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <span className="font-medium">New SOS Request</span>
                <span className="text-xs text-muted-foreground">
                  Critical priority - 2 minutes ago
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <span className="font-medium">Camp Capacity Alert</span>
                <span className="text-xs text-muted-foreground">
                  North Shelter at 90% - 15 minutes ago
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1">
                <span className="font-medium">Weather Update</span>
                <span className="text-xs text-muted-foreground">
                  Flood warning extended - 1 hour ago
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    OP
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium md:inline">
                  Operator
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
