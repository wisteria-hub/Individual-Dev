import { useMemo, useState } from 'react'
import { qualifications } from './data/qualifications.js'
import { buildGraph } from './domain/buildGraph.js'
import { layoutTree } from './domain/layoutTree.js'
import { useProgress } from './progress/useProgress.js'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import CategoryFilter from './components/tree/CategoryFilter.jsx'
import SkillTreeCanvas from './components/tree/SkillTreeCanvas.jsx'
import CongratsModal from './components/common/CongratsModal.jsx'
import './App.css'

function App() {
  const { isAcquired, acquiredAt, acquire, release, reset, acquiredCount } =
    useProgress()
  const [category, setCategory] = useState(null)
  const [modal, setModal] = useState(null) // { id, isNew }

  const layout = useMemo(() => {
    const filtered = category
      ? qualifications.filter((q) => q.category === category)
      : qualifications
    return layoutTree(buildGraph(filtered))
  }, [category])

  const handleAcquire = (id) => {
    acquire(id)
    setModal({ id, isNew: true })
  }

  const handleShowInfo = (id) => setModal({ id, isNew: false })

  const handleReset = () => {
    if (window.confirm('すべての獲得状況をリセットします。よろしいですか？')) {
      reset()
    }
  }

  return (
    <div className="qx-app">
      <div className="qx-stars" aria-hidden="true" />
      <div className="qx-stars qx-stars--far" aria-hidden="true" />

      <div className="qx-shell">
        <Header
          acquiredCount={acquiredCount}
          totalCount={qualifications.length}
          onReset={handleReset}
        />
        <CategoryFilter value={category} onChange={setCategory} />
        <main className="qx-main">
          <SkillTreeCanvas
            layout={layout}
            isAcquired={isAcquired}
            acquiredAt={acquiredAt}
            onAcquire={handleAcquire}
            onShowInfo={handleShowInfo}
          />
        </main>
        <Footer />
      </div>

      {modal && (
        <CongratsModal
          qualificationId={modal.id}
          acquiredAt={acquiredAt(modal.id)}
          isNew={modal.isNew}
          isAcquired={isAcquired}
          onRelease={release}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

export default App
