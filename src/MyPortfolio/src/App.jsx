import { useTheme } from './hooks/useTheme'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import ScrollProgressBar from './components/layout/ScrollProgressBar'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Works from './components/sections/Works'
import Contact from './components/sections/Contact'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const reduced = usePrefersReducedMotion()

  return (
    <>
      <ScrollProgressBar />
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero reduced={reduced} />
        <About reduced={reduced} />
        <Skills reduced={reduced} />
        <Works reduced={reduced} />
        <Contact reduced={reduced} />
      </main>
      <Footer />
    </>
  )
}
