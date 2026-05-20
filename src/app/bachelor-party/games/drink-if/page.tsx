"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function DrinkIfPage() {
  const [items, setItems] = useState([
    'Drink if you have known the groom for more than 10 years.',
    'Drink if you were there when the groom met the bride.',
    'Drink if you are wearing the same color as the groom.',
    'Drink if you have a funny story about the groom that you can\'t tell the bride.',
    'Drink if you traveled by plane to get here.',
    'Drink if you are the Best Man.',
    'Drink if you have ever lived with the groom.',
    'Drink if you have ever been on a road trip with the groom.',
    'Drink if you are older than the groom.',
    'Drink if you have already had a drink today.'
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
          .drink-item {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
      
      <Link href="/bachelor-party/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Drink If...</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Game</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Take a drink if the statement applies to you!</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={i} className="drink-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            </div>
          ))}
        </div>

        {/* Add Item Form */}
        <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add a Rule</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Drink if..." 
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
