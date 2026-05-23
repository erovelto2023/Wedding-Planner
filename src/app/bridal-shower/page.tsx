"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function BridalShowerPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [useCustomGuest, setUseCustomGuest] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTodoText, setEditingTodoText] = useState('');

  useEffect(() => {
    async function fetchGuests() {
      try {
        const res = await fetch('/api/guests');
        if (res.ok) {
          const data = await res.json();
          setGuests(data);
        }
      } catch (error) {
        console.error('Failed to fetch guests:', error);
      }
    }
    fetchGuests();
  }, []);

  const [todos, setTodos] = useState<any[]>([
    // 3+ Months Before
    { id: 1, task: 'Choose a Host', timeline: '3+ Months Before', completed: false },
    { id: 2, task: 'Consult the Couple (Dates, size, theme)', timeline: '3+ Months Before', completed: false },
    { id: 3, task: 'Pick a Theme', timeline: '3+ Months Before', completed: false },
    { id: 4, task: 'Set a Date', timeline: '3+ Months Before', completed: false },
    { id: 5, task: 'Create a Budget', timeline: '3+ Months Before', completed: false },
    { id: 6, task: 'Set the Guest List', timeline: '3+ Months Before', completed: false },
    { id: 7, task: 'Choose and Book a Venue', timeline: '3+ Months Before', completed: false },
    { id: 8, task: 'Hire Any Vendors (Planner, photo, florist, caterer)', timeline: '3+ Months Before', completed: false },
    { id: 9, task: "Ensure the Couple's Registry Is Up", timeline: '3+ Months Before', completed: false },
    
    // 2 Months Before
    { id: 10, task: 'Compile Guest Addresses', timeline: '2 Months Before', completed: false },
    { id: 11, task: 'Select and Mail Invitations', timeline: '2 Months Before', completed: false },
    { id: 12, task: 'Finalize Decor Decisions', timeline: '2 Months Before', completed: false },
    { id: 13, task: 'Delegate Tasks to co-hosts/bridal party', timeline: '2 Months Before', completed: false },
    
    // 1 Month Before
    { id: 14, task: 'Shop for Decor and Party Props', timeline: '1 Month Before', completed: false },
    { id: 15, task: 'Purchase Favors and game prizes', timeline: '1 Month Before', completed: false },
    { id: 16, task: 'Confirm Your Vendors', timeline: '1 Month Before', completed: false },
    { id: 17, task: 'Set the Bridal Shower Itinerary (around 3 hours)', timeline: '1 Month Before', completed: false },
    
    // 2+ Weeks Before
    { id: 18, task: 'Buy Your Gift (as host)', timeline: '2+ Weeks Before', completed: false },
    { id: 19, task: 'Gather Up Your Decorations and check inventory', timeline: '2+ Weeks Before', completed: false },
    { id: 20, task: 'Make a Shopping List for Food and Bev', timeline: '2+ Weeks Before', completed: false },
    { id: 21, task: 'Purchase Any Spirits for Cocktails', timeline: '2+ Weeks Before', completed: false },
    { id: 22, task: 'Create a Shower Playlist', timeline: '2+ Weeks Before', completed: false },
    { id: 23, task: 'Pick Up Any Important items (heirlooms, photos)', timeline: '2+ Weeks Before', completed: false },
    
    // 1 Week Before
    { id: 24, task: 'Confirm RSVPs', timeline: '1 Week Before', completed: false },
    { id: 25, task: 'Confirm Any and All Deliveries', timeline: '1 Week Before', completed: false },
    { id: 26, task: 'Make a Mental Floorplan / Seating Chart', timeline: '1 Week Before', completed: false },
    { id: 27, task: 'Organize Your Activities and game supplies', timeline: '1 Week Before', completed: false },
    { id: 28, task: 'Assemble the Favors', timeline: '1 Week Before', completed: false },
    
    // 1 Day Before
    { id: 29, task: 'Prepare Food (that can be made ahead)', timeline: '1 Day Before', completed: false },
    { id: 30, task: 'Assemble Your Bridal Shower Setup (at home if needed)', timeline: '1 Day Before', completed: false },
    { id: 31, task: 'Touch Base With Other Hosts (share timeline)', timeline: '1 Day Before', completed: false },
    { id: 32, task: 'Run Any Last-Minute Errands (pack car)', timeline: '1 Day Before', completed: false },
    
    // Day-of
    { id: 33, task: 'Prep any food that needs to be made same day', timeline: 'Day-of', completed: false },
    { id: 34, task: 'Pick up cake or other desserts', timeline: 'Day-of', completed: false },
    { id: 35, task: 'Arrive to the venue early', timeline: 'Day-of', completed: false },
    { id: 36, task: 'Decorate the space', timeline: 'Day-of', completed: false },
    { id: 37, task: 'Set up signage and favors', timeline: 'Day-of', completed: false },
    { id: 38, task: 'Arrange food and beverages', timeline: 'Day-of', completed: false },
    { id: 39, task: 'Greet guests', timeline: 'Day-of', completed: false },
    { id: 40, task: 'Record gifts as they are received', timeline: 'Day-of', completed: false },
    { id: 41, task: 'Create the ribbon bouquet/hat', timeline: 'Day-of', completed: false },
    { id: 42, task: 'Host and play games', timeline: 'Day-of', completed: false },
  ]);

  const [gifts, setGifts] = useState<any[]>([
    { id: 1, guest: 'Jane Doe', gift: 'KitchenAid Mixer', thankYouSent: true },
    { id: 2, guest: 'Sarah Smith', gift: 'Silk Robe', thankYouSent: false },
  ]);

  const [details, setDetails] = useState({
    date: '2026-06-20',
    time: '2:00 PM',
    location: 'Le Petit Cafe',
    host: 'Maid of Honor (Ashley)',
    theme: 'Garden Party',
    budget: '$1000'
  });

  const [newGift, setNewGift] = useState({ guest: '', gift: '' });

  // Notes state
  const [notes, setNotes] = useState<{ id: number; text: string; editingId: number | null }[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  const timelines = ['3+ Months Before', '2 Months Before', '1 Month Before', '2+ Weeks Before', '1 Week Before', '1 Day Before', 'Day-of'];

  // Load data from DB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/bridal-shower');
        if (res.ok) {
          const data = await res.json();
          if (data && !data.notFound) {
            if (data.todos) setTodos(data.todos);
            if (data.gifts) setGifts(data.gifts);
            if (data.details) setDetails(data.details);
            if (data.notes) setNotes(data.notes);
          } else {
            // First time: save default seed lists to DB
            saveData(todos, gifts, details, notes);
          }
        }
      } catch (error) {
        console.error('Failed to load bridal shower data:', error);
      }
    }
    loadData();
  }, []);

  // Helper to persist state to MongoDB
  async function saveData(updatedTodos: any[], updatedGifts: any[], updatedDetails: any, updatedNotes: any[]) {
    try {
      await fetch('/api/bridal-shower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todos: updatedTodos,
          gifts: updatedGifts,
          details: updatedDetails,
          notes: updatedNotes
        })
      });
    } catch (error) {
      console.error('Failed to save bridal shower data:', error);
    }
  }

  const addGift = () => {
    if (!newGift.guest || !newGift.gift) return;
    const updated = [...gifts, { id: Date.now(), ...newGift, thankYouSent: false }];
    setGifts(updated);
    setNewGift({ guest: '', gift: '' });
    saveData(todos, updated, details, notes);
  };

  const toggleGiftThankYou = (id: number, thankYouSent: boolean) => {
    const updated = gifts.map(g => g.id === id ? { ...g, thankYouSent } : g);
    setGifts(updated);
    saveData(todos, updated, details, notes);
  };

  const deleteGift = (id: number) => {
    const updated = gifts.filter(g => g.id !== id);
    setGifts(updated);
    saveData(todos, updated, details, notes);
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const updated = [...notes, { id: Date.now(), text: newNote.trim(), editingId: null }];
    setNotes(updated);
    setNewNote('');
    saveData(todos, gifts, details, updated);
  };

  const deleteNote = (id: number) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    saveData(todos, gifts, details, updated);
  };

  const startEditNote = (id: number, text: string) => {
    setEditingNoteId(id);
    setEditingNoteText(text);
  };

  const saveEditNote = (id: number) => {
    if (!editingNoteText.trim()) return;
    const updated = notes.map(n => n.id === id ? { ...n, text: editingNoteText.trim() } : n);
    setNotes(updated);
    setEditingNoteId(null);
    setEditingNoteText('');
    saveData(todos, gifts, details, updated);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, .sidebar {
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
          }
          .card {
            box-shadow: none !important;
            border: 1px solid var(--neutral-gray) !important;
            break-inside: avoid;
            margin-bottom: 1rem !important;
          }
          h1 {
            font-size: 2rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
          input {
            border: none !important;
            border-bottom: 1px solid var(--neutral-gray) !important;
            border-radius: 0 !important;
            padding: 0.25rem 0 !important;
            background: transparent !important;
          }
        }
      `}</style>
      
      <Link href="/" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Dashboard</Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)' }}>Bridal Shower Planner</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Based on The Knot's Complete Bridal Shower Checklist.</p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/bridal-shower/games" className="btn btn-primary">🎮 Play & Print Games</Link>
          <button className="btn btn-secondary" onClick={() => window.print()}>🖨️ Print Plan</button>
        </div>
      </div>

      <div className="canvas-to-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Timeline Checklist */}
        <div>
          {timelines.map(timeline => {
            const items = todos.filter(t => t.timeline === timeline);
            return (
              <div key={timeline} className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{timeline}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {items.map(todo => (
                    <div 
                      key={todo.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        padding: '0.5rem', 
                        background: 'var(--bg-secondary)', 
                        borderRadius: 'var(--radius-sm)' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        <input 
                          type="checkbox" 
                          checked={todo.completed} 
                          onChange={(e) => {
                            const updated = todos.map(t => t.id === todo.id ? { ...t, completed: e.target.checked } : t);
                            setTodos(updated);
                            saveData(updated, gifts, details, notes);
                          }}
                        />
                        {editingTodoId === todo.id ? (
                          <input
                            type="text"
                            value={editingTodoText}
                            onChange={(e) => setEditingTodoText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const updated = todos.map(t => t.id === todo.id ? { ...t, task: editingTodoText } : t);
                                setTodos(updated);
                                setEditingTodoId(null);
                                saveData(updated, gifts, details, notes);
                              }
                            }}
                            style={{ flex: 1, padding: '0.2rem', fontSize: '0.85rem', border: '1px solid var(--accent-primary)', borderRadius: '4px' }}
                            autoFocus
                          />
                        ) : (
                          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                            {todo.task}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.25rem' }} className="no-print">
                        {editingTodoId === todo.id ? (
                          <>
                            <button
                              onClick={() => {
                                const updated = todos.map(t => t.id === todo.id ? { ...t, task: editingTodoText } : t);
                                setTodos(updated);
                                setEditingTodoId(null);
                                saveData(updated, gifts, details, notes);
                              }}
                              style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingTodoId(null)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingTodoId(todo.id);
                                setEditingTodoText(todo.task);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                const updated = todos.filter(t => t.id !== todo.id);
                                setTodos(updated);
                                saveData(updated, gifts, details, notes);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Task under timeline card */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }} className="no-print">
                  <input
                    type="text"
                    placeholder="Add custom task..."
                    id={`new-task-${timeline}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget;
                        const taskText = input.value.trim();
                        if (taskText) {
                          const updated = [...todos, { id: Date.now(), task: taskText, timeline, completed: false }];
                          setTodos(updated);
                          saveData(updated, gifts, details, notes);
                          input.value = '';
                        }
                      }
                    }}
                    style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById(`new-task-${timeline}`) as HTMLInputElement;
                      const taskText = input?.value.trim();
                      if (taskText) {
                        const updated = [...todos, { id: Date.now(), task: taskText, timeline, completed: false }];
                        setTodos(updated);
                        saveData(updated, gifts, details, notes);
                        input.value = '';
                      }
                    }}
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar: Details, Gifts, Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Event Details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Event Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date</label>
                <input 
                  type="date" 
                  value={details.date} 
                  onChange={(e) => {
                    const updated = { ...details, date: e.target.value };
                    setDetails(updated);
                    saveData(todos, gifts, updated, notes);
                  }} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Time</label>
                <input 
                  type="text" 
                  value={details.time} 
                  onChange={(e) => {
                    const updated = { ...details, time: e.target.value };
                    setDetails(updated);
                    saveData(todos, gifts, updated, notes);
                  }} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location</label>
                <input 
                  type="text" 
                  value={details.location} 
                  onChange={(e) => {
                    const updated = { ...details, location: e.target.value };
                    setDetails(updated);
                    saveData(todos, gifts, updated, notes);
                  }} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Host</label>
                <input 
                  type="text" 
                  value={details.host} 
                  onChange={(e) => {
                    const updated = { ...details, host: e.target.value };
                    setDetails(updated);
                    saveData(todos, gifts, updated, notes);
                  }} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Theme</label>
                <input 
                  type="text" 
                  value={details.theme} 
                  onChange={(e) => {
                    const updated = { ...details, theme: e.target.value };
                    setDetails(updated);
                    saveData(todos, gifts, updated, notes);
                  }} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Budget</label>
                <input 
                  type="text" 
                  value={details.budget} 
                  onChange={(e) => {
                    const updated = { ...details, budget: e.target.value };
                    setDetails(updated);
                    saveData(todos, gifts, updated, notes);
                  }} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                />
              </div>
            </div>
          </div>

          {/* Gift Tracker */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Gift Tracker</h2>
            
            <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select Live Guest or Type Custom Name:</label>
                <select
                  value={useCustomGuest ? '__custom__' : newGift.guest}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setUseCustomGuest(true);
                      setNewGift({ ...newGift, guest: '' });
                    } else {
                      setUseCustomGuest(false);
                      setNewGift({ ...newGift, guest: e.target.value });
                    }
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
                >
                  <option value="">-- Choose Live Wedding Guest --</option>
                  {guests.map(g => (
                    <option key={g._id || g.id} value={g.name}>
                      {g.name} {g.rsvp === 'Yes' ? '✅ Confirmed' : g.rsvp === 'No' ? '❌ Declined' : '⏳ Pending'}
                    </option>
                  ))}
                  <option value="__custom__">✍️ Type custom guest name...</option>
                </select>

                {(useCustomGuest || guests.length === 0) && (
                  <input 
                    type="text" 
                    placeholder="Enter Custom Guest Name..." 
                    value={newGift.guest} 
                    onChange={(e) => setNewGift({ ...newGift, guest: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Gift description (e.g., KitchenAid)..." 
                  value={newGift.gift} 
                  onChange={(e) => setNewGift({ ...newGift, gift: e.target.value })}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                />
                <button className="btn btn-primary" onClick={addGift}>Add Gift</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {gifts.map(gift => (
                <div key={gift.id} style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{gift.guest}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{gift.gift}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <input 
                        type="checkbox" 
                        checked={gift.thankYouSent} 
                        onChange={(e) => toggleGiftThankYou(gift.id, e.target.checked)}
                      /> Thank You
                    </label>
                    <button 
                      onClick={() => deleteGift(gift.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                      className="no-print"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>📝 Notes</h2>

            {/* Add Note */}
            <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              />
              <button className="btn btn-primary" onClick={addNote}>Add</button>
            </div>

            {/* Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notes.length === 0 && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No notes yet. Add one above!</p>
              )}
              {notes.map(note => (
                <div key={note.id} style={{ padding: '0.6rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {editingNoteId === note.id ? (
                    <>
                      <input
                        type="text"
                        value={editingNoteText}
                        onChange={(e) => setEditingNoteText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditNote(note.id)}
                        style={{ flex: 1, padding: '0.35rem 0.5rem', borderRadius: '4px', border: '1px solid var(--accent-primary)' }}
                        autoFocus
                      />
                      <button onClick={() => saveEditNote(note.id)} style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer', fontWeight: 'bold' }}>✓</button>
                      <button onClick={() => setEditingNoteId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>✕</button>
                    </>
                  ) : (
                    <>
                      <span style={{ flex: 1, fontSize: '0.9rem' }}>{note.text}</span>
                      <button onClick={() => startEditNote(note.id, note.text)} className="no-print" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>✏️</button>
                      <button onClick={() => deleteNote(note.id)} className="no-print" style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>×</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
