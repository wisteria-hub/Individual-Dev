import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import SectionWrapper from '../common/SectionWrapper'
import SkillBadge from '../common/SkillBadge'
import { skillCategories } from '../../data/skills'
import styles from './Skills.module.css'

// グリッド全体を stagger コンテナにする
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

export default function Skills({ reduced = false }) {
  const [activeKey, setActiveKey] = useState(skillCategories[0].key)
  const active = skillCategories.find((c) => c.key === activeKey)

  return (
    <SectionWrapper id="skills" eyebrow="Skills" title="使える道具たち">
      {/* カテゴリタブ */}
      <div className={styles.tabs} role="tablist" aria-label="スキルカテゴリ">
        {skillCategories.map((cat) => (
          <button
            key={cat.key}
            role="tab"
            aria-selected={cat.key === activeKey}
            className={clsx(styles.tab, cat.key === activeKey && styles.tabActive)}
            onClick={() => setActiveKey(cat.key)}
          >
            {cat.label}
            {cat.key === activeKey && (
              <motion.span layoutId="skill-tab" className={styles.tabBg} />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={activeKey}
          className={styles.grid}
          variants={grid}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {active.skills.map((skill) => (
            <SkillBadge key={skill.name} skill={skill} reduced={reduced} />
          ))}
        </motion.ul>
      </AnimatePresence>

      <p className={styles.note}>※ バーは自己申告による習熟度の目安です。</p>
    </SectionWrapper>
  )
}
