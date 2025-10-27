"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"

type SignUpFormProps = {
  onSuccess: (user: any, session: any) => void
  onSwitchToSignIn: () => void
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [usernameError, setUsernameError] = useState<string | null>(null)

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    setUsernameError(null)

    if (username.length < 3 || username.length > 20) {
      setUsernameError("Username must be between 3 and 20 characters.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up.")
      }

      if (data.session) {
        onSuccess(data.user, data.session)
      } else {
        setMessage(data.message)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google.")
      setLoading(false)
    }
  }

  const handleAppleSignUp = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Apple.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-3">
          Create Your Account
        </h2>
        <p className="text-gray-300 text-lg">Sign up to start saving on your orders.</p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl hover:bg-gray-700/80 hover:border-green-500/50 transition-all duration-200 disabled:opacity-50 font-medium backdrop-blur-sm group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="text-white group-hover:text-green-300 transition-colors">Continue with Google</span>
        </button>
        {/* <button
          onClick={handleAppleSignUp}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl hover:bg-gray-700/80 hover:border-green-500/50 transition-all duration-200 disabled:opacity-50 font-medium backdrop-blur-sm group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#000000"
              d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2ZM12,20C16.42,20 20,16.42 20,12C20,7.58 16.42,4 12,4C7.58,4 4,7.58 4,12C4,16.42 7.58,20 12,20ZM12,14C14.76,14 16.91,12.13 16.91,9.5C16.91,6.87 14.76,5 12,5C9.24,5 7.09,6.87 7.09,9.5C7.09,12.13 9.24,14 12,14ZM12,18C13.66,18 15,16.66 15,15C15,13.34 13.66,12 12,12C10.34,12 9,13.34 9,15C9,16.66 10.34,18 12,18Z"
            />
          </svg>
          <span className="text-white group-hover:text-green-300 transition-colors">Continue with Apple</span>
        </button> */}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700/50" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gray-900 text-gray-400 font-medium">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSignUp} className="space-y-6">
        <div>
          <Label htmlFor="username" className="text-white font-semibold">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="yourusername"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-2 bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:border-green-500/50 focus:ring-green-500/50"
          />
          {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}
        </div>
        <div>
          <Label htmlFor="email" className="text-white font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:border-green-500/50 focus:ring-green-500/50"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-white font-semibold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-2 bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:border-green-500/50 focus:ring-green-500/50"
          />
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}
        {message && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-400 text-sm font-medium">{message}</p>
          </div>
        )}
        <Button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button onClick={onSwitchToSignIn} className="text-green-400 hover:text-green-300 font-medium underline">
          Sign In
        </button>
      </p>
    </div>
  )
}
