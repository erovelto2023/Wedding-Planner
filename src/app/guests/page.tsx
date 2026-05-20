"use client";

import { useState, useEffect } from 'react';

interface Guest {
  _id?: string;
  name: string;
  meal: string;
  dietary: string;
  status: string;
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newMeal, setNewMeal] = useState('Beef');

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
      } finally {
        setLoading(false);
      }
    }
    fetchGuests();
  }, []);

  const addGuest = async () => {
    if (!newName) return;
    const guest: Guest = {
      name: newName,
      meal: newMeal,
      dietary: 'None',
      status: 'Pending'
    };

    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guest)
    });

    if (res.ok) {
      const savedGuest = await res.json();
      setGuests([...guests, savedGuest]);
      setNewName('');
    } else {
      alert('Failed to add guest.');
    }
  };

  const updateGuest = async (updatedGuest: Guest) => {
    const res = await fetch('/api/guests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedGuest)
    });

    if (res.ok) {
      setGuests(guests.map(g => g._id === updatedGuest._id ? updatedGuest : g));
      setIsModalOpen(false);
      setSelectedGuest(null);
    } else {
      alert('Failed to update guest.');
    }
  };

  const deleteGuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest?')) return;

    const res = await fetch(`/api/guests?id=${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setGuests(guests.filter(g => g._id !== id));
    } else {
      alert('Failed to delete guest.');
    }
  };

  const openEdit = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsModalOpen(true);
  };

  if (loading) return <div className="container">Loading guests...</div>;

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      <h1 className="title">Guest Management</h1>
      
      {/* Quick Add Form */}
      <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'white' }}>
        <input
          type="text"
          placeholder="Guest Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }}
        />
        <select
          value={newMeal}
          onChange={(e) => setNewMeal(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'white' }}
        >
          <option value="Beef">Beef</option>
          <option value="Fish">Fish</option>
          <option value="Chicken">Chicken</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
        </select>
        <button className="btn btn-primary" onClick={addGuest}>Add Guest</button>
      </div>

      {/* Guest Table */}
      <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2rem', background: 'white' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--neutral-gray)' }}>
              <th style={{ padding: '0.75rem' }}>Name</th>
              <th style={{ padding: '0.75rem' }}>Meal Choice</th>
              <th style={{ padding: '0.75rem' }}>Dietary Restrictions</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest._id} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{guest.name}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ 
                    background: 'var(--bg-secondary)', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}>
                    {guest.meal}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', color: guest.dietary !== 'None' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                  {guest.dietary}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ 
                    color: guest.status === 'Confirmed' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 'bold'
                  }}>
                    {guest.status}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', marginRight: '0.5rem' }} onClick={() => openEdit(guest)}>Edit</button>
                  <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', color: 'var(--danger)' }} onClick={() => deleteGuest(guest._id!)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedGuest && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)' }}>Edit Guest</h2>
              <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Name</label>
                <input type="text" value={selectedGuest.name} onChange={(e) => setSelectedGuest({ ...selectedGuest, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Meal Choice</label>
                <select value={selectedGuest.meal} onChange={(e) => setSelectedGuest({ ...selectedGuest, meal: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'white' }}>
                  <option value="Beef">Beef</option>
                  <option value="Fish">Fish</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dietary Restrictions</label>
                <input type="text" value={selectedGuest.dietary} onChange={(e) => setSelectedGuest({ ...selectedGuest, dietary: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} placeholder="e.g., Peanut Allergy, Gluten Free" />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>RSVP Status</label>
                <select value={selectedGuest.status} onChange={(e) => setSelectedGuest({ ...selectedGuest, status: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'white' }}>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => updateGuest(selectedGuest)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
