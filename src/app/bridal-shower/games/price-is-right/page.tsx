"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function PriceIsRightPage() {
  const [items, setItems] = useState([
    'Bridal Bouquet', 
    'Wedding Cake (per tier)', 
    'DJ (4 hours)', 
    'Catering (per guest)', 
    'Wedding Dress', 
    'Wedding Rings', 
    'Venue Rental',
    'Invitations (set of 100)',
    'Photographer (full day)',
    'Honeymoon Flight'
  ]);

  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem) return;
    setItems([...items, newItem]);
    setNewItem('');
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
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
          .list-container {
            gap: 1rem !important;
          }
          input[type="text"] {
            border: none !important;
            background: transparent !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Price Is Right: Wedding Edition</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Game</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Guess the cost of these wedding items! The closest total wins!</p>
        <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input 
                type="text" 
                value={item} 
                onChange={(e) => updateItem(i, e.target.value)} 
                style={{ fontWeight: 'bold', width: '220px', fontSize: '1rem', border: 'none', background: 'transparent' }} 
              />
              <div style={{ flex: 1, borderBottom: '1px solid var(--neutral-gray)', height: '1.5rem' }}></div>
              <span style={{ fontWeight: 'bold' }}>$ ________</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <span style={{ fontWeight: 'bold', minWidth: '220px', fontSize: '1.2rem' }}>TOTAL:</span>
            <div style={{ flex: 1 }}></div>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>$ ________</span>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add an Item</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Item name..." 
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
