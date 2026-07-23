import { motion } from 'framer-motion'
import { profile } from '../../data/profile'
import { NAV_LINKS } from './Nav'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.mark}>Y</span>
          <span>{profile.nameEn}</span>
        </div>

        <ul className={styles.links}>
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className={styles.link}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.copy}>
          © {profile.nameEn} — Built with React, Vite &amp; Framer Motion.
        </p>
      </div>
    </motion.footer>
  )
}
