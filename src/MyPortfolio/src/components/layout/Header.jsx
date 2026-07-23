import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import Nav from './Nav'
import ThemeToggle from './ThemeToggle'
import styles from './Header.module.css'

/** 固定ヘッダー。スクロールすると背景が磨りガラス化する。 */
export default function Header({ theme, onToggleTheme }) {
  const { scrollY } = useScroll()
  // スクロール量に応じてヘッダー背景の不透明度とぼかしを段階変化
  const blur = useTransform(scrollY, [0, 120], [0, 12])
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1])
  const backdrop = useMotionTemplate`blur(${blur}px)`

  return (
    <motion.header
      className={styles.header}
      style={{
        backdropFilter: backdrop,
        WebkitBackdropFilter: backdrop,
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* スクロール時のみ現れる下境界線 */}
      <motion.span className={styles.border} style={{ opacity: borderOpacity }} aria-hidden="true" />
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label="トップへ">
          <span className={styles.logoMark}>Y</span>
          <span className={styles.logoText}>Taro Yamada</span>
        </a>
        <div className={styles.right}>
          <Nav />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </motion.header>
  )
}
