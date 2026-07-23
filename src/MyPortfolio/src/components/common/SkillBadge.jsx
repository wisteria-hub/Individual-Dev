import { motion } from 'framer-motion'
import * as SiIcons from 'react-icons/si'
import * as TbIcons from 'react-icons/tb'
import { childVariants } from './SectionWrapper'
import styles from './SkillBadge.module.css'

// data/skills.js の icon 文字列を react-icons のコンポーネントに解決する。
function resolveIcon(name) {
  return SiIcons[name] || TbIcons[name] || null
}

export default function SkillBadge({ skill, reduced = false }) {
  const Icon = resolveIcon(skill.icon)

  return (
    <motion.li
      className={styles.badge}
      variants={childVariants}
      whileHover={reduced ? undefined : { scale: 1.06, rotate: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className={styles.icon} aria-hidden="true">
        {Icon ? <Icon /> : <span className={styles.fallback}>{skill.name[0]}</span>}
      </span>
      <span className={styles.name}>{skill.name}</span>
      {/* 習熟度の目安バー（あくまで自己申告の参考値） */}
      <span className={styles.meter} aria-hidden="true">
        <motion.span
          className={styles.meterFill}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: skill.level / 100 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </span>
    </motion.li>
  )
}
