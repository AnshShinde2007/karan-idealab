"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Phone,
  Eye,
  UserCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"
import { useSOSRequests, updateSOSStatus, type SOSRequest } from "@/lib/sos-store"
import { formatDistanceToNow } from "date-fns"
import { getDirectionsUrl } from "@/lib/location-utils"
import { playAlertSound } from "@/lib/notifications"

const urgencyColors: Record<number, string> = {
  1: "bg-success text-success-foreground",
  2: "bg-success/70 text-success-foreground",
  3: "bg-warning text-warning-foreground",
  4: "bg-emergency/70 text-emergency-foreground",
  5: "bg-emergency text-emergency-foreground animate-pulse",
}

const statusColors: Record<string, string> = {
  pending: "bg-emergency/10 text-emergency border-emergency/30",
  "in-progress": "bg-warning/10 text-warning border-warning/30",
  rescued: "bg-success/10 text-success border-success/30",
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  rescued: "Rescued",
}

export function SOSRequestsTable() {
  const { requests, isLoading } = useSOSRequests()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedRequest, setSelectedRequest] = React.useState<SOSRequest | null>(null)
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 6

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || req.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleStatusUpdate = async (id: string, newStatus: SOSRequest["status"]) => {
    setUpdatingId(id)
    try {
      await updateSOSStatus(id, newStatus)
      playAlertSound("success")
      toast.success(`Status updated to ${statusLabels[newStatus]}`)
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update status")
    } finally {
      setUpdatingId(null)
    }
  }

  const openInMaps = (request: SOSRequest) => {
    // Default starting point (can be rescue center location)
    const from = { lat: 28.6129, lng: 77.2295 }
    const to = { lat: request.location.lat, lng: request.location.lng }
    window.open(getDirectionsUrl(from, to), "_blank")
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-emergency" />
              SOS Requests
              {requests.filter(r => r.status === "pending").length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {requests.filter(r => r.status === "pending").length} new
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="rescued">Rescued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Disaster</TableHead>
                  <TableHead className="hidden sm:table-cell">People</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((request) => (
                  <TableRow 
                    key={request.id}
                    className={request.urgency >= 4 && request.status === "pending" ? "bg-emergency/5" : ""}
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      {request.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden capitalize">
                          {request.disaster}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden capitalize md:table-cell">
                      {request.disaster}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {request.people}
                    </TableCell>
                    <TableCell>
                      <Badge className={urgencyColors[request.urgency]}>
                        {request.urgency === 5 ? "Critical" : `Level ${request.urgency}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[request.status]}
                      >
                        {updatingId === request.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          statusLabels[request.status]
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground lg:table-cell">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedRequest(request)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openInMaps(request)}>
                            <MapPin className="mr-2 h-4 w-4" />
                            Open in Maps
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={`tel:${request.phone}`}>
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {request.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(request.id, "in-progress")}
                              className="text-warning"
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Start Rescue
                            </DropdownMenuItem>
                          )}
                          {request.status === "in-progress" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(request.id, "rescued")}
                              className="text-success"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Mark Rescued
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                      No requests found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedRequests.length} of {filteredRequests.length} requests
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono">{selectedRequest.id}</span>
                  <Badge className={urgencyColors[selectedRequest.urgency]}>
                    {selectedRequest.urgency === 5 ? "Critical" : `Level ${selectedRequest.urgency}`}
                  </Badge>
                  <Badge variant="outline" className={statusColors[selectedRequest.status]}>
                    {statusLabels[selectedRequest.status]}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Submitted {formatDistanceToNow(selectedRequest.createdAt, { addSuffix: true })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a href={`tel:${selectedRequest.phone}`} className="font-semibold text-primary hover:underline">
                      {selectedRequest.phone}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disaster Type</p>
                    <p className="font-semibold capitalize">{selectedRequest.disaster}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">People Affected</p>
                    <p className="font-semibold">{selectedRequest.people}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{selectedRequest.location.text}</p>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-xs"
                      onClick={() => openInMaps(selectedRequest)}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Open in Google Maps
                    </Button>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Situation Description</p>
                    <p className="text-sm">{selectedRequest.description}</p>
                  </div>
                </div>
              </div>

              {selectedRequest.photo && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Attached Photo</p>
                  <img
                    src={selectedRequest.photo}
                    alt="Emergency situation"
                    className="max-h-48 rounded-lg border object-cover"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" asChild>
                  <a href={`tel:${selectedRequest.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </a>
                </Button>
                <Button variant="outline" onClick={() => openInMaps(selectedRequest)}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Directions
                </Button>
                {selectedRequest.status === "pending" && (
                  <Button
                    onClick={() => {
                      handleStatusUpdate(selectedRequest.id, "in-progress")
                      setSelectedRequest(null)
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Rescue
                  </Button>
                )}
                {selectedRequest.status === "in-progress" && (
                  <Button
                    variant="default"
                    className="bg-success hover:bg-success/90"
                    onClick={() => {
                      handleStatusUpdate(selectedRequest.id, "rescued")
                      setSelectedRequest(null)
                    }}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Mark Rescued
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
