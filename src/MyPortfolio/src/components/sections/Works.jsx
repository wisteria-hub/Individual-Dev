import SectionWrapper from '../common/SectionWrapper'
import ProjectCard from '../common/ProjectCard'
import { projects } from '../../data/projects'
import styles from './Works.module.css'

export default function Works({ reduced = false }) {
  return (
    <SectionWrapper id="works" eyebrow="Works" title="つくったもの">
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} reduced={reduced} />
        ))}
      </div>
    </SectionWrapper>
  )
}
