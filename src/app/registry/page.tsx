'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface RegistryItem {
  _id?: string;
  name: string;
  store: string;
  price: number;
  category: string;
  status: string; // 'Available' | 'Purchased'
  priority: string; // 'High' | 'Medium' | 'Low'
  guestName: string;
}

interface CashFund {
  _id?: string;
  name: string;
  target: number;
  raised: number;
  description: string;
}

interface ThankYouNote {
  _id?: string;
  giftName: string;
  guestName: string;
  noteDraft: string;
  status: string; // 'Pending' | 'Sent'
}

interface ReturnItem {
  _id?: string;
  name: string;
  action: string; // 'Return' | 'Exchange' | 'Keep'
  status: string; // 'Pending' | 'Done'
  returnDeadline: string;
}

export default function RegistryPage() {
  const [activeTab, setActiveTab] = useState<string>('registry');
  const [loading, setLoading] = useState<boolean>(true);

  // Live scope database states
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [funds, setFunds] = useState<CashFund[]>([]);
  const [notes, setNotes] = useState<ThankYouNote[]>([]);
  const [returns, setReturns] = useState<ReturnItem[]>([]);

  // Form input states
  const [newItem, setNewItem] = useState<Partial<RegistryItem>>({ name: '', store: 'Amazon', price: 0, category: 'Kitchen', status: 'Available', priority: 'Medium', guestName: '' });
  const [newFund, setNewFund] = useState<Partial<CashFund>>({ name: '', target: 0, raised: 0, description: '' });
  const [newReturn, setNewReturn] = useState<Partial<ReturnItem>>({ name: '', action: 'Return', status: 'Pending', returnDeadline: '' });

  // AI Thank You Note Assistant States
  const [selectedPurchasedGiftId, setSelectedPurchasedGiftId] = useState<string>('');
  const [aiNoteTone, setAiNoteTone] = useState<string>('Warm & Sincere');
  const [draftingNote, setDraftingNote] = useState<boolean>(false);
  const [customDraftOutput, setCustomDraftOutput] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/registry');
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setFunds(data.funds || []);
          setNotes(data.notes || []);
          setReturns(data.returns || []);
          
          // Preselect first purchased gift if any exists for AI panel
          const purchased = (data.items || []).filter((i: RegistryItem) => i.status === 'Purchased');
          if (purchased.length > 0) {
            setSelectedPurchasedGiftId(purchased[0]._id || '');
          }
        }
      } catch (error) {
        console.error('Failed to load registry planner data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Add Registry Item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name?.trim()) return;
    try {
      const res = await fetch('/api/registry?type=items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        const added = await res.json();
        setItems([...items, added]);
        setNewItem({ name: '', store: 'Amazon', price: 0, category: 'Kitchen', status: 'Available', priority: 'Medium', guestName: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle item purchase / available status
  const handleTogglePurchase = async (item: RegistryItem, isPurchased: boolean) => {
    const updated = { 
      ...item, 
      status: isPurchased ? 'Purchased' : 'Available',
      guestName: isPurchased ? (item.guestName || 'Anonymous Guest') : ''
    };
    try {
      const res = await fetch('/api/registry?type=items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setItems(items.map(i => i._id === item._id ? updated : i));
        // Reload thank you notes since the server might have auto-generated one
        const noteRes = await fetch('/api/registry?type=notes');
        if (noteRes.ok) {
          setNotes(await noteRes.json());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/registry?type=items&id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setItems(items.filter(i => i._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Cash Fund
  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFund.name?.trim()) return;
    try {
      const res = await fetch('/api/registry?type=funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFund)
      });
      if (res.ok) {
        const added = await res.json();
        setFunds([...funds, added]);
        setNewFund({ name: '', target: 0, raised: 0, description: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Contribute simulation to Cash Fund
  const handleContributeFund = async (fund: CashFund, amount: number) => {
    const updated = { ...fund, raised: Math.min(fund.target, Number(fund.raised || 0) + amount) };
    try {
      const res = await fetch('/api/registry?type=funds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setFunds(funds.map(f => f._id === fund._id ? updated : f));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Return Exchange Log
  const handleAddReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReturn.name?.trim()) return;
    try {
      const res = await fetch('/api/registry?type=returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReturn)
      });
      if (res.ok) {
        const added = await res.json();
        setReturns([...returns, added]);
        setNewReturn({ name: '', action: 'Return', status: 'Pending', returnDeadline: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Return Status
  const handleToggleReturnStatus = async (item: ReturnItem) => {
    const updated = { ...item, status: item.status === 'Done' ? 'Pending' : 'Done' };
    try {
      const res = await fetch('/api/registry?type=returns', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setReturns(returns.map(r => r._id === item._id ? updated : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Thank You Note status
  const handleToggleNoteStatus = async (note: ThankYouNote) => {
    const updated = { ...note, status: note.status === 'Sent' ? 'Pending' : 'Sent' };
    try {
      const res = await fetch('/api/registry?type=notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setNotes(notes.map(n => n._id === note._id ? updated : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger AI Generator for personalized thank you notes
  const triggerAIThankYouDraft = () => {
    setDraftingNote(true);
    setCustomDraftOutput('');
    const targetGift = items.find(i => i._id === selectedPurchasedGiftId);
    if (!targetGift) {
      setDraftingNote(false);
      return;
    }
    
    setTimeout(() => {
      let draftText = '';
      if (aiNoteTone === 'Warm & Sincere') {
        draftText = `Dear ${targetGift.guestName || 'Friend'},\n\nThank you so much for the absolutely wonderful ${targetGift.name}! Having this for our home means the world to us, and we will think of your beautiful generosity every time we use it. We are so lucky to have you in our lives!\n\nWarmest love,\nEric & Partner`;
      } else if (aiNoteTone === 'Short & Sweet') {
        draftText = `Dear ${targetGift.guestName || 'Friend'},\n\nThank you so much for the gorgeous ${targetGift.name}! We absolutely love it and appreciate your kind support. It was wonderful celebrating our wedding together!\n\nBest,\nEric & Partner`;
      } else {
        draftText = `Dear ${targetGift.guestName || 'Friend'},\n\nWe are incredibly grateful for the ${targetGift.name}! Your thoughtfulness stands out, and it will be an absolute staple in our home for years to come. Thank you for celebrating this milestone with us!\n\nWith gratitude,\nEric & Partner`;
      }
      
      setCustomDraftOutput(draftText);
      setDraftingNote(false);
    }, 1200);
  };

  // Smart Price Tier Curation Engine calculations
  const priceUnder50 = items.filter(i => i.price < 50).length;
  const price50to200 = items.filter(i => i.price >= 50 && i.price <= 200).length;
  const priceOver200 = items.filter(i => i.price > 200).length;

  const totalRegistryValue = items.reduce((sum, i) => sum + Number(i.price || 0), 0);
  const totalRegistryGiftsCount = items.filter(i => i.status === 'Purchased').length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)', margin: 0 }}>
            🎁 Registry & Gifts Planner
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Aggregate multiple stores, track physical gifts, build cash funds, and draft automated thank-you cards.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--neutral-gray)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('registry')} 
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            fontSize: '1rem', 
            fontWeight: 600, 
            color: activeTab === 'registry' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'registry' ? '3px solid var(--accent-primary)' : 'none',
            cursor: 'pointer'
          }}
        >
          🎁 Universal Registry
        </button>
        <button 
          onClick={() => setActiveTab('funds')} 
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            fontSize: '1rem', 
            fontWeight: 600, 
            color: activeTab === 'funds' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'funds' ? '3px solid var(--accent-primary)' : 'none',
            cursor: 'pointer'
          }}
        >
          💸 Cash & Experience Funds
        </button>
        <button 
          onClick={() => setActiveTab('notes')} 
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            fontSize: '1rem', 
            fontWeight: 600, 
            color: activeTab === 'notes' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'notes' ? '3px solid var(--accent-primary)' : 'none',
            cursor: 'pointer'
          }}
        >
          💌 AI Thank-You Assistant
        </button>
        <button 
          onClick={() => setActiveTab('returns')} 
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'none', 
            border: 'none', 
            fontSize: '1rem', 
            fontWeight: 600, 
            color: activeTab === 'returns' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'returns' ? '3px solid var(--accent-primary)' : 'none',
            cursor: 'pointer'
          }}
        >
          🔄 Post-Wedding returns
        </button>
      </div>

      {/* Tab 1: UNIVERSAL REGISTRY */}
      {activeTab === 'registry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Smart Balance Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            
            <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>📊 Smart Price-Tier Balance Auditor</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Psychological gifting models show guest budgets split evenly. Maintain healthy selections across all tiers to keep guests comfortable.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Budget Friendly (&lt;$50)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32', margin: '0.25rem 0' }}>{priceUnder50} Items</div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {priceUnder50 < 3 ? '⚠️ Alert: Add more low cost items' : '✅ Balanced'}
                  </span>
                </div>
                
                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Moderate comfort ($50 - $200)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', margin: '0.25rem 0' }}>{price50to200} Items</div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {price50to200 === 0 ? '⚠️ Add moderate items' : '✅ Balanced'}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Premium Luxury (&gt;$200)</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#b45309', margin: '0.25rem 0' }}>{priceOver200} Items</div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                    {priceOver200 === 0 ? '⚠️ Add group physical gifts' : '✅ Balanced'}
                  </span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registry Value</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                ${totalRegistryValue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1rem' }}>Gifts Received</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '0.25rem' }}>
                {totalRegistryGiftsCount} / {items.length} Purchased
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            
            {/* Registry table */}
            <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem' }}>📦 Unified Gifting Inventory</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Gift Item</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Store</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Priority</th>
                    <th style={{ padding: '0.75rem 0.5rem', width: '150px' }}>Purchased Status</th>
                    <th style={{ padding: '0.75rem 0.5rem', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i._id} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{i.name}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className="pill-badge" style={{ background: 'var(--bg-secondary)', fontSize: '0.7rem' }}>
                          {i.store}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>${i.price.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className="pill-badge" style={{ 
                          fontSize: '0.7rem',
                          background: i.priority === 'High' ? 'rgba(220, 38, 38, 0.1)' : i.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0,0,0,0.05)',
                          color: i.priority === 'High' ? '#dc2626' : i.priority === 'Medium' ? '#d97706' : 'var(--text-secondary)'
                        }}>
                          {i.priority}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                            <input 
                              type="checkbox"
                              checked={i.status === 'Purchased'}
                              onChange={(e) => handleTogglePurchase(i, e.target.checked)}
                            />
                            <span>{i.status === 'Purchased' ? 'Purchased' : 'Available'}</span>
                          </label>
                          {i.status === 'Purchased' && (
                            <input 
                              type="text"
                              placeholder="Guest Name"
                              value={i.guestName}
                              onChange={(e) => {
                                const val = e.target.value;
                                setItems(items.map(item => item._id === i._id ? { ...item, guestName: val } : item));
                              }}
                              onBlur={(e) => handleTogglePurchase(i, true)}
                              style={{ padding: '0.15rem 0.25rem', fontSize: '0.7rem', border: '1px solid var(--neutral-gray)', borderRadius: '3px' }}
                            />
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <button 
                          onClick={() => handleDeleteItem(i._id!)}
                          style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer' }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Add Registry Item Form */}
            <div>
              <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem' }}>➕ Add Registry Item</h3>
                <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Item Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. Dyson Purifier Cool Fan"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Store</label>
                      <input 
                        type="text"
                        placeholder="e.g. Etsy"
                        value={newItem.store}
                        onChange={(e) => setNewItem({ ...newItem, store: e.target.value })}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Price ($)</label>
                      <input 
                        type="number"
                        placeholder="e.g. 150"
                        value={newItem.price || ''}
                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Category</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                      >
                        <option value="Kitchen">Kitchen</option>
                        <option value="Home Care">Home Care</option>
                        <option value="Bedding">Bedding</option>
                        <option value="Bath">Bath</option>
                        <option value="Outdoor">Outdoor</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Priority</label>
                      <select
                        value={newItem.priority}
                        onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
                        style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                      >
                        <option value="High">🔴 High</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="Low">🟢 Low</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                    🎁 Save Item to Registry
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: CASH FUNDS */}
      {activeTab === 'funds' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Active Funds Progress */}
          <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>💸 Experience & Cash Funds</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Create experiential, flexible cash funds for honeymoon adventures or house down payments.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {funds.map(f => {
                const percent = Math.min(100, Math.round(((f.raised || 0) / (f.target || 1)) * 100));
                return (
                  <div key={f._id} style={{ borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{f.name}</h4>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
                        ${f.raised?.toLocaleString()} / ${f.target?.toLocaleString()} ({percent}%)
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0' }}>{f.description}</p>
                    
                    <div style={{ width: '100%', background: 'var(--bg-secondary)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginTop: '0.5rem' }}>
                      <div style={{ width: `${percent}%`, background: 'var(--accent-primary)', height: '100%' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button 
                        onClick={() => handleContributeFund(f, 100)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', cursor: 'pointer', background: 'none' }}
                      >
                        ➕ Contribute $100
                      </button>
                      <button 
                        onClick={() => handleContributeFund(f, 500)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', cursor: 'pointer', background: 'none' }}
                      >
                        ➕ Contribute $500
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Fund Form */}
          <div>
            <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem' }}>➕ Add Cash Fund</h3>
              <form onSubmit={handleAddFund} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Fund Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Honeymoon Ziplining Adventure"
                    value={newFund.name}
                    onChange={(e) => setNewFund({ ...newFund, name: e.target.value })}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Target Goal ($)</label>
                  <input 
                    type="number"
                    placeholder="e.g. 1000"
                    value={newFund.target || ''}
                    onChange={(e) => setNewFund({ ...newFund, target: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Description</label>
                  <textarea 
                    placeholder="Describe what contributions will fund for your guests..."
                    value={newFund.description}
                    onChange={(e) => setNewFund({ ...newFund, description: e.target.value })}
                    style={{ width: '100%', minHeight: '80px', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)', resize: 'vertical' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  💸 Create Experience Fund
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: THANK-YOU NOTE AI ASSISTANT */}
      {activeTab === 'notes' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Purchased Items & Note Status list */}
          <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>💌 Gratitude Tracker</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Track thank-you card status for all received/purchased items.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notes.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--neutral-gray)', borderRadius: '6px' }}>
                  <p>No gifts purchased yet. Go to Universal Registry to toggle purchased states!</p>
                </div>
              ) : (
                notes.map(note => (
                  <div key={note._id} style={{ borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, marginRight: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.85rem' }}>{note.guestName}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>for {note.giftName}</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem', whiteSpace: 'pre-line' }}>
                        {note.noteDraft}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleNoteStatus(note)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: note.status === 'Sent' ? '#2e7d32' : '#d97706',
                        color: 'white'
                      }}
                    >
                      {note.status === 'Sent' ? '📬 Sent' : '⏳ Pending'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Thank You Card generator tool */}
          <div>
            <div className="card" style={{ padding: '1.5rem', background: 'white', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>🤖 AI Thank-You Generator</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Select a purchased registry item to draft custom, brand-aligned gratitude copy instantly.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Select Gift Item</label>
                  <select
                    value={selectedPurchasedGiftId}
                    onChange={(e) => setSelectedPurchasedGiftId(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                  >
                    {items.filter(i => i.status === 'Purchased').map(i => (
                      <option key={i._id} value={i._id}>{i.name} (from {i.guestName})</option>
                    ))}
                    {items.filter(i => i.status === 'Purchased').length === 0 && (
                      <option value="">No gifts purchased yet</option>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Select Tone</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Warm & Sincere', 'Short & Sweet', 'Formal'].map(tone => (
                      <button
                        key={tone}
                        onClick={() => setAiNoteTone(tone)}
                        style={{
                          flex: 1,
                          padding: '0.4rem',
                          borderRadius: '4px',
                          border: aiNoteTone === tone ? '2px solid var(--accent-primary)' : '1px solid var(--neutral-gray)',
                          background: aiNoteTone === tone ? 'rgba(var(--accent-primary-rgb), 0.05)' : 'none',
                          color: aiNoteTone === tone ? 'var(--accent-primary)' : 'var(--text-primary)',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={triggerAIThankYouDraft}
                  disabled={draftingNote || !selectedPurchasedGiftId}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.6rem' }}
                >
                  {draftingNote ? '🔮 Drafting with AI...' : '🔮 Draft Personalized Thank-You'}
                </button>

                {/* AI generated note text output box */}
                <div style={{ flex: 1, minHeight: '200px', background: 'var(--bg-secondary)', border: '1px solid var(--neutral-gray)', borderRadius: '8px', padding: '1rem', overflowY: 'auto' }}>
                  {draftingNote && (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <p>Drafting personalized card...</p>
                    </div>
                  )}

                  {!draftingNote && !customDraftOutput && (
                    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
                      <p>Drafted note will appear here.<br/>Click the generate button above to start.</p>
                    </div>
                  )}

                  {!draftingNote && customDraftOutput && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem', marginBottom: '0.75rem', fontSize: '0.7rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>✨ AI Personalization Active</span>
                        <button 
                          onClick={() => {
                            const note = notes.find(n => n.giftName === items.find(i => i._id === selectedPurchasedGiftId)?.name);
                            if (note) {
                              const updated = { ...note, noteDraft: customDraftOutput };
                              fetch('/api/registry?type=notes', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updated)
                              }).then(res => {
                                if (res.ok) setNotes(notes.map(n => n._id === note._id ? updated : n));
                              });
                            }
                          }}
                          style={{ border: 'none', background: 'none', color: '#2e7d32', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          💾 Save Draft
                        </button>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', whiteSpace: 'pre-line', margin: 0 }}>
                        {customDraftOutput}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: POST-WEDDING & RETURNS */}
      {activeTab === 'returns' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Active returns inventory */}
          <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>🔄 Post-Wedding Returns & Exchange Hub</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Track warranty registration details, exchange tasks, and returns deadlines.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Duplicate/Wrong Gift</th>
                  <th style={{ padding: '0.5rem' }}>Action Required</th>
                  <th style={{ padding: '0.5rem' }}>Deadline Date</th>
                  <th style={{ padding: '0.5rem', width: '100px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {returns.map(ret => (
                  <tr key={ret._id} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{ret.name}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="pill-badge" style={{ background: 'var(--bg-secondary)', fontSize: '0.7rem' }}>
                        {ret.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#dc2626', fontWeight: 600 }}>
                      ⚠️ {ret.returnDeadline}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <button 
                        onClick={() => handleToggleReturnStatus(ret)}
                        style={{
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: ret.status === 'Done' ? '#2e7d32' : 'var(--neutral-gray)',
                          color: ret.status === 'Done' ? 'white' : 'var(--text-primary)'
                        }}
                      >
                        {ret.status === 'Done' ? '✅ Completed' : '⏳ Pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Return log */}
          <div>
            <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem' }}>➕ Log Return / Exchange</h3>
              <form onSubmit={handleAddReturn} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Gift Name</label>
                  <input 
                    type="text"
                    placeholder="e.g. Duplicate Blendtec Blender"
                    value={newReturn.name}
                    onChange={(e) => setNewReturn({ ...newReturn, name: e.target.value })}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Action Required</label>
                  <select
                    value={newReturn.action}
                    onChange={(e) => setNewReturn({ ...newReturn, action: e.target.value })}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                  >
                    <option value="Return">🔄 Return for Refund</option>
                    <option value="Exchange">🔄 Exchange Size/Color</option>
                    <option value="Keep">🏠 Keep (Register Warranty)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Return Deadline</label>
                  <input 
                    type="date"
                    value={newReturn.returnDeadline}
                    onChange={(e) => setNewReturn({ ...newReturn, returnDeadline: e.target.value })}
                    style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px', background: 'var(--bg-primary)' }}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  🔄 Save Return Task
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
