import { useContext } from 'react'
import { ProgressContext } from './progressContext.js'

// 進捗の読み書き用フック。永続化の実装詳細（localStorage / 将来API）は意識しない。
export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) {
    throw new Error('useProgress は ProgressProvider の内側で使ってください。')
  }
  return ctx
}
