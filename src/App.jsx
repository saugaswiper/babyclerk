import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import RotationHome from './pages/RotationHome.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Viva from './pages/Viva.jsx'
import Quiz from './pages/Quiz.jsx'
import Notes from './pages/Notes.jsx'
import Checklist from './pages/Checklist.jsx'
import Generate from './pages/Generate.jsx'
import Import from './pages/Import.jsx'
import Settings from './pages/Settings.jsx'
import StudyToday from './pages/StudyToday.jsx'
import Search from './pages/Search.jsx'
import IOCreate from './pages/IOCreate.jsx'
import SignIn from './pages/SignIn.jsx'
import Schedule from './pages/Schedule.jsx'
import Progress from './pages/Progress.jsx'
import { AuthProvider, useAuth } from './lib/auth.jsx'

function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { enabled, user, status } = useAuth()

  const dot = user ? (status === 'error' ? '🔴' : status === 'syncing' ? '🟡' : '🟢') : ''

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="logo">🩺</span>
        <span>BabyClerk</span>
      </Link>
      <span className="spacer" />
      {!isHome && (
        <button className="back-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
      )}
      <Link to="/search" className="icon-btn" title="Search" aria-label="Search">
        🔍
      </Link>
      <Link to="/progress" className="icon-btn" title="Progress" aria-label="Progress">
        📈
      </Link>
      {enabled && (
        <Link to="/signin" className="icon-btn" title={user ? `Signed in: ${user.email}` : 'Sign in'} aria-label="Account">
          {user ? `👤${dot}` : '👤'}
        </Link>
      )}
      <Link to="/settings" className="icon-btn" title="Settings" aria-label="Settings">
        ⚙️
      </Link>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

function AppShell() {
  return (
    <div className="app">
      <TopBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/r/:rotationId" element={<RotationHome />} />
          <Route path="/r/:rotationId/flashcards" element={<Flashcards />} />
          <Route path="/r/:rotationId/viva" element={<Viva />} />
          <Route path="/r/:rotationId/quiz" element={<Quiz />} />
          <Route path="/r/:rotationId/notes" element={<Notes />} />
          <Route path="/r/:rotationId/checklist" element={<Checklist />} />
          <Route path="/r/:rotationId/generate" element={<Generate />} />
          <Route path="/r/:rotationId/import" element={<Import />} />
          <Route path="/r/:rotationId/io" element={<IOCreate />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/study" element={<StudyToday />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="footer">
        BabyClerk · your clerkship study companion · progress saved in this browser
      </footer>
    </div>
  )
}
