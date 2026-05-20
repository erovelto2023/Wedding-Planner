"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

const specialMomentsList = [
  "Prelude/Cocktail Hour Music",
  "Processional (Wedding Party)",
  "Bride's Entrance",
  "Groom's Entrance",
  "Ceremony Music (Unity Candle, Sand Ceremony, etc.)",
  "Recessional",
  "Cocktail Hour",
  "Grand Entrance/Reception Introduction",
  "First Dance",
  "Parent Dance (Father-Daughter)",
  "Parent Dance (Mother-Son)",
  "Toast/Speech Background Music",
  "Dinner Music",
  "Cake Cutting",
  "Bouquet Toss",
  "Garter Toss",
  "Anniversary Dance",
  "Money Dance",
  "Cultural Dances (Hora, Dollar Dance, etc.)",
  "Open Dancing/Party Music",
  "Last Dance",
  "Send-Off/Exit Music"
];

export default function MusicPage() {
  const [mustPlay, setMustPlay] = useState<any[]>([
    { id: 1, title: 'Perfect', artist: 'Ed Sheeran', notes: 'Slow dance' },
    { id: 2, title: 'Uptown Funk', artist: 'Bruno Mars', notes: 'Get everyone dancing' },
  ]);
  const [doNotPlay, setDoNotPlay] = useState<any[]>([
    { id: 1, title: 'Macarena', artist: 'Los Del Rio', notes: 'Too cliché' },
  ]);
  const [specialMoments, setSpecialMoments] = useState<any[]>([
    { id: 1, event: "Processional (Wedding Party)", song: '', artist: '' },
    { id: 2, event: 'Recessional', song: '', artist: '' },
    { id: 3, event: 'Grand Entrance/Reception Introduction', song: '', artist: '' },
    { id: 4, event: 'First Dance', song: '', artist: '' },
    { id: 5, event: 'Parent Dance (Father-Daughter)', song: '', artist: '' },
    { id: 6, event: 'Parent Dance (Mother-Son)', song: '', artist: '' },
  ]);

  const [newSong, setNewSong] = useState({ title: '', artist: '', notes: '', list: 'must' });

  const addSong = () => {
    if (!newSong.title) return;
    const song = { id: Date.now(), title: newSong.title, artist: newSong.artist, notes: newSong.notes };
    if (newSong.list === 'must') {
      setMustPlay([...mustPlay, song]);
    } else {
      setDoNotPlay([...doNotPlay, song]);
    }
    setNewSong({ title: '', artist: '', notes: '', list: 'must' });
  };

  const updateSpecialMoment = (id: number, field: string, value: string) => {
    setSpecialMoments(specialMoments.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, .sidebar {
            display: none !important;
          }
          .canvas-to-print {
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            page-break-after: always;
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
          }
          .card {
            box-shadow: none !important;
            border: 1px solid var(--neutral-gray) !important;
            break-inside: avoid;
            margin-bottom: 1rem !important;
          }
          input {
            border: none !important;
            border-bottom: 1px solid var(--neutral-gray) !important;
            border-radius: 0 !important;
            padding: 0.25rem 0 !important;
            background: transparent !important;
          }
          h1 {
            font-size: 2rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
      <Link href="/" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Dashboard</Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)' }}>Music & Playlists</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Coordinate your perfect wedding soundtrack.</p>
        </div>
        <button className="btn btn-secondary no-print" onClick={() => window.print()}>🖨️ Print for DJ</button>
      </div>

      {/* Add Song Form */}
      <div className="card no-print" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Add a Song</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
            <input 
              type="text" 
              value={newSong.title} 
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              placeholder="Song title..."
            />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Artist</label>
            <input 
              type="text" 
              value={newSong.artist} 
              onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              placeholder="Artist name..."
            />
          </div>
          <div style={{ flex: 3 }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Notes</label>
            <input 
              type="text" 
              value={newSong.notes} 
              onChange={(e) => setNewSong({ ...newSong, notes: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              placeholder="E.g., Play after cake cutting..."
            />
          </div>
          <div style={{ width: '150px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>List</label>
            <select 
              value={newSong.list} 
              onChange={(e) => setNewSong({ ...newSong, list: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
            >
              <option value="must">Must Play</option>
              <option value="not">Do Not Play</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={addSong}>Add Song</button>
        </div>
      </div>

      <div className="canvas-to-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Must Play */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Must Play</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mustPlay.map(song => (
              <div key={song.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{song.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{song.artist}</div>
                  {song.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>Note: {song.notes}</div>}
                </div>
                <button 
                  onClick={() => setMustPlay(mustPlay.filter(s => s.id !== song.id))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ×
                </button>
              </div>
            ))}
            {mustPlay.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No songs added yet.</p>
            )}
          </div>
        </div>

        {/* Do Not Play */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Do Not Play</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {doNotPlay.map(song => (
              <div key={song.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{song.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{song.artist}</div>
                  {song.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.25rem' }}>Note: {song.notes}</div>}
                </div>
                <button 
                  onClick={() => setDoNotPlay(doNotPlay.filter(s => s.id !== song.id))}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ×
                </button>
              </div>
            ))}
            {doNotPlay.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No songs added yet.</p>
            )}
          </div>
        </div>

        {/* Special Moments */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Special Moments</h2>
          <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <select 
              id="special-moment-select"
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.85rem' }}
            >
              <option value="">Select a moment...</option>
              {specialMomentsList.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button 
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => {
                const select = document.getElementById('special-moment-select') as HTMLSelectElement;
                const value = select.value;
                if (value && !specialMoments.find(m => m.event === value)) {
                  setSpecialMoments([...specialMoments, { id: Date.now(), event: value, song: '', artist: '' }]);
                  select.value = '';
                }
              }}
            >
              + Add
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {specialMoments.map(moment => (
              <div key={moment.id}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{moment.event}</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input 
                    type="text" 
                    placeholder="Song Title" 
                    value={moment.song} 
                    onChange={(e) => updateSpecialMoment(moment.id, 'song', e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.85rem' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Artist" 
                    value={moment.artist} 
                    onChange={(e) => updateSpecialMoment(moment.id, 'artist', e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
