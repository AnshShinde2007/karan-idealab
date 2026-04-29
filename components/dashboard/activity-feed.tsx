"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Users,
  Tent,
  Bell,
  Radio,
} from "lucide-react"

const activities = [
  {
    id: 1,
    type: "sos",
    message: "New SOS request received from John Doe",
    location: "Northern Valley",
    time: "Just now",
    icon: AlertTriangle,
    color: "text-emergency",
    bgColor: "bg-emergency/10",
  },
  {
    id: 2,
    type: "rescue",
    message: "Team Alpha rescued 4 people",
    location: "Riverside Area",
    time: "5 min ago",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 3,
    type: "team",
    message: "Team Bravo dispatched to SOS-003",
    location: "Industrial Zone",
    time: "12 min ago",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 4,
    type: "camp",
    message: "North Shelter capacity at 90%",
    location: "North District",
    time: "18 min ago",
    icon: Tent,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 5,
    type: "alert",
    message: "Flood warning extended for 6 hours",
    location: "All Regions",
    time: "25 min ago",
    icon: Bell,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 6,
    type: "haps",
    message: "HAPS coverage expanded to Eastern Zone",
    location: "Eastern Province",
    time: "32 min ago",
    icon: Radio,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 7,
    type: "rescue",
    message: "Successfully evacuated 15 families",
    location: "Low-lying Areas",
    time: "45 min ago",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: 8,
    type: "sos",
    message: "Critical SOS from building collapse site",
    location: "Downtown",
    time: "1 hour ago",
    icon: AlertTriangle,
    color: "text-emergency",
    bgColor: "bg-emergency/10",
  },
]

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-primary" />
            Activity Feed
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4 pt-0">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${activity.bgColor}`}
                >
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-tight">{activity.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.location}
                    </span>
                    <span>•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
