import { useEffect, useState } from 'react'
import { Check, MessageCircle, Sparkles } from 'lucide-react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import './pricing.css'

type PricingOption = {
  name: string
  price: string
  description: string
  features: string[]
  featured?: boolean
}

const pricingOptions: PricingOption[] = [
  {
    name: 'Starter',
    price: 'From R4,500',
    description: 'A focused online presence for individuals, startups, and local businesses.',
    features: [
      'Landing page or compact website',
      'Responsive mobile-first design',
      'Contact and enquiry journey',
      'Basic search and sharing setup',
      'Launch support',
    ],
  },
  {
    name: 'Business',
    price: 'From R12,000',
    description: 'A more complete digital platform designed around how your business works.',
    features: [
      'Multi-page business website',
      'Custom forms and workflows',
      'Booking or enquiry integration',
      'Content and conversion planning',
      'Deployment and handover',
    ],
    featured: true,
  },
  {
    name: 'Custom Software',
    price: "Let's scope it",
    description: 'Purpose-built software, automation, mobile apps, APIs, and internal tools.',
    features: [
      'Discovery and technical planning',
      'Custom architecture and development',
      'Integrations and automation',
      'Testing and deployment',
      'Ongoing support options',
    ],
  },
]

export default function PricingPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTarget(document.getElementById('services'))
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  if (!target) return null

  return createPortal(
    <div className="pricing-shell" id="pricing">
      <motion.div
        className="pricing-heading"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="eyebrow">Starting points</p>
          <h2>Clear enough to plan. Flexible enough to fit.</h2>
        </div>
        <p>
          These are starting prices, not rigid boxes. Every solution can be adjusted around your
          goals, timeline, priorities, and budget.
        </p>
      </motion.div>

      <div className="pricing-grid">
        {pricingOptions.map((option, index) => (
          <motion.article
            className={`pricing-card${option.featured ? ' pricing-card-featured' : ''}`}
            key={option.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            {option.featured && (
              <span className="pricing-badge">
                <Sparkles size={14} aria-hidden="true" /> Most popular starting point
              </span>
            )}
            <p className="pricing-name">{option.name}</p>
            <h3>{option.price}</h3>
            <p className="pricing-description">{option.description}</p>
            <ul>
              {option.features.map((feature) => (
                <li key={feature}>
                  <Check size={17} aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a className="pricing-action" href="#contact">
              <MessageCircle size={17} aria-hidden="true" /> Discuss this option
            </a>
          </motion.article>
        ))}
      </div>

      <div className="pricing-flex-note">
        <strong>No two projects are exactly alike.</strong>
        <span>
          We will shape the scope together before any work begins, so you understand what is
          included and why.
        </span>
      </div>
    </div>,
    target,
  )
}
