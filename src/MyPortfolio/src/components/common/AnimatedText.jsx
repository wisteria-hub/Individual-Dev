import { motion } from 'framer-motion'

/**
 * テキストを単語単位で分割し、1語ずつ下から stagger reveal する。
 * ヒーローの見せ場に使用。reduced-motion 時は一括フェードに縮退。
 */
export default function AnimatedText({
  text,
  className,
  as = 'span',
  reduced = false,
  delay = 0,
  stagger = 0.045,
}) {
  const words = String(text).split(' ')
  const MotionTag = motion[as] || motion.span

  if (reduced) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay }}
      >
        {text}
      </MotionTag>
    )
  }

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }
  const child = {
    hidden: { opacity: 0, y: '0.5em', rotateX: -40 },
    show: {
      opacity: 1,
      y: '0em',
      rotateX: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      style={{ display: 'inline-block', perspective: 600 }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
          aria-hidden="true"
        >
          <motion.span variants={child} style={{ display: 'inline-block', transformOrigin: 'bottom' }}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
