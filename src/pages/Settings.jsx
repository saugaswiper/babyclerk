import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getApiKey, setApiKey, getModel, setModel, MODEL_OPTIONS } from '../lib/settings.js'

export default function Settings() {
  const [key, setKey] = useState(getApiKey())
  const [model, setModelState] = useState(getModel())
  const [saved, setSaved] = useState(false)

  const save = () => {
    setApiKey(key.trim())
    setModel(model)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="study-shell">
      <div className="page-head">
        <h1>⚙️ Settings</h1>
        <p className="sub">Connect your Anthropic API key to generate fresh questions with AI.</p>
      </div>

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

        <div className="btn-row" style={{ marginTop: 18 }}>
          <button className="btn primary" onClick={save}>
            {saved ? 'Saved ✓' : 'Save'}
          </button>
          <Link className="btn ghost" to="/">
            Done
          </Link>
        </div>
      </div>

      <p className="kbd-hint">
        Without a key you can still use everything except AI generation — flashcards, viva, quizzes,
        notes and import all work offline.
      </p>
    </div>
  )
}
