"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function BingoPage() {
  const [items, setItems] = useState([
    'Toaster', 'Blender', 'Towels', 'Robe', 'Candle', 
    'Vase', 'Picture Frame', 'Perfume', 'Luggage', 'Serving Bowl',
    'Wine Glasses', 'Baking Sheet', 'FREE SQUARE', 'Cookbook', 'Apron',
    'Lingerie', 'Gift Card', 'Silicone Mats', 'Knife Set', 'Coffee Maker',
    'Mixing Bowls', 'Tablecloth', 'Napkins', 'Waffle Maker', 'Cutting Board'
  ]);

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
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
          .card {
            box-shadow: none !important;
            border: 2px solid #333 !important;
            break-inside: avoid;
            margin-bottom: 1rem !important;
            padding: 1rem !important;
          }
          input {
            border: none !important;
            text-align: center !important;
            background: transparent !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Bridal Bingo</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Game</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>Fill in the squares with gifts you think the bride will receive!</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
          {items.map((item, index) => (
            <div key={index} style={{ 
              border: '1px solid var(--neutral-gray)', 
              padding: '0.5rem', 
              textAlign: 'center', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '80px',
              background: item === 'FREE SQUARE' ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
              fontWeight: item === 'FREE SQUARE' ? 'bold' : 'normal'
            }}>
              {item === 'FREE SQUARE' ? (
                <span>{item}</span>
              ) : (
                <input 
                  type="text" 
                  value={item} 
                  onChange={(e) => updateItem(index, e.target.value)} 
                  style={{ border: 'none', background: 'transparent', textAlign: 'center', width: '100%', outline: 'none', fontSize: '0.85rem' }} 
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
