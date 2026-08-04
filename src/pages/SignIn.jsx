import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export default function SignIn() {
  const { user, enabled, signInWithEmail, signOut, status } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  if (!enabled) {
    return (
      <div className="study-shell">
        <div className="page-head">
          <h1>Sign in</h1>
          <p className="sub">Online sync isn’t configured on this build.</p>
        </div>
        <Link className="btn" to="/">Back home</Link>
      </div>
    )
  }

  if (user) {
    return (
      <div className="study-shell">
        <div className="page-head">
          <h1>You’re signed in</h1>
          <p className="sub">{user.email} · progress syncs automatically ({status}).</p>
        </div>
        <div className="btn-row">
          <button className="btn primary" onClick={() => navigate('/')}>Start studying</button>
          <button className="btn ghost" onClick={signOut}>Sign out</button>
        </div>
      </div>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signInWithEmail(email.trim())
      setSent(true)
    } catch (err) {
      setError(err?.message || 'Could not send the link.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>Sign in</h1>
        <p className="sub">Sync your progress across devices. Optional — the app works fully without it.</p>
      </div>

      {sent ? (
        <div className="card">
          <p style={{ marginTop: 0 }}>
            Check <strong>{email}</strong> for a sign-in link. Open it on this device to finish.
          </p>
          <button className="btn ghost" onClick={() => setSent(false)}>Use a different email</button>
        </div>
      ) : (
        <form className="card" onSubmit={submit}>
          <label className="section-title" htmlFor="email" style={{ marginTop: 0 }}>Email</label>
          <input
            id="email"
            type="email"
            required
            className="text-input"
            placeholder="you@qmed.ca"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <p className="muted" style={{ fontSize: '0.82rem', margin: '8px 0 14px' }}>
            We’ll email you a one-tap sign-in link — no password. Your progress (not your API key) is stored to your account.
          </p>
          <div className="btn-row">
            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Email me a link'}
            </button>
            <Link className="btn ghost" to="/">Skip for now</Link>
          </div>
          {error && (
            <div className="explain" style={{ marginTop: 12, borderColor: 'var(--danger)' }}>{error}</div>
          )}
        </form>
      )}
    </div>
  )
}
