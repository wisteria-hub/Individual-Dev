import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FiGithub, FiExternalLink, FiArrowUpRight } from 'react-icons/fi'
import clsx from 'clsx'
import { childVariants } from './SectionWrapper'
import ProjectThumbnailPlaceholder from './ProjectThumbnailPlaceholder'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project, reduced = false }) {
  const { featured } = project
  const ref = useRef(null)

  // マウス位置ベースの 3D チルト（featured のみ）
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 15 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 150, damping: 15 })

  const enableTilt = featured && !reduced

  const handleMove = (e) => {
    if (!enableTilt || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.article
      ref={ref}
      className={clsx(styles.card, featured && styles.featured)}
      variants={childVariants}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={reduced ? undefined : { y: -8 }}
      style={enableTilt ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
    >
      <div className={styles.thumb}>
        {project.image ? (
          <img src={project.image} alt={`${project.title} のスクリーンショット`} />
        ) : (
          <ProjectThumbnailPlaceholder variant={project.placeholder} reduced={reduced} />
        )}
        {!project.liveUrl && <span className={styles.badge}>準備中</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.subtitle}>{project.subtitle}</span>
          <span className={styles.year}>{project.year}</span>
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.description}</p>

        <ul className={styles.tags}>
          {project.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>

        <div className={styles.links}>
          {project.repoUrl && (
            <a
              className={styles.link}
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiGithub aria-hidden="true" /> ソース
            </a>
          )}
          {project.liveUrl ? (
            <a
              className={styles.link}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiExternalLink aria-hidden="true" /> ライブデモ
            </a>
          ) : (
            <span className={clsx(styles.link, styles.linkDisabled)}>
              <FiExternalLink aria-hidden="true" /> デモ準備中
            </span>
          )}
        </div>
      </div>

      {/* ホバー時に右上へ現れる矢印 */}
      {!reduced && (
        <span className={styles.corner} aria-hidden="true">
          <FiArrowUpRight />
        </span>
      )}
    </motion.article>
  )
}
