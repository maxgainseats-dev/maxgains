"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-client"

type SignInFormProps = {
  onSuccess: (user: any, session: any) => void
  onSwitchToSignUp: () => void
}

export default function SignInForm({ onSuccess, onSwitchToSignUp }: SignInFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user && data.session) {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, full_name, avatar_url")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
          // Continue anyway, profile might not exist yet
        }

        const userWithProfile = {
          id: data.user.id,
          email: data.user.email,
          ...profile,
        }

        onSuccess(userWithProfile, data.session)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
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
      setError(err.message || "Failed to sign in with Google.")
      setLoading(false)
    }
  }

  const handleAppleSignIn = async () => {
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
      setError(err.message || "Failed to sign in with Apple.")
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-3">
          Welcome Back!
        </h2>
        <p className="text-gray-300 text-lg">Sign in to access your order history.</p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl hover:bg-gray-700/80 hover:border-blue-500/50 transition-all duration-200 disabled:opacity-50 font-medium backdrop-blur-sm group"
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
          <span className="text-white group-hover:text-blue-300 transition-colors">Continue with Google</span>
        </button>

        {/* <button
          onClick={handleAppleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-800/80 border border-gray-700/50 rounded-xl hover:bg-gray-700/80 hover:border-gray-500/50 transition-all duration-200 disabled:opacity-50 font-medium backdrop-blur-sm group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#ffffff"
              d="M12,2C15.86,2 19,5.14 19,9c0,3.86-3.14,7-7,7s-7-3.14-7-7C3,5.14 6.14,2 12,2z M12,19C7.58,19 4,15.42 4,11C4,6.58 7.58,4 12,4s8,2.58 8,6.58C20,15.42 16.42,19 12,19z M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7z"
            />
          </svg>
          <span className="text-white group-hover:text-gray-300 transition-colors">Continue with Apple</span>
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

      <form onSubmit={handleSignIn} className="space-y-6">
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
            className="mt-2 bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/50"
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
            className="mt-2 bg-gray-800/80 border-gray-700/50 text-white placeholder-gray-400 focus:border-orange-500/50 focus:ring-orange-500/50"
          />
        </div>
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}
        <Button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignUp} className="text-orange-400 hover:text-orange-300 font-medium underline">
          Sign Up
        </button>
      </p>
    </div>
  )
}
