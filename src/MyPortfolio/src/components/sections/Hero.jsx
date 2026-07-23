import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiArrowDown } from 'react-icons/fi'
import AnimatedText from '../common/AnimatedText'
import { profile } from '../../data/profile'
import styles from './Hero.module.css'

export default function Hero({ reduced = false }) {
  const ref = useRef(null)
  // マウス追従の視差（装飾シェイプがわずかに動く）
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const shape1X = useTransform(sx, [-0.5, 0.5], [-30, 30])
  const shape1Y = useTransform(sy, [-0.5, 0.5], [-24, 24])
  const shape2X = useTransform(sx, [-0.5, 0.5], [24, -24])
  const shape2Y = useTransform(sy, [-0.5, 0.5], [20, -20])

  const handleMove = (e) => {
    if (reduced) return
    mx.set(e.clientX / window.innerWidth - 0.5)
    my.set(e.clientY / window.innerHeight - 0.5)
  }

  return (
    <section id="top" className={styles.hero} ref={ref} onMouseMove={handleMove}>
      {/* 背景装飾（白黒のぼかしシェイプ + 細線グリッド） */}
      <div className={styles.bg} aria-hidden="true">
        <motion.span
          className={styles.blob1}
          style={{ x: shape1X, y: shape1Y }}
          animate={reduced ? {} : { scale: [1, 1.08, 1] }}
          transition={reduced ? {} : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className={styles.blob2}
          style={{ x: shape2X, y: shape2Y }}
          animate={reduced ? {} : { scale: [1, 1.12, 1] }}
          transition={reduced ? {} : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className={styles.grid} />
      </div>

      <div className={`container ${styles.inner}`}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {profile.role}
        </motion.p>

        <h1 className={styles.title}>
          <AnimatedText text={profile.name} reduced={reduced} delay={0.15} as="span" />
        </h1>

        <div className={styles.tagline}>
          <AnimatedText
            text={profile.tagline}
            reduced={reduced}
            delay={0.6}
            stagger={0.06}
            as="span"
          />
        </div>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.a
            href="#works"
            className={styles.ctaPrimary}
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            制作物を見る
          </motion.a>
          <motion.a
            href="#contact"
            className={styles.ctaGhost}
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            連絡する
          </motion.a>
        </motion.div>
      </div>

      {/* スクロール誘導 */}
      <motion.a
        href="#about"
        className={styles.scrollHint}
        aria-label="下へスクロール"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        <motion.span
          animate={reduced ? {} : { y: [0, 8, 0] }}
          transition={reduced ? {} : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FiArrowDown />
        </motion.span>
      </motion.a>
    </section>
  )
}
