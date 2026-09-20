import React, { useState, useEffect } from 'react';
import { fetchDoubts } from '../services/doubtService';
import { DoubtCard } from '../components/ui/DoubtCard';
import SectionHeader from '../components/ui/SectionHeader';
import './Events.css';
import './Doubts.css';

export default function Doubts() {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  const CATEGORIES = ['All', 'Web Development', 'AI / ML', 'Competitive Programming', 'Hackathons', 'General Technical'];

  const loadData = async () => {
    setLoading(true);
    const res = await fetchDoubts({
      category: selectedCategory,
      searchQuery,
      sortBy
    });
    if (res?.data) {
      setDoubts(res.data);
      setIsFallback(res.isFallback);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="page doubts-page">
      <div className="container">
        <div className="doubts-page__header-wrap">
          <SectionHeader
            eyebrow="Student Q&A & Mentorship"
            title="Ask & Resolve Technical Doubts"
            subtitle="Connect with senior mentors, club leads, and peer developers to unblock your code, project setup, and hackathon challenges."
            align="left"
          />

          <button
            onClick={() => setShowAskModal(true)}
            className="doubts-page__ask-btn"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Ask a Doubt
          </button>
        </div>

        {/* System notice badge if using localStorage fallback */}
        {isFallback && (
          <div style={{
            background: 'rgba(238, 215, 154, 0.08)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            marginBottom: '24px',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: 'var(--color-accent)' }}>⚡ Note:</span>
            <span>Running in Local Storage dual-mode. All doubts and answers save locally until Supabase credentials are configured in <code>.env</code>.</span>
          </div>
        )}

        {/* Filter controls */}
        <div className="events-page__controls">
          <div className="events-page__tabs">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', marginRight: '4px' }}>
              Category:
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`events-page__tab ${selectedCategory === cat ? 'events-page__tab--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="events-page__tabs">
              <button
                onClick={() => setSortBy('newest')}
                className={`events-page__tab ${sortBy === 'newest' ? 'events-page__tab--active' : ''}`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('upvotes')}
                className={`events-page__tab ${sortBy === 'upvotes' ? 'events-page__tab--active' : ''}`}
              >
                Most Upvoted
              </button>
            </div>

            <div className="events-page__search-wrap">
              <svg className="events-page__search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or topics..."
                className="events-page__search-input"
              />
            </div>
          </div>
        </div>

        {/* List of doubts */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
            Loading student doubts...
          </div>
        ) : doubts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px var(--container-px)',
            background: 'rgba(18, 16, 13, 0.6)',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)', margin: 0 }}>
              No Questions Found in {selectedCategory}
            </h3>
            <p style={{ color: 'var(--color-text-dim)', fontSize: 'var(--text-sm)', margin: 0, maxWidth: '480px' }}>
              Be the first to post a technical question! Our mentors actively monitor this section.
            </p>
            <button
              onClick={() => setShowAskModal(true)}
              className="doubts-page__ask-btn"
            >
              Ask a Doubt Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {doubts.map(doubt => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                onUpvoteSuccess={() => loadData()}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ask Doubt Modal - Google Form Embed */}
      {showAskModal && (
        <div className="doubts-page__modal-overlay" onClick={() => setShowAskModal(false)}>
          <div 
            className="doubts-page__modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              width: '100%', 
              maxWidth: '800px', 
              height: '85vh', 
              padding: '0', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid var(--color-border)',
              background: 'rgba(18, 16, 13, 0.9)'
            }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}>Submit a Doubt</h3>
              <button 
                onClick={() => setShowAskModal(false)}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--color-text-muted)',
                  cursor: 'pointer', fontSize: '24px', lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSdINFkIy_5hlER0FfHUYdLHDJUai8SmH9b1O5FDmkqKnqM7ZA/viewform?embedded=true" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              marginHeight="0" 
              marginWidth="0"
              style={{ flexGrow: 1 }}
              title="Submit Doubt Form"
            >
              Loading…
            </iframe>
          </div>
        </div>
      )}
    </div>
  );
}
