"use client";

import Link from 'next/link';

export default function BachelorPartyGamesPage() {
  const games = [
    { name: 'Groom Trivia', slug: 'groom-trivia', description: 'How well do the guys know the groom?' },
    { name: 'Bachelor: Would You Rather?', slug: 'would-you-rather', description: 'Fun dilemmas for the bachelor party.' },
    { name: 'Drink If...', slug: 'drink-if', description: 'A classic party game with a bachelor twist.' }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/bachelor-party" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Bachelor Party</Link>
      
      <div className="heading-container" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--text-primary)' }}>Bachelor Party Games</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Printable games for the guys.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {games.map(game => (
          <div key={game.slug} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{game.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{game.description}</p>
            </div>
            <Link href={`/bachelor-party/games/${game.slug}`} className="btn btn-primary" style={{ textAlign: 'center' }}>Play & Print</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
