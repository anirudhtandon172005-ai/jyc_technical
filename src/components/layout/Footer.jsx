import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { socialLinks } from '../../data/social'
import './Footer.css'

const navLinks = [
  { to: '/',         label: 'Home'       },
  { to: '/events',   label: 'Events'     },
  { to: '/doubts',   label: 'Ask Doubts' },
  { to: '/lectures', label: 'Lectures'   },
  { to: '/team',     label: 'Team'       },
  { to: '/about',    label: 'About'      },
]

// Social icon SVGs
function SocialIcon({ id }) {
  const icons = {
    instagram: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    x: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    youtube: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.97A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="var(--color-void)" />
      </svg>
    ),
    github: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  }
  return icons[id] ?? null
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo" aria-label={`${site.name} home`}>
              <span className="footer__logo-mark" aria-hidden="true">
                <img
                  src="/logo.png"
                  alt="JYC Logo"
                  width="28"
                  height="28"
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              </span>
              <span className="footer__logo-text">{site.name}</span>
            </Link>
            <p className="footer__desc">{site.description}</p>
            <p className="footer__college">{site.college}</p>
          </div>

          {/* Nav */}
          <nav className="footer__nav" aria-label="Footer navigation">
            <h3 className="footer__nav-title">Pages</h3>
            <ul className="footer__nav-links" role="list">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="footer__nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div className="footer__social-section">
            <h3 className="footer__nav-title">Connect</h3>
            <ul className="footer__social-links" role="list">
              {socialLinks.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__social-link"
                    aria-label={s.label}
                  >
                    <SocialIcon id={s.id} />
                    <span>{s.platform}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {year} {site.name}. {site.college}. All rights reserved.
          </p>
          <div className="footer__legal">
            <Link to="/preview" className="footer__legal-link">Design System</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
