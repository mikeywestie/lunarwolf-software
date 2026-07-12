import { useEffect, useState } from 'react'
import { ArrowRight, Bot, MapPin, PawPrint, Sparkles } from 'lucide-react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import './success-stories.css'

type SuccessStory = {
  title: string
  type: string
  challenge: string
  solution: string
  outcome: string
  services: string[]
  icon: typeof PawPrint
  accent: 'pets' | 'automation'
  href: string
  action: string
}

const stories: SuccessStory[] = [
  {
    title: 'Exclusive Pets Grooming Parlour',
    type: 'Business website',
    challenge:
      'Create a polished online presence that reflects the care and quality of the grooming experience.',
    solution:
      'Designed and developed a warm, responsive website focused on trust, simplicity, and customer contact.',
    outcome:
      'A professional digital presence that clearly presents the business and makes it easier for customers to connect.',
    services: ['Website design', 'Responsive development', 'Customer experience'],
    icon: PawPrint,
    accent: 'pets',
    href: 'https://exclusive-pets-grooming.netlify.app/',
    action: 'View live website',
  },
  {
    title: 'N&S Automation',
    type: 'Business automation',
    challenge:
      'Reduce repetitive administration and create a clearer quotation workflow for day-to-day operations.',
    solution:
      'Built practical automation around the company’s existing process instead of forcing the business into a generic system.',
    outcome:
      'Less manual administration, improved consistency, and more time available for higher-value business work.',
    services: ['Workflow automation', 'Custom software', 'Process improvement'],
    icon: Bot,
    accent: 'automation',
    href: '#contact',
    action: 'Discuss an automation project',
  },
]

const proofPoints = [
  { value: '10+', label: 'Solutions built', icon: Sparkles },
  { value: '100%', label: 'Custom built', icon: Bot },
  { value: 'South Africa', label: 'Based', icon: MapPin },
]

export default function SuccessStoriesPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTarget(document.getElementById('process'))
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  if (!target) return null

  return createPortal(
    <section
      className="success-stories"
      id="success-stories"
      aria-labelledby="success-stories-heading"
    >
      <motion.div
        className="success-stories-heading"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="eyebrow">Success stories</p>
          <h2 id="success-stories-heading">Real work. Clear outcomes. No invented claims.</h2>
        </div>
        <p>
          Every project starts with a real business problem. These stories show how LunarWolf turns
          those problems into practical, dependable solutions.
        </p>
      </motion.div>

      <div className="success-stories-grid">
        {stories.map((story, index) => {
          const Icon = story.icon
          const external = story.href.startsWith('http')

          return (
            <motion.article
              className={`success-story-card success-story-${story.accent}`}
              key={story.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -5 }}
            >
              <div className="success-story-topline">
                <span className="success-story-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <span>{story.type}</span>
              </div>

              <h3>{story.title}</h3>

              <dl className="success-story-details">
                <div>
                  <dt>Challenge</dt>
                  <dd>{story.challenge}</dd>
                </div>
                <div>
                  <dt>Solution</dt>
                  <dd>{story.solution}</dd>
                </div>
                <div className="success-story-outcome">
                  <dt>Outcome</dt>
                  <dd>{story.outcome}</dd>
                </div>
              </dl>

              <div className="success-story-services" aria-label={`${story.title} services`}>
                {story.services.map((service) => (
                  <span key={service}>{service}</span>
                ))}
              </div>

              <a
                className="success-story-link"
                href={story.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                {story.action} <ArrowRight size={16} aria-hidden="true" />
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </motion.article>
          )
        })}
      </div>

      <motion.div
        className="success-proof-strip"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        {proofPoints.map(({ value, label, icon: Icon }) => (
          <div key={`${value}-${label}`}>
            <Icon size={19} aria-hidden="true" />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </motion.div>
    </section>,
    target,
  )
}
