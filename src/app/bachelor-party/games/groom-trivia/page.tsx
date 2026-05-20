"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function GroomTriviaPage() {
  const [questions, setQuestions] = useState([
    'What is the groom\'s dream car?',
    'What was the groom\'s first job?',
    'Where did the groom go to college?',
    'What is the groom\'s favorite beer or drink?',
    'How many kids does the groom want?',
    'What is the groom\'s biggest fear?',
    'What was the groom\'s favorite subject in school?',
    'What is the groom\'s favorite sports team?',
    'Who was the groom\'s first crush?',
    'What is the groom\'s favorite movie?'
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions([...questions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingText(questions[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingText.trim()) {
      const newQuestions = [...questions];
      newQuestions[editingIndex] = editingText.trim();
      setQuestions(newQuestions);
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
          .question-item {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
      
      <Link href="/bachelor-party/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Groom Trivia</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Game</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>How well do you know the groom? Answer the questions below!</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((question, i) => (
            <div key={i} className="question-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                  <span style={{ flex: 1 }}>{question}</span>
                  <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => startEditing(i)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => removeQuestion(i)}
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

        {/* Add Question Form */}
        <div className="no-print" style={{ marginTop: '2rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add a Question</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="What is..." 
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
