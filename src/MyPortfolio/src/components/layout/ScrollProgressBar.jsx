import { motion, useScroll, useSpring } from 'framer-motion'
import styles from './ScrollProgressBar.module.css'

/** ページ最上部の読了率バー。scrollYProgress を scaleX にバインド。 */
export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden="true" />
}
