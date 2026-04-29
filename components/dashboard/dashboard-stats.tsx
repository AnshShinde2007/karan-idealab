"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useSOSStats } from "@/lib/sos-store"
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
} from "lucide-react"

export function DashboardStats() {
  const stats = useSOSStats()

  const statCards = [
    {
      title: "Active SOS Requests",
      value: stats.pending,
      change: `${stats.critical} critical`,
      icon: AlertTriangle,
      color: "text-emergency",
      bgColor: "bg-emergency/10",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      change: "Rescue teams deployed",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Rescued Today",
      value: stats.rescued,
      change: "Successfully evacuated",
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Requests",
      value: stats.total,
      change: "All time",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
