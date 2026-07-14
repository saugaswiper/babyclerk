import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient.js'
import { pullMerge, pushLocal, snapshot } from './sync.js'

const AuthCtx = createContext({ user: null, status: 'off', signInWithEmail: async () => {}, signOut: async () => {}, syncNow: async () => {} })

export function useAuth() {
  return useContext(AuthCtx)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(supabase ? 'idle' : 'off') // off | idle | syncing | synced | error
  const timer = useRef(null)
  const lastPush = useRef('')
  const userRef = useRef(null)

  const push = useCallback(async () => {
    const u = userRef.current
    if (!u) return
    const snap = snapshot()
    if (snap === lastPush.current) return
    try {
      await pushLocal(u.id)
      lastPush.current = snap
      setStatus('synced')
    } catch {
      setStatus('error')
    }
  }, [])

  const initialSync = useCallback(async (u) => {
    userRef.current = u
    try {
      setStatus('syncing')
      const changed = await pullMerge()
      await pushLocal(u.id)
      lastPush.current = snapshot()
      setStatus('synced')
      if (changed) {
        // Reflect merged data in the running app. HashRouter keeps the route.
        setTimeout(() => window.location.reload(), 250)
      }
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (!supabase) return undefined

    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user || null
      setUser(u)
      if (u) initialSync(u)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null
      setUser(u)
      userRef.current = u
      if (u) initialSync(u)
      else {
        setStatus('idle')
        lastPush.current = ''
      }
    })

    // Push on a heartbeat and whenever the app is backgrounded (phone lock / tab switch).
    timer.current = setInterval(() => push(), 60000)
    const onHide = () => {
      if (document.visibilityState === 'hidden') push()
    }
    document.addEventListener('visibilitychange', onHide)

    return () => {
      sub.subscription.unsubscribe()
      clearInterval(timer.current)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [initialSync, push])

  const signInWithEmail = useCallback(async (email) => {
    if (!supabase) throw new Error('Sync is not configured.')
    const redirect = window.location.origin + import.meta.env.BASE_URL
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await push() // final flush
    await supabase.auth.signOut()
    userRef.current = null
    setUser(null)
    setStatus('idle')
  }, [push])

  const value = { user, status, enabled: !!supabase, signInWithEmail, signOut, syncNow: push }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
