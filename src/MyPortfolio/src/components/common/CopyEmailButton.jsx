import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCopy, FiCheck } from 'react-icons/fi'
import styles from './CopyEmailButton.module.css'

/**
 * クリックでメールアドレスをクリップボードにコピーし、
 * 「コピーしました」トーストを一瞬表示するマイクロインタラクション。
 */
export default function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // クリップボードAPIが使えない環境向けのフォールバック
      const ta = document.createElement('textarea')
      ta.value = email
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* noop */
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <motion.button
      type="button"
      className={styles.btn}
      onClick={handleCopy}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`メールアドレス ${email} をコピー`}
    >
      <span className={styles.email}>{email}</span>
      <span className={styles.iconWrap}>
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className={styles.icon}
            >
              <FiCheck />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className={styles.icon}
            >
              <FiCopy />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <AnimatePresence>
        {copied && (
          <motion.span
            className={styles.toast}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            コピーしました
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
