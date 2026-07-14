import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSyncConfigured } from './syncConfig.js'

// Null when sync isn't configured — callers guard on this and fall back to local-only.
// PKCE flow so the magic-link callback returns ?code=… (a query param) rather than a
// URL hash, which would collide with HashRouter.
export const supabase = isSyncConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null
