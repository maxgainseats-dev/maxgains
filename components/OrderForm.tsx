"use client"

import type React from "react"
import { useState, useEffect } from "react"

type Item = {
  quantity: number
  title: string
  isBogo?: boolean
  discountedPrice: number
  totalEstimatedForItem: number
}

type ValidationResult = {
  error?: string
  restaurantName?: string
  deliveryAddress?: string
  items?: Item[]
  estimatedSubtotal?: number
  ourPrice?: number
}

type User = {
  id: string
  email: string
  username?: string
}

type ServiceStatus = {
  isOpen: boolean
  message: string
}

type OrderFormProps = {
  link: string
  setLink: (value: string) => void
  validationResult: ValidationResult | null
  chatClosed: boolean
  ticketId?: string
  handleSubmit: () => void
  children?: React.ReactNode
  user: User | null
  existingTicket?: any
  onContinueExisting?: () => void
  ticketStatus?: string | null
  serviceStatus: ServiceStatus
}

export default function OrderForm({
  link,
  setLink,
  validationResult,
  chatClosed,
  ticketId,
  handleSubmit,
  children,
  user,
  existingTicket,
  onContinueExisting,
  ticketStatus,
  serviceStatus,
}: OrderFormProps) {
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (
      validationResult?.estimatedSubtotal &&
      validationResult.estimatedSubtotal >= 15 &&
      validationResult.estimatedSubtotal <= 23
    ) {
      setIsValidating(true)
      const timer = setTimeout(() => setIsValidating(false), 1000)
      return () => clearTimeout(timer)
    } else {
      setIsValidating(false)
    }
  }, [validationResult])

  const subtotal = validationResult?.estimatedSubtotal || 0

  // Existing active order
  if (existingTicket && existingTicket.status === "open") {
    return (
      <div className="bg-black border-2 border-primary rounded-3xl p-10 glow-orange-strong w-full max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 gradient-orange-glow rounded-full flex items-center justify-center mx-auto mb-6 glow-orange-strong">
            <span className="text-3xl">⚡</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Active Order Found</h2>
          <p className="text-gray-200 text-xl font-medium">
            You have an active order. Continue with your existing chat or wait for completion.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-black/50 border-2 border-primary/50 rounded-2xl p-8 glow-orange">
            <div className="flex items-center space-x-4 text-primary mb-4">
              <div className="w-8 h-8 gradient-orange-glow rounded-full flex items-center justify-center glow-orange">
                <span className="text-white text-sm font-black">!</span>
              </div>
              <span className="font-black text-2xl text-white">Active Order</span>
            </div>
            <p className="text-gray-200 font-bold text-lg">Order ID: #{existingTicket.id.slice(-8)}</p>
            <p className="text-gray-200 font-bold text-lg">Status: {existingTicket.status}</p>
          </div>

          <button
            onClick={onContinueExisting}
            className="w-full gradient-orange-glow text-white font-black text-xl py-6 px-8 rounded-2xl transition-all duration-300 hover:scale-105 glow-orange-strong flex items-center justify-center space-x-4"
          >
            <span>Continue Existing Chat</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">💬</span>
            </div>
          </button>

          <div className="text-center text-gray-400 font-medium">
            <p>You can only have one active order at a time.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black border-2 border-primary rounded-3xl p-4 lg:p-10 glow-orange-strong w-full mx-auto">
      <div className="text-center mb-10">
        <div className="w-20 h-20 gradient-orange-glow rounded-full flex items-center justify-center mx-auto mb-6 glow-orange-strong">
          <span className="text-3xl">🚀</span>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 text-glow-orange">Start Saving Now</h2>
        <p className="text-gray-200 text-xl font-medium">
          {!user
            ? "Sign in and paste your Uber Eats group order link below"
            : "Paste your Uber Eats group order link below"}
        </p>
      </div>

      <div className="space-y-8">
        {!user && serviceStatus.isOpen && (
          <div className="bg-black/50 border-2 border-primary/50 rounded-2xl p-8 glow-orange">
            <div className="flex items-center space-x-4 text-primary">
              <div className="w-8 h-8 gradient-orange-glow rounded-full flex items-center justify-center glow-orange">
                <span className="text-white text-sm font-black">!</span>
              </div>
              <span className="font-black text-xl text-white">Sign in required</span>
            </div>
            <p className="text-gray-200 font-medium text-lg mt-3">You must be signed in to create an order.</p>
          </div>
        )}

        {!serviceStatus.isOpen && (
          <div className="bg-black/50 border-2 border-primary/50 rounded-2xl p-8 glow-orange">
            <div className="flex items-center space-x-4 text-primary">
              <div className="w-8 h-8 gradient-orange-glow rounded-full flex items-center justify-center glow-orange">
                <span className="text-white text-sm font-black">×</span>
              </div>
              <span className="font-black text-xl text-white">Service Closed</span>
            </div>
            <p className="text-gray-200 font-medium text-lg mt-3">{serviceStatus.message}</p>
          </div>
        )}

        {serviceStatus.isOpen && user && (
          <div className="bg-black/50 border-2 border-accent/50 rounded-2xl p-8 shadow-lg shadow-accent/25">
            <div className="flex items-center space-x-4 text-accent">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/50">
                <span className="text-white text-sm font-black">✓</span>
              </div>
              <span className="font-black text-xl text-white">Service Open!</span>
            </div>
            <p className="text-gray-200 font-medium text-lg mt-3">Get Ready to Eat! Service is Open!</p>
          </div>
        )}

        <div>
          <label className="block text-xl font-black text-white mb-6">Group Order Link</label>
          <div className="relative">
            <input
              type="url"
              placeholder="https://ubereats.com/orders/..."
              className="w-full bg-black border-2 border-primary/50 focus:border-primary rounded-2xl px-6 py-6 text-white text-lg font-medium placeholder-gray-500 transition-all duration-300 focus:outline-none focus:glow-orange pr-16"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              disabled={!user || !serviceStatus.isOpen || (!chatClosed && !!ticketId)}
            />
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
              <div className="w-8 h-8 gradient-orange-glow rounded-full flex items-center justify-center glow-orange">
                <span className="text-white text-sm">🔗</span>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div
            className={`p-8 rounded-2xl border-2 ${
              validationResult.error
                ? "bg-black/50 border-primary/50 glow-orange"
                : "bg-black/50 border-accent/50 shadow-lg shadow-accent/25"
            }`}
          >
            {validationResult.error ? (
              <div className="flex items-center space-x-4 text-primary">
                <div className="w-8 h-8 gradient-orange-glow rounded-full flex items-center justify-center glow-orange">
                  <span className="text-white text-sm font-black">×</span>
                </div>
                <span className="font-bold text-xl text-white">{validationResult.error}</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-accent">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/50">
                    <span className="text-white text-sm font-black">✓</span>
                  </div>
                  <span className="font-black text-2xl text-white">Valid group link detected!</span>
                </div>

                {validationResult.restaurantName && (
                  <h3 className="font-black text-white text-3xl">{validationResult.restaurantName}</h3>
                )}

                {validationResult.deliveryAddress && (
                  <p className="text-gray-300 text-lg font-medium">{validationResult.deliveryAddress}</p>
                )}

                {validationResult.items && validationResult.items.length > 0 && (
                  <>
                    {subtotal >= 15 && subtotal <= 35 ? (
                      <div className="bg-black/80 rounded-2xl p-8 space-y-6 border-2 border-primary/30">
                        <h4 className="font-black text-white text-2xl">Order Summary</h4>
                        <div className="space-y-4">
                          {validationResult.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span className="font-bold text-white text-lg">
                                    {item.quantity} × {item.title}
                                  </span>
                                  {item.isBogo && (
                                    <span className="gradient-orange-glow text-white text-xs px-3 py-1 rounded-full font-black glow-orange">
                                      BOGO
                                    </span>
                                  )}
                                </div>
                                <div className="text-gray-400 font-medium mt-1">
                                  @ ${item.discountedPrice.toFixed(2)} each
                                </div>
                              </div>
                              <div className="font-black text-white text-lg">
                                ${item.totalEstimatedForItem.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-primary/30 pt-6 space-y-3">
                          <div className="flex justify-between text-lg">
                            <span className="text-gray-400 font-medium">Estimated Total (with fees & taxes):</span>
                            <span className="font-bold text-white">${(subtotal * 1.34).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-2xl font-black">
                            <span className="text-white">Your Price:</span>
                            <span className="gradient-orange-glow bg-clip-text text-transparent text-glow-orange">
                              ${validationResult.ourPrice?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-black/50 border-2 border-primary/50 text-gray-200 p-6 rounded-2xl font-bold text-lg glow-orange">
                        Cart value must be between $15 and 35. Please adjust your order.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={
            !user ||
            !serviceStatus.isOpen ||
            (!chatClosed && !!ticketId) ||
            !validationResult ||
            !!validationResult.error ||
            isValidating
          }
          className="w-full gradient-orange-glow text-white font-black text-lg px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 glow-orange-soft"
        >
          <span>
            {!user
              ? "Sign In to Continue"
              : !serviceStatus.isOpen
                ? "Service Closed"
                : !chatClosed && !!ticketId
                  ? "Chat Active"
                  : isValidating
                    ? "Validating..."
                    : !validationResult
                      ? "Enter Link Above"
                      : validationResult.error
                        ? "Invalid Link"
                        : "Start Chat"}
          </span>
          {!isValidating && validationResult && !validationResult.error && user && serviceStatus.isOpen && (
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">→</span>
            </div>
          )}
        </button>

        <div className="flex items-center justify-center space-x-4">
          <div
            className={`w-4 h-4 rounded-full ${
              serviceStatus.isOpen
                ? "bg-accent animate-pulse shadow-lg shadow-accent/50"
                : "gradient-orange-glow glow-orange"
            }`}
          ></div>
          <span className={`font-bold text-lg ${serviceStatus.isOpen ? "text-accent" : "text-primary"}`}>
            {serviceStatus.message}
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}
