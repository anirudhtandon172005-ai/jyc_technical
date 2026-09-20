import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { lectures } from '../data/lectures'
import { team } from '../data/team'
import LectureCard from '../components/ui/LectureCard'
import TeamCard from '../components/ui/TeamCard'
import Button from '../components/ui/Button'
import SectionHeader from '../components/ui/SectionHeader'
import { heroEntrance, revealOnScroll, killScrollTriggers } from '../animations/gsap.config'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { WhoWeAreSection } from '../components/sections/WhoWeAreSection'
import { WhyUsSection } from '../components/sections/WhyUsSection'
import { EventsSection } from '../components/sections/EventsSection'
import { fetchDoubts } from '../services/doubtService'
import { DoubtCard } from '../components/ui/DoubtCard'
import './Home.css'

// Lazy-load heavy 3D canvas — Three.js persistent across Home page
const HeroCanvas = lazy(() => import('../three/HeroCanvas'))

const featuredLectures = lectures.filter((l) => l.featured).slice(0, 3)
const coreTeam = team.filter((m) => m.tier === 'core').slice(0, 4)

export default function Home() {
  const heroRef    = useRef()
  const eyebrowRef = useRef()
  const titleRef   = useRef()
  const subtitleRef = useRef()
  const ctaRef     = useRef()
  const prefersReducedMotion = useReducedMotion()

  const [recentDoubts, setRecentDoubts] = useState([])

  useEffect(() => {
    async function loadDoubts() {
      const res = await fetchDoubts({ sortBy: 'newest' })
      if (res?.data) {
        setRecentDoubts(res.data.slice(0, 3))
      }
    }
    loadDoubts()
  }, [])

  // Hero entrance animation
  useEffect(() => {
    if (prefersReducedMotion) {
      ;[eyebrowRef, titleRef, subtitleRef, ctaRef].forEach((r) => {
        if (r.current) {
          r.current.style.opacity = 1
          r.current.style.transform = 'none'
        }
      })
      return
    }

    const tl = heroEntrance(
      [eyebrowRef.current, titleRef.current, subtitleRef.current, ctaRef.current],
      { delay: 0.8 }
    )

    return () => tl.kill()
  }, [prefersReducedMotion])

  // Section scroll reveals
  useEffect(() => {
    if (prefersReducedMotion) return

    const triggers = []

    triggers.push(
      revealOnScroll('.home-stat', { stagger: 0.08, start: 'top 85%' })
    )
    triggers.push(
      revealOnScroll('.home-activity-card', { stagger: 0.12 })
    )
    triggers.push(
      revealOnScroll('.section-header', { stagger: 0.05 })
    )

    return () => killScrollTriggers()
  }, [prefersReducedMotion])

  return (
    <div className="page home-page">
      {/* 3D Eagle background — persistent across full page scroll */}
      <Suspense fallback={<div className="home-hero__canvas-fallback" aria-hidden="true" />}>
        <HeroCanvas />
      </Suspense>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="home-hero" ref={heroRef} aria-label="Hero">
        {/* Text content — always above the 3D */}
        <div className="home-hero__content container">
          <span
            ref={eyebrowRef}
            className="home-hero__eyebrow"
            style={{ opacity: 0 }}
          >
            {site.college}
          </span>

          <h1
            ref={titleRef}
            className="home-hero__title"
            style={{ opacity: 0 }}
          >
            {site.tagline}
          </h1>

          <p
            ref={subtitleRef}
            className="home-hero__subtitle"
            style={{ opacity: 0 }}
          >
            {site.description}
          </p>

          <div
            ref={ctaRef}
            className="home-hero__cta"
            style={{ opacity: 0, display: 'flex', flexWrap: 'wrap', gap: '12px' }}
          >
            <Button href="/events" variant="primary" size="lg">
              Explore Events
            </Button>
            <Button href="/doubts" variant="secondary" size="lg">
              Ask a Doubt
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="home-hero__scroll-indicator" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── WHAT WE DO SECTION ────────────────────────────────────────── */}
      <WhoWeAreSection />

      {/* ── EVENTS SECTION ────────────────────────────────────────────── */}
      <EventsSection />

      {/* ── WHY US SECTION ────────────────────────────────────────────── */}
      <WhyUsSection />

      {/* ── STUDENT DOUBTS & Q&A PREVIEW ──────────────────────────────── */}
      <section className="section home-doubts" style={{ padding: 'clamp(36px, 5vw, 56px) 0', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '40px' }}>
            <div>
              <div style={{ textTransform: 'uppercase', color: 'var(--color-accent)', fontSize: 'var(--text-xs)', fontWeight: '600', letterSpacing: 'var(--tracking-widest)', marginBottom: '8px' }}>
                ✦ COMMUNITY DISCUSSIONS ✦
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--color-text)', margin: 0 }}>
                Recent Student Doubts & Answers
              </h2>
            </div>

            <Link
              to="/doubts"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-semibold)',
                textDecoration: 'none'
              }}
            >
              Ask or Answer a Doubt
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {recentDoubts.map(doubt => (
              <DoubtCard key={doubt.id} doubt={doubt} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LECTURES ────────────────────────────────────────── */}
      <section className="section home-lectures" aria-label="Featured lectures" style={{ padding: 'clamp(36px, 5vw, 56px) 0', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <div className="home-lectures__header">
            <SectionHeader
              eyebrow="From the Archive"
              title="Recent lectures."
              subtitle="A sample from our growing library of technical talks."
              align="left"
            />
            <Button href="/lectures" variant="ghost">
              View All Lectures
            </Button>
          </div>

          <div className="home-lectures__grid">
            {featuredLectures.map((lecture) => (
              <LectureCard key={lecture.id} lecture={lecture} className="reveal" />
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM PREVIEW ─────────────────────────────────────────────── */}
      <section className="section home-team" aria-label="Core team preview" style={{ padding: 'clamp(36px, 5vw, 56px) 0', position: 'relative', zIndex: 5 }}>
        <div className="container">
          <SectionHeader
            eyebrow="The Team"
            title="Built by students, run by students."
            subtitle="Meet the core team behind the club's events, content, and community."
          />

          <div className="home-team__grid">
            {coreTeam.map((member) => (
              <TeamCard key={member.id} member={member} className="reveal" />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Button href="/team" variant="ghost">
              Meet the Full Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
