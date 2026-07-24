import { useCallback, useEffect, useMemo, useState } from 'react'
import { getTransitiveDependents } from '../domain/dependents.js'
import { ProgressContext } from './progressContext.js'
import * as store from './progressStore.js'

export function ProgressProvider({ children }) {
  // { [id]: acquiredAt(ISO) }。キーの有無が「獲得済みか」を表す。
  const [progress, setProgress] = useState({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    store.getAllProgress().then((data) => {
      if (active) {
        setProgress(data)
        setLoaded(true)
      }
    })
    return () => {
      active = false
    }
  }, [])

  const isAcquired = useCallback((id) => id in progress, [progress])
  const acquiredAt = useCallback((id) => progress[id] ?? null, [progress])

  const acquire = useCallback((id) => {
    const acquiredAt = new Date().toISOString()
    setProgress((prev) => ({ ...prev, [id]: acquiredAt }))
    store.acquire(id, acquiredAt)
    return acquiredAt
  }, [])

  // 資格の獲得を取り消す。これを前提とする上位資格も連鎖的に取り消す。
  // 実際に取り消した id の配列を返す。
  const release = useCallback((id) => {
    const targets = [id, ...getTransitiveDependents(id)]
    setProgress((prev) => {
      const next = { ...prev }
      for (const t of targets) delete next[t]
      return next
    })
    for (const t of targets) store.release(t)
    return targets
  }, [])

  const reset = useCallback(() => {
    setProgress({})
    store.resetProgress()
  }, [])

  const acquiredCount = Object.keys(progress).length

  const value = useMemo(
    () => ({
      progress,
      isAcquired,
      acquiredAt,
      acquire,
      release,
      reset,
      loaded,
      acquiredCount,
    }),
    [progress, isAcquired, acquiredAt, acquire, release, reset, loaded, acquiredCount],
  )

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}
