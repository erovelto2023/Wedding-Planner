"use client";

import Link from 'next/link';

export default function GamesDashboardPage() {
  const games = [
    { title: 'Bridal Bingo', path: 'bingo', desc: 'Gift-opening or bride trivia squares' },
    { title: 'How Well Do You Know the Bride?', path: 'know-the-bride', desc: 'Quiz game about the bride' },
    { title: 'Guess the Guest', path: 'guess-the-guest', desc: 'Baby photo matching game' },
    { title: 'Advice for the Bride', path: 'advice', desc: 'Written advice cards' },
    { title: 'Wedding Dress Design', path: 'dress-design', desc: 'Toilet paper fashion challenge' },
    { title: 'Mr. & Mrs.', path: 'mr-and-mrs', desc: 'He Said / She Said questions' },
    { title: 'Price is Right', path: 'price-is-right', desc: 'Wedding Edition cost guessing' },
    { title: "Don't Say Bride", path: 'dont-say-bride', desc: 'Clothespin penalty game' },
    { title: 'Wedding Word Scramble', path: 'word-scramble', desc: 'Unscramble wedding words' },
    { title: 'Love Story Mad Libs', path: 'mad-libs', desc: 'Fill-in-the-blank story' },
    { title: 'Emoji Pictionary', path: 'emoji-pictionary', desc: 'Guess phrases from emojis' },
    { title: 'Movie Quote Match', path: 'movie-quotes', desc: 'Match quotes to romantic films' },
    { title: 'Find the Guest', path: 'find-the-guest', desc: 'Icebreaker scavenger hunt' },
    { title: 'Traditions Match', path: 'traditions-match', desc: 'Match traditions to countries' },
    { title: 'Would You Rather?', path: 'would-you-rather', desc: 'Guess the bride\'s preferences' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/bridal-shower" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Bridal Shower</Link>
      
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)' }}>Bridal Shower Games</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Printable micro-apps for your celebration.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {games.map(game => (
          <Link href={`/bridal-shower/games/${game.path}`} key={game.path} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>{game.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{game.desc}</p>
              </div>
              <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', marginTop: '1rem', alignSelf: 'flex-end' }}>Open Game →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
