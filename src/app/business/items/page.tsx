'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ItemsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newItem, setNewItem] = useState({
    description: '',
    price: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchItems() {
        try {
          const res = await fetch('/api/items');
          const data = await res.json();
          setItems(data);
        } catch (error) {
          console.error('Failed to fetch items:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchItems();
    }
  }, [status]);

  async function createItem() {
    if (!newItem.description || !newItem.price) return;
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newItem.description,
          price: parseFloat(newItem.price)
        })
      });
      const data = await res.json();
      setItems([...items, data]);
      setNewItem({ description: '', price: '' });
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  }

  const formatCurrency = (amount: number) => {
    return '$' + amount.toLocaleString();
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <div className="container" style={{ padding: '2rem' }}>Loading services...</div>;
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)' }}>Services / Invoice Items</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Save services and items to reuse on invoices and proposals.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/business" className="btn btn-secondary">← Back to Dashboard</Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '2rem' }}>

        {/* Items List */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Saved Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Description</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Default Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item._id} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{item.description}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{formatCurrency(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No items saved yet.</p>
            )}
          </div>
        </div>

        {/* Create Item Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Add Item</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Description</label>
              <input 
                type="text" 
                value={newItem.description} 
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} 
                placeholder="Item or service name..." 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Default Price ($)</label>
              <input 
                type="number" 
                value={newItem.price} 
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} 
                placeholder="0.00" 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} 
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={createItem}>Save Item</button>
          </div>
        </div>
      </div>
    </div>
  );
}
