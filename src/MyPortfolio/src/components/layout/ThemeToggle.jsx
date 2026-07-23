import { motion, AnimatePresence } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import styles from './ThemeToggle.module.css'

/** 太陽/月アイコンを回転クロスフェードで切り替えるテーマトグル。 */
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <motion.button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      aria-pressed={isDark}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className={styles.iconWrap}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {isDark ? <FiMoon /> : <FiSun />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
