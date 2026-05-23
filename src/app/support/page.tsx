"use client";

import Link from 'next/link';

export default function SupportPage() {
  return (
    <div style={{
      maxWidth: '720px',
      margin: '0 auto',
      padding: '2rem 1rem',
      fontFamily: 'var(--font-family)'
    }}>

      {/* Hero Card */}
      <div className="card" style={{
        textAlign: 'center',
        padding: '3rem 2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(111,66,193,0.05) 0%, rgba(232,221,255,0.3) 100%)',
        border: '1px solid rgba(111,66,193,0.12)',
        borderRadius: '24px'
      }}>
        <img
          src="/icon.png"
          alt="AURA"
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 24px rgba(111,66,193,0.2)'
          }}
        />
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          fontWeight: '800',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Thank You for Using AURA
        </h1>
        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.75',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          Your all-in-one <strong>Luxury Wedding Planner</strong>. We developed this app to be a powerful
          and beautiful tool for managing your wedding or launching your very own wedding planning business.
        </p>
      </div>

      {/* Contact Support */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(111,66,193,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            flexShrink: 0
          }}>
            ✉️
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Need Help or Have Questions?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
              Our support team is here for you. Reach out any time and we'll get back to you as soon as possible.
            </p>
            <a
              href="mailto:erovelto@outlook.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--accent-primary)',
                color: 'white',
                padding: '0.55rem 1.2rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '700',
                transition: 'background 0.2s ease'
              }}
            >
              📧 erovelto@outlook.com
            </a>
          </div>
        </div>
      </div>

      {/* Our Products */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🌐</span>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Our Other Products
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* K Business Academy */}
          <a
            href="http://www.kbusinessacademy.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderRadius: '14px',
              border: '1px solid var(--neutral-gray)',
              textDecoration: 'none',
              background: '#fafafa',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent-primary)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(111,66,193,0.03)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--neutral-gray)';
              (e.currentTarget as HTMLAnchorElement).style.background = '#fafafa';
            }}
          >
            <div>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                🎓 K Business Academy
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                www.kbusinessacademy.com
              </p>
            </div>
            <span style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>➔</span>
          </a>

          {/* Warlock Publishing */}
          <a
            href="http://www.warlockpublishing.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              borderRadius: '14px',
              border: '1px solid var(--neutral-gray)',
              textDecoration: 'none',
              background: '#fafafa',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--accent-primary)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(111,66,193,0.03)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--neutral-gray)';
              (e.currentTarget as HTMLAnchorElement).style.background = '#fafafa';
            }}
          >
            <div>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                📚 Warlock Publishing
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                www.warlockpublishing.com
              </p>
            </div>
            <span style={{ fontSize: '1rem', color: 'var(--accent-primary)' }}>➔</span>
          </a>
        </div>
      </div>

      {/* Footer / Legal */}
      <div style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--neutral-gray)',
        marginTop: '1rem'
      }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          © 2026 AURA Luxury Wedding Planner. All Rights Reserved.
          <br />
          This application is intended for your own personal use only.
        </p>
      </div>

    </div>
  );
}
