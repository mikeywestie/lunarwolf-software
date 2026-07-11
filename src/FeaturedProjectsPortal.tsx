import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  Bot,
  PawPrint,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'framer-motion'
import './featured-projects.css'

type Project = {
  number: string
  type: string
  title: string
  description: string
  label: string
  mockupTitle: string
  tags: string[]
  href: string
  action: string
  icon: LucideIcon
}

const projects: Project[] = [
  {
    number: '01',
    type: 'Client website',
    title: 'Exclusive Pets Grooming Parlour',
    description:
      'A warm, responsive website that gives a local grooming business a clearer customer journey from first visit to booking enquiry.',
    label: 'Exclusive Pets',
    mockupTitle: 'Grooming with as much care as love.',
    tags: ['Responsive design', 'Local business', 'Customer journey'],
    href: 'https://exclusive-pets-grooming.netlify.app/',
    action: 'View live website',
    icon: PawPrint,
  },
  {
    number: '02',
    type: 'Full-stack platform',
    title: 'Demo E-Commerce Platform',
    description:
      'A production-style Java and React commerce platform demonstrating secure APIs, role-based access, realistic checkout workflows, observability, and cloud deployment.',
    label: 'Commerce platform',
    mockupTitle: 'Secure shopping, operations, and insight in one system.',
    tags: ['Java 21', 'Spring Boot 3', 'React', 'PostgreSQL', 'JWT', 'Docker'],
    href: 'https://mikeywestie.github.io/ecommerce-admin-ui/',
    action: 'Open live demo',
    icon: ShoppingCart,
  },
  {
    number: '03',
    type: 'Business automation',
    title: 'N&S Automation Work',
    description:
      'Practical workflow automation focused on reducing repetitive administration, improving quote handling, and helping a small business operate more efficiently.',
    label: 'N&S Services',
    mockupTitle: 'Less repetitive admin. More time for the business.',
    tags: ['Workflow design', 'Automation', 'Quote processing', 'Consulting'],
    href: '#contact',
    action: 'Discuss an automation project',
    icon: Bot,
  },
  {
    number: '04',
    type: 'Native Android app',
    title: 'QuoteFlow Mobile',
    description:
      'A native Android quotation management application built to simplify mobile quote creation and keep essential business information available on the move.',
    label: 'QuoteFlow Mobile',
    mockupTitle: 'Create and manage quotations wherever work happens.',
    tags: ['Kotlin', 'Jetpack Compose', 'Room Database', 'Signed APK'],
    href: 'https://mikeywestie.github.io/quoteflow-mobile.html',
    action: 'View app page',
    icon: Smartphone,
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = project.icon
  const external = project.href.startsWith('http')

  return (
    <motion.a
      className="project-showcase-card"
      href={project.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <div className="project-showcase-visual">
        <span className="project-showcase-number">{project.number}</span>
        <span className="project-showcase-icon" aria-hidden="true">
          <Icon size={22} />
        </span>
        <div className="project-mockup" aria-hidden="true">
          <div className="project-mockup-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="project-mockup-body">
            <span className="project-mockup-label">{project.label}</span>
            <strong className="project-mockup-title">{project.mockupTitle}</strong>
            <div className="project-mockup-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      <div className="project-showcase-copy">
        <p className="project-showcase-type">{project.type}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-showcase-tags" aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <span className="project-showcase-link">
          {project.action} <ArrowRight size={17} aria-hidden="true" />
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </span>
      </div>
    </motion.a>
  )
}

export default function FeaturedProjectsPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const workSection = document.getElementById('work')
    if (!workSection) return

    workSection.classList.add('featured-work-mounted')
    setTarget(workSection)

    return () => workSection.classList.remove('featured-work-mounted')
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
          <h2>Real work. Practical outcomes. Strong engineering.</h2>
        </div>
        <p>
          From client-facing websites to secure full-stack platforms, automation, and native mobile
          software, each project reflects a different way LunarWolf turns an idea into something
          useful.
        </p>
      </motion.div>

      <div className="project-showcase-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>

      <div className="featured-projects-note">
        <p>Have a project that does not fit neatly into a package? We will shape the right solution together.</p>
        <a className="text-link" href="#contact">
          Start a conversation <ArrowRight size={16} aria-hidden="true" />
        </a>
      </div>
    </div>,
    target,
  )
}
