import { motion } from 'framer-motion'
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi'
import SectionWrapper, { SectionChild, childVariants } from '../common/SectionWrapper'
import CopyEmailButton from '../common/CopyEmailButton'
import { profile } from '../../data/profile'
import styles from './Contact.module.css'

const ICONS = {
  github: FiGithub,
  x: FiTwitter,
  linkedin: FiLinkedin,
}

export default function Contact({ reduced = false }) {
  return (
    <SectionWrapper id="contact" eyebrow="Contact" title="話しかけてください。">
      <div className={styles.wrap}>
        <SectionChild as="p" className={`lead ${styles.lead}`}>
          お仕事のご相談、雑談、なんでも歓迎です。下のアドレスへ直接どうぞ。
        </SectionChild>

        <SectionChild as="div" className={styles.actions}>
          <CopyEmailButton email={profile.email} />
          <motion.a
            href={`mailto:${profile.email}`}
            className={styles.mailBtn}
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <FiMail aria-hidden="true" /> メールを書く
          </motion.a>
        </SectionChild>

        <SectionChild as="ul" className={styles.socials}>
          {profile.socials.map((social) => {
            const Icon = ICONS[social.key] || FiMail
            return (
              <motion.li
                key={social.key}
                variants={childVariants}
                whileHover={reduced ? undefined : { y: -6, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.social}
                  aria-label={social.label}
                >
                  <Icon />
                </a>
              </motion.li>
            )
          })}
        </SectionChild>
      </div>
    </SectionWrapper>
  )
}
