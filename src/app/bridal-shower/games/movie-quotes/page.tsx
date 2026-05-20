"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import movieData from '../../../../data/romantic_movies.json';

export default function MovieQuotesPage() {
  const [allData, setAllData] = useState(movieData);
  const [items, setItems] = useState([
    { quote: '"You had me at hello."', movie: 'Jerry Maguire' },
    { quote: '"I\'m just a girl, standing in front of a boy, asking him to love her."', movie: 'Notting Hill' },
    { quote: '"To me, you are perfect."', movie: 'Love Actually' },
    { quote: '"As you wish."', movie: 'The Princess Bride' },
    { quote: '"I wanted it to be you. I wanted it to be you so badly."', movie: 'You\'ve Got Mail' },
    { quote: '"It was a million tiny little things that, when you added them all up, they meant we were supposed to be together."', movie: 'Sleepless in Seattle' },
    { quote: '"You should be kissed and by someone who knows how."', movie: 'Gone with the Wind' },
    { quote: '"I think I\'d miss you even if we\'d never met."', movie: 'The Wedding Date' }
  ]);

  const [showAnswers, setShowAnswers] = useState(false);
  const [questionCount, setQuestionCount] = useState(8);
  const [newQuote, setNewQuote] = useState('');
  const [newMovie, setNewMovie] = useState('');

  const pullNewQuotes = () => {
    // Get distinct movies
    const movies = Array.from(new Set(allData.map(i => i.movie)));
    // Shuffle movies
    const shuffledMovies = movies.sort(() => 0.5 - Math.random());
    // Pick N movies
    const selectedMovies = shuffledMovies.slice(0, Math.min(questionCount, movies.length));
    // For each movie, pick 1 random quote
    const selectedQuotes = selectedMovies.map(movie => {
      const movieQuotes = allData.filter(i => i.movie === movie);
      return movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
    });
    
    setItems(selectedQuotes);
  };

  useEffect(() => {
    pullNewQuotes();
  }, [allData, questionCount]);

  const addCustomQuote = () => {
    if (!newQuote || !newMovie) return;
    setAllData([...allData, { quote: `"${newQuote.replace(/^"|"$/g, '')}"`, movie: newMovie }]);
    setNewQuote('');
    setNewMovie('');
  };

  return (
    <div className="printable-content" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, .sidebar, .nav, nav, header, footer {
            display: none !important;
          }
          .canvas-to-print {
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
          html, body, .app-layout, .main-content, .container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            left: 0 !important;
            top: 0 !important;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .printable-content {
            padding: 0 !important;
            margin: 0 !important;
            margin-top: 0 !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            margin: 0 !important;
            padding: 0.5rem !important;
            margin-top: 0 !important;
          }
          h1 {
            font-size: 1.2rem !important;
            margin-top: 0 !important;
            margin-bottom: 0.25rem !important;
            text-align: center;
          }
          .heading-container {
            margin-top: 0 !important;
            margin-bottom: 0.25rem !important;
            justify-content: center !important;
          }
          .quote-item {
            gap: 0.1rem !important;
            margin-bottom: 0.25rem !important;
            font-size: 0.9rem !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          p {
            font-size: 0.85rem !important;
            margin-bottom: 0.5rem !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Wedding Movie Quote Match</h1>
        <div className="no-print" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="count" style={{ fontSize: '0.9rem' }}>Questions:</label>
            <input 
              id="count"
              type="number" 
              value={questionCount} 
              onChange={(e) => setQuestionCount(Math.max(1, parseInt(e.target.value) || 1))} 
              style={{ width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }} 
            />
          </div>
          <button className="btn btn-secondary" onClick={pullNewQuotes}>🔄 Pull Quotes</button>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} /> Show Answers
          </label>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Game</button>
        </div>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Match the romantic movie quote to the correct film!</p>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Quotes */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map((item, i) => (
              <div key={i} className="quote-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontStyle: 'italic' }}>"{item.quote.replace(/^"|"$/g, '')}"</span>
                <div style={{ borderBottom: '1px solid var(--neutral-gray)', width: '150px', height: '1.5rem', display: 'flex', alignItems: 'center' }}>
                  {showAnswers && (
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{item.movie}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Movie List (Scrambled) */}
          <div style={{ width: '200px', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', textAlign: 'center' }}>Movies:</h3>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Array.from(new Set(items.map(i => i.movie))).sort().map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Add Quote Form */}
        <div className="no-print" style={{ marginTop: '3rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add Custom Quote to Database</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Enter quote..." 
              value={newQuote} 
              onChange={(e) => setNewQuote(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Movie title..." 
                value={newMovie} 
                onChange={(e) => setNewMovie(e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
              />
              <button className="btn btn-primary" onClick={addCustomQuote}>Add Quote</button>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total quotes in your current database: {allData.length}</p>
        </div>
      </div>
    </div>
  );
}
