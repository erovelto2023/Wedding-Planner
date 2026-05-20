"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function GuessTheGuestPage() {
  const [items, setItems] = useState(
    Array.from({ length: 12 }, (_, i) => ({ id: i + 1, image: null as string | null }))
  );

  const handleImageUpload = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setItems(items.map(item => item.id === id ? { ...item, image: e.target?.result as string } : item));
    };
    reader.readAsDataURL(file);
  };

  const addNumber = () => {
    setItems([...items, { id: items.length + 1, image: null }]);
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
            gap: 0.5rem !important;
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .image-placeholder {
            width: 80px !important;
            height: 80px !important;
            border: 1px solid #ccc !important;
          }
          .image-placeholder span {
            display: none !important;
          }
          .item-card {
            padding: 0.5rem !important;
            border: 1px solid #eee !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Guess the Guest</h1>
        <div className="no-print" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={addNumber}>➕ Add Number</button>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Game</button>
        </div>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Match the numbered baby photos on display to the guests in the room!</p>
        
        <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} className="item-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--neutral-gray)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>#{item.id}</span>
              
              <div className="image-placeholder" style={{ width: '120px', height: '120px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {item.image ? (
                  <img src={item.image} alt={`Baby #${item.id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Click to Upload</span>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(item.id, e.target.files[0])}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  className="no-print"
                  title="Upload baby photo"
                />
              </div>
              
              <div style={{ width: '100%', borderBottom: '1px solid var(--neutral-gray)', height: '1.5rem', marginTop: '0.5rem' }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
