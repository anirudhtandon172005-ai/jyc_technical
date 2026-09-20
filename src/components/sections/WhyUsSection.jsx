import React from 'react';
import { Link } from 'react-router-dom';

export function WhyUsSection() {
  const BENEFITS = [
    {
      title: 'Hands-on Project Building',
      desc: 'Work on production-grade web applications, AI models, and open-source tools with real university users.'
    },
    {
      title: 'Direct Senior Mentorship',
      desc: 'Get personal guidance on placements, technical roadmaps, competitive programming, and research publications.'
    },
    {
      title: 'National Exposure & Fests',
      desc: 'Represent the university in national hackathons, interact with industry judges, and win prize pools.'
    },
    {
      title: 'Inclusive Student Community',
      desc: 'Collaborate with passionate peers across all departments in a supportive environment where every question matters.'
    }
  ];

  const STATS = [
    { value: '1,200+', label: 'Active Student Developers' },
    { value: '45+', label: 'Technical Workshops & Fests' },
    { value: '350+', label: 'Technical Doubts Resolved' },
    { value: '₹3.5L+', label: 'Prize Pool & Grants' }
  ];

  return (
    <section className="section" id="why-us" style={{ padding: 'clamp(36px, 5vw, 56px) 0', position: 'relative', zIndex: 5 }}>
      <div className="container">
        {/* Metric Stats Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(127, 30, 29, 0.4) 0%, rgba(18, 16, 13, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--color-border-bright)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px var(--container-px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '28px',
          marginBottom: '64px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.8), 0 0 32px var(--color-brand-maroon-glow)'
        }}>
          {STATS.map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 'var(--weight-black)',
                color: 'var(--jyc-gold)',
                textShadow: '0 0 20px var(--color-accent-glow)'
              }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--color-text-dim)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ textTransform: 'uppercase', color: 'var(--color-accent)', fontSize: 'var(--text-xs)', fontWeight: '600', letterSpacing: 'var(--tracking-widest)', marginBottom: '8px' }}>
              ✦ WHY JOIN JYC TECHNICAL? ✦
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', color: 'var(--color-text)', marginBottom: '16px' }}>
              Accelerate Your Engineering Journey
            </h2>
            <p style={{ color: 'var(--color-text-dim)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-loose)', marginBottom: '28px' }}>
              Whether you are writing your first line of code or deploying complex microservices, JYC Technical provides the sandbox, community, and mentorship to help you soar.
            </p>

            <Link
              to="/events"
              className="event-card__btn event-card__btn--primary"
              style={{ display: 'inline-flex', width: 'auto', padding: '12px 24px' }}
            >
              Explore Our Events
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {BENEFITS.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(18, 16, 13, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px 24px',
                  display: 'flex',
                  gap: '16px'
                }}
              >
                <div style={{
                  color: 'var(--jyc-gold)',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  0{idx + 1}.
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: 'var(--color-text)', margin: '0 0 4px 0' }}>
                    {item.title}
                  </h4>
                  <p style={{ color: 'var(--color-text-dim)', fontSize: 'var(--text-sm)', margin: 0, lineHeight: 'var(--leading-normal)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
