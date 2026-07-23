import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * OS の「視差効果を減らす」設定を検知するフック。
 * true のとき、酔いやすい演出（無限ループ・3Dチルト・視差）は
 * 各コンポーネント側で無効化またはフェードのみに縮退させる。
 */
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    setPrefersReduced(mql.matches)

    const onChange = (e) => setPrefersReduced(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return prefersReduced
}
