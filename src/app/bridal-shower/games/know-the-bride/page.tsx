"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function KnowTheBridePage() {
  const [questions, setQuestions] = useState([
    { q: 'Where did she meet her partner?', a: '' },
    { q: 'What is her favorite color?', a: '' },
    { q: 'What is her dream vacation?', a: '' },
    { q: 'How many kids does she want?', a: '' },
    { q: 'What is her shoe size?', a: '' },
    { q: 'What is her favorite restaurant?', a: '' },
    { q: 'What was her first job?', a: '' },
    { q: 'What is her favorite movie?', a: '' },
    { q: 'Where was her first kiss with her partner?', a: '' },
    { q: 'What is her biggest pet peeve?', a: '' }
  ]);

  const [newQuestion, setNewQuestion] = useState({ q: '', a: '' });
  const [showAnswers, setShowAnswers] = useState(false);

  const addQuestion = () => {
    if (!newQuestion.q) return;
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ q: '', a: '' });
  };

  const updateQuestion = (index: number, field: 'q' | 'a', value: string) => {
    const newQs = [...questions];
    newQs[index][field] = value;
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
          .question-list {
            gap: 1rem !important;
          }
          input {
            border: none !important;
            border-bottom: 1px solid #ccc !important;
            border-radius: 0 !important;
            background: transparent !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>How Well Do You Know the Bride?</h1>
        <div className="no-print" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} /> Show Answers
          </label>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Game</button>
        </div>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Answer the questions below. The person with the most correct answers wins!</p>
        
        <div className="question-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 'bold', minWidth: '25px' }}>{i+1}.</span>
                <input 
                  type="text" 
                  value={item.q} 
                  onChange={(e) => updateQuestion(i, 'q', e.target.value)} 
                  style={{ flex: 1, fontSize: '1rem', padding: '0.25rem', border: 'none', background: 'transparent' }} 
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '25px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Answer:</span>
                {showAnswers ? (
                  <input 
                    type="text" 
                    value={item.a} 
                    onChange={(e) => updateQuestion(i, 'a', e.target.value)} 
                    style={{ flex: 1, padding: '0.25rem', border: 'none', borderBottom: '1px solid var(--neutral-gray)' }} 
                  />
                ) : (
                  <div style={{ flex: 1, borderBottom: '1px solid var(--neutral-gray)', height: '1.5rem' }}></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Form */}
        <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add a Question</h3>
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <input 
              type="text" 
              placeholder="Question..." 
              value={newQuestion.q} 
              onChange={(e) => setNewQuestion({ ...newQuestion, q: e.target.value })}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
            <input 
              type="text" 
              placeholder="Answer (optional)..." 
              value={newQuestion.a} 
              onChange={(e) => setNewQuestion({ ...newQuestion, a: e.target.value })}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
            />
            <button className="btn btn-primary" onClick={addQuestion}>Add Question</button>
          </div>
        </div>
      </div>
    </div>
  );
}
