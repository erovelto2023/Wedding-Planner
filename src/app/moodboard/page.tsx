"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MoodBoardPage() {
  const [boards, setBoards] = useState<{ id: string; name: string; notes?: string }[]>([
    { id: 'dress', name: 'Dress & Tux' },
    { id: 'decor', name: 'Decor & Flowers' },
    { id: 'colors', name: 'Color Palette' },
  ]);
  const [activeBoard, setActiveBoard] = useState('dress');
  const [items, setItems] = useState<any[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentColor, setCurrentColor] = useState('#ff4d6d');

  const saveData = async (updatedItems: any[], updatedBoards: any[] = boards) => {
    try {
      await fetch('/api/moodboard', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems, boards: updatedBoards })
      });
    } catch (error) {
      console.error('Failed to save moodboard data:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/moodboard');
        const data = await res.json();
        if (data && !data.error) {
          if (data.items) setItems(data.items);
          if (data.boards) setBoards(data.boards);
        }
      } catch (error) {
        console.error('Failed to fetch moodboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId !== null) {
      const rect = e.currentTarget.getBoundingClientRect();
      setItems(items.map(item => 
        item.id === draggingId ? { ...item, x: e.clientX - rect.left - 25, y: e.clientY - rect.top - 25 } : item
      ));
    }
  };

  if (loading) {
    return <div className="container">Loading Mood Boards...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <style>{`
        @media screen {
          .print-only {
            display: none !important;
          }
        }
        @media print {
          .print-only {
            display: block !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, .sidebar {
            display: none !important;
          }
          .canvas-to-print {
            width: 100% !important;
            height: 700px !important;
            border: none !important;
            box-shadow: none !important;
            background: #f5f5f5 !important;
            page-break-after: always;
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
          }
        }
      `}</style>
      {/* Sidebar */}
      <div className="no-print" style={{ width: '250px', background: 'var(--bg-secondary)', padding: '2rem', borderRight: '1px solid var(--neutral-gray)' }}>
        <Link href="/" className="btn btn-secondary" style={{ marginBottom: '2rem', display: 'inline-block' }}>← Dashboard</Link>
        
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1rem' }}>My Boards</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {boards.map(board => {
            const isActive = activeBoard === board.id;
            return (
              <div 
                key={board.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'background 0.2s',
                }}
                onClick={() => setActiveBoard(board.id)}
              >
                <span style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {board.name}
                </span>
                
                <div 
                  style={{ 
                    display: 'flex', 
                    gap: '0.25rem', 
                    marginLeft: '0.5rem',
                    opacity: isActive ? 1 : 0.6 
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      const newName = prompt('Enter new board name:', board.name);
                      if (newName && newName.trim()) {
                        const updatedBoards = boards.map(b => 
                          b.id === board.id ? { ...b, name: newName } : b
                        );
                        setBoards(updatedBoards);
                        saveData(items, updatedBoards);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isActive ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      padding: '2px 4px'
                    }}
                    title="Rename Board"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (boards.length <= 1) {
                        alert('You must keep at least one vision board.');
                        return;
                      }
                      if (confirm(`Are you sure you want to delete "${board.name}"? This will delete all of its items permanently!`)) {
                        const updatedBoards = boards.filter(b => b.id !== board.id);
                        const updatedItems = items.filter(i => i.boardId !== board.id);
                        setBoards(updatedBoards);
                        setItems(updatedItems);
                        if (activeBoard === board.id) {
                          setActiveBoard(updatedBoards[0].id);
                        }
                        saveData(updatedItems, updatedBoards);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isActive ? 'white' : 'var(--danger)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      padding: '2px 4px'
                    }}
                    title="Delete Board"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
          <button
            onClick={() => {
              const name = prompt('Enter board name:');
              if (name) {
                const id = name.toLowerCase().replace(/\s+/g, '-');
                const updatedBoards = [...boards, { id, name }];
                setBoards(updatedBoards);
                saveData(items, updatedBoards);
              }
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--neutral-gray)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            + Add Board
          </button>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: '0.5rem' }}>Board Notes</h3>
            <textarea
              value={boards.find(b => b.id === activeBoard)?.notes || ''}
              onChange={(e) => {
                const updatedBoards = boards.map(b => 
                  b.id === activeBoard ? { ...b, notes: e.target.value } : b
                );
                setBoards(updatedBoards);
                saveData(items, updatedBoards);
              }}
              placeholder="Add notes for this board..."
              style={{
                width: '100%',
                height: '150px',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--neutral-gray)',
                fontSize: '0.85rem',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Print-only board header */}
        <div className="print-only" style={{ padding: '1rem 2rem', background: 'white', borderBottom: '2px solid var(--accent-primary)', marginBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', margin: 0, color: 'var(--text-primary)', textAlign: 'center' }}>
            🎀 Vision Board: {boards.find(b => b.id === activeBoard)?.name}
          </h1>
        </div>

        {/* Toolbar */}
        <div className="no-print" style={{ padding: '1rem 2rem', background: 'white', borderBottom: '1px solid var(--neutral-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--text-primary)' }}>
            {boards.find(b => b.id === activeBoard)?.name}
          </h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="file" 
              id="file-upload" 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = reader.result as string;
                    const updated = [...items, { id: Date.now(), boardId: activeBoard, type: 'image', value: base64, x: 50, y: 50 }];
                    setItems(updated);
                    saveData(updated);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <button className="btn btn-primary" onClick={() => document.getElementById('file-upload')?.click()}>+ Upload Image</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="color" 
                value={currentColor} 
                onChange={(e) => setCurrentColor(e.target.value)}
                style={{ width: '40px', height: '40px', border: '1px solid var(--neutral-gray)', borderRadius: '4px', cursor: 'pointer' }}
              />
              <button className="btn btn-secondary" onClick={() => {
                const updated = [...items, { id: Date.now(), boardId: activeBoard, type: 'color', value: currentColor, x: 50, y: 50 }];
                setItems(updated);
                saveData(updated);
              }}>+ Add Color</button>
            </div>
            <button className="btn btn-secondary" onClick={() => window.print()}>Export PDF</button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          className="canvas-to-print"
          onMouseMove={handleMouseMove}
          onMouseUp={() => {
            setDraggingId(null);
            saveData(items);
          }}
          onMouseLeave={() => {
            setDraggingId(null);
            saveData(items);
          }}
          style={{ flex: 1, background: '#f5f5f5', position: 'relative', overflow: 'hidden', cursor: draggingId ? 'grabbing' : 'default' }}
        >
          {items.filter(item => item.boardId === activeBoard).map(item => (
            <div
              key={item.id}
              onMouseDown={(e) => {
                e.stopPropagation();
                setDraggingId(item.id);
              }}
              onMouseUp={() => {
                setDraggingId(null);
                saveData(items);
              }}
              style={{
                position: 'absolute',
                left: item.x,
                top: item.y,
                cursor: 'grab',
                fontSize: '3rem',
                userSelect: 'none',
                padding: '10px',
                background: draggingId === item.id ? 'rgba(0,0,0,0.05)' : 'transparent',
                borderRadius: '8px',
              }}
            >
              {/* Delete Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const updated = items.filter(i => i.id !== item.id);
                  setItems(updated);
                  saveData(updated);
                }}
                style={{
                  position: 'absolute',
                  top: '0px',
                  right: '0px',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 10,
                }}
              >
                ×
              </button>

              {item.type === 'color' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '80px', height: '80px', background: item.value, borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>{item.value}</span>
                </div>
              ) : item.value.startsWith('data:image') || item.value.startsWith('http') ? (
                <img src={item.value} alt="mood" style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '4px' }} />
              ) : (
                item.value
              )}
            </div>
          ))}
        </div>
        {/* Print Only Notes */}
        <div className="print-only" style={{ marginTop: '2rem', padding: '1rem', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Board Notes</h3>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {boards.find(b => b.id === activeBoard)?.notes || 'No notes for this board.'}
          </div>
        </div>
      </div>
    </div>
  );
}
