import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { site } from '../../data/site'
import { socialLinks } from '../../data/social'
import './Navbar.css'

const navLinks = [
  { to: '/',         label: 'Home'       },
  { to: '/events',   label: 'Events'     },
  { to: '/doubts',   label: 'Ask Doubts' },
  { to: '/lectures', label: 'Lectures'   },
  { to: '/team',     label: 'Team'       },
  { to: '/about',    label: 'About'      }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const instagramLink = socialLinks.find((s) => s.id === 'instagram')
  const githubLink    = socialLinks.find((s) => s.id === 'github')

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
        <a href="#main-content" className="skip-link">Skip to content</a>

        <div className="navbar__inner container">
          {/* JYC Emblem Logo */}
          <Link to="/" className="navbar__logo" aria-label={`${site.name} — Home`}>
            <span className="navbar__logo-mark" aria-hidden="true">
              <img
                src="/logo.png"
                alt="JYC Logo"
                width="38"
                height="38"
                style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(238, 215, 154, 0.4)' }}
              />
            </span>
            <div className="navbar__logo-brand">
              <span className="navbar__logo-text">JYC TECHNICAL</span>
              <span className="navbar__logo-subtext">READY TO SOAR</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="navbar__nav" aria-label="Main navigation">
            <ul className="navbar__links" role="list">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Icons (Desktop) */}
          <div className="navbar__social" aria-label="Social links">
            {instagramLink && (
              <a
                href={instagramLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="navbar__social-link"
                aria-label={instagramLink.label}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}
            {githubLink && (
              <a
                href={githubLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="navbar__social-link"
                aria-label={githubLink.label}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
          </div>

          {/* Hamburger (Mobile) */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop & Sheet */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__backdrop" onClick={() => setMenuOpen(false)} />
        <div className="mobile-menu__sheet">
          <nav aria-label="Mobile navigation">
            <ul className="mobile-menu__links" role="list">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
