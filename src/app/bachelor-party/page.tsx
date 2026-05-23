"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PartyPlannerPage() {
  const [partyType, setPartyType] = useState<'bachelor' | 'bachelorette'>('bachelor');

  // --- Bachelor Data ---
  const [bachelorItinerary, setBachelorItinerary] = useState([
    { time: 'Friday 4:00 PM', activity: 'Arrival & Check-in at AirBnB', location: 'Downtown Loft' },
    { time: 'Friday 7:00 PM', activity: 'Welcome Dinner & Drinks', location: 'The Prime Cut Steakhouse' },
    { time: 'Saturday 10:00 AM', activity: 'Golf Tournament', location: 'Whistling Pines Country Club' },
    { time: 'Saturday 2:00 PM', activity: 'Pool Party & BBQ', location: 'AirBnB Pool' },
    { time: 'Saturday 8:00 PM', activity: 'VIP Night Out & Lounge', location: 'Skyline Lounge & Club' },
    { time: 'Sunday 11:00 AM', activity: 'Farewell Brunch', location: 'The Daily Egg Diner' }
  ]);

  const [bachelorAttendees, setBachelorAttendees] = useState<any[]>([
    { name: 'Marcus Brooks', role: 'Groom', status: 'Confirmed', paid: true },
    { name: 'Brad Callahan', role: 'Best Man', status: 'Confirmed', paid: true },
    { name: 'Liam Sterling', role: 'Groomsman', status: 'Confirmed', paid: true },
    { name: 'Ethan Hunt', role: 'Groomsman', status: 'Confirmed', paid: false },
    { name: 'Tyler Durden', role: 'Friend', status: 'Maybe', paid: false },
    { name: 'David Miller', role: 'Friend', status: 'Declined', paid: false }
  ]);

  // Load guests on page mount
  useEffect(() => {
    async function loadGuests() {
      try {
        const res = await fetch('/api/guests');
        if (res.ok) {
          const dbGuests = await res.json();
          if (dbGuests.length > 0) {
            // Map DB guests to Bachelor attendees
            const mappedBachelor = dbGuests.map((g: any) => ({
              _id: g._id,
              name: g.name,
              role: g.role || (g.name === 'Marcus Brooks' ? 'Groom' : g.name === 'Brad Callahan' ? 'Best Man' : 'Groomsman'),
              status: g.status === 'Confirmed' ? 'Confirmed' : g.status === 'Declined' ? 'Declined' : 'Maybe',
              paid: g.paid ?? (g.status === 'Confirmed' ? true : false)
            }));
            setBachelorAttendees(mappedBachelor);

            // Map DB guests to Bachelorette attendees
            const mappedBachelorette = dbGuests.map((g: any) => ({
              _id: g._id,
              name: g.name,
              role: g.role || (g.name === 'Maya Brooks' ? 'Bride' : g.name === 'Emma Vance' ? 'Maid of Honor' : 'Bridesmaid'),
              status: g.status === 'Confirmed' ? 'Confirmed' : g.status === 'Declined' ? 'Declined' : 'Maybe',
              paid: g.paid ?? (g.status === 'Confirmed' ? true : false)
            }));
            setBacheloretteAttendees(mappedBachelorette);
          }
        }
      } catch (err) {
        console.error('Failed to load guests:', err);
      }
    }
    loadGuests();
  }, []);

  const [bachelorBudget, setBachelorBudget] = useState([
    { item: 'AirBnB Rental', cost: 1500 },
    { item: 'Golf Fees', cost: 500 },
    { item: 'Dinner Reservations', cost: 600 },
    { item: 'Drinks & Groceries', cost: 400 }
  ]);

  // --- Bachelorette Data ---
  const [bacheloretteItinerary, setBacheloretteItinerary] = useState([
    { time: 'Friday 3:00 PM', activity: 'Champagne Welcome & Gift Bags', location: 'Rosewater Cottage AirBnB' },
    { time: 'Friday 6:00 PM', activity: 'Private Chef Dinner & PJ Party', location: 'Cottage Dining Room' },
    { time: 'Saturday 11:00 AM', activity: 'Winery Tour & Tasting', location: 'Valley Vineyards' },
    { time: 'Saturday 3:00 PM', activity: 'Floral Workshop or Spa Chill', location: 'Cottage Gardens' },
    { time: 'Saturday 7:30 PM', activity: 'Limo Ride & Glam Dinner Out', location: 'Le Petit Bistro & Rooftop' },
    { time: 'Sunday 10:30 AM', activity: 'Pajama Brunch & Photos', location: 'Brunch & Mimosa Bar' }
  ]);

  const [bacheloretteAttendees, setBacheloretteAttendees] = useState([
    { name: 'Maya Brooks', role: 'Bride', status: 'Confirmed', paid: true },
    { name: 'Emma Vance', role: 'Maid of Honor', status: 'Confirmed', paid: true },
    { name: 'Chloe Sterling', role: 'Bridesmaid', status: 'Confirmed', paid: true },
    { name: 'Sophia Miller', role: 'Bridesmaid', status: 'Confirmed', paid: false },
    { name: 'Olivia Wild', role: 'Friend', status: 'Maybe', paid: false },
    { name: 'Isabella Ross', role: 'Friend', status: 'Declined', paid: false }
  ]);

  const [bacheloretteBudget, setBacheloretteBudget] = useState([
    { item: 'Luxury AirBnB Cottage', cost: 1800 },
    { item: 'Winery Tour & Wine Tastings', cost: 600 },
    { item: 'Private Chef Dinner', cost: 800 },
    { item: 'Spa Treatments', cost: 500 },
    { item: 'Party Favors & Gift Bags', cost: 300 }
  ]);

  // --- Add State / Forms ---
  const [newItem, setNewItem] = useState({ time: '', activity: '', location: '' });
  const [newAttendee, setNewAttendee] = useState({ name: '', role: '', status: 'Maybe', paid: false });
  const [newBudgetItem, setNewBudgetItem] = useState({ item: '', cost: 0 });

  // Toggle helpers
  const currentItinerary = partyType === 'bachelor' ? bachelorItinerary : bacheloretteItinerary;
  const currentAttendees = partyType === 'bachelor' ? bachelorAttendees : bacheloretteAttendees;
  const currentBudget = partyType === 'bachelor' ? bachelorBudget : bacheloretteBudget;

  const setCurrentItinerary = partyType === 'bachelor' ? setBachelorItinerary : setBacheloretteItinerary;
  const setCurrentAttendees = partyType === 'bachelor' ? setBachelorAttendees : setBacheloretteAttendees;
  const setCurrentBudget = partyType === 'bachelor' ? setBachelorBudget : setBacheloretteBudget;

  // Add Handlers
  const addItineraryItem = () => {
    if (newItem.time && newItem.activity) {
      setCurrentItinerary([...currentItinerary, newItem]);
      setNewItem({ time: '', activity: '', location: '' });
    }
  };

  const addAttendee = async () => {
    if (newAttendee.name) {
      const gObj = {
        name: newAttendee.name.trim(),
        role: newAttendee.role.trim() || (partyType === 'bachelor' ? 'Groomsman' : 'Bridesmaid'),
        status: newAttendee.status === 'Confirmed' ? 'Confirmed' : newAttendee.status === 'Declined' ? 'Declined' : 'Pending',
        paid: newAttendee.paid
      };

      try {
        const res = await fetch('/api/guests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gObj)
        });
        if (res.ok) {
          const saved = await res.json();
          setCurrentAttendees([...currentAttendees, {
            _id: saved._id,
            name: saved.name,
            role: saved.role,
            status: saved.status === 'Confirmed' ? 'Confirmed' : saved.status === 'Declined' ? 'Declined' : 'Maybe',
            paid: saved.paid ?? false
          }]);
        }
      } catch (e) {
        console.error('Failed to sync attendee add:', e);
        setCurrentAttendees([...currentAttendees, newAttendee]);
      }
      setNewAttendee({ name: '', role: '', status: 'Maybe', paid: false });
    }
  };

  const addBudgetItem = () => {
    if (newBudgetItem.item && newBudgetItem.cost > 0) {
      setCurrentBudget([...currentBudget, newBudgetItem]);
      setNewBudgetItem({ item: '', cost: 0 });
    }
  };

  const removeItineraryItem = (index: number) => {
    setCurrentItinerary(currentItinerary.filter((_, i) => i !== index));
  };

  const removeAttendee = async (index: number) => {
    const attendee = currentAttendees[index];
    setCurrentAttendees(currentAttendees.filter((_, i) => i !== index));

    if (attendee._id) {
      try {
        await fetch(`/api/guests?id=${attendee._id}`, {
          method: 'DELETE'
        });
      } catch (e) {
        console.error('Failed to sync attendee delete:', e);
      }
    }
  };

  const removeBudgetItem = (index: number) => {
    setCurrentBudget(currentBudget.filter((_, i) => i !== index));
  };

  const togglePaid = async (index: number) => {
    const updated = [...currentAttendees];
    updated[index].paid = !updated[index].paid;
    setCurrentAttendees(updated);

    const attendee = updated[index];
    if (attendee._id) {
      try {
        await fetch('/api/guests', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _id: attendee._id,
            paid: attendee.paid
          })
        });
      } catch (e) {
        console.error('Failed to sync paid status:', e);
      }
    }
  };

  // Calculations
  const confirmedCount = currentAttendees.filter(a => a.status === 'Confirmed').length || 1;
  const totalCost = currentBudget.reduce((sum, item) => sum + item.cost, 0);
  const perPersonCost = totalCost / confirmedCount;

  // Theme Styling Config
  const isBachelor = partyType === 'bachelor';
  const accentColor = isBachelor ? '#cca43b' : '#ff929d';
  const cardBorderColor = isBachelor ? '#cca43b33' : '#ff929d33';
  const hoverColor = isBachelor ? '#b08b30' : '#e57c88';
  const bgBadge = isBachelor ? '#fff3cd' : '#ffe5ec';
  const badgeColor = isBachelor ? '#856404' : '#c9184a';

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Back Link */}
      <Link href="/" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Dashboard</Link>
      
      {/* Header and Toggle Mode Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--text-primary)' }}>
            {isBachelor ? 'Bachelor Party Planner 🍾' : 'Bachelorette Party Planner 👰‍♀️'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {isBachelor ? 'Coordinate the ultimate send-off for the groom.' : 'Plan the perfect, unforgettable getaway for the bride.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="btn btn-secondary no-print"
            style={{ whiteSpace: 'nowrap' }}
          >
            🖨️ Print Plan
          </button>

          {/* Unified Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--neutral-light)', padding: '0.4rem', borderRadius: '30px', border: '1px solid var(--neutral-gray)' }}>
            <button 
              onClick={() => setPartyType('bachelor')}
              style={{ 
                padding: '0.6rem 1.5rem', 
                borderRadius: '25px', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                background: isBachelor ? '#cca43b' : 'transparent',
                color: isBachelor ? 'white' : 'var(--text-primary)',
                transition: 'all 0.3s ease'
              }}
            >
              🍾 Bachelor Mode
            </button>
            <button 
              onClick={() => setPartyType('bachelorette')}
              style={{ 
                padding: '0.6rem 1.5rem', 
                borderRadius: '25px', 
                border: 'none', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                background: !isBachelor ? '#ff929d' : 'transparent',
                color: !isBachelor ? 'white' : 'var(--text-primary)',
                transition: 'all 0.3s ease'
              }}
            >
              👰‍♀️ Bachelorette Mode
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem' }}>
        
        {/* Itinerary Section */}
        <div className="card" style={{ padding: '2rem', border: `1px solid ${cardBorderColor}`, transition: 'border 0.3s ease' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.5rem', transition: 'border-color 0.3s ease' }}>
            Schedule & Events
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentItinerary.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ minWidth: '120px', fontWeight: 'bold', color: accentColor, transition: 'color 0.3s' }}>{item.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500' }}>{item.activity}</div>
                  {item.location && <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📍 {item.location}</div>}
                </div>
                <button onClick={() => removeItineraryItem(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1rem' }}>✕</button>
              </div>
            ))}
            {currentItinerary.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No events scheduled yet!</p>}
          </div>

          {/* Add Itinerary Form */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Add Event</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Time (e.g. Sat 3pm)" 
                value={newItem.time} 
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              />
              <input 
                type="text" 
                placeholder="Activity" 
                value={newItem.activity} 
                onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              />
              <input 
                type="text" 
                placeholder="Location" 
                value={newItem.location} 
                onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              />
              <button 
                className="btn" 
                onClick={addItineraryItem}
                style={{ background: accentColor, color: 'white', border: 'none', transition: 'background 0.3s' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Attendees Section */}
        <div className="card" style={{ padding: '2rem', border: `1px solid ${cardBorderColor}`, transition: 'border 0.3s ease' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.5rem', transition: 'border-color 0.3s ease' }}>
            Guest List & RSVPs
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentAttendees.map((attendee, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{attendee.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{attendee.role}</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    background: attendee.status === 'Confirmed' ? '#d4edda' : attendee.status === 'Maybe' ? bgBadge : '#f8d7da',
                    color: attendee.status === 'Confirmed' ? '#155724' : attendee.status === 'Maybe' ? badgeColor : '#721c24',
                    transition: 'all 0.3s'
                  }}>
                    {attendee.status}
                  </span>
                  <button 
                    onClick={() => togglePaid(index)}
                    style={{ 
                      background: attendee.paid ? '#d4edda' : 'transparent',
                      border: `1px solid ${attendee.paid ? '#28a745' : 'var(--neutral-gray)'}`,
                      color: attendee.paid ? '#155724' : 'var(--text-secondary)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {attendee.paid ? '✓ Paid' : '✗ Unpaid'}
                  </button>
                  <button onClick={() => removeAttendee(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Guest Form */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Add Guest</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Name" 
                value={newAttendee.name} 
                onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', minWidth: '120px' }}
              />
              <input 
                type="text" 
                placeholder="Role (e.g. Groomsman)" 
                value={newAttendee.role} 
                onChange={(e) => setNewAttendee({ ...newAttendee, role: e.target.value })}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', minWidth: '100px' }}
              />
              <select 
                value={newAttendee.status} 
                onChange={(e) => setNewAttendee({ ...newAttendee, status: e.target.value })}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', minWidth: '100px' }}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Maybe">Maybe</option>
                <option value="Declined">Declined</option>
              </select>
              <button 
                className="btn" 
                onClick={addAttendee}
                style={{ background: accentColor, color: 'white', border: 'none', transition: 'background 0.3s' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Budget Section */}
        <div className="card" style={{ padding: '2rem', gridColumn: 'span 2', border: `1px solid ${cardBorderColor}`, transition: 'border 0.3s ease' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.5rem', transition: 'border-color 0.3s ease' }}>
            Shared Party Budget
          </h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Expense Item</th>
                <th style={{ padding: '0.75rem' }}>Total Cost</th>
                <th style={{ padding: '0.75rem' }}>Per Person ({confirmedCount} Confirmed)</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentBudget.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--neutral-light)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{item.item}</td>
                  <td style={{ padding: '0.75rem' }}>${item.cost.toFixed(2)}</td>
                  <td style={{ padding: '0.75rem' }}>${(item.cost / confirmedCount).toFixed(2)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button onClick={() => removeBudgetItem(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>✕</button>
                  </td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', background: 'var(--neutral-light)' }}>
                <td style={{ padding: '0.75rem' }}>Total Estimated Cost</td>
                <td style={{ padding: '0.75rem' }}>${totalCost.toFixed(2)}</td>
                <td style={{ padding: '0.75rem', color: accentColor }}>${perPersonCost.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Add Budget Item Form */}
          <div style={{ padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Add Expense</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Item (e.g. Accommodation)" 
                value={newBudgetItem.item} 
                onChange={(e) => setNewBudgetItem({ ...newBudgetItem, item: e.target.value })}
                style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              />
              <input 
                type="number" 
                placeholder="Total Cost" 
                value={newBudgetItem.cost || ''} 
                onChange={(e) => setNewBudgetItem({ ...newBudgetItem, cost: parseFloat(e.target.value) || 0 })}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
              />
              <button 
                className="btn" 
                onClick={addBudgetItem}
                style={{ background: accentColor, color: 'white', border: 'none', transition: 'background 0.3s' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Games Links card */}
        <div className="card" style={{ padding: '2rem', gridColumn: 'span 2', border: `1px solid ${cardBorderColor}`, transition: 'border 0.3s ease', background: 'var(--neutral-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', margin: 0 }}>
                {isBachelor ? 'Bachelor Games & Fun' : 'Bachelorette Party Games'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {isBachelor ? 'Printable Trivia, Dilemmas, and Drinking games for the boys!' : 'Rose-themed activities, Would You Rather, and Bridal games.'}
              </p>
            </div>
            <Link 
              href={isBachelor ? '/bachelor-party/games' : '/bridal-shower/games'} 
              className="btn"
              style={{ background: accentColor, color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
            >
              🎮 Browse {isBachelor ? 'Bachelor' : 'Bachelorette'} Games
            </Link>
          </div>
        </div>

        {/* Tips & Tricks Section */}
        <div className="card" style={{ padding: '2rem', gridColumn: 'span 2', border: `1px solid ${cardBorderColor}`, transition: 'border 0.3s ease' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: `2px solid ${accentColor}`, paddingBottom: '0.5rem', transition: 'border-color 0.3s ease' }}>
            {isBachelor ? 'Bachelor Party Tips & Tricks' : 'Bachelorette Planning Wisdom'}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Planning */}
            <details style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <summary style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>📅 Planning & Timelines</summary>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {isBachelor ? (
                  <>
                    <p><strong>Start Early:</strong> Begin 3-6 months in advance for destinations, 2-3 for local.</p>
                    <p><strong>Know Your Groom:</strong> Survey must-dos and hard nos discreetly.</p>
                    <p><strong>Date Selection:</strong> Poll key bridesmaids/groomsmen before booking accommodations.</p>
                  </>
                ) : (
                  <>
                    <p><strong>Theme Syncing:</strong> Match the cottage decor and dress code to a single aesthetic (e.g., Floral, Sage & Blush, Vintage Chic).</p>
                    <p><strong>Coordinate Arrival:</strong> Arrange early check-in so bridesmaids can set up gift bags and decorations before the bride arrives!</p>
                  </>
                )}
              </div>
            </details>

            {/* Budget */}
            <details style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <summary style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>💰 Cost Management & Splitting</summary>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <p><strong>Transparency:</strong> Put all expected costs (lodging, travel, chef, spa) up front before inviting.</p>
                <p><strong>Gifting Bride/Groom:</strong> It is standard that guests split the bride or groom's lodging and dinner costs among themselves.</p>
                <p><strong>Venmo / Splitwise:</strong> Appoint a single money manager to handle payments and create a unified spreadsheet.</p>
              </div>
            </details>

            {/* Safety */}
            <details style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <summary style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>🛡️ Safety & Logistics</summary>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <p><strong>Location Sharing:</strong> Use Find My Friends or group chats to share real-time locations during big nights out.</p>
                <p><strong>Uber Accounts:</strong> Pre-load rideshare balances or book group sprinter vans so no one gets left behind.</p>
                <p><strong>The 1:1 Water Rule:</strong> Alternate alcoholic drinks with water to survive long weekend marathons!</p>
              </div>
            </details>

            {/* Memorable */}
            <details style={{ background: 'var(--neutral-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <summary style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>🎉 Special Surprises</summary>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {isBachelor ? (
                  <>
                    <p><strong>Letters:</strong> Have the bride write a sweet private letter for him to read on the trip.</p>
                    <p><strong>Custom Swag:</strong> Get personalized matches, sunglasses, or matching caps for the golf event.</p>
                  </>
                ) : (
                  <>
                    <p><strong>Videographer Toast:</strong> Film a mini Q&A video of the groom in advance and play it during dinner!</p>
                    <p><strong>Signature Mimosa:</strong> Name a custom brunch drink after the couple's pet or first date spot.</p>
                  </>
                )}
              </div>
            </details>

          </div>

          {/* Quick lists */}
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: '#f8d7da', borderRadius: 'var(--radius-sm)', color: '#721c24' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>❌ Major Mistakes to Avoid</h3>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem' }}>
                <li>Overscheduling every single hour (leave down time!)</li>
                <li>Underestimating taxes, resort fees, and tips</li>
                <li>Pressuring the bride/groom into activities they explicitly hate</li>
                <li>Not planning safe transport home after bars</li>
              </ul>
            </div>
            <div style={{ padding: '1rem', background: '#d4edda', borderRadius: 'var(--radius-sm)', color: '#155724' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>✅ Planner Best Practices</h3>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '1.2rem' }}>
                <li>Delegate specific tasks (decor, alcohol buying, winery contact)</li>
                <li>Stock the kitchen pantry immediately upon arrival</li>
                <li>Create a shared photo album for easy photo sharing</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
