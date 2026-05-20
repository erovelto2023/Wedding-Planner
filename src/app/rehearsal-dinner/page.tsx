"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function RehearsalDinnerPage() {
  // 1. Core Event Setup
  const [details, setDetails] = useState({
    venue: 'The Rustic Grill',
    address: '123 Main St, Anytown',
    date: 'Friday, September 18, 2026',
    time: '6:00 PM',
    theme: 'Rustic Chic',
    dressCode: 'Cocktail Attire',
    formality: 'Semi-Formal'
  });

  // 2. Guest List & RSVPs
  const [guests, setGuests] = useState<any[]>([
    { name: 'John Doe', role: 'Groom', rsvp: 'Confirmed', dietary: 'None', speechVolunteer: false },
    { name: 'Jane Smith', role: 'Bride', rsvp: 'Confirmed', dietary: 'Vegetarian', speechVolunteer: false },
    { name: 'Mike Johnson', role: 'Best Man', rsvp: 'Confirmed', dietary: 'Gluten-Free', speechVolunteer: true },
    { name: 'Sarah Williams', role: 'Maid of Honor', rsvp: 'Confirmed', dietary: 'None', speechVolunteer: true },
    { name: 'David Brown', role: 'Father of the Groom', rsvp: 'Confirmed', dietary: 'None', speechVolunteer: true },
    { name: 'Emily Davis', role: 'Mother of the Groom', rsvp: 'Confirmed', dietary: 'None', speechVolunteer: false }
  ]);

  // Load guests on page mount
  useEffect(() => {
    async function loadGuests() {
      try {
        const res = await fetch('/api/guests');
        if (res.ok) {
          const dbGuests = await res.json();
          if (dbGuests.length > 0) {
            const mapped = dbGuests.map((g: any) => ({
              _id: g._id,
              name: g.name,
              role: g.role || 'Guest',
              rsvp: g.status === 'Confirmed' ? 'Confirmed' : g.status === 'Declined' ? 'Declined' : 'Maybe',
              dietary: g.dietary || 'None',
              speechVolunteer: g.speechVolunteer ?? false
            }));
            setGuests(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load guests:', err);
      }
    }
    loadGuests();
  }, []);

  // 3. Catering & Menu
  const [menu, setMenu] = useState([
    { course: 'Appetizer', item: 'Bruschetta & Calamari', dietary: 'Gluten option' },
    { course: 'Main Course', item: 'Filet Mignon or Grilled Salmon', dietary: 'Halal available' },
    { course: 'Side', item: 'Roasted Potatoes & Asparagus', dietary: 'Vegan/GF' },
    { course: 'Dessert', item: 'Tiramisu', dietary: 'Vegetarian' },
    { course: 'Drinks', item: 'Signature Elderflower Spritz & Cabernet', dietary: 'Alcoholic & Mocktail' }
  ]);

  // 4. Program & Speeches
  const [speeches, setSpeeches] = useState([
    { time: '6:00 PM', speaker: 'Arrival & Welcome Drinks', role: 'All Guests', duration: '30 mins', notes: 'Background acoustic music playing' },
    { time: '6:30 PM', speaker: 'Ceremony Rehearsal Walkthrough', role: 'Wedding Party', duration: '45 mins', notes: 'Practice at the ceremony site' },
    { time: '7:30 PM', speaker: 'David Brown', role: 'Father of the Groom', duration: '5 mins', notes: 'Welcome toast & dinner blessing' },
    { time: '7:45 PM', speaker: 'Mike Johnson', role: 'Best Man', duration: '4 mins', notes: 'Friendly toast' },
    { time: '8:00 PM', speaker: 'Sarah Williams', role: 'Maid of Honor', duration: '4 mins', notes: 'Sweet speech' }
  ]);

  // 5. Budget & Cost Splitting
  const [expenses, setExpenses] = useState([
    { category: 'Venue Rental', cost: 1200 },
    { category: 'Catering & Dining', cost: 2400 },
    { category: 'Decor & Flowers', cost: 450 },
    { category: 'Beverages & Bar', cost: 800 }
  ]);

  const [contributors, setContributors] = useState([
    { name: 'Groom\'s Parents', percentage: 60 },
    { name: 'Bride\'s Parents', percentage: 40 }
  ]);

  // Forms State
  const [newGuest, setNewGuest] = useState({ name: '', role: '', rsvp: 'Maybe', dietary: '', speechVolunteer: false });
  const [newMenuItem, setNewMenuItem] = useState({ course: '', item: '', dietary: '' });
  const [newSpeech, setNewSpeech] = useState({ time: '', speaker: '', role: '', duration: '', notes: '' });
  const [newExpense, setNewExpense] = useState({ category: '', cost: 0 });
  const [newContributor, setNewContributor] = useState({ name: '', percentage: 0 });

  // Edit State
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editingDetails, setEditingDetails] = useState(details);

  const [editingGuestIndex, setEditingGuestIndex] = useState<number | null>(null);
  const [editingGuestItem, setEditingGuestItem] = useState({ name: '', role: '', rsvp: 'Maybe', dietary: '', speechVolunteer: false });

  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState({ course: '', item: '', dietary: '' });

  const [editingSpeechIndex, setEditingSpeechIndex] = useState<number | null>(null);
  const [editingSpeechItem, setEditingSpeechItem] = useState({ time: '', speaker: '', role: '', duration: '', notes: '' });

  const [editingExpenseIndex, setEditingExpenseIndex] = useState<number | null>(null);
  const [editingExpenseItem, setEditingExpenseItem] = useState({ category: '', cost: 0 });

  const [editingContributorIndex, setEditingContributorIndex] = useState<number | null>(null);
  const [editingContributorItem, setEditingContributorItem] = useState({ name: '', percentage: 0 });

  // Event Details Actions
  const saveDetails = () => {
    setDetails(editingDetails);
    setIsEditingDetails(false);
  };

  // Guest Actions
  const addGuest = async () => {
    if (newGuest.name.trim()) {
      const gObj = {
        name: newGuest.name.trim(),
        role: newGuest.role.trim() || 'Guest',
        status: newGuest.rsvp === 'Confirmed' ? 'Confirmed' : newGuest.rsvp === 'Declined' ? 'Declined' : 'Pending',
        dietary: newGuest.dietary.trim() || 'None',
        speechVolunteer: newGuest.speechVolunteer
      };

      try {
        const res = await fetch('/api/guests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gObj)
        });
        if (res.ok) {
          const saved = await res.json();
          setGuests([...guests, {
            _id: saved._id,
            name: saved.name,
            role: saved.role,
            rsvp: saved.status === 'Confirmed' ? 'Confirmed' : saved.status === 'Declined' ? 'Declined' : 'Maybe',
            dietary: saved.dietary || 'None',
            speechVolunteer: saved.speechVolunteer ?? false
          }]);
        }
      } catch (e) {
        console.error('Failed to sync guest add:', e);
        setGuests([...guests, { ...newGuest, name: newGuest.name.trim() }]);
      }
      setNewGuest({ name: '', role: '', rsvp: 'Maybe', dietary: '', speechVolunteer: false });
    }
  };

  const removeGuest = async (index: number) => {
    const guest = guests[index];
    setGuests(guests.filter((_, i) => i !== index));

    if (guest._id) {
      try {
        await fetch(`/api/guests?id=${guest._id}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.error('Failed to sync guest delete:', e);
      }
    }
  };

  const startEditingGuest = (index: number) => {
    setEditingGuestIndex(index);
    setEditingGuestItem(guests[index]);
  };

  const saveEditGuest = async () => {
    if (editingGuestIndex !== null && editingGuestItem.name.trim()) {
      const newGuests = [...guests];
      newGuests[editingGuestIndex] = { ...editingGuestItem, name: editingGuestItem.name.trim() };
      setGuests(newGuests);

      const guest = newGuests[editingGuestIndex];
      if (guest._id) {
        try {
          await fetch('/api/guests', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              _id: guest._id,
              name: guest.name,
              role: guest.role,
              status: guest.rsvp === 'Confirmed' ? 'Confirmed' : guest.rsvp === 'Declined' ? 'Declined' : 'Pending',
              dietary: guest.dietary,
              speechVolunteer: guest.speechVolunteer
            })
          });
        } catch (e) {
          console.error('Failed to sync guest update:', e);
        }
      }
      setEditingGuestIndex(null);
    }
  };

  // Menu Actions
  const addMenuItem = () => {
    if (newMenuItem.course.trim() && newMenuItem.item.trim()) {
      setMenu([...menu, { course: newMenuItem.course.trim(), item: newMenuItem.item.trim(), dietary: newMenuItem.dietary.trim() }]);
      setNewMenuItem({ course: '', item: '', dietary: '' });
    }
  };

  const removeMenuItem = (index: number) => {
    setMenu(menu.filter((_, i) => i !== index));
  };

  const startEditingMenu = (index: number) => {
    setEditingMenuIndex(index);
    setEditingMenuItem(menu[index]);
  };

  const saveEditMenu = () => {
    if (editingMenuIndex !== null && editingMenuItem.course.trim() && editingMenuItem.item.trim()) {
      const newMenu = [...menu];
      newMenu[editingMenuIndex] = {
        course: editingMenuItem.course.trim(),
        item: editingMenuItem.item.trim(),
        dietary: editingMenuItem.dietary.trim()
      };
      setMenu(newMenu);
      setEditingMenuIndex(null);
    }
  };

  // Speech Actions
  const addSpeech = () => {
    if (newSpeech.time.trim() && newSpeech.speaker.trim()) {
      setSpeeches([...speeches, {
        time: newSpeech.time.trim(),
        speaker: newSpeech.speaker.trim(),
        role: newSpeech.role.trim(),
        duration: newSpeech.duration.trim(),
        notes: newSpeech.notes.trim()
      }]);
      setNewSpeech({ time: '', speaker: '', role: '', duration: '', notes: '' });
    }
  };

  const removeSpeech = (index: number) => {
    setSpeeches(speeches.filter((_, i) => i !== index));
  };

  const startEditingSpeech = (index: number) => {
    setEditingSpeechIndex(index);
    setEditingSpeechItem(speeches[index]);
  };

  const saveEditSpeech = () => {
    if (editingSpeechIndex !== null && editingSpeechItem.time.trim() && editingSpeechItem.speaker.trim()) {
      const newSpeeches = [...speeches];
      newSpeeches[editingSpeechIndex] = {
        time: editingSpeechItem.time.trim(),
        speaker: editingSpeechItem.speaker.trim(),
        role: editingSpeechItem.role.trim(),
        duration: editingSpeechItem.duration.trim(),
        notes: editingSpeechItem.notes.trim()
      };
      setSpeeches(newSpeeches);
      setEditingSpeechIndex(null);
    }
  };

  // Expense Actions
  const addExpense = () => {
    if (newExpense.category.trim() && newExpense.cost > 0) {
      setExpenses([...expenses, { category: newExpense.category.trim(), cost: newExpense.cost }]);
      setNewExpense({ category: '', cost: 0 });
    }
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const startEditingExpense = (index: number) => {
    setEditingExpenseIndex(index);
    setEditingExpenseItem(expenses[index]);
  };

  const saveEditExpense = () => {
    if (editingExpenseIndex !== null && editingExpenseItem.category.trim() && editingExpenseItem.cost > 0) {
      const newExpenses = [...expenses];
      newExpenses[editingExpenseIndex] = { category: editingExpenseItem.category.trim(), cost: editingExpenseItem.cost };
      setExpenses(newExpenses);
      setEditingExpenseIndex(null);
    }
  };

  // Contributor Actions
  const addContributor = () => {
    if (newContributor.name.trim() && newContributor.percentage > 0) {
      setContributors([...contributors, { name: newContributor.name.trim(), percentage: newContributor.percentage }]);
      setNewContributor({ name: '', percentage: 0 });
    }
  };

  const removeContributor = (index: number) => {
    setContributors(contributors.filter((_, i) => i !== index));
  };

  const startEditingContributor = (index: number) => {
    setEditingContributorIndex(index);
    setEditingContributorItem(contributors[index]);
  };

  const saveEditContributor = () => {
    if (editingContributorIndex !== null && editingContributorItem.name.trim() && editingContributorItem.percentage > 0) {
      const newContributors = [...contributors];
      newContributors[editingContributorIndex] = { name: editingContributorItem.name.trim(), percentage: editingContributorItem.percentage };
      setContributors(newContributors);
      setEditingContributorIndex(null);
    }
  };

  // Calculations
  const totalCost = expenses.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="printable-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
            margin: 0 0 2rem 0 !important;
            padding: 0 !important;
          }
          h1 {
            font-size: 2rem !important;
            margin-bottom: 0.5rem !important;
          }
          h2 {
            font-size: 1.4rem !important;
            border-bottom: 2px solid #333 !important;
            padding-bottom: 0.25rem !important;
            margin-bottom: 1rem !important;
          }
          .heading-container {
            margin-bottom: 1rem !important;
          }
          .print-item {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 2rem !important;
          }
        }
      `}</style>

      <Link href="/" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Dashboard</Link>
      
      <div className="heading-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--text-primary)' }}>Rehearsal Dinner</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Plan the intimate dinner before the big day.</p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => window.print()}>🖨️ Print Plan</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* SECTION 1: Core Event Setup */}
        <div className="card print-item" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: 0 }}>1. Core Event Setup</h2>
            <button 
              className="btn btn-sm btn-secondary no-print" 
              onClick={() => {
                if (isEditingDetails) {
                  saveDetails();
                } else {
                  setEditingDetails(details);
                  setIsEditingDetails(true);
                }
              }}
            >
              {isEditingDetails ? 'Save Details' : '✏️ Edit Setup'}
            </button>
          </div>
          
          {isEditingDetails ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Venue Name</label>
                <input type="text" value={editingDetails.venue} onChange={(e) => setEditingDetails({...editingDetails, venue: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Address</label>
                <input type="text" value={editingDetails.address} onChange={(e) => setEditingDetails({...editingDetails, address: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Date</label>
                <input type="text" value={editingDetails.date} onChange={(e) => setEditingDetails({...editingDetails, date: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Time</label>
                <input type="text" value={editingDetails.time} onChange={(e) => setEditingDetails({...editingDetails, time: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Theme</label>
                <input type="text" value={editingDetails.theme} onChange={(e) => setEditingDetails({...editingDetails, theme: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Dress Code</label>
                <input type="text" value={editingDetails.dressCode} onChange={(e) => setEditingDetails({...editingDetails, dressCode: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>Formality</label>
                <input type="text" value={editingDetails.formality} onChange={(e) => setEditingDetails({...editingDetails, formality: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>VENUE & ADDRESS</label>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{details.venue}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{details.address}</div>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>DATE & TIME</label>
                <div style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '0.25rem' }}>{details.date}</div>
                <div style={{ color: 'var(--text-secondary)' }}>{details.time}</div>
              </div>
              <div>
                <label style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>STYLE & VIBE</label>
                <div style={{ fontSize: '1.1rem', fontWeight: '500', marginTop: '0.25rem' }}>{details.theme}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{details.dressCode} ({details.formality})</div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Guest List & RSVPs */}
        <div className="card print-item" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem' }}>2. Guest List & RSVPs</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {guests.map((guest, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                {editingGuestIndex === index ? (
                  <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input type="text" value={editingGuestItem.name} onChange={(e) => setEditingGuestItem({...editingGuestItem, name: e.target.value})} style={{ flex: 2, padding: '0.25rem', minWidth: '120px' }} placeholder="Name" />
                    <input type="text" value={editingGuestItem.role} onChange={(e) => setEditingGuestItem({...editingGuestItem, role: e.target.value})} style={{ flex: 1, padding: '0.25rem', minWidth: '80px' }} placeholder="Role" />
                    <input type="text" value={editingGuestItem.dietary} onChange={(e) => setEditingGuestItem({...editingGuestItem, dietary: e.target.value})} style={{ flex: 1, padding: '0.25rem', minWidth: '80px' }} placeholder="Dietary" />
                    <select value={editingGuestItem.rsvp} onChange={(e) => setEditingGuestItem({...editingGuestItem, rsvp: e.target.value})} style={{ padding: '0.25rem' }}>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Maybe">Maybe</option>
                      <option value="Declined">Declined</option>
                    </select>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                      <input type="checkbox" checked={editingGuestItem.speechVolunteer} onChange={(e) => setEditingGuestItem({...editingGuestItem, speechVolunteer: e.target.checked})} /> Speak?
                    </label>
                    <button className="btn btn-primary btn-sm" onClick={saveEditGuest}>Save</button>
                  </div>
                ) : (
                  <>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {guest.name}
                        {guest.speechVolunteer && <span style={{ fontSize: '0.8rem', background: 'var(--accent-primary)', color: 'white', padding: '1px 6px', borderRadius: '10px' }}>🎙️ Toast</span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {guest.role} {guest.dietary && guest.dietary !== 'None' && `| 🍽️ ${guest.dietary}`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold',
                        background: guest.rsvp === 'Confirmed' ? '#d4edda' : guest.rsvp === 'Maybe' ? '#fff3cd' : '#f8d7da',
                        color: guest.rsvp === 'Confirmed' ? '#155724' : guest.rsvp === 'Maybe' ? '#856404' : '#721c24'
                      }}>
                        {guest.rsvp}
                      </span>
                      <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEditingGuest(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                        <button onClick={() => removeGuest(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add Guest Form */}
          <div className="no-print" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Add Guest</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Name" value={newGuest.name} onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })} style={{ flex: 2, padding: '0.5rem', minWidth: '120px' }} />
              <input type="text" placeholder="Role (e.g. Bridesmaid)" value={newGuest.role} onChange={(e) => setNewGuest({ ...newGuest, role: e.target.value })} style={{ flex: 1, padding: '0.5rem', minWidth: '100px' }} />
              <input type="text" placeholder="Dietary Restrictions" value={newGuest.dietary} onChange={(e) => setNewGuest({ ...newGuest, dietary: e.target.value })} style={{ flex: 1, padding: '0.5rem', minWidth: '120px' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={newGuest.speechVolunteer} onChange={(e) => setNewGuest({ ...newGuest, speechVolunteer: e.target.checked })} /> Toast Volunteer?
              </label>
              <button className="btn btn-primary" onClick={addGuest}>Add Guest</button>
            </div>
          </div>
        </div>

        {/* SECTION 3: Catering & Menu */}
        <div className="card print-item" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem' }}>3. Catering & Menu</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {menu.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                {editingMenuIndex === index ? (
                  <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input type="text" value={editingMenuItem.course} onChange={(e) => setEditingMenuItem({...editingMenuItem, course: e.target.value})} style={{ flex: 1, padding: '0.25rem' }} placeholder="Course" />
                    <input type="text" value={editingMenuItem.item} onChange={(e) => setEditingMenuItem({...editingMenuItem, item: e.target.value})} style={{ flex: 2, padding: '0.25rem' }} placeholder="Item Name" />
                    <input type="text" value={editingMenuItem.dietary} onChange={(e) => setEditingMenuItem({...editingMenuItem, dietary: e.target.value})} style={{ flex: 1, padding: '0.25rem' }} placeholder="Dietary Flags" />
                    <button className="btn btn-primary btn-sm" onClick={saveEditMenu}>Save</button>
                  </div>
                ) : (
                  <>
                    <div>
                      <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', marginRight: '0.5rem' }}>{item.course}:</span>
                      <span>{item.item}</span>
                      {item.dietary && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({item.dietary})</span>}
                    </div>
                    <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEditingMenu(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                      <button onClick={() => removeMenuItem(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add Menu Item Form */}
          <div className="no-print" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Add Menu Item</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Course (e.g. Appetizer)" value={newMenuItem.course} onChange={(e) => setNewMenuItem({ ...newMenuItem, course: e.target.value })} style={{ flex: 1, padding: '0.5rem' }} />
              <input type="text" placeholder="Item Name" value={newMenuItem.item} onChange={(e) => setNewMenuItem({ ...newMenuItem, item: e.target.value })} style={{ flex: 2, padding: '0.5rem' }} />
              <input type="text" placeholder="Dietary Notes (e.g. Gluten-Free)" value={newMenuItem.dietary} onChange={(e) => setNewMenuItem({ ...newMenuItem, dietary: e.target.value })} style={{ flex: 1, padding: '0.5rem' }} />
              <button className="btn btn-primary" onClick={addMenuItem}>Add Item</button>
            </div>
          </div>
        </div>

        {/* SECTION 4: Program & Speeches */}
        <div className="card print-item" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem' }}>4. Program & Speeches</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {speeches.map((speech, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                {editingSpeechIndex === index ? (
                  <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input type="text" value={editingSpeechItem.time} onChange={(e) => setEditingSpeechItem({...editingSpeechItem, time: e.target.value})} style={{ flex: 1, padding: '0.25rem' }} placeholder="Time" />
                    <input type="text" value={editingSpeechItem.speaker} onChange={(e) => setEditingSpeechItem({...editingSpeechItem, speaker: e.target.value})} style={{ flex: 2, padding: '0.25rem' }} placeholder="Speaker / Activity" />
                    <input type="text" value={editingSpeechItem.role} onChange={(e) => setEditingSpeechItem({...editingSpeechItem, role: e.target.value})} style={{ flex: 1, padding: '0.25rem' }} placeholder="Role" />
                    <input type="text" value={editingSpeechItem.duration} onChange={(e) => setEditingSpeechItem({...editingSpeechItem, duration: e.target.value})} style={{ flex: 1, padding: '0.25rem' }} placeholder="Duration" />
                    <input type="text" value={editingSpeechItem.notes} onChange={(e) => setEditingSpeechItem({...editingSpeechItem, notes: e.target.value})} style={{ flex: 2, padding: '0.25rem' }} placeholder="Notes" />
                    <button className="btn btn-primary btn-sm" onClick={saveEditSpeech}>Save</button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', minWidth: '80px' }}>{speech.time}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold' }}>{speech.speaker}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {speech.role} {speech.duration && `| ⏱️ ${speech.duration}`}
                      </div>
                      {speech.notes && <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', fontStyle: 'italic' }}>{speech.notes}</div>}
                    </div>
                    <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => startEditingSpeech(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                      <button onClick={() => removeSpeech(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add Speech Form */}
          <div className="no-print" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Add Schedule Event / Toast</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Time" value={newSpeech.time} onChange={(e) => setNewSpeech({ ...newSpeech, time: e.target.value })} style={{ flex: 1, padding: '0.5rem' }} />
              <input type="text" placeholder="Speaker / Event" value={newSpeech.speaker} onChange={(e) => setNewSpeech({ ...newSpeech, speaker: e.target.value })} style={{ flex: 2, padding: '0.5rem' }} />
              <input type="text" placeholder="Role (e.g. Best Man)" value={newSpeech.role} onChange={(e) => setNewSpeech({ ...newSpeech, role: e.target.value })} style={{ flex: 1, padding: '0.5rem' }} />
              <input type="text" placeholder="Duration (e.g. 5 mins)" value={newSpeech.duration} onChange={(e) => setNewSpeech({ ...newSpeech, duration: e.target.value })} style={{ flex: 1, padding: '0.5rem' }} />
              <input type="text" placeholder="Notes/Comments" value={newSpeech.notes} onChange={(e) => setNewSpeech({ ...newSpeech, notes: e.target.value })} style={{ flex: 2, padding: '0.5rem' }} />
              <button className="btn btn-primary" onClick={addSpeech}>Add Event</button>
            </div>
          </div>
        </div>

        {/* SECTION 5: Budget & Cost Splitting */}
        <div className="card print-item" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.5rem' }}>5. Budget & Cost Splitting</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            
            {/* Expense breakdown */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Expense Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {expenses.map((expense, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                    {editingExpenseIndex === index ? (
                      <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                        <input type="text" value={editingExpenseItem.category} onChange={(e) => setEditingExpenseItem({...editingExpenseItem, category: e.target.value})} style={{ flex: 2, padding: '0.25rem' }} placeholder="Category" />
                        <input type="number" value={editingExpenseItem.cost || ''} onChange={(e) => setEditingExpenseItem({...editingExpenseItem, cost: parseFloat(e.target.value) || 0})} style={{ flex: 1, padding: '0.25rem' }} placeholder="Cost" />
                        <button className="btn btn-primary btn-sm" onClick={saveEditExpense}>Save</button>
                      </div>
                    ) : (
                      <>
                        <span>{expense.category}</span>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>${expense.cost.toFixed(2)}</span>
                          <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => startEditingExpense(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                            <button onClick={() => removeExpense(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--neutral-dark)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
                  <span>Total Estimated Spend</span>
                  <span>${totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Add Expense Form */}
              <div className="no-print" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Add Expense</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Category" value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})} style={{ flex: 2, padding: '0.5rem' }} />
                  <input type="number" placeholder="Cost" value={newExpense.cost || ''} onChange={(e) => setNewExpense({...newExpense, cost: parseFloat(e.target.value) || 0})} style={{ flex: 1, padding: '0.5rem' }} />
                  <button className="btn btn-primary" onClick={addExpense}>Add</button>
                </div>
              </div>
            </div>

            {/* Split Cost Breakdown */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Host Cost Splitting</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {contributors.map((contrib, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                    {editingContributorIndex === index ? (
                      <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                        <input type="text" value={editingContributorItem.name} onChange={(e) => setEditingContributorItem({...editingContributorItem, name: e.target.value})} style={{ flex: 2, padding: '0.25rem' }} placeholder="Host Name" />
                        <input type="number" value={editingContributorItem.percentage || ''} onChange={(e) => setEditingContributorItem({...editingContributorItem, percentage: parseFloat(e.target.value) || 0})} style={{ flex: 1, padding: '0.25rem' }} placeholder="Share %" />
                        <button className="btn btn-primary btn-sm" onClick={saveEditContributor}>Save</button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>{contrib.name}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({contrib.percentage}%)</span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                            ${((totalCost * contrib.percentage) / 100).toFixed(2)}
                          </span>
                          <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => startEditingContributor(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                            <button onClick={() => removeContributor(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Contributor Form */}
              <div className="no-print" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Add Host/Contributor</h4>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" placeholder="Host Name" value={newContributor.name} onChange={(e) => setNewContributor({...newContributor, name: e.target.value})} style={{ flex: 2, padding: '0.5rem' }} />
                  <input type="number" placeholder="Share %" value={newContributor.percentage || ''} onChange={(e) => setNewContributor({...newContributor, percentage: parseFloat(e.target.value) || 0})} style={{ flex: 1, padding: '0.5rem' }} />
                  <button className="btn btn-primary" onClick={addContributor}>Add</button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
