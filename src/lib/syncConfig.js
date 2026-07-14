// Supabase connection for optional online sign-in + progress sync.
// The publishable key is safe to ship in client code — row-level security
// protects each user's data. If these are blank, the app runs local-only.
export const SUPABASE_URL = 'https://wyroabplbanturiersjm.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_0mJMsgaCzFAkW9vg-G-1kQ_aQeFc-hS'

export function isSyncConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}
