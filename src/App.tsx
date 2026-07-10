import { useState } from 'react'
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

const services = [
  { icon: Globe2, title: 'Business websites', text: 'Fast, polished sites that help customers trust your business and take action.' },
  { icon: Code2, title: 'Custom software', text: 'Purpose-built applications, APIs, integrations, and internal tools.' },
  { icon: Sparkles, title: 'Automation & AI', text: 'Practical systems that remove repetitive work and improve delivery.' },
]

const principles = [
  { icon: Gauge, title: 'Built for momentum', text: 'Clear scope, focused execution, and frequent releases.' },
  { icon: ShieldCheck, title: 'Reliable by design', text: 'Accessible, maintainable, secure foundations from day one.' },
  { icon: Layers3, title: 'Designed to grow', text: 'Every release should make the next one faster and stronger.' },
]

const process = [
  ['01', 'Discover', 'Understand the business, audience, and outcome before choosing the solution.'],
  ['02', 'Design', 'Shape the message, experience, and technical path with clarity.'],
  ['03', 'Develop', 'Build in focused releases with quality visible from the start.'],
  ['04', 'Deploy', 'Launch through a dependable pipeline and keep improving after release.'],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="LunarWolf home">
            <img
                src="/brand/lunarwolf-logo.png"
                alt="LunarWolf"
                className="brand-logo"
            />
        </a>

        <nav className={menuOpen ? 'nav-open' : ''} aria-label="Primary navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#process" onClick={closeMenu}>Process</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
          <span className="portal-link">Portal · Soon</span>
        </nav>

        <div className="header-actions">
          <a className="button button-small" href="#contact">Start a project</a>
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

      <main id="top">
        <section className="hero section-pad">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow">Software studio · Johannesburg</p>
            <h1>Built with clarity. <span>Made to move.</span></h1>
            <p className="hero-lead">LunarWolf creates modern websites, custom software, and intelligent automation for businesses ready to grow with confidence.</p>
            <div className="hero-actions">
              <a className="button" href="#contact">Start your project <ArrowRight size={18} /></a>
              <a className="text-link" href="#work">See our work <ArrowRight size={16} /></a>
            </div>
            <div className="hero-proof">
              <span>Live client work</span>
              <span>Direct founder access</span>
              <span>Built for long-term value</span>
            </div>
          </motion.div>

          <motion.div
            className="crest-stage"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            aria-hidden="true"
          >
            <div className="crest-glow" />
            <div className="crest-ring crest-ring-one" />
            <div className="crest-ring crest-ring-two" />
            <div className="crest-moon">
              <div className="crest-wolf">LW</div>
            </div>
            <div className="crest-caption">Strategy · Design · Engineering · Growth</div>
          </motion.div>
        </section>

        <section className="proof-strip" aria-label="LunarWolf capabilities">
          <span>Strategy</span><i />
          <span>Design</span><i />
          <span>Engineering</span><i />
          <span>Automation</span><i />
          <span>Support</span>
        </section>

        <section className="section-pad" id="work">
          <div className="section-heading">
            <div><p className="eyebrow">Featured work</p><h2>Proof before promises.</h2></div>
            <p>Every LunarWolf project should solve a real problem, communicate clearly, and leave the client with something stronger than they had before.</p>
          </div>
          <a className="case-study" href="https://exclusive-pets-grooming.netlify.app/" target="_blank" rel="noreferrer">
            <div className="case-visual">
              <span className="live-pill">Live project</span>
              <div className="browser-frame">
                <div className="browser-bar"><span /><span /><span /></div>
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
              <p>A warm, responsive local-business website that brings services, trust signals, contact details, and bookings into one clear customer journey.</p>
              <div className="case-meta"><span>Responsive</span><span>Fast</span><span>Live on Netlify</span></div>
              <span className="text-link">View live website <ArrowRight size={16} /></span>
            </div>
          </a>
        </section>

        <section className="section-pad section-muted" id="services">
          <div className="section-heading compact"><div><p className="eyebrow">What we build</p><h2>Useful technology, thoughtfully delivered.</h2></div></div>
          <div className="card-grid">
            {services.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                className="service-card"
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08 }}
              >
                <Icon size={24} /><h3>{title}</h3><p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-pad" id="process">
          <div className="section-heading">
            <div><p className="eyebrow">How we work</p><h2>From first conversation to confident launch.</h2></div>
            <p>A transparent process keeps decisions clear, reduces waste, and gives every project a stronger foundation.</p>
          </div>
          <div className="process-grid">
            {process.map(([number, title, text]) => (
              <article className="process-step" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-pad about-section" id="about">
          <div className="about-grid">
            <div>
              <p className="eyebrow">Why LunarWolf</p>
              <h2>Calm thinking. Strong engineering. Honest delivery.</h2>
              <p className="about-intro">LunarWolf is a South African software studio focused on practical digital work that earns trust and creates momentum.</p>
            </div>
            <div className="principle-list">
              {principles.map(({ icon: Icon, title, text }) => (
                <article key={title}><Icon size={22} /><div><h3>{title}</h3><p>{text}</p></div></article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <p className="eyebrow">Start something useful</p>
          <h2>Bring us the problem. We’ll help shape the right solution.</h2>
          <p>Whether it begins with a business website, an internal tool, or an automation idea, the first step is a clear conversation.</p>
          <a className="button button-light" href="mailto:mikeywestman@gmail.com">Start your project <ArrowRight size={18} /></a>
        </section>
      </main>

      <footer>
        <a className="brand" href="#top">
            <img
                src="/brand/lunarwolf-logo.png"
                alt="LunarWolf"
                className="brand-logo"
            />
        </a>
        <p>Building software, systems, and momentum.</p>
        <span>© {new Date().getFullYear()} LunarWolf</span>
      </footer>
    </div>
  )
}

export default App
