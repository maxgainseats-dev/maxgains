"use client"

import type React from "react"

type AuthModalProps = {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function AuthModal({ visible, onClose, children }: AuthModalProps) {
  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl shadow-orange-500/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700/80 border border-gray-600/50 transition-all duration-200 text-gray-300 hover:text-white text-xl hover:scale-105"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
