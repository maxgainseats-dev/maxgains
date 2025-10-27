import { createClient } from '@supabase/supabase-js'

// Server-side client with service role (backend only)
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Server-side client that respects RLS
export const createServerClient = (accessToken?: string) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )
  
  if (accessToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '', // We'll handle refresh separately
    })
  }
  
  return supabase
}
