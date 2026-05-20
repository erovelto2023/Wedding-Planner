"use client";

import { useState, useEffect } from 'react';

interface BudgetItem {
  _id?: string;
  category: string;
  item: string;
  estimated: number;
  actual: number;
  isSettings?: boolean;
}

export default function BudgetPage() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBudgetLimit, setTotalBudgetLimit] = useState<number>(0);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  
  const [newCategory, setNewCategory] = useState('Venue');
  const [newItem, setNewItem] = useState('');
  const [newEstimated, setNewEstimated] = useState(0);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const res = await fetch('/api/expenses');
        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        }
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      }
    }
    fetchExpenses();
  }, []);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await fetch('/api/budget');
        if (res.ok) {
          const data: BudgetItem[] = await res.json();
          setItems(data);
          
          // Find settings
          const settings = data.find(i => i.isSettings);
          if (settings) {
            setTotalBudgetLimit(settings.estimated); // We store limit in 'estimated' field for settings
            setSettingsId(settings._id!);
          }
        }
      } catch (error) {
        console.error('Failed to fetch budget:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBudget();
  }, []);

  const saveTotalBudget = async (value: number) => {
    setTotalBudgetLimit(value);
    
    if (settingsId) {
      // Update
      await fetch('/api/budget', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: settingsId, category: 'Settings', item: 'Total Budget', estimated: value, actual: 0, isSettings: true })
      });
    } else {
      // Create
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Settings', item: 'Total Budget', estimated: value, actual: 0, isSettings: true })
      });
      if (res.ok) {
        const data = await res.json();
        setSettingsId(data._id);
      }
    }
  };

  const addItem = async () => {
    if (!newItem) return;
    const item: BudgetItem = {
      category: newCategory,
      item: newItem,
      estimated: newEstimated,
      actual: 0
    };

    const res = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });

    if (res.ok) {
      const savedItem = await res.json();
      setItems([...items, savedItem]);
      setNewItem('');
      setNewEstimated(0);
    } else {
      alert('Failed to add item.');
    }
  };

  // Updated to handle any field
  const updateItem = async (id: string, field: keyof BudgetItem, value: string | number) => {
    const itemToUpdate = items.find(item => item._id === id);
    if (!itemToUpdate) return;

    const updatedItem = { ...itemToUpdate, [field]: value };

    // Optimistic update
    setItems(items.map(item => item._id === id ? updatedItem : item));

    const res = await fetch('/api/budget', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    });

    if (!res.ok) {
      alert('Failed to update item.');
      // Rollback
      const fetchRes = await fetch('/api/budget');
      if (fetchRes.ok) {
        setItems(await fetchRes.json());
      }
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const res = await fetch(`/api/budget?id=${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setItems(items.filter(item => item._id !== id));
    } else {
      alert('Failed to delete item.');
    }
  };

  const handlePrint = () => {
    // Open all details before printing
    const details = document.querySelectorAll('details');
    details.forEach(d => d.setAttribute('open', 'true'));
    
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const budgetItems = items.filter(i => !i.isSettings);
  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);
  const remainingBudget = totalBudgetLimit - totalActual;
  const planRemaining = totalBudgetLimit - totalEstimated;
  // Group items by category
  const groupedItems = budgetItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, BudgetItem[]>);

  const categories = Object.keys(groupedItems).sort();

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, exp) => {
    const cat = exp.category || 'General';
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += exp.amount;
    return acc;
  }, {} as Record<string, number>);

  if (loading) return <div className="container">Loading budget...</div>;

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #budget-print-area, #budget-print-area * {
            visibility: visible;
          }
          #budget-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          details {
            border: 1px solid #ccc !important;
            margin-bottom: 1rem !important;
            page-break-inside: avoid;
          }
          summary {
            background: #f5f5f5 !important;
          }
          input {
            border: none !important;
            background: transparent !important;
            text-align: right !important;
          }
          .text-left-print {
            text-align: left !important;
          }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="title">Wedding Budget</h1>
        <button className="btn btn-secondary no-print" onClick={handlePrint}>
          Save as PDF / Print
        </button>
      </div>
      
      {/* Summary Cards */}
      <div id="budget-print-area" className="glass-card" style={{ padding: '2rem', textAlign: 'left', background: 'white' }}>
        
        {/* Total Budget Input */}
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Total Budget</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>$</span>
            <input
              type="number"
              value={totalBudgetLimit}
              onChange={(e) => saveTotalBudget(parseFloat(e.target.value) || 0)}
              style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '200px', border: 'none', borderBottom: '2px solid var(--accent-primary)', background: 'transparent', padding: '0.25rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Estimated</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>${totalEstimated.toLocaleString()}</p>
            <p style={{ fontSize: '0.8rem', color: planRemaining >= 0 ? '#388E3C' : '#D32F2F' }}>
              {planRemaining >= 0 ? `$${planRemaining.toLocaleString()} under plan` : `$${Math.abs(planRemaining).toLocaleString()} over plan`}
            </p>
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Spent</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>${totalActual.toLocaleString()}</p>
          </div>
          <div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Remaining Cash</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: remainingBudget >= 0 ? '#388E3C' : '#D32F2F' }}>
              ${remainingBudget.toLocaleString()}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Based on actual spent</p>
          </div>
        </div>

        {/* Add New Item Form */}
        <div className="no-print" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {/* NEW: Datalist for categories allows typing custom ones! */}
          <input
            list="categories"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category"
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)', width: '150px' }}
          />
          <datalist id="categories">
            {categories.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>

          <input
            type="text"
            placeholder="Item Description"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            style={{ flex: 1, minWidth: '200px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}
          />
          <input
            type="number"
            placeholder="Est. Cost"
            value={newEstimated}
            onChange={(e) => setNewEstimated(parseFloat(e.target.value) || 0)}
            style={{ width: '120px', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}
          />
          <button className="btn btn-primary" onClick={addItem}>Add Item</button>
        </div>

        {/* Grouped Budget Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {categories.map(category => {
            const catItems = groupedItems[category];
            const catEstimated = catItems.reduce((sum, item) => sum + item.estimated, 0);
            const catActual = catItems.reduce((sum, item) => sum + item.actual, 0);
            const catCalculatedExpenses = expensesByCategory[category] || 0;

            return (
              <details key={category} style={{ border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
                <summary style={{ padding: '1rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{category} ({catItems.length})</span>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Est: ${catEstimated.toLocaleString()}</span>
                    <span style={{ color: 'var(--text-primary)' }}>Man: ${catActual.toLocaleString()}</span>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Auto: ${catCalculatedExpenses.toLocaleString()}</span>
                  </div>
                </summary>
                
                <div style={{ padding: '0 1rem 1rem 1rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--neutral-gray)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }}>Item</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }}>Estimated</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }}>Actual</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }} className="no-print">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catItems.map((item) => (
                        <tr key={item._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          {/* NEW: Item name is now editable! */}
                          <td style={{ padding: '0.5rem' }}>
                            <input
                              type="text"
                              value={item.item}
                              onChange={(e) => updateItem(item._id!, 'item', e.target.value)}
                              style={{ width: '100%', border: 'none', background: 'transparent', padding: '0.25rem' }}
                              className="text-left-print"
                            />
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                            <input
                              type="number"
                              value={item.estimated}
                              onChange={(e) => updateItem(item._id!, 'estimated', parseFloat(e.target.value) || 0)}
                              style={{ width: '90px', textAlign: 'right', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }}
                            />
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                            <input
                              type="number"
                              value={item.actual}
                              onChange={(e) => updateItem(item._id!, 'actual', parseFloat(e.target.value) || 0)}
                              style={{ width: '90px', textAlign: 'right', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }}
                            />
                          </td>
                          <td style={{ padding: '0.5rem', textAlign: 'right' }} className="no-print">
                            <button onClick={() => deleteItem(item._id!)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
}
