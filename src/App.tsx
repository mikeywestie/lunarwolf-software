import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Code2,
  Gauge,
  Globe2,
  Layers3,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { MagneticLink, StarField, usePrefersReducedMotion } from './effects'

const services = [
  {
    icon: Globe2,
    title: 'Business websites',
    text: 'Fast, polished sites that help customers trust your business and take action.',
  },
  {
    icon: Code2,
    title: 'Custom software',
    text: 'Purpose-built applications, APIs, integrations, and internal tools.',
  },
  {
    icon: Sparkles,
    title: 'Automation & AI',
    text: 'Practical systems that remove repetitive work and improve delivery.',
  },
]

const principles = [
  {
    icon: Gauge,
    title: 'Built for momentum',
    text: 'Clear scope, focused execution, and frequent releases.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable by design',
    text: 'Accessible, maintainable, secure foundations from day one.',
  },
  {
    icon: Layers3,
    title: 'Designed to grow',
    text: 'Every release should make the next one faster and stronger.',
  },
]

const process = [
  [
    '01',
    'Discover',
    'Understand the business, audience, and outcome before choosing the solution.',
  ],
  ['02', 'Design', 'Shape the message, experience, and technical path with clarity.'],
  ['03', 'Develop', 'Build in focused releases with quality visible from the start.'],
  ['04', 'Deploy', 'Launch through a dependable pipeline and keep improving after release.'],
]

const revealUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
} as const

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    document.body.classList.toggle('nav-locked', menuOpen)
    return () => document.body.classList.remove('nav-locked')
  }, [menuOpen])

  const stageRef = useRef<HTMLDivElement>(null)

  const handleStageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    stageRef.current.style.setProperty('--spot-x', `${px * 100}%`)
    stageRef.current.style.setProperty('--spot-y', `${py * 100}%`)
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#top">
        Skip to main content
      </a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="LunarWolf home">
          <img
            src="/brand/lunarwolf-logo.png"
            alt="LunarWolf"
            className="brand-logo"
            width={492}
            height={220}
          />
        </a>

        <nav className={menuOpen ? 'nav-open' : ''} aria-label="Primary navigation">
          <a href="#work" onClick={closeMenu}>
            Work
          </a>
          <a href="#services" onClick={closeMenu}>
            Services
          </a>
          <a href="#process" onClick={closeMenu}>
            Process
          </a>
          <a href="#about" onClick={closeMenu}>
            About
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
          <span className="portal-link">Portal · Soon</span>
        </nav>

        <div className="header-actions">
          <MagneticLink className="button button-small" href="#contact" strength={10}>
            Start a project
          </MagneticLink>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main id="top" tabIndex={-1}>
        <section className="hero section-pad">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow">Software studio · Johannesburg</p>
            <h1>
              Building software. <span>Solving problems.</span> Creating impact.
            </h1>
            <div className="hero-actions">
              <MagneticLink className="button" href="#contact" strength={10}>
                Start Your Project <ArrowRight size={18} aria-hidden="true" />
              </MagneticLink>
            </div>
            <div className="hero-proof">
              <span>Live client work</span>
              <span>Direct founder access</span>
              <span>Built for long-term value</span>
            </div>
          </motion.div>

          <motion.div
            className="crest-stage"
            ref={stageRef}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            onMouseMove={handleStageMouseMove}
            aria-hidden="true"
          >
            <StarField className="crest-stars" />
            <div className="crest-glow" />
            <div className="crest-ring crest-ring-one" />
            <div className="crest-ring crest-ring-two" />
            <div className="crest-spotlight" />
            <picture>
              <source srcSet="/brand/lunarwolf-mark.webp" type="image/webp" />
              <img
                src="/brand/lunarwolf-mark.png"
                alt=""
                width={520}
                height={520}
                className="crest-mark"
              />
            </picture>
            <div className="crest-caption">Strategy · Design · Engineering · Growth</div>
          </motion.div>
        </section>

        <section className="proof-strip" aria-label="LunarWolf capabilities">
          <span>Strategy</span>
          <i />
          <span>Design</span>
          <i />
          <span>Engineering</span>
          <i />
          <span>Automation</span>
          <i />
          <span>Support</span>
        </section>

        <section className="section-pad" id="work">
          <motion.div className="section-heading" {...revealUp}>
            <div>
              <p className="eyebrow">Featured work</p>
              <h2>Proof before promises.</h2>
            </div>
            <p>
              Every LunarWolf project should solve a real problem, communicate clearly, and leave
              the client with something stronger than they had before.
            </p>
          </motion.div>
          <motion.a
            className="case-study"
            href="https://exclusive-pets-grooming.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Exclusive Pets Grooming Parlour — view live website (opens in a new tab)"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            whileHover={reducedMotion ? undefined : { y: -6 }}
          >
            <div className="case-visual">
              <span className="live-pill">Live project</span>
              <div className="browser-frame">
                <div className="browser-bar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="browser-content">
                  <small>EXCLUSIVE PETS</small>
                  <strong>Grooming with as much care as love.</strong>
                  <div className="browser-button">Book a groom</div>
                </div>
              </div>
            </div>
            <div className="case-copy">
              <p className="eyebrow">Business website · 2026</p>
              <h3>Exclusive Pets Grooming Parlour</h3>
              <p>
                A warm, responsive local-business website that brings services, trust signals,
                contact details, and bookings into one clear customer journey.
              </p>
              <div className="case-meta">
                <span>Responsive</span>
                <span>Fast</span>
                <span>Live on Netlify</span>
              </div>
              <span className="text-link">
                View live website <ArrowRight size={16} aria-hidden="true" />
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </div>
          </motion.a>
        </section>

        <section className="section-pad section-muted" id="services">
          <motion.div className="section-heading compact" {...revealUp}>
            <div>
              <p className="eyebrow">What We Build</p>
              <h2>Useful technology, thoughtfully delivered.</h2>
            </div>
          </motion.div>
          <div className="card-grid">
            {services.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                className="service-card"
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08 }}
                whileHover={reducedMotion ? undefined : { y: -4 }}
              >
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-pad" id="process">
          <motion.div className="section-heading" {...revealUp}>
            <div>
              <p className="eyebrow">How we work</p>
              <h2>From first conversation to confident launch.</h2>
            </div>
            <p>
              A transparent process keeps decisions clear, reduces waste, and gives every project a
              stronger foundation.
            </p>
          </motion.div>
          <div className="process-grid">
            {process.map(([number, title, text], index) => (
              <motion.article
                className="process-step"
                key={number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-pad about-section" id="about">
          <div className="about-grid">
            <motion.div
              className="about-visual"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <img
                src="/brand/lunarwolf-office.jpg"
                alt="LunarWolf's workspace, showing the brand mark, a code editor, and a desk set up for focused engineering work"
                width={1200}
                height={800}
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="eyebrow">Why LunarWolf Exists</p>
              <h2>We build software businesses can depend on.</h2>
              <p className="about-intro">
                LunarWolf is a South African software studio focused on practical digital work that
                earns trust and creates momentum.
              </p>
            </motion.div>
            <div className="principle-list">
              {principles.map(({ icon: Icon, title, text }, index) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Icon size={22} />
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <motion.section
          className="contact-section section-pad"
          id="contact"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="eyebrow">Start something useful</p>
          <h2>Bring us the problem. We’ll help shape the right solution.</h2>
          <p>
            Whether it begins with a business website, an internal tool, or an automation idea, the
            first step is a clear conversation.
          </p>
          <MagneticLink
            className="button button-light"
            href="mailto:mikeywestman@gmail.com"
            strength={16}
          >
            Start your project <ArrowRight size={18} aria-hidden="true" />
          </MagneticLink>
        </motion.section>
      </main>

      <footer>
        <a className="brand" href="#top">
          <img
            src="/brand/lunarwolf-logo.png"
            alt="LunarWolf"
            className="brand-logo"
            width={492}
            height={220}
            loading="lazy"
          />
        </a>
        <p>Building software, systems, and momentum.</p>
        <span>© {new Date().getFullYear()} LunarWolf</span>
      </footer>
    </div>
  )
}

export default App
