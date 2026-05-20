"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function DontSayBridePage() {
  const [word, setWord] = useState('BRIDE');
  const [rules, setRules] = useState('Take a clothespin when you arrive and pin it to your outfit. If you say the word above and someone catches you, they get to steal your pin!');
  const [variations, setVariations] = useState([
    'Banned Words: "Wedding", "Groom", "Dress"',
    'Time Limit: Only during cocktail hour',
    'Penalty: Must do a dance if you lose all pins'
  ]);

  const [players, setPlayers] = useState([
    { name: 'Alice', pins: 1 },
    { name: 'Bob', pins: 1 }
  ]);

  const [newPlayer, setNewPlayer] = useState('');

  const addPlayer = () => {
    if (!newPlayer) return;
    setPlayers([...players, { name: newPlayer, pins: 1 }]);
    setNewPlayer('');
  };

  const updatePins = (index: number, amount: number) => {
    const newPlayers = [...players];
    newPlayers[index].pins = Math.max(0, newPlayers[index].pins + amount);
    setPlayers(newPlayers);
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
            border: 4px solid var(--accent-primary) !important;
            break-inside: avoid;
            margin: 0 !important;
            padding: 2rem !important;
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
          textarea {
            border: none !important;
            background: transparent !important;
            text-align: center !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Don't Say "{word}"!</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Sign</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>Grab a Pin!</h2>
        
        <div style={{ border: '2px dashed var(--accent-primary)', padding: '2rem', borderRadius: 'var(--radius-md)', background: 'white', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>The Rules:</h3>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            <textarea 
              value={rules} 
              onChange={(e) => setRules(e.target.value)} 
              style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'center', fontSize: '1.2rem', resize: 'none', height: '100px' }} 
              className="no-print-border"
            />
          </p>
          <div style={{ marginTop: '1rem' }}>
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Forbidden Word:</span>
            <input 
              type="text" 
              value={word} 
              onChange={(e) => setWord(e.target.value)} 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', border: 'none', borderBottom: '1px solid var(--accent-primary)', width: '150px', textAlign: 'center', background: 'transparent' }} 
            />
          </div>
        </div>

        {/* Variations */}
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Game Variations:</h3>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {variations.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>

        {/* Pin Tracker (Scoreboard) */}
        <div className="no-print" style={{ textAlign: 'left', background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Live Pin Tracker (Host Use Only)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {players.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0', borderBottom: '1px solid #eee' }}>
                <span>{p.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => updatePins(i, -1)} style={{ padding: '0.25rem 0.5rem' }}>-</button>
                  <span style={{ minWidth: '60px', textAlign: 'center' }}>{p.pins} pins</span>
                  <button className="btn btn-secondary" onClick={() => updatePins(i, 1)} style={{ padding: '0.25rem 0.5rem' }}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="text" 
              placeholder="Add player name..." 
              value={newPlayer} 
              onChange={(e) => setNewPlayer(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
            <button className="btn btn-primary" onClick={addPlayer}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
