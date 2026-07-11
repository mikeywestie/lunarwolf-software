import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  Bot,
  ExternalLink,
  PawPrint,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import './featured-projects.css'
import './featured-projects-v2.css'

type Project = {
  number: string
  type: string
  title: string
  description: string
  outcome: string
  label: string
  mockupTitle: string
  metricLabel: string
  metricValue: string
  tags: string[]
  href: string
  action: string
  status: string
  visual: 'website' | 'commerce' | 'automation' | 'mobile'
  icon: LucideIcon
}

const projects: Project[] = [
  {
    number: '01',
    type: 'Client website',
    title: 'Exclusive Pets Grooming Parlour',
    description:
      'A warm, responsive website that gives a local grooming business a clearer customer journey from first visit to booking enquiry.',
    outcome:
      'A professional online presence designed to build trust and make customer contact easier.',
    label: 'Exclusive Pets',
    mockupTitle: 'Grooming with as much care as love.',
    metricLabel: 'Experience',
    metricValue: 'Mobile-first',
    tags: ['Responsive design', 'Local business', 'Customer journey'],
    href: 'https://exclusive-pets-grooming.netlify.app/',
    action: 'View live website',
    status: 'Live client project',
    visual: 'website',
    icon: PawPrint,
  },
  {
    number: '02',
    type: 'Full-stack platform',
    title: 'Demo E-Commerce Platform',
    description:
      'A production-style Java and React commerce platform demonstrating secure APIs, role-based access, realistic checkout workflows, observability, and cloud deployment.',
    outcome:
      'A technical showcase spanning customer journeys, admin operations, security, testing, and deployment.',
    label: 'Commerce Platform',
    mockupTitle: 'Secure shopping, operations, and insight in one system.',
    metricLabel: 'Architecture',
    metricValue: 'Full-stack',
    tags: ['Java 21', 'Spring Boot 3', 'React', 'PostgreSQL', 'JWT', 'Docker'],
    href: 'https://mikeywestie.github.io/ecommerce-admin-ui/',
    action: 'Open live demo',
    status: 'Live technical demo',
    visual: 'commerce',
    icon: ShoppingCart,
  },
  {
    number: '03',
    type: 'Business automation',
    title: 'N&S Automation Work',
    description:
      'Practical workflow automation focused on reducing repetitive administration, improving quote handling, and helping a small business operate more efficiently.',
    outcome:
      'Less manual administration and a clearer path from incoming work to prepared quotations.',
    label: 'N&S Services',
    mockupTitle: 'Less repetitive admin. More time for the business.',
    metricLabel: 'Focus',
    metricValue: 'Time saved',
    tags: ['Workflow design', 'Automation', 'Quote processing', 'Consulting'],
    href: '#contact',
    action: 'Discuss an automation project',
    status: 'Client workflow work',
    visual: 'automation',
    icon: Bot,
  },
  {
    number: '04',
    type: 'Native Android app',
    title: 'QuoteFlow Mobile',
    description:
      'A native Android quotation management application built to simplify mobile quote creation and keep essential business information available on the move.',
    outcome:
      'A portable quotation workflow for creating and managing business quotes wherever work happens.',
    label: 'QuoteFlow Mobile',
    mockupTitle: 'Create and manage quotations wherever work happens.',
    metricLabel: 'Platform',
    metricValue: 'Android',
    tags: ['Kotlin', 'Jetpack Compose', 'Room Database', 'Signed APK'],
    href: 'https://mikeywestie.github.io/quoteflow-mobile.html',
    action: 'View app page',
    status: 'Mobile product build',
    visual: 'mobile',
    icon: Smartphone,
  },
]

function ProjectVisual({ project }: { project: Project }) {
  const Icon = project.icon

  return (
    <div className={`project-showcase-visual project-visual-${project.visual}`}>
      <div className="project-visual-topline">
        <span className="project-showcase-number">{project.number}</span>
        <span className="project-status">
          <i /> {project.status}
        </span>
        <span className="project-showcase-icon" aria-hidden="true">
          <Icon size={22} />
        </span>
      </div>

      <div className="project-mockup" aria-hidden="true">
        <div className="project-mockup-bar">
          <span />
          <span />
          <span />
          <small>{project.label}</small>
        </div>
        <div className="project-mockup-body">
          <span className="project-mockup-label">{project.type}</span>
          <strong className="project-mockup-title">{project.mockupTitle}</strong>
          <div className="project-mockup-dashboard">
            <div className="project-mockup-lines">
              <span />
              <span />
              <span />
            </div>
            <div className="project-metric">
              <small>{project.metricLabel}</small>
              <strong>{project.metricValue}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const external = project.href.startsWith('http')

  return (
    <motion.article
      className="project-showcase-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <ProjectVisual project={project} />

      <div className="project-showcase-copy">
        <p className="project-showcase-type">{project.type}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="project-outcome">
          <span>Outcome</span>
          <p>{project.outcome}</p>
        </div>

        <div className="project-showcase-tags" aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <a
          className="project-showcase-link"
          href={project.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {project.action}
          {external ? (
            <ExternalLink size={16} aria-hidden="true" />
          ) : (
            <ArrowRight size={17} aria-hidden="true" />
          )}
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      </div>
    </motion.article>
  )
}

export default function FeaturedProjectsPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const workSection = document.getElementById('work')
      if (!workSection) return

      workSection.classList.add('featured-work-mounted')
      setTarget(workSection)
    })

    return () => {
      window.cancelAnimationFrame(frame)
      document.getElementById('work')?.classList.remove('featured-work-mounted')
    }
  }, [])

  if (!target) return null

  return createPortal(
    <div className="featured-projects">
      <motion.div
        className="featured-projects-intro"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="eyebrow">Featured projects</p>
          <h2>Built for real businesses, real workflows, and real users.</h2>
        </div>
        <p>
          Four projects, four different problems, and one consistent approach: understand the need,
          build with care, and deliver something genuinely useful.
        </p>
      </motion.div>

      <div className="project-showcase-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>

      <div className="featured-projects-note">
        <div>
          <span>Need something different?</span>
          <p>Every solution can be shaped around your workflow, budget, and priorities.</p>
        </div>
        <a className="text-link" href="#contact">
          Start a conversation <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </div>,
    target,
  )
}
