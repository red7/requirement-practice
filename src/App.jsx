import { useEffect } from 'react'
import useAppStore, { PHASES } from './stores/useAppStore'
import InitPhase from './pages/InitPhase'
import ChatPhase from './pages/ChatPhase'
import DocumentingPhase from './pages/DocumentingPhase'
import DesignPhase from './pages/DesignPhase'
import ReviewPhase from './pages/ReviewPhase'

function App() {
  const { currentPhase } = useAppStore()

  useEffect(() => {
    // Check system dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const renderPhase = () => {
    switch (currentPhase) {
      case PHASES.INIT:
        return <InitPhase />
      case PHASES.CHAT:
        return <ChatPhase />
      case PHASES.DOCUMENTING:
        return <DocumentingPhase />
      case PHASES.DESIGN:
        return <DesignPhase />
      case PHASES.REVIEW:
        return <ReviewPhase />
      default:
        return <InitPhase />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {renderPhase()}
    </div>
  )
}

export default App
