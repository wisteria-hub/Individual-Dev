import { motion } from 'framer-motion'
import styles from './SectionWrapper.module.css'
import clsx from 'clsx'

// 各セクション共通の「スクロールインで浮き上がりフェード」variants。
// staggerChildren により子要素が順番に登場する。
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
}

/**
 * セクションの外枠。id（アンカー用）・eyebrow・見出し・本文をまとめて配置し、
 * viewport に入ったら子を stagger 表示する。
 */
export default function SectionWrapper({
  id,
  eyebrow,
  title,
  children,
  className,
  fullWidth = false,
}) {
  return (
    <motion.section
      id={id}
      className={clsx(styles.section, className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={fullWidth ? styles.wide : 'container'}>
        {(eyebrow || title) && (
          <header className={styles.head}>
            {eyebrow && <SectionChild as="p" className="eyebrow">{eyebrow}</SectionChild>}
            {title && <SectionChild as="h2" className={styles.title}>{title}</SectionChild>}
          </header>
        )}
        {children}
      </div>
    </motion.section>
  )
}

// 子要素用の共通 fade-up variant。SectionWrapper 配下で使うと stagger に乗る。
export const childVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export function SectionChild({ as = 'div', className, children, ...rest }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag variants={childVariants} className={className} {...rest}>
      {children}
    </MotionTag>
  )
}
