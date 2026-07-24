import { createContext } from 'react'

// Provider（ProgressContext.jsx）と利用フック（useProgress.js）から参照される
// Context オブジェクト本体。コンポーネントと分離して Fast Refresh を効かせる。
export const ProgressContext = createContext(null)
