"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function WouldYouRatherPage() {
  const [items, setItems] = useState([
    { optionA: 'Have a huge wedding with 300+ guests', optionB: 'Elope on a private beach' },
    { optionA: 'Wear a classic white ballgown', optionB: 'Wear a bold, colorful non-traditional dress' },
    { optionA: 'Have a live band playing all night', optionB: 'Have a DJ with a custom playlist' },
    { optionA: 'Serve a formal sit-down 3-course dinner', optionB: 'Have fun food trucks and buffet stations' },
    { optionA: 'Go on an adventurous honeymoon (safari/hiking)', optionB: 'Go on a relaxing beach honeymoon' },
    { optionA: 'Have a summer wedding', optionB: 'Have a winter wedding' },
    { optionA: 'Write your own emotional vows', optionB: 'Stick to traditional wedding vows' },
    { optionA: 'Have an open bar all night', optionB: 'Have a signature cocktail & wine bar' }
  ]);

  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingOptionA, setEditingOptionA] = useState('');
  const [editingOptionB, setEditingOptionB] = useState('');

  const addItem = () => {
    if (!newOptionA.trim() || !newOptionB.trim()) return;
    setItems([...items, { optionA: newOptionA.trim(), optionB: newOptionB.trim() }]);
    setNewOptionA('');
    setNewOptionB('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingOptionA(items[index].optionA);
    setEditingOptionB(items[index].optionB);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingOptionA.trim() && editingOptionB.trim()) {
      const newItems = [...items];
      newItems[editingIndex] = { optionA: editingOptionA.trim(), optionB: editingOptionB.trim() };
      setItems(newItems);
      setEditingIndex(null);
      setEditingOptionA('');
      setEditingOptionB('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingOptionA('');
    setEditingOptionB('');
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
          .wyr-item {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 1rem !important;
            padding-bottom: 1rem !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Bridal Shower: Would You Rather?</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Game</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Guess what the bride would choose! Circle Option A or Option B.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={i} className="wyr-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '1rem' }}>
              <span style={{ fontWeight: 'bold', minWidth: '30px' }}>{i+1}.</span>
              
              {editingIndex === i ? (
                <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={editingOptionA} 
                    onChange={(e) => setEditingOptionA(e.target.value)}
                    style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>OR</span>
                  <input 
                    type="text" 
                    value={editingOptionB} 
                    onChange={(e) => setEditingOptionB(e.target.value)}
                    style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <span style={{ fontWeight: '500' }}>{item.optionA}</span>
                  </div>
                  
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>OR</span>
                  
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <span style={{ fontWeight: '500' }}>{item.optionB}</span>
                  </div>

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
              )}
            </div>
          ))}
        </div>

        {/* Add Item Form */}
        <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add a Dilemma</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Option A..." 
              value={newOptionA} 
              onChange={(e) => setNewOptionA(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
            <input 
              type="text" 
              placeholder="Option B..." 
              value={newOptionB} 
              onChange={(e) => setNewOptionB(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
            <button className="btn btn-primary" onClick={addItem}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
