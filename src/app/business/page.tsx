'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BusinessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    amount: '',
    status: 'pending',
    date: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchData() {
        try {
          const [invoicesRes, expensesRes] = await Promise.all([
            fetch('/api/invoices'),
            fetch('/api/expenses')
          ]);
          const invoicesData = await invoicesRes.json();
          const expensesData = await expensesRes.json();
          setInvoices(invoicesData);
          setExpenses(expensesData);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [status]);

  async function createInvoice() {
    if (!newInvoice.clientName || !newInvoice.amount) return;
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newInvoice,
          amount: parseFloat(newInvoice.amount)
        })
      });
      const data = await res.json();
      setInvoices([...invoices, data]);
      setNewInvoice({ clientName: '', amount: '', status: 'pending', date: '' });
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  }

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <div className="container" style={{ padding: '2rem' }}>Loading business dashboard...</div>;
  }

  // Calculate generic stats
  const totalRevenue = invoices
    .filter((inv: any) => inv.status === 'paid')
    .reduce((sum: number, inv: any) => sum + inv.amount, 0);

  const pendingRevenue = invoices
    .filter((inv: any) => inv.status === 'pending')
    .reduce((sum: number, inv: any) => sum + inv.amount, 0);

  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Recent activity
  const recentActivity = invoices.slice(0, 5).map((inv: any) => ({
    id: inv._id,
    type: 'invoice',
    description: `Invoice for ${inv.clientName}`,
    amount: inv.amount,
    date: inv.date,
    status: inv.status
  }));

  const formatCurrency = (amount: number) => {
    return '$' + amount.toLocaleString();
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)' }}>Accounting Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Overview of your business finances.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/" className="btn btn-secondary">← Back to Dashboard</Link>
          <button onClick={() => {}} className="btn btn-primary">➕ New Invoice</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        {/* Total Revenue */}
        <div className="card" style={{ background: 'linear-gradient(135deg, white, #E8F5E9)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>TOTAL REVENUE</p>
            <span style={{ fontSize: '1.2rem' }}>💲</span>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--success)' }}>{formatCurrency(totalRevenue)}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Collected this year</p>
        </div>

        {/* Expenses */}
        <div className="card" style={{ background: 'linear-gradient(135deg, white, #FFEBEE)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>EXPENSES</p>
            <span style={{ fontSize: '1.2rem' }}>💳</span>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#D32F2F' }}>{formatCurrency(totalExpenses)}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total expenses</p>
        </div>

        {/* Net Income */}
        <div className="card" style={{ background: 'linear-gradient(135deg, white, #E3F2FD)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>NET INCOME</p>
            <span style={{ fontSize: '1.2rem' }}>📈</span>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: netIncome >= 0 ? 'var(--success)' : '#D32F2F' }}>{formatCurrency(netIncome)}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Revenue minus expenses</p>
        </div>

        {/* Pending Invoices */}
        <div className="card" style={{ background: 'linear-gradient(135deg, white, #FFFDE7)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>PENDING INVOICES</p>
            <span style={{ fontSize: '1.2rem' }}>📄</span>
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{formatCurrency(pendingRevenue)}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Unpaid invoices</p>
        </div>

      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '2rem' }}>

        {/* Recent Activity */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.length > 0 ? (
              recentActivity.map((item: any) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: item.status === 'paid' ? '#E8F5E9' : '#FFFDE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>📄</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.description}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.date}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: item.status === 'paid' ? 'var(--success)' : 'var(--accent-primary)' }}>
                      {item.status === 'paid' ? '+' : ''}{formatCurrency(item.amount)}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.status.toUpperCase()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No recent activity found.</p>
            )}
          </div>
        </div>

        {/* Quick Links / Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Quick Access</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Link href="/business/invoices" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📄</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Invoices</span>
              </Link>
              <Link href="/business/expenses" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💳</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Expenses</span>
              </Link>
              <Link href="/business/clients" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Clients</span>
              </Link>
              <Link href="/business/items" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-primary)' }}>
                <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛠️</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Services</span>
              </Link>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-hover))', color: 'white' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'white' }}>Pro Tip</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
              Connect your business bank account to automatically import transactions and save time on data entry.
            </p>
            <button className="btn" style={{ width: '100%', background: 'white', color: 'var(--accent-primary)' }}>Coming Soon</button>
          </div>

        </div>
      </div>
      
      {/* Create Invoice Form */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Create Invoice</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Client Name</label>
            <input 
              type="text" 
              value={newInvoice.clientName} 
              onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })} 
              placeholder="Client name..." 
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Amount ($)</label>
            <input 
              type="number" 
              value={newInvoice.amount} 
              onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} 
              placeholder="0.00" 
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} 
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Date</label>
            <input 
              type="date" 
              value={newInvoice.date} 
              onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })} 
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} 
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={createInvoice}>Create Invoice</button>
          </div>
        </div>
      </div>

    </div>
  );
}
