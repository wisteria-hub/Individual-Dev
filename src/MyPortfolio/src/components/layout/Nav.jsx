import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import styles from './Nav.module.css'

export const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'works', label: 'Works' },
  { id: 'contact', label: 'Contact' },
]

// スクロール位置から現在のセクションを判定する
function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
  return active
}

export default function Nav() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)

  // モバイルメニュー展開中はスクロールロック + Escで閉じる
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      {/* デスクトップ用 横並びナビ */}
      <ul className={styles.desktop}>
        {NAV_LINKS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={clsx(styles.link, active === id && styles.linkActive)}
            >
              {label}
              {active === id && (
                <motion.span layoutId="nav-underline" className={styles.underline} />
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* モバイル用 ハンバーガー */}
      <button
        type="button"
        className={clsx(styles.burger, open && styles.burgerOpen)}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'メニューを閉じる' : 'メニューを開く'}
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {/* モバイル用 フルスクリーンオーバーレイ */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className={styles.overlay}
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.ul
              className={styles.overlayList}
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
            >
              {NAV_LINKS.map(({ id, label }) => (
                <motion.li
                  key={id}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <a href={`#${id}`} onClick={() => setOpen(false)} className={styles.overlayLink}>
                    {label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
