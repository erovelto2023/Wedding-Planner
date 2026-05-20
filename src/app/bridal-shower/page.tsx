"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BridalShowerPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [useCustomGuest, setUseCustomGuest] = useState(false);

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

  const timelines = ['3+ Months Before', '2 Months Before', '1 Month Before', '2+ Weeks Before', '1 Week Before', '1 Day Before', 'Day-of'];

  const addGift = () => {
    if (!newGift.guest || !newGift.gift) return;
    setGifts([...gifts, { id: Date.now(), ...newGift, thankYouSent: false }]);
    setNewGift({ guest: '', gift: '' });
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
                    <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                      <input 
                        type="checkbox" 
                        checked={todo.completed} 
                        onChange={(e) => setTodos(todos.map(t => t.id === todo.id ? { ...t, completed: e.target.checked } : t))}
                      />
                      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{todo.task}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar: Details & Gifts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Event Details */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Event Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date</label>
                <input type="date" value={details.date} onChange={(e) => setDetails({ ...details, date: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Time</label>
                <input type="text" value={details.time} onChange={(e) => setDetails({ ...details, time: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location</label>
                <input type="text" value={details.location} onChange={(e) => setDetails({ ...details, location: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Host</label>
                <input type="text" value={details.host} onChange={(e) => setDetails({ ...details, host: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Theme</label>
                <input type="text" value={details.theme} onChange={(e) => setDetails({ ...details, theme: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Budget</label>
                <input type="text" value={details.budget} onChange={(e) => setDetails({ ...details, budget: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
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
                        onChange={(e) => setGifts(gifts.map(g => g.id === gift.id ? { ...g, thankYouSent: e.target.checked } : g))}
                      /> Thank You
                    </label>
                    <button 
                      onClick={() => setGifts(gifts.filter(g => g.id !== gift.id))}
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
        </div>
      </div>
    </div>
  );
}
