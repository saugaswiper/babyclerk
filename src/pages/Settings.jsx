import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getApiKey, setApiKey, getModel, setModel, MODEL_OPTIONS, getNewLimit, setNewLimit } from '../lib/settings.js'
import { useAuth } from '../lib/auth.jsx'
import { getAttempts, clearAttempts } from '../lib/attempts.js'

export default function Settings() {
  const { enabled, user, status, signOut, syncNow } = useAuth()
  const [key, setKey] = useState(getApiKey())
  const [model, setModelState] = useState(getModel())
  const [newLimit, setNewLimitState] = useState(getNewLimit())
  const [saved, setSaved] = useState(false)
  const [backupMsg, setBackupMsg] = useState('')

  const save = () => {
    setApiKey(key.trim())
    setModel(model)
    setNewLimit(Number(newLimit))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Everything except the API key: SRS schedule, quiz bests, checklists,
  // imported/AI cards, and the model choice.
  const exportBackup = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('babyclerk:') && k !== 'babyclerk:apiKey') data[k] = localStorage.getItem(k)
    }
    const payload = { app: 'babyclerk', version: 1, exported: new Date().toISOString(), data }
    const blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `babyclerk-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
    setBackupMsg(`Exported ${Object.keys(data).length} items.`)
  }

  const importBackup = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || ''))
        if (payload?.app !== 'babyclerk' || !payload.data) {
          setBackupMsg('That doesn’t look like a BabyClerk backup file.')
          return
        }
        let n = 0
        for (const [k, v] of Object.entries(payload.data)) {
          if (k.startsWith('babyclerk:') && k !== 'babyclerk:apiKey' && typeof v === 'string') {
            localStorage.setItem(k, v)
            n++
          }
        }
        setBackupMsg(`Restored ${n} items — reloading…`)
        setTimeout(() => window.location.reload(), 800)
      } catch {
        setBackupMsg('Could not read that file.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>Settings</h1>
        <p className="sub">Connect your Anthropic API key to generate fresh questions with AI.</p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <label className="section-title" style={{ marginTop: 0 }}>Study schedule</label>
        <p className="muted" style={{ margin: '0 0 12px', fontSize: '0.88rem' }}>
          Enter your rotation blocks and exam dates to get current-rotation focus and exam countdowns on
          the home screen.
        </p>
        <div className="btn-row">
          <Link className="btn" to="/schedule">Edit schedule</Link>
          <Link className="btn ghost" to="/welcome">Run setup again</Link>
        </div>
      </div>

      {enabled && (
        <div className="card" style={{ marginBottom: 16 }}>
          <label className="section-title" style={{ marginTop: 0 }}>Account &amp; sync</label>
          {user ? (
            <>
              <p className="muted" style={{ margin: '0 0 12px', fontSize: '0.88rem' }}>
                Signed in as <strong>{user.email}</strong>. Progress syncs across your devices automatically
                (status: {status}). Your API key stays on this device only.
              </p>
              <div className="btn-row">
                <button className="btn" onClick={syncNow}>Sync now</button>
                <button className="btn ghost" onClick={signOut}>Sign out</button>
              </div>
            </>
          ) : (
            <>
              <p className="muted" style={{ margin: '0 0 12px', fontSize: '0.88rem' }}>
                Sign in to sync your progress across devices (and let classmates keep their own). Optional — the
                app works fully without it.
              </p>
              <Link className="btn primary" to="/signin">Sign in</Link>
            </>
          )}
        </div>
      )}

      <div className="card">
        <label className="section-title" htmlFor="apikey" style={{ marginTop: 0 }}>
          Anthropic API key
        </label>
        <input
          id="apikey"
          type="password"
          className="text-input"
          placeholder="sk-ant-..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
          autoComplete="off"
        />
        <p className="muted" style={{ fontSize: '0.82rem', marginTop: 8 }}>
          Get a key at{' '}
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            console.anthropic.com
          </a>
          . It’s stored only in this browser and sent directly to Anthropic from your device. Don’t
          use a shared computer.
        </p>

        <label className="section-title" htmlFor="model">
          Model
        </label>
        <select id="model" className="text-input" value={model} onChange={(e) => setModelState(e.target.value)}>
          {MODEL_OPTIONS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>

        <label className="section-title" htmlFor="newlimit">
          New cards per day (per rotation)
        </label>
        <input
          id="newlimit"
          type="number"
          min="0"
          max="200"
          className="text-input"
          value={newLimit}
          onChange={(e) => setNewLimitState(e.target.value)}
        />
        <p className="muted" style={{ fontSize: '0.82rem', marginTop: 6 }}>
          How many brand-new cards a rotation introduces each day (default 20). Keeps the big deck a
          steady trickle instead of a wall. Reviews of cards you’ve already seen are never capped. Set
          to 0 to study reviews only.
        </p>

        <div className="btn-row" style={{ marginTop: 18 }}>
          <button className="btn primary" onClick={save}>
            {saved ? 'Saved' : 'Save'}
          </button>
          <Link className="btn ghost" to="/">
            Done
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <label className="section-title" style={{ marginTop: 0 }}>Backup &amp; transfer</label>
        <p className="muted" style={{ margin: '0 0 12px', fontSize: '0.85rem' }}>
          All progress lives in this browser. Export a backup file to protect your spaced-repetition
          history and imported cards, or to move everything to another device (export here → import
          there). Your API key is never included.
        </p>
        <div className="btn-row">
          <button className="btn primary" onClick={exportBackup}>
            Export backup
          </button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            Restore from file
            <input type="file" accept=".json,application/json" onChange={importBackup} style={{ display: 'none' }} />
          </label>
        </div>
        {backupMsg && (
          <p className="muted" style={{ marginTop: 10, fontSize: '0.85rem' }}>{backupMsg}</p>
        )}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <label className="section-title" style={{ marginTop: 0 }}>Study history</label>
        <p className="muted" style={{ margin: '0 0 12px', fontSize: '0.85rem' }}>
          BabyClerk records each answer (which card, right/wrong, how long) to power your{' '}
          <Link to="/progress">progress &amp; weak-area insights</Link>. It’s your data — {getAttempts().length} answer
          {getAttempts().length === 1 ? '' : 's'} logged, synced only to your account, never shared. You can clear it anytime.
        </p>
        <button
          className="btn ghost"
          onClick={() => {
            if (window.confirm('Clear your study history? This removes progress/weak-area data (not your cards or spaced-repetition schedule).')) {
              clearAttempts()
              setBackupMsg('Study history cleared.')
            }
          }}
        >
          Clear study history
        </button>
      </div>

      <p className="kbd-hint">
        Without a key you can still use everything except AI generation — flashcards, viva, quizzes,
        notes and import all work offline.
      </p>
    </div>
  )
}
