"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PhotoVideoPage() {
  const [shotList, setShotList] = useState<any[]>([
    { id: 1, category: 'Getting Ready', description: 'Dress hanging up', time: '12:00 PM', notes: '' },
    { id: 2, category: 'Getting Ready', description: 'Bride putting on shoes', time: '12:30 PM', notes: '' },
    { id: 3, category: 'Ceremony', description: 'Groom looking at Bride walking down aisle', time: '4:00 PM', notes: 'Wide shot' },
    { id: 4, category: 'Portraits', description: 'Family photos', time: '5:00 PM', notes: 'List of names provided' },
    { id: 5, category: 'Reception', description: 'First Dance', time: '7:00 PM', notes: '' },
  ]);

  const [newShot, setNewShot] = useState({ category: 'Getting Ready', description: '', time: '', notes: '' });

  const categories = ['Getting Ready', 'Ceremony', 'Portraits', 'Reception', 'Detail Shots'];

  const addShot = () => {
    if (!newShot.description) return;
    setShotList([...shotList, { id: Date.now(), ...newShot }]);
    setNewShot({ category: 'Getting Ready', description: '', time: '', notes: '' });
  };

  const deleteShot = (id: number) => {
    setShotList(shotList.filter(s => s.id !== id));
  };

  const updateShot = (id: number, field: string, value: string) => {
    setShotList(shotList.map(s => s.id === id ? { ...s, [field]: value } : s));
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
          input, select {
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)' }}>Photo & Video Shot List</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Plan your essential shots and timeline for the photographers.</p>
        </div>
        <button className="btn btn-secondary no-print" onClick={() => window.print()}>🖨️ Print for Photographer</button>
      </div>

      {/* Add Shot Form */}
      <div className="card no-print" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Add a Shot</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ width: '150px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
            <select 
              value={newShot.category} 
              onChange={(e) => setNewShot({ ...newShot, category: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Shot Description</label>
            <input 
              type="text" 
              value={newShot.description} 
              onChange={(e) => setNewShot({ ...newShot, description: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              placeholder="E.g., Bride with bridesmaids..."
            />
          </div>
          <div style={{ width: '120px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Time</label>
            <input 
              type="text" 
              value={newShot.time} 
              onChange={(e) => setNewShot({ ...newShot, time: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              placeholder="E.g., 2:00 PM"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Notes</label>
            <input 
              type="text" 
              value={newShot.notes} 
              onChange={(e) => setNewShot({ ...newShot, notes: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              placeholder="Special instructions..."
            />
          </div>
          <button className="btn btn-primary" onClick={addShot}>Add Shot</button>
        </div>
      </div>

      <div className="canvas-to-print">
        {categories.map(category => {
          const shots = shotList.filter(s => s.category === category);
          return (
            <div key={category} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{category}</h2>
              
              {shots.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--neutral-gray)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem', width: '120px' }}>Time</th>
                      <th style={{ padding: '0.5rem' }}>Description</th>
                      <th style={{ padding: '0.5rem' }}>Notes</th>
                      <th style={{ padding: '0.5rem', width: '50px' }} className="no-print"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {shots.map(shot => (
                      <tr key={shot.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="text" 
                            value={shot.time} 
                            onChange={(e) => updateShot(shot.id, 'time', e.target.value)}
                            style={{ width: '100%' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="text" 
                            value={shot.description} 
                            onChange={(e) => updateShot(shot.id, 'description', e.target.value)}
                            style={{ width: '100%' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="text" 
                            value={shot.notes} 
                            onChange={(e) => updateShot(shot.id, 'notes', e.target.value)}
                            style={{ width: '100%' }}
                            placeholder="Add notes..."
                          />
                        </td>
                        <td style={{ padding: '0.5rem' }} className="no-print">
                          <button 
                            onClick={() => deleteShot(shot.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No shots planned for this category.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
