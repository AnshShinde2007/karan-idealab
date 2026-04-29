"use client"

import { useState, useEffect } from "react"
import { db } from "./firebase"
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Timestamp,
  getDoc
} from "firebase/firestore"

export interface SOSRequest {
  id: string
  name: string
  phone: string
  location: {
    lat: number
    lng: number
    text: string
  }
  disaster: string
  people: number
  urgency: number
  status: "pending" | "in-progress" | "rescued"
  description: string
  createdAt: Date
  updatedAt: Date
  voiceMessage?: string
  photo?: string
}

// Hook for using SOS requests in real-time
export function useSOSRequests() {
  const [requests, setRequests] = useState<SOSRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // We only run this on the client
    if (typeof window === "undefined") return;

    try {
      const q = query(collection(db, "sosRequests"), orderBy("createdAt", "desc"))
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const docData = doc.data()
          return {
            id: doc.id,
            ...docData,
            createdAt: docData.createdAt?.toDate() || new Date(),
            updatedAt: docData.updatedAt?.toDate() || new Date(),
          } as SOSRequest
        })
        setRequests(data)
        setIsLoading(false)
      }, (err) => {
        console.error("Firebase subscription error:", err)
        setError(err as Error)
        setIsLoading(false)
      })

      return () => unsubscribe()
    } catch (e) {
      console.warn("Firebase not fully configured yet.", e)
      setIsLoading(false)
    }
  }, [])

  return {
    requests,
    isLoading,
    error,
  }
}

// Add new SOS request
export async function addSOSRequest(
  request: Omit<SOSRequest, "id" | "createdAt" | "updatedAt" | "status">
): Promise<SOSRequest> {
  // Firestore does not accept undefined values, so we filter them out
  const cleanRequest = Object.fromEntries(
    Object.entries(request).filter(([_, v]) => v !== undefined)
  )

  const docRef = await addDoc(collection(db, "sosRequests"), {
    ...cleanRequest,
    status: "pending",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  
  return {
    id: docRef.id,
    ...request,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Update SOS request status
export async function updateSOSStatus(
  id: string,
  status: SOSRequest["status"]
): Promise<SOSRequest | null> {
  const docRef = doc(db, "sosRequests", id)
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
  })
  
  // Return a partial object or fetch the latest if needed
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) return null;
  
  const docData = snapshot.data();
  return {
    id: snapshot.id,
    ...docData,
    createdAt: docData.createdAt?.toDate() || new Date(),
    updatedAt: docData.updatedAt?.toDate() || new Date(),
  } as SOSRequest
}

// Get SOS request by ID
export async function getSOSRequest(id: string): Promise<SOSRequest | null> {
  const snapshot = await getDoc(doc(db, "sosRequests", id))
  if (!snapshot.exists()) return null;
  
  const docData = snapshot.data()
  return {
    id: snapshot.id,
    ...docData,
    createdAt: docData.createdAt?.toDate() || new Date(),
    updatedAt: docData.updatedAt?.toDate() || new Date(),
  } as SOSRequest
}

// Stats
export function useSOSStats() {
  const { requests } = useSOSRequests()
  
  return {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    rescued: requests.filter((r) => r.status === "rescued").length,
    critical: requests.filter((r) => r.urgency >= 4 && r.status !== "rescued").length,
  }
}
