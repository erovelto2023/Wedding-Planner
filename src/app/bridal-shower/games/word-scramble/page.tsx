"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function WordScramblePage() {
  const [words, setWords] = useState<{ original: string, scrambled: string }[]>([]);
  const [newWord, setNewWord] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);

  const scrambleWord = (word: string) => {
    const arr = word.toUpperCase().split('');
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };

  const addWord = () => {
    if (!newWord) return;
    const scrambled = scrambleWord(newWord);
    setWords([...words, { original: newWord.toUpperCase(), scrambled }]);
    setNewWord('');
  };

  const scrambleAll = () => {
    const newWords = words.map(item => ({
      ...item,
      scrambled: scrambleWord(item.original)
    }));
    setWords(newWords);
  };

  const removeWord = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
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
          }
          body {
            background: white !important;
            color: black !important;
          }
          .printable-content {
            padding: 0 !important;
            margin: 0 !important;
          }
          .card {
            box-shadow: none !important;
            border: 2px solid #333 !important;
            break-inside: avoid;
            margin: 0 !important;
            padding: 1.5rem !important;
          }
          h1 {
            font-size: 1.5rem !important;
            margin-bottom: 0.5rem !important;
            text-align: center;
          }
          .heading-container {
            margin-bottom: 0.5rem !important;
            justify-content: center !important;
          }
          .grid-container {
            gap: 1rem !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Wedding Word Scramble</h1>
        <div className="no-print" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} /> Show Answers
          </label>
          <button className="btn btn-secondary" onClick={scrambleAll} disabled={words.length === 0}>🎲 Scramble All</button>
          <button className="btn btn-primary" onClick={() => window.print()} disabled={words.length === 0}>🖨️ Print Game</button>
        </div>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Unscramble the wedding-themed words! The fastest person wins!</p>
        
        {words.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }} className="no-print">
            No words added yet. Use the form below to add words to the game!
          </div>
        ) : (
          <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {words.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 'bold', width: '120px', fontSize: '1.1rem', letterSpacing: '2px' }}>{item.scrambled}</span>
                <div style={{ flex: 1, borderBottom: '1px solid var(--neutral-gray)', height: '1.5rem', display: 'flex', alignItems: 'center' }}>
                  {showAnswers && (
                    <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginLeft: '1rem' }}>{item.original}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Word Form */}
        <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add a Word</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Enter word..." 
              value={newWord} 
              onChange={(e) => setNewWord(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
              onKeyPress={(e) => e.key === 'Enter' && addWord()}
            />
            <button className="btn btn-primary" onClick={addWord}>Add & Scramble</button>
          </div>
        </div>

        {/* Master List */}
        {words.length > 0 && (
          <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Master Word List (Answer Key)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {words.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  <span style={{ fontWeight: 'bold' }}>{item.original}</span>
                  <button 
                    onClick={() => removeWord(i)} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
