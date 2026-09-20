import { useState, useEffect, useRef } from 'react'
import { fetchLectures, lectureCategories } from '../services/lectureService'
import LectureCard from '../components/ui/LectureCard'
import SectionHeader from '../components/ui/SectionHeader'
import { revealOnScroll, killScrollTriggers } from '../animations/gsap.config'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './Lectures.css'

export default function Lectures() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  // Load lectures
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const data = await fetchLectures()
      setLectures(data)
      setLoading(false)
    }
    loadData()
  }, [])

  // Filter lectures by category + search
  const filtered = lectures.filter((lecture) => {
    const matchesCategory =
      activeCategory === 'All' || lecture.category === activeCategory
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      lecture.title.toLowerCase().includes(q) ||
      lecture.speaker.toLowerCase().includes(q) ||
      lecture.description.toLowerCase().includes(q) ||
      lecture.tags.some((tag) => tag.toLowerCase().includes(q))
    return matchesCategory && matchesSearch
  })

  // Scroll reveals
  useEffect(() => {
    if (prefersReducedMotion) return
    revealOnScroll('.lectures-page__header', { start: 'top 90%' })
    return () => killScrollTriggers()
  }, [prefersReducedMotion])

  return (
    <main id="main-content" className="page lectures-page">
      <div className="container">
        {/* Header */}
        <div className="lectures-page__header">
          <SectionHeader
            eyebrow="Lecture Archive"
            title={`${lectures.length} Talks & Counting`}
            subtitle="Past sessions, live-recorded. Browse by topic or search for what you need."
            align="left"
          />
        </div>

        {/* Search + Filter */}
        <div className="lectures-filters">
          {/* Search */}
          <div className="lectures-search">
            <svg
              className="lectures-search__icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              className="lectures-search__input"
              placeholder="Search by title, speaker, or topic…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search lectures"
            />
            {searchQuery && (
              <button
                className="lectures-search__clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Category filter — only show when enough lectures to justify */}
          <div className="lectures-categories" role="group" aria-label="Filter by category">
            {lectureCategories.map((cat) => (
              <button
                key={cat}
                className={`lectures-category-btn ${activeCategory === cat ? 'lectures-category-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="lectures-results" aria-live="polite">
          {filtered.length === 0
            ? null
            : `${filtered.length} lecture${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
            Loading lectures...
          </div>
        ) : filtered.length > 0 ? (
          <div className="lectures-grid">
            {filtered.map((lecture) => (
              <LectureCard key={lecture.id} lecture={lecture} />
            ))}
          </div>
        ) : (
          <div className="lectures-empty" role="status">
            <p className="lectures-empty__title">No lectures found</p>
            <p className="lectures-empty__hint">
              Try a different search term or category.
            </p>
            <button
              className="lectures-empty__reset"
              onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
