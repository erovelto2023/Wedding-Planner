"use client";

import { useState, useEffect } from 'react';

interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  date: string;
  status: 'Inquiry' | 'Follow Up' | 'Booked' | 'Client';
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/leads');
        if (res.ok) {
          const data = await res.json();
          setLeads(data);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const addLead = async () => {
    if (!newName || !newEmail) {
      alert('Name and Email are required.');
      return;
    }
    
    const leadData = {
      name: newName,
      email: newEmail,
      phone: newPhone,
      address: newAddress,
      city: newCity,
      state: newState,
      zip: newZip,
      date: newDate || new Date().toISOString().split('T')[0],
      status: 'Inquiry' as const
    };

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    if (res.ok) {
      const result = await res.json();
      setLeads([...leads, { ...leadData, _id: result.id }]);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setNewAddress('');
      setNewCity('');
      setNewState('');
      setNewZip('');
      setNewDate('');
    } else {
      alert('Failed to add lead.');
    }
  };

  const updateLeadStatus = async (id: string, status: string) => {
    const res = await fetch('/api/leads', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, status })
    });

    if (res.ok) {
      setLeads(leads.map(l => l._id === id ? { ...l, status: status as any } : l));
    } else {
      alert('Failed to update lead status.');
    }
  };

  if (loading) return <div className="container">Loading leads...</div>;

  return (
    <div className="container">
      <h1 className="title">Lead Management</h1>
      
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Add New Lead (Client)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Couple's Names</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-primary)' }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-primary)' }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Phone</label>
            <input
              type="text"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-primary)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Wedding Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-primary)' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Address</label>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-primary)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>City</label>
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-primary)' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>State</label>
              <input
                type="text"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-primary)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Zip</label>
              <input
                type="text"
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-primary)' }}
              />
            </div>
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={addLead}>Add Lead</button>

        <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Existing Leads</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--accent-secondary)', color: 'var(--accent-primary)' }}>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Location</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Wedding Date</th>
              <th style={{ textAlign: 'left', padding: '1rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '1rem' }}>{lead.name}</td>
                <td style={{ padding: '1rem' }}>{lead.email}</td>
                <td style={{ padding: '1rem' }}>
                  {lead.city ? `${lead.city}, ${lead.state || ''}` : 'N/A'}
                </td>
                <td style={{ padding: '1rem' }}>{lead.date}</td>
                <td style={{ padding: '1rem' }}>
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead._id!, e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      background: lead.status === 'Client' ? '#E1BEE7' : lead.status === 'Booked' ? '#C8E6C9' : lead.status === 'Follow Up' ? '#FFF9C4' : '#E0E0E0',
                      color: lead.status === 'Client' ? '#7B1FA2' : lead.status === 'Booked' ? '#388E3C' : lead.status === 'Follow Up' ? '#FBC02D' : '#616161',
                      border: '1px solid var(--neutral-gray)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Inquiry">Inquiry</option>
                    <option value="Follow Up">Follow Up</option>
                    <option value="Booked">Booked</option>
                    <option value="Client">Client</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
