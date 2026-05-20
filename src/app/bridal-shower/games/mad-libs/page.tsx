"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function MadLibsPage() {
  const [story, setStory] = useState(`Once upon a time, Bride and Groom met at a [Place]. It was love at first [Noun]. He thought she was very [Adjective], and she loved his [Noun]. They decided to [Verb] together forever. On their wedding day, it will be the most [Adjective] day ever! They will dance to a song about [Plural Noun] and eat a giant [Noun]. And they lived [Adverb] ever after!`);

  const [presets, setPresets] = useState(['Noun', 'Verb', 'Adjective', 'Place', 'Adverb', 'Plural Noun']);
  const [customVar, setCustomVar] = useState('');

  const parts = story.split(/(\[[^\]]+\])/);

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('story-editor') as HTMLTextAreaElement;
    if (!textarea) {
      // Fallback to append if ref/id fails
      setStory(story + ` [${variable}]`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    setStory(before + `[${variable}]` + after);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
    }, 0);
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
          textarea {
            border: none !important;
            background: transparent !important;
          }
        }
      `}</style>
      
      <Link href="/bridal-shower/games" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Games</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Love Story Mad Libs</h1>
        <button className="btn btn-primary no-print" onClick={() => window.print()}>🖨️ Print Game</button>
      </div>

      <div className="card canvas-to-print" style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Fill in the blanks without reading the story first. Then read it aloud!</p>
        
        {/* Rendered Story */}
        <div style={{ lineHeight: '3', fontSize: '1.2rem', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          {parts.map((part, index) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              const label = part.slice(1, -1);
              return (
                <span key={index} style={{ borderBottom: '1px solid var(--neutral-gray)', padding: '0 0.5rem', display: 'inline-block', minWidth: '100px', textAlign: 'center', position: 'relative', height: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', position: 'absolute', bottom: '-2rem', left: 0, width: '100%', textAlign: 'center' }}>({label})</span>
                </span>
              );
            }
            return <span key={index}>{part}</span>;
          })}
        </div>

        {/* Edit Story Form */}
        <div className="no-print" style={{ marginTop: '4rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Build Your Story</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Type your story below. Click the variable buttons to insert blanks at your cursor.</p>
          
          {/* Variable Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {presets.map(v => (
              <button key={v} className="btn btn-secondary" onClick={() => insertVariable(v)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>+{v}</button>
            ))}
          </div>

          {/* Custom Variable Form */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="New variable type..." 
              value={customVar} 
              onChange={(e) => setCustomVar(e.target.value)} 
              style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }} 
            />
            <button className="btn btn-secondary" onClick={() => { if(customVar) { setPresets([...presets, customVar]); setCustomVar(''); } }}>Add Variable</button>
          </div>

          <textarea 
            id="story-editor"
            value={story} 
            onChange={(e) => setStory(e.target.value)} 
            style={{ width: '100%', height: '150px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white', fontSize: '1rem' }} 
          />
        </div>
      </div>
    </div>
  );
}
