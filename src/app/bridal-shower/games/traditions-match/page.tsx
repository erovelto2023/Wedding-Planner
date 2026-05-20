"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function TraditionsMatchPage() {
  const [items, setItems] = useState([
    { tradition: 'Smashing dishes before the wedding for good luck.', country: 'Germany' },
    { tradition: 'Stealing the groom\'s shoes during the ceremony.', country: 'India' },
    { tradition: 'Crying for a month before the wedding.', country: 'China' },
    { tradition: 'Brides wearing a crown of flowers and gold.', country: 'Norway' },
    { tradition: 'The couple sawing a log in half together.', country: 'Germany' },
    { tradition: 'Guests pinning money to the bride\'s dress to dance with her.', country: 'Philippines' },
    { tradition: 'The groom carrying the bride across the threshold.', country: 'USA / UK' },
    { tradition: 'Releasing two white doves to symbolize peace and love.', country: 'Philippines' }
  ]);

  const [showAnswers, setShowAnswers] = useState(false);
  const [newTradition, setNewTradition] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingTradition, setEditingTradition] = useState('');
  const [editingCountry, setEditingCountry] = useState('');

  const addItem = () => {
    if (newTradition.trim() && newCountry.trim()) {
      setItems([...items, { tradition: newTradition.trim(), country: newCountry.trim() }]);
      setNewTradition('');
      setNewCountry('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingTradition(items[index].tradition);
    setEditingCountry(items[index].country);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingTradition.trim() && editingCountry.trim()) {
      const newItems = [...items];
      newItems[editingIndex] = { tradition: editingTradition.trim(), country: editingCountry.trim() };
      setItems(newItems);
      setEditingIndex(null);
      setEditingTradition('');
      setEditingCountry('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingTradition('');
    setEditingCountry('');
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
            border: none !important;
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
          .tradition-item {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Wedding Traditions Around the World</h1>
        <div className="no-print" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} /> Show Answers
          </label>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Game</button>
        </div>
      </div>

      {/* Creator Section */}
      <div className="card no-print" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: 'var(--neutral-light)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add a Tradition</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tradition / Meaning</label>
            <input 
              type="text" 
              value={newTradition} 
              onChange={(e) => setNewTradition(e.target.value)}
              placeholder="e.g. Smashing dishes before the wedding..."
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Country</label>
            <input 
              type="text" 
              value={newCountry} 
              onChange={(e) => setNewCountry(e.target.value)}
              placeholder="e.g. Germany"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
          </div>
          <button className="btn btn-primary" onClick={addItem}>Add</button>
        </div>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Match the unique wedding tradition to the correct country!</p>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          {/* Traditions */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map((item, i) => (
              <div key={i} className="tradition-item" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {editingIndex === i ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={editingTradition} 
                      onChange={(e) => setEditingTradition(e.target.value)}
                      style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={editingCountry} 
                        onChange={(e) => setEditingCountry(e.target.value)}
                        style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', flex: 1 }}
                      />
                      <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span>{item.tradition}</span>
                      <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                        <button 
                          onClick={() => startEditing(i)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => removeItem(i)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div style={{ borderBottom: '1px solid var(--neutral-gray)', width: '150px', height: '1.5rem', display: 'flex', alignItems: 'center' }}>
                      {showAnswers && (
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>{item.country}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Country List (Scrambled) */}
          <div style={{ width: '200px', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-md)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', textAlign: 'center' }}>Countries:</h3>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Array.from(new Set(items.map(i => i.country))).sort().map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
