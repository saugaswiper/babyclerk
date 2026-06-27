import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import RotationHome from './pages/RotationHome.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Viva from './pages/Viva.jsx'
import Quiz from './pages/Quiz.jsx'
import Notes from './pages/Notes.jsx'
import Checklist from './pages/Checklist.jsx'

function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

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
    </header>
  )
}

export default function App() {
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
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <footer className="footer">
        BabyClerk · your clerkship study companion · progress saved in this browser
      </footer>
    </div>
  )
}
