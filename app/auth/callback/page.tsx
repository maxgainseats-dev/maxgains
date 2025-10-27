"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/?error=auth_failed')
          return
        }

        if (data.session) {
          // Send session to backend for processing
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/oauth-callback`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }),
          })

          if (response.ok) {
            const result = await response.json()
            
            // Store user and session data
            localStorage.setItem('grubslash_user', JSON.stringify(result.user))
            localStorage.setItem('grubslash_session', result.session.access_token)
            
            // Redirect to home page
            router.push('/')
          } else {
            console.error('Failed to process OAuth callback')
            router.push('/?error=auth_processing_failed')
          }
        } else {
          router.push('/?error=no_session')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/?error=auth_callback_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Completing sign in...</p>
      </div>
    </div>
  )
}
