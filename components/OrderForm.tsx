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
   <div className="bg-neutral-900/95 border-2 border-orange-500/50 rounded-3xl p-10 shadow-2xl shadow-orange-500/25 w-full max-w-2xl mx-auto">
  <div className="text-center mb-10">
    {/* ⚡ Clean glowing circle */}
    <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 glow-orange">
      <span className="text-3xl text-white">⚡</span>
    </div>

    <h2 className="text-3xl font-black text-white mb-4">Active Order Found</h2>
    <p className="text-gray-200 text-xl font-medium">
      You have an active order. Continue with your existing chat or wait for completion.
    </p>
  </div>

        <div className="space-y-8">

  <div className="bg-black/50 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-8 glow-orange">
    <div className="flex items-center space-x-4 text-orange-300 mb-4">
 
      <div className="w-8 h-8 rounded-full flex items-center justify-center glow-orange">
        <span className="text-orange-300 text-sm font-black">!</span>
      </div>

      <span className="font-black text-2xl text-white">Active Order</span>
    </div>

    <p className="text-orange-200 font-bold text-lg">Order ID: #{existingTicket.id.slice(-8)}</p>
    <p className="text-orange-200 font-bold text-lg">Status: {existingTicket.status}</p>
  </div>



          <button
            onClick={onContinueExisting}
            className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 text-white font-black text-xl py-6 px-8 rounded-2xl transition-all duration-300 shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/75 hover:scale-105 flex items-center justify-center space-x-4"
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
    <div className="bg-neutral-900/95 border-2 border-orange-500/50 rounded-3xl p-4 lg:p-10 shadow-2xl shadow-orange-500/25 glow-orange w-full mx-auto">
      <div className="text-center mb-10">
  <div className="w-20 h-20 bg-gradient-to-br from-orange-500/40 to-orange-700/30 rounded-full flex items-center justify-center mx-auto mb-6 glow-orange">
    <span className="text-3xl text-white">🚀</span>
  </div>
  <h2 className="text-4xl font-black text-white mb-4">Start Saving Now</h2>
  <p className="text-gray-200 text-xl font-medium">
    {!user
      ? "Sign in and paste your Uber Eats group order link below"
      : "Paste your Uber Eats group order link below"}
  </p>
</div>


      <div className="space-y-8">
        {!user && serviceStatus.isOpen && (
           <div className="bg-gradient-to-r from-orange-400/20 via-red-500/20 to-pink-500/20 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-8">
            <div className="flex items-center space-x-4 text-orange-300">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                <span className="text-white text-sm font-black">×</span>
              </div>
              <span className="font-black text-xl text-white">Sign in Required</span>
            </div>
            <p className="text-orange-200 font-medium text-lg mt-3">You Must be Signed in to Order!</p>
          </div>
        )}

        {!serviceStatus.isOpen && (
         <div className="bg-gradient-to-r from-orange-400/20 via-red-500/20 to-pink-500/20 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-8">
            <div className="flex items-center space-x-4 text-orange-300">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                <span className="text-white text-sm font-black">×</span>
              </div>
              <span className="font-black text-xl text-white">Service Closed</span>
            </div>
            <p className="text-orange-200 font-medium text-lg mt-3">{serviceStatus.message}</p>
          </div>
        )}

       {serviceStatus.isOpen && user && (
  <div className="bg-green-500/20 backdrop-blur-xl border border-green-500/40 rounded-2xl p-8">
    <div className="flex items-center space-x-4 text-green-300">
      <div className="w-8 h-8 glow-orange rounded-full flex items-center justify-center">
        <span className="text-green-300 text-sm font-black">✓</span>
      </div>
      <span className="font-black text-xl text-white">Service Open!</span>
    </div>
    <p className="text-green-200 font-medium text-lg mt-3">Get Ready to Eat! Service is Open!</p>
  </div>
)}

      <div>
  <label className="block text-xl font-black text-white mb-6">Group Order Link</label>
  <div className="relative">
    <input
      type="url"
      placeholder="https://ubereats.com/orders/..."
      className="w-full 
    bg-black 
    border-2 border-transparent 
    rounded-2xl 
    px-6 py-6 
    text-white text-lg font-medium 
    placeholder-gray-400 
    transition-all duration-300 
    focus:outline-none 
    focus:border-orange-500 
    focus:ring-4 focus:ring-orange-500/50 
    focus:shadow-[0_0_20px_rgba(255,165,0,0.6)] 
    pr-16"
      value={link}
      onChange={(e) => setLink(e.target.value)}
      disabled={!user || !serviceStatus.isOpen || (!chatClosed && !!ticketId)}
    />
    <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
    
      <div className="w-8 h-8 bg-gradient-to-br from-orange-500/40 to-orange-700/30 rounded-full flex items-center justify-center glow-orange">
        <span className="text-white text-sm">🔗</span>
      </div>
    </div>
  </div>
</div>


        {/* Validation Result */}
        {validationResult && (
          <div
            className={`p-8 rounded-2xl backdrop-blur-xl ${
              validationResult.error
                ? "bg-red-500/20 border border-orange-500/40 glow-orange"
                : "bg-green-500/20 border border-green-500/40 glow-orange"
            }`}
          >
            {validationResult.error ? (
              <div className="flex items-center space-x-4 text-orange-300">
                <div className="w-8 h-8 glow-orange rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
                  <span className="text-white text-sm font-black">×</span>
                </div>
                <span className="font-bold text-xl text-white">{validationResult.error}</span>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-green-300">
  <div className="w-8 h-8 glow-orange rounded-full flex items-center justify-center">
    <span className="text-green-300 text-sm font-black">✓</span>
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
                    {subtotal >= 15 && subtotal <= 30 ? (
                      <div className="bg-black/80 rounded-2xl p-8 space-y-6 border border-orange-500/40 glow-orange">
  {validationResult.items.map((item, index) => (
    <div key={index} className="flex justify-between items-center border-b border-orange-500/20 pb-4">
      <div>
        <p className="text-white font-bold text-lg">
          {item.quantity} x {item.title} {item.isBogo ? "(BOGO)" : ""}
        </p>
        <p className="text-orange-200 font-medium text-sm">
          Discounted Price: ${item.discountedPrice.toFixed(2)}
        </p>
      </div>
      <p className="text-white font-black text-lg">${item.totalEstimatedForItem.toFixed(2)}</p>
    </div>
  ))}

  <div className="flex justify-between items-center">
    <span className="text-white font-black text-xl">Original Uber Subtotal</span>
    <span className="text-orange-300 font-bold text-xl">${subtotal.toFixed(2)}</span>
  </div>

  {/* {validationResult.ourPrice && (
    // <div className="flex justify-between items-center mt-2">
    //   <span className="text-white font-black text-xl">Our Price</span>
    //   <span className="text-orange-400 font-bold text-xl">${validationResult.ourPrice.toFixed(2)}</span>
    // </div>
  )} */}
</div>

                    ) : (
                      <div className="bg-red-500/20 border border-orange-500/40 text-gray-200 p-6 rounded-2xl font-bold text-lg glow-orange">
                        Cart value must be between $15 and 30. Please adjust your order.
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
          className="w-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-black text-xl py-6 px-8 rounded-2xl transition-all duration-300 shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/75 hover:scale-105 disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center space-x-4"
        >
          <span>Submit Order</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg">🍔</span>
          </div>
        </button>
      </div>
    </div>
  )
}
