import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * 要素が画面に入ったら 0 → target までカウントアップするフック。
 * reduced-motion 時は即座に最終値を表示。
 * @returns [ref, displayValue]
 */
export function useCountUp(target, { duration = 1600, reduced = false } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(target)
      return
    }

    let raf
    let start
    const step = (timestamp) => {
      if (start === undefined) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration, reduced])

  return [ref, value]
}
