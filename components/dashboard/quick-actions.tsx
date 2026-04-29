"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Users,
  Megaphone,
  FileText,
  Radio,
  Settings,
  Plus,
  Send,
} from "lucide-react"

const quickActions = [
  {
    label: "Dispatch Team",
    icon: Users,
    variant: "default" as const,
  },
  {
    label: "Send Alert",
    icon: Megaphone,
    variant: "destructive" as const,
  },
  {
    label: "Generate Report",
    icon: FileText,
    variant: "outline" as const,
  },
  {
    label: "HAPS Status",
    icon: Radio,
    variant: "outline" as const,
  },
  {
    label: "Add Camp",
    icon: Plus,
    variant: "outline" as const,
  },
  {
    label: "Broadcast",
    icon: Send,
    variant: "outline" as const,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-5 w-5 text-warning" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              className="h-auto flex-col gap-2 py-4"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
