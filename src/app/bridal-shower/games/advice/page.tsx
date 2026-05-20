"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function AdvicePage() {
  const [cards, setCards] = useState([
    { title: 'Words of Wisdom', subtitle: 'Share your advice for the Bride & Groom.', to: 'Dear Bride,', from: 'With love, ____________' },
    { title: 'Words of Wisdom', subtitle: 'Share your advice for the Bride & Groom.', to: 'Dear Bride,', from: 'With love, ____________' }
  ]);

  const addCard = () => {
    setCards([...cards, { ...cards[0] }]);
  };

  const updateCard = (index: number, field: string, value: string) => {
    const newCards = [...cards];
    (newCards[index] as any)[field] = value;
    setCards(newCards);
  };

  return (
    <div className="printable-content" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
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
            padding: 1rem !important;
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
            grid-template-columns: repeat(2, 1fr) !important;
          }
          input {
            border: none !important;
            background: transparent !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Advice for the Bride</h1>
        <div className="no-print" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={addCard}>➕ Add Card</button>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Cards</button>
        </div>
      </div>

      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {cards.map((card, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <input 
              type="text" 
              value={card.title} 
              onChange={(e) => updateCard(i, 'title', e.target.value)} 
              style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', textAlign: 'center', width: '100%', border: 'none', background: 'transparent' }} 
            />
            <input 
              type="text" 
              value={card.subtitle} 
              onChange={(e) => updateCard(i, 'subtitle', e.target.value)} 
              style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', width: '100%', border: 'none', background: 'transparent' }} 
            />
            
            <div style={{ border: '1px dashed var(--neutral-gray)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
              <input 
                type="text" 
                value={card.to} 
                onChange={(e) => updateCard(i, 'to', e.target.value)} 
                style={{ color: 'var(--text-secondary)', width: '100%', border: 'none', background: 'transparent', textAlign: 'left', fontSize: '0.9rem' }} 
              />
              <div style={{ borderBottom: '1px solid var(--neutral-gray)', height: '1.5rem', marginBottom: '0.5rem' }}></div>
              <div style={{ borderBottom: '1px solid var(--neutral-gray)', height: '1.5rem', marginBottom: '0.5rem' }}></div>
              <div style={{ borderBottom: '1px solid var(--neutral-gray)', height: '1.5rem', marginBottom: '0.5rem' }}></div>
              <input 
                type="text" 
                value={card.from} 
                onChange={(e) => updateCard(i, 'from', e.target.value)} 
                style={{ textAlign: 'right', width: '100%', color: 'var(--text-secondary)', border: 'none', background: 'transparent', fontSize: '0.9rem' }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
