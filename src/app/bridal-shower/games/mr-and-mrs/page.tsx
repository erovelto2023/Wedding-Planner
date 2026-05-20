"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function MrAndMrsPage() {
  const [questions, setQuestions] = useState([
    'Who initiated the first kiss?',
    'Who is the better cook?',
    'Who is more organized?',
    'Who said "I love you" first?',
    'Who is more likely to get lost?',
    'Who is the bigger spender?',
    'Who controls the TV remote?',
    'Who is more stubborn?',
    'Who is the better driver?',
    'Who takes longer to get ready?'
  ]);

  const [newQuestion, setNewQuestion] = useState('');

  const addQuestion = () => {
    if (!newQuestion) return;
    setQuestions([...questions, newQuestion]);
    setNewQuestion('');
  };

  const updateQuestion = (index: number, value: string) => {
    const newQs = [...questions];
    newQs[index] = value;
    setQuestions(newQs);
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
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Mr. & Mrs. (He Said / She Said)</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Game</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Who is most likely to... ? Guess what the couple answered!</p>
        <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {questions.map((q, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <span style={{ fontWeight: 'bold' }}>{i+1}.</span>
                <input 
                  type="text" 
                  value={q} 
                  onChange={(e) => updateQuestion(i, e.target.value)} 
                  style={{ flex: 1, fontSize: '1rem', border: 'none', background: 'transparent' }} 
                />
              </div>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" style={{ transform: 'scale(1.2)' }} /> Bride
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" style={{ transform: 'scale(1.2)' }} /> Groom
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Form */}
        <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add a Question</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Who is most likely to..." 
              value={newQuestion} 
              onChange={(e) => setNewQuestion(e.target.value)}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
            <button className="btn btn-primary" onClick={addQuestion}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
