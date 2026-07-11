import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { CalendarDays, Mail, MessageCircle, Send, ShieldCheck } from 'lucide-react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import './contact.css'

type ProjectPlan = 'Starter' | 'Business' | 'Custom Software' | 'Not sure yet'

const emailAddress = 'lunarwolf.dev@gmail.com'
const whatsappNumber = '27625315897'

export default function ContactPortal() {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [plan, setPlan] = useState<ProjectPlan>('Not sure yet')

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const contactSection = document.getElementById('contact')
      if (!contactSection) return

      contactSection.classList.add('contact-portal-mounted')
      setTarget(contactSection)
    })

    const handlePlanSelection = (event: Event) => {
      const selectedPlan = (event as CustomEvent<string>).detail
      if (
        selectedPlan === 'Starter' ||
        selectedPlan === 'Business' ||
        selectedPlan === 'Custom Software'
      ) {
        setPlan(selectedPlan)
      }
    }

    window.addEventListener('lunarwolf:select-plan', handlePlanSelection)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('lunarwolf:select-plan', handlePlanSelection)
      document.getElementById('contact')?.classList.remove('contact-portal-mounted')
    }
  }, [])

  const whatsappUrl = useMemo(() => {
    const message = encodeURIComponent(
      `Hi LunarWolf, I would like to discuss a ${plan === 'Not sure yet' ? 'new project' : plan + ' project'}.`,
    )
    return `https://wa.me/${whatsappNumber}?text=${message}`
  }, [plan])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '')
    const company = String(form.get('company') ?? '')
    const email = String(form.get('email') ?? '')
    const budget = String(form.get('budget') ?? '')
    const timeline = String(form.get('timeline') ?? '')
    const message = String(form.get('message') ?? '')

    const subject = encodeURIComponent(`New LunarWolf project enquiry — ${plan}`)
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Company: ${company || 'Not provided'}`,
        `Email: ${email}`,
        `Project type: ${plan}`,
        `Budget: ${budget}`,
        `Timeline: ${timeline}`,
        '',
        'Project details:',
        message,
      ].join('\n'),
    )

    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`
  }

  if (!target) return null

  return createPortal(
    <div className="contact-portal-shell">
      <motion.div
        className="contact-portal-intro"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="eyebrow">Start something useful</p>
          <h2>Tell us what you need. We’ll help shape the right solution.</h2>
        </div>
        <p>
          Start with a quick message, request a discovery call, or send a structured project brief.
          Every enquiry goes directly to LunarWolf.
        </p>
      </motion.div>

      <div className="contact-portal-grid">
        <motion.aside
          className="contact-direct-card"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <p className="contact-kicker">Direct contact</p>
          <h3>Choose the easiest way to start.</h3>
          <p>No sales maze. No ticket queue. Just a clear first conversation.</p>

          <a
            className="contact-direct-link"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={21} aria-hidden="true" />
            <span>
              <strong>WhatsApp LunarWolf</strong>
              <small>062 531 5897</small>
            </span>
          </a>

          <a className="contact-direct-link" href={`mailto:${emailAddress}`}>
            <Mail size={21} aria-hidden="true" />
            <span>
              <strong>Email us</strong>
              <small>{emailAddress}</small>
            </span>
          </a>

          <a
            className="contact-direct-link"
            href={`mailto:${emailAddress}?subject=${encodeURIComponent('Discovery call request')}`}
          >
            <CalendarDays size={21} aria-hidden="true" />
            <span>
              <strong>Request a discovery call</strong>
              <small>Booking link coming soon</small>
            </span>
          </a>

          <div className="contact-trust-note">
            <ShieldCheck size={18} aria-hidden="true" />
            <span>Your details are used only to respond to your enquiry.</span>
          </div>
        </motion.aside>

        <motion.form
          className="contact-enquiry-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className="contact-form-heading">
            <p className="contact-kicker">Project brief</p>
            <h3>Give us the useful details.</h3>
          </div>

          <div className="contact-form-row">
            <label>
              Name
              <input name="name" type="text" autoComplete="name" required />
            </label>
            <label>
              Company <span>optional</span>
              <input name="company" type="text" autoComplete="organization" />
            </label>
          </div>

          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <div className="contact-form-row">
            <label>
              Project type
              <select value={plan} onChange={(event) => setPlan(event.target.value as ProjectPlan)}>
                <option>Starter</option>
                <option>Business</option>
                <option>Custom Software</option>
                <option>Not sure yet</option>
              </select>
            </label>
            <label>
              Budget range
              <select name="budget" defaultValue="">
                <option value="" disabled>
                  Select a range
                </option>
                <option>R1,500 – R5,000</option>
                <option>R5,000 – R15,000</option>
                <option>R15,000 – R50,000</option>
                <option>R50,000+</option>
                <option>Need guidance</option>
              </select>
            </label>
          </div>

          <label>
            Preferred timeline
            <select name="timeline" defaultValue="">
              <option value="" disabled>
                Select a timeline
              </option>
              <option>As soon as possible</option>
              <option>Within 1 month</option>
              <option>Within 1–3 months</option>
              <option>Flexible / planning ahead</option>
            </select>
          </label>

          <label>
            What would you like to build or improve?
            <textarea name="message" rows={6} required />
          </label>

          <label className="contact-consent">
            <input type="checkbox" required />
            <span>I consent to LunarWolf using these details to respond to this enquiry.</span>
          </label>

          <button className="contact-submit" type="submit">
            Prepare email enquiry <Send size={17} aria-hidden="true" />
          </button>
          <small className="contact-submit-note">
            This opens your email app with the project brief pre-filled. Nothing is sent
            automatically.
          </small>
        </motion.form>
      </div>
    </div>,
    target,
  )
}
