"use client"

import * as React from "react"
import { useSOSRequests, useSOSStats, updateSOSStatus } from "@/lib/sos-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, AlertTriangle, Users, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { requests, isLoading } = useSOSRequests()
  const stats = useSOSStats()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Rescue Operations Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical / Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emergency">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rescued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.rescued}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No SOS requests have been submitted yet.</p>
            </CardContent>
          </Card>
        ) : (
          requests.map((req) => (
            <Card key={req.id} className={req.status === 'pending' ? 'border-l-4 border-l-emergency' : ''}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={req.status === 'rescued' ? 'default' : req.status === 'in-progress' ? 'secondary' : 'destructive'} 
                         className={req.status === 'rescued' ? 'bg-success' : req.status === 'in-progress' ? 'bg-warning text-warning-foreground' : ''}>
                    {req.status.toUpperCase()}
                  </Badge>
                  <CardTitle className="text-lg">{req.name} ({req.disaster})</CardTitle>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Clock className="inline mr-1 h-3 w-3" />
                  {new Date(req.createdAt).toLocaleString()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" /> {req.phone}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {req.location.text}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" /> {req.people} people
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Urgency Level: {req.urgency}/5
                    </p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-sm font-medium">Description:</p>
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm font-medium">Update Status:</span>
                      <Select 
                        value={req.status} 
                        onValueChange={(val: any) => updateSOSStatus(req.id, val)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="rescued">Rescued</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
