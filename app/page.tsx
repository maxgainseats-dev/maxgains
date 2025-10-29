"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import io from "socket.io-client"
import OrderForm from "@/components/OrderForm"
import FAQModal from "@/components/FAQModal"
import HeroSection from "@/components/HeroSection"
import QuickGuide from "@/components/QuickGuide"
import HowItWorks from "@/components/HowItWorksSection"
import Features from "@/components/Features"
import Navigation from "@/components/Navigation"
import SignInForm from "@/components/SignInForm"
import SignUpForm from "@/components/SignUpForm"
import OrderHistory from "@/components/OrderHistory"
import AuthModal from "@/components/AuthModal"
import ChatWindow from "@/components/ChatWindow"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

type User = {
  id: string
  email: string
  username?: string
  full_name?: string
  avatar_url?: string
}

type Message = {
  from: "user" | "agent" | "system"
  content: string
  sender?: string
}

type ValidationResult = {
  error?: string
  restaurantName?: string
  deliveryAddress?: string
  items?: any[]
  estimatedSubtotal?: number
  ourPrice?: number
  estimatedSavings?: number
}

type ServiceStatus = {
  isOpen: boolean
  message: string
}

export default function App() {
  const [link, setLink] = useState("")
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [chatClosed, setChatClosed] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const socketRef = useRef<any>(null)
  const globalSocketRef = useRef<any>(null) // New global socket for persistent connection
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [viewMode, setViewMode] = useState<"orderForm" | "orderHistory">("orderForm")
  const [existingTicket, setExistingTicket] = useState<any>(null)
  const [ticketStatus, setTicketStatus] = useState<string | null>(null)
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    isOpen: true,
    message: "All systems operational",
  })

  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open)
  const openFAQModal = () => setShowFAQModal(true)
  const closeFAQModal = () => setShowFAQModal(false)

  // Global socket connection for persistent updates
  const connectGlobalSocket = useCallback(() => {
    if (globalSocketRef.current) {
      globalSocketRef.current.disconnect()
    }

    const socket = io(BACKEND_URL)

    socket.on("connect", () => {
      console.log("Global socket connected")
      // If user has an existing ticket, join it for updates
      if (user && existingTicket) {
        socket.emit("joinTicketForUpdates", existingTicket.id)
      }
    })

    socket.on("serviceStatusChanged", (status: ServiceStatus) => {
      setServiceStatus(status)
    })

    socket.on("ticketStatusChanged", (data: { ticketId: string; status: string }) => {
      console.log("Global socket received status change:", data)

      // Only update if this is for the current user's ticket
      if (existingTicket && existingTicket.id === data.ticketId) {
        setTicketStatus(data.status)

        // Update existing ticket status
        setExistingTicket((prev: any) => {
          if (prev && prev.id === data.ticketId) {
            return { ...prev, status: data.status }
          }
          return prev
        })

        if (data.status === "deleted" || data.status === "closed") {
          setChatClosed(true)
          setShowChat(false)
          localStorage.removeItem("chatSession")

          if (data.status === "deleted") {
            // Clear all ticket-related state when deleted
            setTicketId(null)
            setExistingTicket(null)
            setTicketStatus(null)
            setMessages([])
            setLink("")
            setValidationResult(null)
          }
        }
      }
    })

    socket.on("ticketCompleted", (data: { ticketId: string; completionLink: string }) => {
      console.log("Global socket received completion:", data)

      // Only update if this is for the current user's ticket
      if (existingTicket && existingTicket.id === data.ticketId) {
        setTicketStatus("completed")
        // Update existing ticket status
        setExistingTicket((prev: any) => (prev ? { ...prev, status: "completed" } : null))
      }
    })

    globalSocketRef.current = socket
  }, [BACKEND_URL, user, existingTicket])

  const handleUserLogin = useCallback((loggedInUser: User, session: any) => {
    setUser(loggedInUser)
    localStorage.setItem("grubslash_user", JSON.stringify(loggedInUser))
    localStorage.setItem("grubslash_session", session.access_token)
    setShowAuthModal(false)

    // Check for existing tickets after login
    checkExistingTickets(loggedInUser.id, session.access_token)
  }, [])

  const checkExistingTickets = useCallback(
    async (userId: string, sessionToken: string) => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/tickets/check-existing/${userId}`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.hasExisting) {
            setExistingTicket(data.ticket)
            setTicketId(data.ticket.id)
            setTicketStatus(data.ticket.status)
            if (data.ticket.status === "open") {
              setChatClosed(false)
            }
          } else {
            setExistingTicket(null)
            setTicketId(null)
            setTicketStatus(null)
          }
        }
      } catch (error) {
        console.error("Error checking existing tickets:", error)
      }
    },
    [BACKEND_URL],
  )

  const validateAndRefreshSession = useCallback(async () => {
    const savedSession = localStorage.getItem("grubslash_session")
    if (!savedSession) {
      handleLogout()
      return false
    }

    try {
      // Try to validate the current session
      const response = await fetch(`${BACKEND_URL}/api/auth/validate-session`, {
        headers: {
          Authorization: `Bearer ${savedSession}`,
        },
      })

      if (response.ok) {
        return true
      } else {
        // Session is invalid, clear it and logout
        console.log("Session expired, logging out")
        handleLogout()
        return false
      }
    } catch (error) {
      console.error("Error validating session:", error)
      handleLogout()
      return false
    }
  }, [BACKEND_URL])

  const handleLogout = useCallback(async () => {
    setUser(null)
    localStorage.removeItem("grubslash_user")
    localStorage.removeItem("grubslash_session")
    localStorage.removeItem("chatSession")
    setTicketId(null)
    setMessages([])
    setChatClosed(true)
    setShowChat(false)
    setLink("")
    setValidationResult(null)
    setViewMode("orderForm")
    setExistingTicket(null)
    setTicketStatus(null)

    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    if (globalSocketRef.current) {
      globalSocketRef.current.disconnect()
      globalSocketRef.current = null
    }

    try {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }, [BACKEND_URL])

  // Fetch service status and user on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch service status
      try {
        const statusResponse = await fetch(`${BACKEND_URL}/api/service-status`)
        if (statusResponse.ok) {
          const status = await statusResponse.json()
          setServiceStatus(status)
        }
      } catch (error) {
        console.error("Error fetching service status:", error)
      }

      // Fetch user
      const savedUser = localStorage.getItem("grubslash_user")
      const savedSession = localStorage.getItem("grubslash_session")

      if (savedUser && savedSession) {
        const isValidSession = await validateAndRefreshSession()
        if (isValidSession) {
          const user = JSON.parse(savedUser)
          setUser(user)
          checkExistingTickets(user.id, savedSession)
        }
      } else {
        localStorage.removeItem("grubslash_user")
        localStorage.removeItem("grubslash_session")
        setUser(null)
      }
    }

    fetchInitialData()
  }, [checkExistingTickets, validateAndRefreshSession, BACKEND_URL])

  // Connect global socket when user logs in or existing ticket changes
  useEffect(() => {
    if (user) {
      connectGlobalSocket()
    }

    return () => {
      if (globalSocketRef.current) {
        globalSocketRef.current.disconnect()
        globalSocketRef.current = null
      }
    }
  }, [user, existingTicket?.id, connectGlobalSocket])

  const connectToChat = useCallback(
    (id: string, clearMessages = false) => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }

      if (clearMessages) {
        setMessages([])
      }

      const socket = io(BACKEND_URL)
      socket.on("connect", () => {
        socket.emit("joinTicket", id)
      })

      socket.on("agentMessage", (data: { sender?: string; content: string }) => {
        const senderName = data.sender || "Agent"
        setMessages((prev) => [...prev, { from: "agent", content: data.content, sender: senderName }])
      })

      socket.on("userMessage", (content: string) => {
        setMessages((prev) => [...prev, { from: "user", content }])
      })

      socket.on("chatClosed", (msg: string) => {
        setMessages((prev) => [...prev, { from: "system", content: msg }])
        setChatClosed(true)
        setShowChat(false)
        localStorage.removeItem("chatSession")
      })

      socket.on("ticketCompleted", (data: { ticketId: string; completionLink: string }) => {
        console.log("Chat socket received completion:", data)
        console.log("Current ticketId in chat:", ticketId)

        setMessages((prev) => [
          ...prev,
          {
            from: "system",
            content: `Order completed! You can view your order at: ${data.completionLink}`,
          },
        ])
        setTicketStatus("completed")
        // Update existing ticket status
        setExistingTicket((prev: any) => (prev ? { ...prev, status: "completed" } : null))
      })

      socket.on("ticketStatusChanged", (data: { ticketId: string; status: string }) => {
        setTicketStatus(data.status)

        // Update existing ticket status
        setExistingTicket((prev: any) => {
          if (prev && prev.id === data.ticketId) {
            return { ...prev, status: data.status }
          }
          return prev
        })

        if (data.status === "deleted" || data.status === "closed") {
          setChatClosed(true)
          setShowChat(false)
          localStorage.removeItem("chatSession")

          if (data.status === "deleted") {
            // Clear all ticket-related state when deleted
            setTicketId(null)
            setExistingTicket(null)
            setTicketStatus(null)
            setMessages([])
            setLink("")
            setValidationResult(null)
          }
        }
      })

      socket.on("serviceStatusChanged", (status: ServiceStatus) => {
        setServiceStatus(status)
      })

      socketRef.current = socket
    },
    [BACKEND_URL],
  )

  const validateGroupLink = useCallback(
    async (groupLink: string) => {
      setIsValidating(true)
      setValidationResult(null)

      try {
        const response = await fetch("/api/proxy-validate-group-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "", // Or hardcoded for now
          },
          body: JSON.stringify({ groupLink, service: "UberEats" }),
        })

        // ✅ Handle 204 No Content
        if (response.status === 204) {
          const result = {
            success: true,
            message: "No content returned (204)",
          }
          setValidationResult(result)
          return result
        }

        // ✅ Handle 503
        if (response.status === 503) {
          const data = await response.json()
          const result = {
            error: data.error || "Service is currently closed",
          }
          setValidationResult(result)
          return null
        }

        // ❌ Handle other errors
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP ${response.status}: ${errorText}`)
        }

        // ✅ Handle 200 OK
        const data = await response.json()
        setValidationResult(data)
        return data
      } catch (error: any) {
        console.error("Error validating group link:", error)
        setValidationResult({
          error: error.message || "Failed to validate link. Please try again.",
        })
        return null
      } finally {
        setIsValidating(false)
      }
    },
    [], // No dependencies needed now that BACKEND_URL is removed
  )

  const handleSubmit = async (customerData?: {
    username: string
    address: string
    deliveryNotes: string
    paymentMethod: string
  }) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (!serviceStatus.isOpen) {
      alert("Service is currently closed. Please try again later.")
      return
    }

    if (!link.trim()) return alert("Please enter a valid Uber Eats group link.")
    if (!validationResult || validationResult.error) {
      return alert("Please wait for link validation to complete or enter a valid link.")
    }

    const sessionToken = localStorage.getItem("grubslash_session")

    try {
      const res = await fetch(`${BACKEND_URL}/api/create-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          link,
          validationData: validationResult,
          customerData, // Pass customer data to backend
        }),
      })

      const data = await res.json()

      if (res.status === 503) {
        alert(data.error || "Service is currently closed. Please try again later.")
        return
      }

      if (data.ticketId) {
        setTicketId(data.ticketId)
        setChatClosed(false)
        setTicketStatus("open")
        localStorage.setItem("chatSession", JSON.stringify({ ticketId: data.ticketId }))
        setMessages([])
        connectToChat(data.ticketId, true)
        setShowChat(true)
        setExistingTicket({ id: data.ticketId, status: "open" })
      } else if (data.error) {
        if (data.existingTicketId) {
          alert("You already have an open ticket. Please complete or cancel it first.")
          setTicketId(data.existingTicketId)
          setExistingTicket({ id: data.existingTicketId, status: "open" })
          setChatClosed(false)
          setTicketStatus("open")
        } else {
          alert("Error: " + data.error)
        }
      }
    } catch (err) {
      console.error("Failed to create ticket:", err)
      alert("Something went wrong. Please try again.")
    }
  }

  const handleContinueExistingChat = () => {
    if (existingTicket && existingTicket.status === "open") {
      connectToChat(existingTicket.id, true)
      setShowChat(true)
      setChatClosed(false)
    }
  }

  const handleSendMessage = () => {
    if (chatInput.trim() && socketRef.current && ticketId && !chatClosed) {
      const message = { from: "user", content: chatInput }
      setMessages((prev) => [...prev, message])
      socketRef.current.emit("userMessage", { ticketId, content: chatInput })
      setChatInput("")
    }
  }

  const handleCloseChat = () => setShowChat(false)
  const handleOpenChat = () => {
    if (ticketId && !chatClosed) setShowChat(true)
  }

  const handleViewTicketFromHistory = (id: string) => {
    setTicketId(id)
    connectToChat(id, true)
    setShowChat(true)
    setViewMode("orderForm")

    // Check ticket status
    fetch(`${BACKEND_URL}/api/validate-ticket/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setTicketStatus(data.ticket.status)
          setExistingTicket(data.ticket)
          if (data.ticket.status === "open") {
            setChatClosed(false)
          } else {
            setChatClosed(true)
          }
        }
      })
      .catch(console.error)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileMenuOpen])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (link.trim() && link.includes("eats.uber.com")) {
        validateGroupLink(link)
      } else if (link.trim() && !link.includes("eats.uber.com")) {
        setValidationResult({ error: "Please enter a valid Uber Eats link" })
      } else {
        setValidationResult(null)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [link, validateGroupLink])

  const handleViewModeChange = useCallback(
    async (mode: "orderForm" | "orderHistory") => {
      if (mode === "orderHistory" && user) {
        const isValidSession = await validateAndRefreshSession()
        if (isValidSession) {
          setViewMode(mode)
        }
      } else {
        setViewMode(mode)
      }
    },
    [user, validateAndRefreshSession],
  )

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navigation
        user={user}
        setShowAuthModal={setShowAuthModal}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        openFAQModal={openFAQModal}
        handleLogout={handleLogout}
        setViewMode={handleViewModeChange}
      />

      <div className="min-h-screen bg-black">
        {viewMode === "orderForm" && (
          <>
            <div className="relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.3),transparent_70%)]"></div>

              <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-2 lg:px-8 py-6 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-16 items-start">
                  {/* Order form - shows first on mobile, takes 3/5 on desktop */}
                  <div className="order-2 lg:order-2 lg:col-span-3 w-full">
                    <div className="modern-card p-0.5 sm:p-5 lg:p-8 w-full">
                      <OrderForm
                        link={link}
                        setLink={setLink}
                        validationResult={validationResult}
                        chatClosed={chatClosed}
                        ticketId={ticketId}
                        handleSubmit={handleSubmit}
                        user={user}
                        existingTicket={existingTicket}
                        onContinueExisting={handleContinueExistingChat}
                        ticketStatus={ticketStatus}
                        serviceStatus={serviceStatus}
                      >
                        <QuickGuide />
                      </OrderForm>
                    </div>
                  </div>

                  {/* Hero section - shows second on mobile, takes 2/5 on desktop */}
                  <div className="order-1 lg:order-1 lg:col-span-2 w-full max-w-full">
                    <div className="relative w-full overflow-visible px-4 sm:px-6 lg:px-0">
                      <HeroSection />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="py-6 lg:py-8">
              <div className="section-container">
                <Features />
              </div>
            </section>

            <section className="relative py-6 lg:py-8 bg-black">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.3),transparent_70%)]"></div>
              <div className="relative section-container">
                <HowItWorks />
              </div>
            </section>
          </>
        )}

        {viewMode === "orderHistory" && user && (
          <div className="py-8">
            <OrderHistory
              userId={user.id}
              onViewTicket={handleViewTicketFromHistory}
              onBackToOrderForm={() => setViewMode("orderForm")}
            />
          </div>
        )}

        <ChatWindow
          showChat={showChat}
          ticketId={ticketId}
          chatClosed={chatClosed}
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          handleSendMessage={handleSendMessage}
          handleCloseChat={handleCloseChat}
          handleOpenChat={handleOpenChat}
          setChatClosed={setChatClosed}
          setTicketId={setTicketId}
          setMessages={setMessages}
          setValidationResult={setValidationResult}
          setLink={setLink}
          ticketStatus={ticketStatus}
        />
      </div>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal visible={showAuthModal} onClose={() => setShowAuthModal(false)}>
          {authMode === "signin" ? (
            <SignInForm onSuccess={handleUserLogin} onSwitchToSignUp={() => setAuthMode("signup")} />
          ) : (
            <SignUpForm onSuccess={handleUserLogin} onSwitchToSignIn={() => setAuthMode("signin")} />
          )}
        </AuthModal>
      )}
      {showFAQModal && <FAQModal visible={showFAQModal} onClose={closeFAQModal} />}
    </div>
  )
}
