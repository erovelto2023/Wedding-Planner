"use client";

import { useState, useEffect } from 'react';

interface Vendor {
  _id?: string;
  name: string;
  category: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  contact?: string;
  email?: string;
  website?: string;
  notes?: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Photography');

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await fetch('/api/vendors');
        if (res.ok) {
          const data = await res.json();
          setVendors(data);
        }
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);

  const addVendor = async () => {
    if (!newName) return;
    const vendor: Vendor = {
      name: newName,
      category: newCategory,
    };

    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor)
    });

    if (res.ok) {
      const savedVendor = await res.json();
      setVendors([...vendors, savedVendor]);
      setNewName('');
    } else {
      alert('Failed to add vendor.');
    }
  };

  const updateVendor = async (updatedVendor: Vendor) => {
    const res = await fetch('/api/vendors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedVendor)
    });

    if (res.ok) {
      setVendors(vendors.map(v => v._id === updatedVendor._id ? updatedVendor : v));
      setIsPanelOpen(false);
      setSelectedVendor(null);
    } else {
      alert('Failed to update vendor.');
    }
  };

  const deleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    const res = await fetch(`/api/vendors?id=${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setVendors(vendors.filter(v => v._id !== id));
      if (selectedVendor?._id === id) {
        setIsPanelOpen(false);
        setSelectedVendor(null);
      }
    } else {
      alert('Failed to delete vendor.');
    }
  };

  const openProfile = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsPanelOpen(true);
  };

  if (loading) return <div className="container">Loading vendors...</div>;

  return (
    <div className="container" style={{ maxWidth: '1200px', position: 'relative' }}>
      <h1 className="title">Vendor Directory</h1>
      
      {/* Quick Add Form */}
      <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'white' }}>
        <input
          type="text"
          placeholder="Business Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }}
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'white' }}
        >
          <option value="Photography">Photography</option>
          <option value="Catering">Catering</option>
          <option value="Florist">Florist</option>
          <option value="DJ/Music">DJ/Music</option>
          <option value="Venue">Venue</option>
          <option value="Planner">Planner</option>
          <option value="Other">Other</option>
        </select>
        <button className="btn btn-primary" onClick={addVendor}>Add Vendor</button>
      </div>

      {/* Grid of Vendor Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {vendors.map((vendor) => (
          <div 
            key={vendor._id} 
            className="glass-card" 
            style={{ padding: '1.5rem', textAlign: 'left', background: 'white', cursor: 'pointer', transition: 'transform 0.2s ease', position: 'relative' }}
            onClick={() => openProfile(vendor)}
          >
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.5rem' }}>
              {vendor.category === 'Photography' && '📷'}
              {vendor.category === 'Catering' && '🍽️'}
              {vendor.category === 'Florist' && '💐'}
              {vendor.category === 'DJ/Music' && '🎵'}
              {vendor.category === 'Venue' && '🏰'}
              {vendor.category === 'Planner' && '📋'}
              {vendor.category === 'Other' && '💼'}
            </div>
            
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.25rem' }}>{vendor.name}</h3>
            <span style={{ 
              background: 'var(--bg-secondary)', 
              color: 'var(--accent-primary)', 
              padding: '0.1rem 0.5rem', 
              borderRadius: '12px', 
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {vendor.category}
            </span>
            
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {vendor.city && vendor.state ? <p style={{ marginBottom: '0.25rem' }}>📍 {vendor.city}, {vendor.state}</p> : vendor.address && <p style={{ marginBottom: '0.25rem' }}>📍 {vendor.address}</p>}
              {vendor.email && <p>✉️ {vendor.email}</p>}
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>View Profile</button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', color: 'var(--danger)' }}
                onClick={(e) => { e.stopPropagation(); deleteVendor(vendor._id!); }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Profile Panel */}
      {isPanelOpen && selectedVendor && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '500px', height: '100%', background: 'white', boxShadow: '-2px 0 10px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--neutral-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)' }}>{selectedVendor.name}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedVendor.category}</span>
            </div>
            <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setIsPanelOpen(false)}>✕</button>
          </div>

          {/* Content / Form with specific fields */}
          <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business Name</label>
                <input type="text" value={selectedVendor.name} onChange={(e) => setSelectedVendor({ ...selectedVendor, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business Address</label>
                <input type="text" value={selectedVendor.address || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, address: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>City</label>
                  <input type="text" value={selectedVendor.city || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, city: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>State</label>
                  <input type="text" value={selectedVendor.state || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, state: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Zip</label>
                  <input type="text" value={selectedVendor.zip || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, zip: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business Contact Person</label>
                <input type="text" value={selectedVendor.contact || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, contact: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} placeholder="e.g., John Doe" />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business Phone</label>
                <input type="tel" value={selectedVendor.phone || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, phone: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business Email</label>
                <input type="email" value={selectedVendor.email || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, email: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Business Website</label>
                <input type="url" value={selectedVendor.website || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, website: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} placeholder="https://..." />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Internal Notes</label>
                <textarea value={selectedVendor.notes || ''} onChange={(e) => setSelectedVendor({ ...selectedVendor, notes: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', minHeight: '100px' }} />
              </div>

            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--neutral-gray)', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsPanelOpen(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => updateVendor(selectedVendor)}>Save Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}
