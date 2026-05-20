'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InvoicesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    amount: '',
    status: 'pending',
    date: '',
    milestone: ''
  });

  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [selectedSavedItemId, setSelectedSavedItemId] = useState('');
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [invoicePayments, setInvoicePayments] = useState<any[]>([]);
  const [newPaymentAmount, setNewPaymentAmount] = useState('');
  const [newPaymentNote, setNewPaymentNote] = useState('');

  const editInvoice = (inv: any) => {
    setEditingInvoiceId(inv._id);
    setNewInvoice({
      clientName: inv.clientName,
      amount: inv.amount.toString(),
      status: inv.status,
      date: inv.date,
      milestone: inv.milestone || ''
    });
    setInvoiceItems(inv.items || []);
    setInvoicePayments(inv.payments || []);
  };
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
    async function fetchSavedItems() {
      try {
        const res = await fetch('/api/items');
        const data = await res.json();
        setSavedItems(data);
      } catch (error) {
        console.error('Failed to fetch saved items:', error);
      }
    }
    if (status === 'authenticated') {
      fetchSavedItems();
    }
  }, [status]);

  const handleAddSavedItem = () => {
    const item = savedItems.find(i => i._id === selectedSavedItemId);
    if (item) {
      setInvoiceItems([...invoiceItems, { description: item.description, quantity: 1, price: item.price }]);
      setSelectedSavedItemId('');
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setInvoiceItems(updatedItems);
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculatePaid = () => {
    return invoicePayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  };

  const calculateBalance = () => {
    return calculateTotal() - calculatePaid();
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchInvoices() {
        try {
          const res = await fetch('/api/invoices');
          const data = await res.json();
          setInvoices(data);
        } catch (error) {
          console.error('Failed to fetch invoices:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchInvoices();
    }
  }, [status]);

  async function createInvoice() {
    if (!newInvoice.clientName || invoiceItems.length === 0) return;
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: newInvoice.clientName,
          amount: calculateTotal(),
          status: newInvoice.status,
          date: newInvoice.date || new Date().toISOString().split('T')[0],
          items: invoiceItems,
          milestone: newInvoice.milestone
        })
      });
      const data = await res.json();
      setInvoices([...invoices, data]);
      setNewInvoice({ clientName: '', amount: '', status: 'pending', date: '', milestone: '' });
      setInvoiceItems([]);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  }

  async function updateInvoice() {
    if (!editingInvoiceId || !newInvoice.clientName || invoiceItems.length === 0) return;
    try {
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingInvoiceId,
          clientName: newInvoice.clientName,
          amount: calculateTotal(),
          status: newInvoice.status,
          date: newInvoice.date || new Date().toISOString().split('T')[0],
          items: invoiceItems,
          payments: invoicePayments,
          milestone: newInvoice.milestone
        })
      });
      if (res.ok) {
        setInvoices(invoices.map(inv => inv._id === editingInvoiceId ? { ...inv, clientName: newInvoice.clientName, amount: calculateTotal(), status: newInvoice.status, date: newInvoice.date, items: invoiceItems, payments: invoicePayments, milestone: newInvoice.milestone } : inv));
        setEditingInvoiceId(null);
        setNewInvoice({ clientName: '', amount: '', status: 'pending', date: '', milestone: '' });
        setInvoiceItems([]);
        setInvoicePayments([]);
      } else {
        alert('Failed to update invoice');
      }
    } catch (error) {
      console.error('Failed to update invoice:', error);
    }
  }

  async function updateInvoiceStatus(id: string, newStatus: string) {
    try {
      const res = await fetch('/api/invoices', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setInvoices(invoices.map(inv => inv._id === id ? { ...inv, status: newStatus } : inv));
      } else {
        alert('Failed to update invoice status');
      }
    } catch (error) {
      console.error('Failed to update invoice status:', error);
    }
  }

  const formatCurrency = (amount: number) => {
    return '$' + amount.toLocaleString();
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <div className="container" style={{ padding: '2rem' }}>Loading invoices...</div>;
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            overflow: visible;
            background: white;
            padding: 2rem;
            border-radius: 0;
            box-shadow: none;
          }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)' }}>Invoices</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your client invoices.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/business" className="btn btn-secondary">← Back to Dashboard</Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '2rem' }}>

        {/* Invoices List */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>All Invoices</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {invoices.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Client</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Date</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Total</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Paid</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Balance</th>
                    <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: any) => {
                    const paid = (inv.payments || []).reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
                    const balance = inv.amount - paid;
                    return (
                      <tr key={inv._id} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                        <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{inv.clientName}</td>
                        <td style={{ padding: '0.75rem' }}>{inv.date}</td>
                        <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{formatCurrency(inv.amount)}</td>
                        <td style={{ padding: '0.75rem', color: 'var(--success)' }}>{formatCurrency(paid)}</td>
                        <td style={{ padding: '0.75rem', color: balance > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>{formatCurrency(balance)}</td>
                        <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select
                          value={inv.status}
                          onChange={(e) => updateInvoiceStatus(inv._id, e.target.value)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            background: inv.status === 'paid' ? '#E8F5E9' : '#FFFDE7',
                            color: inv.status === 'paid' ? 'var(--success)' : 'var(--accent-primary)',
                            border: '1px solid var(--neutral-gray)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">PENDING</option>
                          <option value="paid">PAID</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                        <button 
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setShowViewModal(true);
                          }}
                        >
                          View
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => editInvoice(inv)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No invoices found.</p>
            )}
          </div>
        </div>

        {/* Create Invoice Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>{editingInvoiceId ? 'Edit Invoice' : 'Create Invoice'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Client Name</label>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => setShowLeadsModal(true)}
                >
                  From Leads
                </button>
              </div>
              <input 
                type="text" 
                value={newInvoice.clientName} 
                onChange={(e) => setNewInvoice({ ...newInvoice, clientName: e.target.value })} 
                placeholder="Client name..." 
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
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Status</label>
              <select 
                value={newInvoice.status} 
                onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value })} 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Milestone</label>
              <select 
                value={newInvoice.milestone} 
                onChange={(e) => setNewInvoice({ ...newInvoice, milestone: e.target.value })} 
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }}
              >
                <option value="">Full Payment / None</option>
                <option value="deposit">Deposit</option>
                <option value="50_percent">50% Payment</option>
                <option value="final_balance">Final Balance</option>
              </select>
            </div>

            {/* Items Section */}
            <div style={{ borderTop: '1px solid var(--neutral-gray)', paddingTop: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Items</label>
              
              {/* Add Saved Item */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '1rem' }}>
                <select 
                  value={selectedSavedItemId} 
                  onChange={(e) => setSelectedSavedItemId(e.target.value)} 
                  style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }}
                >
                  <option value="">Select a saved item...</option>
                  {savedItems.map(item => (
                    <option key={item._id} value={item._id}>{item.description} (${item.price})</option>
                  ))}
                </select>
                <button className="btn btn-secondary" onClick={handleAddSavedItem}>Add</button>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {invoiceItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', flex: 2 }}>{item.description}</span>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} 
                      style={{ width: '50px', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }} 
                    />
                    <span style={{ fontSize: '0.85rem' }}>x</span>
                    <span style={{ fontSize: '0.85rem' }}>${item.price}</span>
                  </div>
                ))}
              </div>

              {invoiceItems.length > 0 && (
                <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                  Total: ${calculateTotal().toFixed(2)}
                </div>
              )}
            </div>

            {/* Payments Section (Only when editing) */}
            {editingInvoiceId && (
              <div style={{ borderTop: '1px solid var(--neutral-gray)', paddingTop: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Payments</label>
                
                {/* Add Payment */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="number" 
                      value={newPaymentAmount} 
                      onChange={(e) => setNewPaymentAmount(e.target.value)} 
                      placeholder="Amount..." 
                      style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }} 
                    />
                    <input 
                      type="text" 
                      value={newPaymentNote} 
                      onChange={(e) => setNewPaymentNote(e.target.value)} 
                      placeholder="Note (e.g. Check #123)..." 
                      style={{ flex: 2, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }} 
                    />
                  </div>
                  <button 
                    className="btn btn-secondary" 
                    style={{ width: '100%' }}
                    onClick={() => {
                      const amount = parseFloat(newPaymentAmount);
                      if (amount > 0) {
                        setInvoicePayments([...invoicePayments, { amount, date: new Date().toISOString().split('T')[0], note: newPaymentNote }]);
                        setNewPaymentAmount('');
                        setNewPaymentNote('');
                      }
                    }}
                  >
                    Apply Payment
                  </button>
                </div>

                {/* Payments List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {invoicePayments.map((p, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                      <div>
                        <span>{p.date}</span>
                        {p.note && <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({p.note})</span>}
                      </div>
                      <span style={{ fontWeight: 'bold' }}>${p.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', textAlign: 'right', fontSize: '0.85rem' }}>
                  <p>Paid: <span style={{ fontWeight: 'bold' }}>${calculatePaid().toFixed(2)}</span></p>
                  <p>Balance Due: <span style={{ fontWeight: 'bold', color: 'var(--danger)' }}>${calculateBalance().toFixed(2)}</span></p>
                </div>
              </div>
            )}

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem' }} 
              onClick={editingInvoiceId ? updateInvoice : createInvoice}
            >
              {editingInvoiceId ? 'Update Invoice' : 'Create Invoice'}
            </button>
            {editingInvoiceId && (
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', marginTop: '0.5rem' }} 
                onClick={() => {
                  setEditingInvoiceId(null);
                  setNewInvoice({ clientName: '', amount: '', status: 'pending', date: '', milestone: '' });
                  setInvoiceItems([]);
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Leads Modal */}
      {showLeadsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxHeight: '80vh', overflowY: 'auto', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>Select Lead</h3>
              <button className="btn btn-secondary" onClick={() => setShowLeadsModal(false)}>Close</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leads.length > 0 ? (
                leads.map((lead: any) => (
                  <div key={lead._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>{lead.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lead.status}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {lead.status !== 'Client' && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          onClick={async () => {
                            // Update lead status
                            const res = await fetch('/api/leads', {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ id: lead._id, status: 'Client' })
                            });
                            if (res.ok) {
                              setLeads(leads.map(l => l._id === lead._id ? { ...l, status: 'Client' } : l));
                            }
                          }}
                        >
                          Mark as Client
                        </button>
                      )}
                      <button 
                        className="btn btn-primary" 
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        onClick={() => {
                          setNewInvoice({ ...newInvoice, clientName: lead.name });
                          setShowLeadsModal(false);
                        }}
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No leads found.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div id="printable-invoice" className="card" style={{ width: '600px', maxHeight: '80vh', overflowY: 'auto', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)' }}>Invoice Details</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => window.print()}>Print</button>
                <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Client</p>
                  <p style={{ fontWeight: 'bold' }}>{selectedInvoice.clientName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Date</p>
                  <p style={{ fontWeight: 'bold' }}>{selectedInvoice.date}</p>
                </div>
              </div>

              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Items</p>
                {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--neutral-gray)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Description</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Qty</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Price</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item: any, index: number) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                          <td style={{ padding: '0.5rem' }}>{item.description}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }}>{item.quantity}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }}>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No items listed.</p>
                )}
              </div>

              {/* Payments Section in View Modal */}
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Payments</p>
                {selectedInvoice.payments && selectedInvoice.payments.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--neutral-gray)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Date</th>
                        <th style={{ padding: '0.5rem' }}>Note</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.payments.map((p: any, index: number) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                          <td style={{ padding: '0.5rem' }}>{p.date}</td>
                          <td style={{ padding: '0.5rem' }}>{p.note || '-'}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }}>${p.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No payments recorded.</p>
                )}
              </div>

              <div style={{ borderTop: '2px solid var(--neutral-gray)', paddingTop: '1rem', textAlign: 'right' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: {formatCurrency(selectedInvoice.amount)}</p>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--success)' }}>Paid: {formatCurrency(selectedInvoice.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0)}</p>
                <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--danger)' }}>Balance Due: {formatCurrency(selectedInvoice.amount - (selectedInvoice.payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0))}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '0.5rem' }}>Status: {selectedInvoice.status.toUpperCase()}</p>
                {selectedInvoice.status !== 'paid' && (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%' }} 
                    onClick={async () => {
                      await updateInvoiceStatus(selectedInvoice._id, 'paid');
                      setSelectedInvoice({ ...selectedInvoice, status: 'paid' });
                    }}
                  >
                    Apply Payment (Mark as Paid)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
