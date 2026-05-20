"use client";

import Link from 'next/link';

export default function DressDesignPage() {
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
          .grid-container {
            gap: 1rem !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Wedding Dress Design</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Scorecard</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Use toilet paper to design the best wedding dress. The bride picks the winner!</p>
        
        <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Rules:</h3>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Teams of 3-5 players.</li>
              <li>Only use toilet paper and tape.</li>
              <li>Time limit: 15 minutes.</li>
              <li>The bride picks the winner!</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Scorecard:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                <span>Creativity:</span>
                <span>_____ / 10</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                <span>Durability:</span>
                <span>_____ / 10</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                <span>Fit & Style:</span>
                <span>_____ / 10</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>Total Score:</span>
                <span>_____ / 30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
