"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function FindTheGuestPage() {
  const [items, setItems] = useState([
    'Find someone who traveled the farthest to be here.',
    'Find someone who is wearing the same color as you.',
    'Find someone who has been married for 10+ years.',
    'Find someone who has a birthday in the same month as you.',
    'Find someone who went to school with the bride.',
    'Find someone who has more than 3 pets.',
    'Find someone who can speak more than one language.',
    'Find someone who is a left-handed person.',
    'Find someone who has known the bride since childhood.',
    'Find someone who has a tattoo.'
  ]);

  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, newItem.trim()]);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(items[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingText.trim()) {
      const newItems = [...items];
      newItems[editingIndex] = editingText.trim();
      setItems(newItems);
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
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
          .scavenger-item {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Find the Guest</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Game</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Talk to other guests and find someone who matches each description! Write their name on the line.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={i} className="scavenger-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 'bold', minWidth: '30px' }}>{i+1}.</span>
              
              {editingIndex === i ? (
                <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    value={editingText} 
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{ flex: 1, padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <span style={{ flex: 1 }}>{item}</span>
                  <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
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
                </>
              )}
              
              <div style={{ width: '200px', borderBottom: '1px solid var(--neutral-gray)', height: '1.5rem' }}></div>
            </div>
          ))}
        </div>

        {/* Add Item Form */}
        <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add a Description</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Find someone who..." 
              value={newItem} 
              onChange={(e) => setNewItem(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
            <button className="btn btn-primary" onClick={addItem}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
