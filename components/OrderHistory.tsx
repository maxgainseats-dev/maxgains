"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

type Ticket = {
  id: string
  link: string
  status: string
  created_at: string
  completion_link?: string
  completed_at?: string
  closed_at?: string
  validation_data: {
    restaurantName?: string
    estimatedSubtotal?: number
    ourPrice?: number
    estimatedSavings?: number
  }
}

type OrderHistoryProps = {
  userId: string
  onViewTicket: (ticketId: string) => void
  onBackToOrderForm: () => void
}

export default function OrderHistory({ userId, onViewTicket, onBackToOrderForm }: OrderHistoryProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

  const validateSession = async () => {
    const sessionToken = localStorage.getItem("grubslash_session")
    if (!sessionToken) {
      setError("Please sign in to view your order history.")
      return false
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/validate-session`, {
        headers: {
          "Authorization": `Bearer ${sessionToken}`
        }
      })

      if (!response.ok) {
        setError("Your session has expired. Please sign in again.")
        // Clear expired session
        localStorage.removeItem("grubslash_user")
        localStorage.removeItem("grubslash_session")
        return false
      }
      return true
    } catch (error) {
      setError("Session validation failed. Please sign in again.")
      return false
    }
  }

  

  const fetchTickets = async () => {
    setLoading(true)
    setError(null)
    
    const isValidSession = await validateSession()
    if (!isValidSession) {
      setLoading(false)
      return
    }

    const sessionToken = localStorage.getItem("grubslash_session")

    try {
      const response = await fetch(`${BACKEND_URL}/api/tickets/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${sessionToken}`
        }
      })
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          setError("Your session has expired. Please sign in again.")
          localStorage.removeItem("grubslash_user")
          localStorage.removeItem("grubslash_session")
        } else {
          throw new Error(data.error || "Failed to fetch tickets.")
        }
        return
      }
      setTickets(data.tickets)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching orders.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchTickets()
    }
  }, [userId, BACKEND_URL])

  // Auto-refresh every 30 seconds to get status updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (userId) {
        fetchTickets()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [userId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-600">Loading order history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
        <Button onClick={onBackToOrderForm} className="mt-4">
          Back to Order Form
        </Button>
      </div>
    )
  }

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "closed":
      return "bg-slate-200 text-slate-800"
    case "deleted":
      return "bg-red-100 text-red-800"
    default:
      return "bg-slate-200 text-slate-800"
  }
}


  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Active"
      case "completed":
        return "Completed"
      case "closed":
        return "Closed"
      case "deleted":
        return "Cancelled"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return (
 <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
      My Order History
    </h2>
    <Button onClick={onBackToOrderForm} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg shadow-orange-500/30 justify-center">
      Back to New Order
    </Button>
  </div>

  {tickets.length === 0 ? (
    <div className="text-center p-8 bg-neutral-900/80 border border-neutral-800/50 rounded-2xl shadow-xl shadow-orange-500/20">
      <p className="text-gray-200">You haven't placed any orders yet.</p>
      <Button onClick={onBackToOrderForm} className="mt-4">
        Start Your First Order
      </Button>
    </div>
  ) : (
    <div className="grid gap-6">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="bg-neutral-900/80 border border-neutral-800/50 rounded-2xl shadow-md hover:shadow-2xl transition-shadow p-6"
        >
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-white">
              <span>Order #{ticket.id.slice(-8)}</span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                  ticket.status
                )}`}
              >
                {getStatusText(ticket.status)}
              </span>
            </CardTitle>
            <p className="text-sm text-slate-300">{format(new Date(ticket.created_at), "PPP p")}</p>
          </CardHeader>

          <CardContent className="space-y-2 text-slate-200">
            {ticket.validation_data?.restaurantName && (
              <p>
                <span className="font-semibold">Restaurant:</span> {ticket.validation_data.restaurantName}
              </p>
            )}
            {ticket.validation_data?.ourPrice && (
              <p>
                <span className="font-semibold">Your Price:</span> ${ticket.validation_data.ourPrice.toFixed(2)}
              </p>
            )}
            {ticket.completion_link && (
              <p>
                <span className="font-semibold">Order Link:</span>{" "}
                <a
                  href={ticket.completion_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline"
                >
                  View Order
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )}
</div>


  )
}
