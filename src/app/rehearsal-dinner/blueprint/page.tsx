"use client";

import Link from 'next/link';

export default function RehearsalDinnerBlueprintPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/rehearsal-dinner" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Rehearsal Dinner</Link>
      
      <div className="heading-container" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)' }}>Rehearsal Dinner Blueprint</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Condensed feature list for a tight app.</p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <section style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>1. Core Event Setup</h2>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem' }}>
              <li>Type & Date: Sit-down vs casual, night before wedding.</li>
              <li>Location & Logistics: Venue address, parking, remote guest link.</li>
              <li>Formality & Theme: Dress code, color palette sync.</li>
            </ul>
          </section>

          <section style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>2. Guest & RSVP</h2>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem' }}>
              <li>Import List: Sync subset from main wedding list.</li>
              <li>RSVP Tracker: Custom questions (dietary, arrival time).</li>
              <li>Categories: Wedding party, VIPs, Out-of-towners.</li>
              <li>Speech Sign-Up: Volunteer for toasts in advance.</li>
            </ul>
          </section>

          <section style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>3. Catering & Menu</h2>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem' }}>
              <li>Menu Builder: Courses, sides, desserts, kids options.</li>
              <li>Dietary Tracker: Flag allergies, vegan, etc.</li>
              <li>Beverage Plan: Signature cocktail, wine/beer quantities.</li>
            </ul>
          </section>

          <section style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>4. Program & Speeches</h2>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem' }}>
              <li>Speech Order: Traditional flow or custom.</li>
              <li>Time Limits: Guidelines for concise toasts (3-5 mins).</li>
              <li>Gift Presentation: Logistics for wedding party gifts.</li>
              <li>Timeline: Rehearsal &rarr; Arrival &rarr; Dinner &rarr; Speeches.</li>
            </ul>
          </section>

          <section style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>5. Budget & Day-Of</h2>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem' }}>
              <li>Budget Tracker: Total vs per-person cost.</li>
              <li>Split-Cost: If multiple families contribute.</li>
              <li>Mobile View: Quick access to timeline and contacts.</li>
            </ul>
          </section>

        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--neutral-dark)', color: 'white', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem' }}>💡 Focus on coordination of people and flow to keep the evening stress-free.</p>
        </div>

      </div>
    </div>
  );
}
