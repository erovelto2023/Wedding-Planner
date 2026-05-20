'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ExpensesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: '',
    category: 'general',
    clientName: ''
  });

  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        setLeads(data);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      }
    }
    if (status === 'authenticated') {
      fetchLeads();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchExpenses() {
        try {
          const res = await fetch('/api/expenses');
          const data = await res.json();
          setExpenses(data);
        } catch (error) {
          console.error('Failed to fetch expenses:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchExpenses();
    }
  }, [status]);

  async function createExpense() {
    if (!newExpense.description || !newExpense.amount) return;
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount)
        })
      });
      const data = await res.json();
      setExpenses([...expenses, data]);
      setNewExpense({ description: '', amount: '', date: '', category: 'general', clientName: '' });
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  }

  const formatCurrency = (amount: number) => {
    return '$' + amount.toLocaleString();
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <div className="container" style={{ padding: '2rem' }}>Loading expenses...</div>;
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)' }}>Expenses</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your business expenses.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/business" className="btn btn-secondary">← Back to Dashboard</Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '2rem' }}>

        {/* Expenses List */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>All Expenses</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {expenses.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Description</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Client</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Date</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp: any) => (
                    <tr key={exp._id} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{exp.description}</td>
                      <td style={{ padding: '0.75rem' }}>{exp.clientName || 'N/A'}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: 'var(--radius-sm)', 
                          fontSize: '0.75rem', 
                          fontWeight: 'bold',
                          background: 'var(--neutral-gray)',
                          color: 'var(--text-primary)'
                        }}>
                          {exp.category.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{exp.date}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#D32F2F' }}>{formatCurrency(exp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No expenses found.</p>
            )}
          </div>
        </div>

        {/* Create Expense Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Create Expense</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Description</label>
              <input 
                type="text" 
                value={newExpense.description} 
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })} 
                placeholder="Office supplies, travel, etc." 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Amount ($)</label>
              <input 
                type="number" 
                value={newExpense.amount} 
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} 
                placeholder="0.00" 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Date</label>
              <input 
                type="date" 
                value={newExpense.date} 
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Client (Tagging)</label>
              <select 
                value={newExpense.clientName} 
                onChange={(e) => setNewExpense({ ...newExpense, clientName: e.target.value })} 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }}
              >
                <option value="">No Client (General)</option>
                {leads.filter((l: any) => l.status === 'Client').map((lead: any) => (
                  <option key={lead._id} value={lead.name}>{lead.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Category</label>
              <select 
                value={newExpense.category} 
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }}
              >
                <option value="General">General</option>
                <option value="Rings">Rings</option>
                <option value="Pre-Wedding">Pre-Wedding</option>
                <option value="Planners">Planners</option>
                <option value="Venue">Venue</option>
                <option value="Ceremony">Ceremony</option>
                <option value="Attire">Attire</option>
                <option value="Beauty">Beauty</option>
                <option value="Catering">Catering</option>
                <option value="Rentals">Rentals</option>
                <option value="Decor">Decor</option>
                <option value="Florals">Florals</option>
                <option value="Photo/Video">Photo/Video</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transport">Transport</option>
                <option value="Stationery">Stationery</option>
                <option value="Gifts">Gifts</option>
                <option value="Events">Events</option>
                <option value="Travel">Travel</option>
                <option value="Supplies">Supplies</option>
                <option value="Marketing">Marketing</option>
                <option value="Misc">Misc</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} onClick={createExpense}>Create Expense</button>
          </div>
        </div>
      </div>
    </div>
  );
}
