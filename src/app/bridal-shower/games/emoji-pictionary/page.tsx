"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function EmojiPictionaryPage() {
  const [items, setItems] = useState([
    { emojis: '👰🔔', answer: 'Wedding Bells' },
    { emojis: '🍾🥂', answer: 'Champagne Toast' },
    { emojis: '💍💎', answer: 'Engagement Ring' },
    { emojis: '🍰🍴', answer: 'Cutting the Cake' },
    { emojis: '💃🕺🎶', answer: 'First Dance' },
    { emojis: '💌📮', answer: 'Wedding Invitation' },
    { emojis: '⛪🕊️', answer: 'Church Ceremony' },
    { emojis: '💐🔙', answer: 'Bouquet Toss' },
    { emojis: '✈️🏖️', answer: 'Honeymoon' },
    { emojis: '📷✨', answer: 'Photo Booth' }
  ]);

  const [showAnswers, setShowAnswers] = useState(false);
  const [newEmojis, setNewEmojis] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const commonEmojis = [
    // Wedding & Love
    '💍', '👰', '🤵', '💒', '🔔', '🍾', '🥂', '🎂', '🍰', '💐', 
    '💌', '🕊️', '❤️', '💘', '💝', '💖', '💗', '💓', '💞', '💕', 
    '💟', '❣️', '❤️‍🔥', '💋', '💄', '👠', '👔', '👑', '⭐', '✨',
    // Celebration & Fun
    '🎉', '🎊', '🎈', '🎁', '🎆', '🎇', '🪄', '🌟', '🥳', '💃', 
    '🕺', '🎶', '🎵', '🎼', '🎤', '🎧', '🎹', '🎸', '🎻', '🎺',
    // Honeymoon & Travel
    '✈️', '🏝️', '🏖️', '🚢', '🚂', '🚗', '🏨', '🌋', '🏔️', '🗺️',
    '🌞', '☀️', '🌈', '🌊', '🍹', '🍸', '🍷', '🍺', '🍻', '🥃',
    // Food & Sweets
    '🍓', '🍒', '🍑', '🍇', '🍏', '🍋', '🍦', '🍧', '🍨', '🍩', 
    '🍪', '🍫', '🍬', '🍭', '🍮', '🍯', '🍕', '🍔', '🍟', '🌮',
    // Smilies & Emotion
    '😍', '🥰', '😘', '😚', '😋', '😛', '😜', '🤪', '🤩', '😭', 
    '😱', '🤫', '🤔', '😇', '🤠', '🤡', '👽', '👾', '🤖', '🎃'
  ];

  const addItem = () => {
    if (newEmojis.trim() && newAnswer.trim()) {
      setItems([...items, { emojis: newEmojis.trim(), answer: newAnswer.trim() }]);
      setNewEmojis('');
      setNewAnswer('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const addEmoji = (emoji: string) => {
    setNewEmojis(prev => prev + emoji);
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
          .puzzle-item {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Wedding Emoji Pictionary</h1>
        <div className="no-print" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={showAnswers} onChange={(e) => setShowAnswers(e.target.checked)} /> Show Answers
          </label>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Game</button>
        </div>
      </div>

      {/* Creator Section */}
      <div className="card no-print" style={{ padding: '1.5rem', marginBottom: '2rem', backgroundColor: 'var(--neutral-light)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add Your Own Puzzle</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {commonEmojis.map(emoji => (
            <button 
              key={emoji} 
              onClick={() => addEmoji(emoji)}
              style={{ fontSize: '1.5rem', padding: '0.5rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'white', cursor: 'pointer' }}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Emojis</label>
            <input 
              type="text" 
              value={newEmojis} 
              onChange={(e) => setNewEmojis(e.target.value)}
              placeholder="e.g. 👰🔔"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Answer</label>
            <input 
              type="text" 
              value={newAnswer} 
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="e.g. Wedding Bells"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
            />
          </div>
          <button className="btn btn-primary" onClick={addItem}>Add Puzzle</button>
        </div>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem' }}>Guess the wedding phrase represented by the emojis!</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={i} className="puzzle-item" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontWeight: 'bold', minWidth: '30px' }}>{i+1}.</span>
              <span style={{ fontSize: '2rem', minWidth: '100px', textAlign: 'center' }}>{item.emojis}</span>
              <div style={{ flex: 1, borderBottom: '1px solid var(--neutral-gray)', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {showAnswers && (
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginLeft: '1rem' }}>{item.answer}</span>
                )}
                <button 
                  className="no-print" 
                  onClick={() => removeItem(i)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0 0.5rem' }}
                  title="Remove puzzle"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
