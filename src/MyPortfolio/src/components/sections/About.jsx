import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import SectionWrapper, { SectionChild } from '../common/SectionWrapper'
import { profile } from '../../data/profile'
import { useCountUp } from '../../hooks/useCountUp'
import styles from './About.module.css'

function Stat({ stat, reduced }) {
  const [ref, value] = useCountUp(stat.value, { reduced })
  return (
    <SectionChild as="div" className={styles.stat}>
      <span ref={ref} className={styles.statValue}>
        {value}
        <span className={styles.statSuffix}>{stat.suffix}</span>
      </span>
      <span className={styles.statLabel}>{stat.label}</span>
    </SectionChild>
  )
}

export default function About({ reduced = false }) {
  const cardRef = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 15 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 15 })

  const handleMove = (e) => {
    if (reduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <SectionWrapper id="about" eyebrow="About" title="つくることが、好きです。">
      <div className={styles.layout}>
        <div className={styles.text}>
          {profile.about.map((para, i) => (
            <SectionChild as="p" key={i} className={styles.para}>
              {para}
            </SectionChild>
          ))}
          <SectionChild as="p" className={styles.location}>
            <FiMapPin aria-hidden="true" /> {profile.location}
          </SectionChild>

          <div className={styles.stats}>
            {profile.stats.map((stat) => (
              <Stat key={stat.label} stat={stat} reduced={reduced} />
            ))}
          </div>
        </div>

        {/* プロフィール画像プレースホルダー（3Dチルト） */}
        <SectionChild as="div" className={styles.cardWrap}>
          <motion.div
            ref={cardRef}
            className={styles.card}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
          >
            <div className={styles.avatar} aria-hidden="true">
              {profile.name.charAt(0)}
            </div>
            <div className={styles.cardName}>{profile.nameEn}</div>
            <div className={styles.cardRole}>{profile.role}</div>
          </motion.div>
        </SectionChild>
      </div>
    </SectionWrapper>
  )
}
