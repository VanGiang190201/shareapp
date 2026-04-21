import { useMemo } from 'react'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { HistoryPage } from './pages/HistoryPage'
import { DetailPage } from './pages/DetailPage'
import { InstructionPage } from './pages/InstructionPage'
import { SubmitPage } from './pages/SubmitPage'

function App() {
  const path = useMemo(() => {
    const cleanPath = window.location.pathname.toLowerCase()

    if (cleanPath === '/history') {
      return '/history'
    }

    if (cleanPath === '/detail') {
      return '/detail'
    }

    if (cleanPath === '/instruction') {
      return '/instruction'
    }

    return '/submit'
  }, [])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">
        {path === '/history' && <HistoryPage />}
        {path === '/detail' && <DetailPage />}
        {path === '/instruction' && <InstructionPage />}
        {path === '/submit' && <SubmitPage />}
      </main>
      <Footer />
    </div>
  )
}

export default App
