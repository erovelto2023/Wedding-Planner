"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FoodBeveragePage() {
  const [menuItems, setMenuItems] = useState<any[]>([
    { id: 1, category: 'Appetizers', name: 'Mini Crab Cakes', notes: 'Gluten free option needed' },
    { id: 2, category: 'Main Course', name: 'Filet Mignon', notes: 'Medium rare' },
    { id: 3, category: 'Dessert', name: 'Macaron Tower', notes: 'Assorted flavors' },
  ]);

  const [barItems, setBarItems] = useState<any[]>([
    { id: 1, type: 'Signature Cocktail', name: 'Blushing Bride', description: 'Vodka, Elderflower, Grapefruit' },
    { id: 2, type: 'Wine', name: 'Chardonnay', description: 'House white' },
  ]);

  const [dietaryNotes, setDietaryNotes] = useState('Loading confirmed guests and dietary data...');

  useEffect(() => {
    async function loadGuests() {
      try {
        const res = await fetch('/api/guests');
        if (res.ok) {
          const dbGuests = await res.json();
          if (dbGuests.length > 0) {
            const confirmed = dbGuests.filter((g: any) => g.status === 'Confirmed');
            const dietList = confirmed
              .map((g: any) => g.dietary)
              .filter((d: any) => d && d.toLowerCase() !== 'none');
            
            const mealCounts = confirmed.reduce((acc: any, g: any) => {
              const meal = g.meal || 'Not Selected';
              acc[meal] = (acc[meal] || 0) + 1;
              return acc;
            }, {});

            let computedNotes = `${confirmed.length} Confirmed guests.\n`;
            if (dietList.length > 0) {
              computedNotes += `Special Dietary Needs: ${dietList.join(', ')}.\n`;
            } else {
              computedNotes += `Special Dietary Needs: None reported.\n`;
            }
            if (Object.keys(mealCounts).length > 0) {
              computedNotes += `Meal Selections:\n` + Object.entries(mealCounts)
                .map(([meal, count]) => `  - ${meal}: ${count}`)
                .join('\n');
            }
            setDietaryNotes(computedNotes);
          } else {
            setDietaryNotes('No guests found in database.');
          }
        }
      } catch (err) {
        console.error('Failed to load guests for F&B:', err);
        setDietaryNotes('Failed to load guest dietary preferences.');
      }
    }
    loadGuests();
  }, []);

  const [newMenu, setNewMenu] = useState({ category: 'Appetizers', name: '', notes: '' });
  const [newBar, setNewBar] = useState({ type: 'Signature Cocktail', name: '', description: '' });

  const menuCategories = ['Appetizers', 'Salad', 'Main Course', 'Late Night Snack', 'Dessert'];
  const barTypes = ['Signature Cocktail', 'Beer', 'Wine', 'Liquor', 'Non-Alcoholic'];

  const addMenu = () => {
    if (!newMenu.name) return;
    setMenuItems([...menuItems, { id: Date.now(), ...newMenu }]);
    setNewMenu({ category: 'Appetizers', name: '', notes: '' });
  };

  const addBar = () => {
    if (!newBar.name) return;
    setBarItems([...barItems, { id: Date.now(), ...newBar }]);
    setNewBar({ type: 'Signature Cocktail', name: '', description: '' });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, .sidebar {
            display: none !important;
          }
          .canvas-to-print {
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
          }
          html, body, .app-layout, .main-content, .container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            left: 0 !important;
          }
          body {
            background: white !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid var(--neutral-gray) !important;
            break-inside: avoid;
            margin-bottom: 1rem !important;
          }
          h1 {
            font-size: 2rem !important;
          }
          h2 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
      
      <Link href="/" className="btn btn-secondary no-print" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Dashboard</Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)' }}>Food & Beverage Planner</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Design your wedding menu and bar service.</p>
        </div>
        <button className="btn btn-secondary no-print" onClick={() => window.print()}>🖨️ Print for Caterer</button>
      </div>

      <div className="canvas-to-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Menu Section */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Dinner Menu</h2>
          
          {/* Add Menu Form */}
          <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <select 
              value={newMenu.category} 
              onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
            >
              {menuCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="Item name..." 
              value={newMenu.name} 
              onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
            />
            <button className="btn btn-primary" onClick={addMenu}>Add</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {menuCategories.map(category => {
              const items = menuItems.filter(i => i.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{category}</h3>
                  {items.map(item => (
                    <div key={item.id} style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span>{item.name}</span>
                        {item.notes && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({item.notes})</span>}
                      </div>
                      <button 
                        onClick={() => setMenuItems(menuItems.filter(i => i.id !== item.id))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
                        className="no-print"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar Section */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Bar & Beverages</h2>
          
          {/* Add Bar Form */}
          <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <select 
              value={newBar.type} 
              onChange={(e) => setNewBar({ ...newBar, type: e.target.value })}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
            >
              {barTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input 
              type="text" 
              placeholder="Beverage name..." 
              value={newBar.name} 
              onChange={(e) => setNewBar({ ...newBar, name: e.target.value })}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
            />
            <button className="btn btn-primary" onClick={addBar}>Add</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {barTypes.map(type => {
              const items = barItems.filter(i => i.type === type);
              if (items.length === 0) return null;
              return (
                <div key={type}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{type}</h3>
                  {items.map(item => (
                    <div key={item.id} style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                        {item.description && <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.description}</div>}
                      </div>
                      <button 
                        onClick={() => setBarItems(barItems.filter(i => i.id !== item.id))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
                        className="no-print"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dietary & Notes Section */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Dietary Restrictions & Notes</h2>
          <textarea 
            value={dietaryNotes}
            onChange={(e) => setDietaryNotes(e.target.value)}
            style={{ width: '100%', height: '150px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem', resize: 'none' }}
            placeholder="Enter any specific dietary restrictions or notes for the caterer..."
          />
        </div>
      </div>
    </div>
  );
}
