"use client";

import { useState, useEffect, useRef } from 'react';

interface CanvasObject {
  id: string;
  type: string;
  shape: 'round' | 'rectangle' | 'oval' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  seats?: number;
  assignedGuests?: string[];
  color?: string;
  icon?: string;
}

interface Layout {
  _id?: string;
  name: string;
  objects: CanvasObject[];
}

interface Guest {
  _id?: string;
  name: string;
  meal: string;
  dietary: string;
}

// Library of objects with default sizes, shapes, and styles
const objectLibrary = {
  'Tables & Seating': [
    { label: 'Round Table 60"', type: 'table', shape: 'round', width: 60, height: 60, color: '#E3F2FD', icon: '⭕' },
    { label: 'Round Table 72"', type: 'table', shape: 'round', width: 72, height: 72, color: '#E3F2FD', icon: '⭕' },
    { label: 'Rect Table 6ft', type: 'table', shape: 'rectangle', width: 72, height: 30, color: '#E3F2FD', icon: '⬛' },
    { label: 'Rect Table 8ft', type: 'table', shape: 'rectangle', width: 96, height: 30, color: '#E3F2FD', icon: '⬛' },
    { label: 'Head Table', type: 'table', shape: 'rectangle', width: 144, height: 36, color: '#BBDEFB', icon: '👑' },
    { label: 'Sweetheart Table', type: 'table', shape: 'round', width: 48, height: 48, color: '#F8BBD0', icon: '❤️' },
    { label: 'Cocktail Table', type: 'table', shape: 'round', width: 30, height: 30, color: '#E0E0E0', icon: '🍸' },
    { label: 'Chair', type: 'furniture', shape: 'rectangle', width: 18, height: 18, color: '#FFFFFF', icon: '🪑' },
  ],
  'Event Features': [
    { label: 'Dance Floor', type: 'dancefloor', shape: 'rectangle', width: 200, height: 200, color: '#FFF9C4', icon: '💃' },
    { label: 'Stage', type: 'stage', shape: 'rectangle', width: 300, height: 150, color: '#FFE082', icon: '🎭' },
    { label: 'DJ Booth', type: 'dj', shape: 'rectangle', width: 80, height: 40, color: '#CFD8DC', icon: '🎧' },
    { label: 'Band Area', type: 'band', shape: 'rectangle', width: 150, height: 100, color: '#CFD8DC', icon: '🎸' },
    { label: 'Lounge Sofa', type: 'furniture', shape: 'rectangle', width: 72, height: 30, color: '#E1BEE7', icon: '🛋️' },
    { label: 'Photo Booth', type: 'photo', shape: 'rectangle', width: 80, height: 80, color: '#F5F5F5', icon: '📸' },
  ],
  'Service Areas': [
    { label: 'Bar Unit', type: 'bar', shape: 'rectangle', width: 120, height: 30, color: '#C8E6C9', icon: '🍻' },
    { label: 'Buffet Station', type: 'buffet', shape: 'rectangle', width: 180, height: 40, color: '#C8E6C9', icon: '🍽️' },
    { label: 'Cake Table', type: 'cake', shape: 'round', width: 48, height: 48, color: '#FFF3E0', icon: '🎂' },
    { label: 'Gift Table', type: 'gift', shape: 'rectangle', width: 72, height: 30, color: '#FFF3E0', icon: '🎁' },
    { label: 'Guest Book', type: 'guestbook', shape: 'rectangle', width: 48, height: 24, color: '#FFF3E0', icon: '📖' },
  ],
  'Infrastructure & Safety': [
    { label: 'Fire Exit', type: 'exit', shape: 'rectangle', width: 48, height: 12, color: '#FFCDD2', icon: '🚪' },
    { label: 'Restroom', type: 'restroom', shape: 'rectangle', width: 60, height: 60, color: '#E0E0E0', icon: '🚻' },
    { label: 'Fire Extinguisher', type: 'safety', shape: 'rectangle', width: 12, height: 12, color: '#FF8A80', icon: '🧯' },
    { label: 'Electrical Outlet', type: 'power', shape: 'rectangle', width: 12, height: 12, color: '#FFF59D', icon: '🔌' },
    { label: 'Column/Pillar', type: 'obstacle', shape: 'round', width: 24, height: 24, color: '#BDBDBD', icon: '柱' },
  ]
};

export default function FloorPlansPage() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [seatingNotes, setSeatingNotes] = useState('');
  const [currentLayout, setCurrentLayout] = useState<Layout | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // NEW: History for Undo/Redo
  const [history, setHistory] = useState<CanvasObject[][]>([]);
  const [future, setFuture] = useState<CanvasObject[][]>([]);

  // NEW: Zoom state
  const [scale, setScale] = useState(1);

  // NEW: Ruler state
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerStart, setRulerStart] = useState<{ x: number, y: number } | null>(null);
  const [rulerEnd, setRulerEnd] = useState<{ x: number, y: number } | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // NEW: UI State for full screen
  const [showSidebars, setShowSidebars] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/floorplans');
        if (res.ok) {
          const data = await res.json();
          setLayouts(data);
          if (data.length > 0) {
            setCurrentLayout(data[0]);
          }
        }

        const guestsRes = await fetch('/api/guests');
        if (guestsRes.ok) {
          const guestsData = await guestsRes.json();
          setAllGuests(guestsData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const saveToHistory = () => {
    if (currentLayout) {
      setHistory([...history, currentLayout.objects]);
      setFuture([]);
    }
  };

  const undo = () => {
    if (history.length > 0 && currentLayout) {
      const previous = history[history.length - 1];
      setFuture([currentLayout.objects, ...future]);
      setHistory(history.slice(0, -1));
      setCurrentLayout({ ...currentLayout, objects: previous });
    }
  };

  const redo = () => {
    if (future.length > 0 && currentLayout) {
      const next = future[0];
      setHistory([...history, currentLayout.objects]);
      setFuture(future.slice(1));
      setCurrentLayout({ ...currentLayout, objects: next });
    }
  };

  // NEW: Update Item Label
  const updateItemLabel = (id: string, newLabel: string) => {
    if (!currentLayout) return;
    
    // Save history
    setHistory([...history, currentLayout.objects]);
    setFuture([]); // Clear future on new action
    
    const updatedObjects = currentLayout.objects.map(obj => 
      obj.id === id ? { ...obj, label: newLabel } : obj
    );
    
    setCurrentLayout({
      ...currentLayout,
      objects: updatedObjects
    });
  };

  // NEW: Clear Canvas
  const clearCanvas = async () => {
    if (!currentLayout) return;
    if (!confirm('Are you sure you want to clear the canvas? This will remove all objects and reset seating.')) return;
    
    saveToHistory(); // Save before clearing!
    
    const updatedLayout = { ...currentLayout, objects: [] };
    setCurrentLayout(updatedLayout);
    
    await fetch('/api/floorplans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLayout)
    });
  };

  // NEW: Calculate Distance for Ruler
  const calculateDistance = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const pixels = Math.sqrt(dx * dx + dy * dy);
    const inches = Math.round(pixels);
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (draggedGuestId) return;
    
    saveToHistory(); // Save state before moving
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDraggingId(id);
    setDragOffset({
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (rulerMode && isMeasuring && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      setRulerEnd({ x, y });
      return;
    }

    if (!draggingId || !currentLayout || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    let newX = (e.clientX - canvasRect.left) / scale - dragOffset.x;
    let newY = (e.clientY - canvasRect.top) / scale - dragOffset.y;

    // Snap to grid (20px) to tighten up controls
    newX = Math.round(newX / 20) * 20;
    newY = Math.round(newY / 20) * 20;

    newX = Math.max(0, Math.min(newX, canvasRect.width - 50));
    newY = Math.max(0, Math.min(newY, canvasRect.height - 50));

    const updatedObjects = currentLayout.objects.map(obj => 
      obj.id === draggingId ? { ...obj, x: newX, y: newY } : obj
    );

    setCurrentLayout({ ...currentLayout, objects: updatedObjects });
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    if (!draggingId || !currentLayout) return;
    
    setDraggingId(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    await fetch('/api/floorplans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentLayout)
    });
  };

  // Updated to accept full library item
  const addObject = (item: typeof objectLibrary['Tables & Seating'][0]) => {
    if (!currentLayout) return;

    saveToHistory(); // Save before adding!

    const newObj: CanvasObject = {
      id: Math.random().toString(36).substr(2, 9),
      type: item.type,
      shape: item.shape as any,
      x: 50,
      y: 50,
      width: item.width,
      height: item.height,
      label: item.label,
      color: item.color,
      icon: item.icon,
      assignedGuests: []
    };

    const updatedLayout = {
      ...currentLayout,
      objects: [...currentLayout.objects, newObj]
    };

    setCurrentLayout(updatedLayout);
    
    fetch('/api/floorplans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLayout)
    });
  };

  const handleGuestDragStart = (e: React.DragEvent, guestId: string) => {
    setDraggedGuestId(guestId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleGuestDrop = async (e: React.DragEvent, tableId: string) => {
    e.preventDefault();
    if (!draggedGuestId || !currentLayout) return;

    saveToHistory(); // Save before dropping guest!

    const guest = allGuests.find(g => g._id === draggedGuestId);
    if (!guest) return;

    const updatedObjects = currentLayout.objects.map(obj => {
      if (obj.id === tableId && obj.type === 'table') {
        const assigned = obj.assignedGuests || [];
        if (!assigned.includes(guest.name)) {
          return { ...obj, assignedGuests: [...assigned, guest.name] };
        }
      }
      return obj;
    });

    const updatedLayout = { ...currentLayout, objects: updatedObjects };
    setCurrentLayout(updatedLayout);
    setDraggedGuestId(null);

    await fetch('/api/floorplans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLayout)
    });
  };

  // NEW: CSV Import Handler
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      
      const newGuests = lines.slice(1).map(line => {
        const values = line.split(',');
        if (values.length < 1 || !values[0]) return null;
        return {
          name: values[0].trim(),
          meal: values[1]?.trim() || 'Beef',
          dietary: values[2]?.trim() || 'None',
          status: 'Confirmed'
        };
      }).filter(Boolean);

      for (const guest of newGuests) {
        await fetch('/api/guests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guest)
        });
      }

      const guestsRes = await fetch('/api/guests');
      if (guestsRes.ok) {
        const guestsData = await guestsRes.json();
        setAllGuests(guestsData);
      }
    };
    reader.readAsText(file);
  };

  const assignedGuestNames = currentLayout?.objects.flatMap(obj => obj.assignedGuests || []) || [];
  const unassignedGuests = allGuests.filter(g => !assignedGuestNames.includes(g.name));

  const selectedTable = currentLayout?.objects.find(obj => obj.id === selectedTableId);

  // NEW: Calculate meal and dietary summaries for selected table
  const assignedGuestObjs = allGuests.filter(g => selectedTable?.assignedGuests?.includes(g.name));
  
  const mealCounts = assignedGuestObjs.reduce((acc, g) => {
    acc[g.meal] = (acc[g.meal] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dietaryAlerts = assignedGuestObjs.filter(g => g.dietary && g.dietary !== 'None');

  const removeGuestFromTable = async (tableName: string, guestName: string) => {
    if (!currentLayout) return;
    
    const updatedObjects = currentLayout.objects.map(obj => {
      if (obj.label === tableName) {
        return { ...obj, assignedGuests: (obj.assignedGuests || []).filter(name => name !== guestName) };
      }
      return obj;
    });

    const updatedLayout = { ...currentLayout, objects: updatedObjects };
    setCurrentLayout(updatedLayout);

    await fetch('/api/floorplans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLayout)
    });
  };

  const reorderGuests = async (tableId: string, startIndex: number, endIndex: number) => {
    if (!currentLayout) return;

    const updatedObjects = currentLayout.objects.map(obj => {
      if (obj.id === tableId) {
        const guests = [...(obj.assignedGuests || [])];
        const [removed] = guests.splice(startIndex, 1);
        guests.splice(endIndex, 0, removed);
        return { ...obj, assignedGuests: guests };
      }
      return obj;
    });

    const updatedLayout = { ...currentLayout, objects: updatedObjects };
    setCurrentLayout(updatedLayout);

    await fetch('/api/floorplans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedLayout)
    });
  };

  // NEW: Load Template
  const loadTemplate = async (templateName: string) => {
    const templates = {
      'Intimate Dinner': [
        { id: '1', type: 'table', shape: 'rectangle', x: 100, y: 100, width: 144, height: 36, label: 'Head Table', color: '#BBDEFB', icon: '👑', assignedGuests: [] },
        { id: '2', type: 'table', shape: 'round', x: 50, y: 200, width: 60, height: 60, label: 'Table 1', color: '#E3F2FD', icon: '⭕', assignedGuests: [] },
        { id: '3', type: 'table', shape: 'round', x: 150, y: 200, width: 60, height: 60, label: 'Table 2', color: '#E3F2FD', icon: '⭕', assignedGuests: [] },
        { id: '4', type: 'table', shape: 'round', x: 250, y: 200, width: 60, height: 60, label: 'Table 3', color: '#E3F2FD', icon: '⭕', assignedGuests: [] },
      ],
      'Cocktail Reception': [
        { id: '1', type: 'bar', shape: 'rectangle', x: 50, y: 50, width: 120, height: 30, label: 'Main Bar', color: '#C8E6C9', icon: '🍻', assignedGuests: [] },
        { id: '2', type: 'table', shape: 'round', x: 100, y: 150, width: 30, height: 30, label: 'High Top 1', color: '#E0E0E0', icon: '🍸', assignedGuests: [] },
        { id: '3', type: 'table', shape: 'round', x: 200, y: 150, width: 30, height: 30, label: 'High Top 2', color: '#E0E0E0', icon: '🍸', assignedGuests: [] },
        { id: '4', type: 'table', shape: 'round', x: 300, y: 150, width: 30, height: 30, label: 'High Top 3', color: '#E0E0E0', icon: '🍸', assignedGuests: [] },
        { id: '5', type: 'dj', shape: 'rectangle', x: 50, y: 300, width: 80, height: 40, label: 'DJ', color: '#CFD8DC', icon: '🎧', assignedGuests: [] },
      ]
    };

    const objects = templates[templateName as keyof typeof templates];
    if (!objects) return;

    const newLayout = {
      name: `${templateName} (Copy)`,
      objects
    };

    const res = await fetch('/api/floorplans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLayout)
    });

    if (res.ok) {
      const savedLayout = await res.json();
      setLayouts([...layouts, savedLayout]);
      setCurrentLayout(savedLayout);
    }
  };

  if (loading) return <div className="container">Loading floor plans...</div>;

  return (
    <div className="container" style={{ maxWidth: '1400px' }}> {/* Widened for more sidebars */}
      <h1 className="title no-print">Floor Plan & Seating Chart</h1>
      
      <style>{`
        @media screen {
          .printable-seating-list {
            display: none !important;
          }
        }
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
            height: 700px !important;
            border: none !important;
            box-shadow: none !important;
            background-image: linear-gradient(#BBDEFB 1px, transparent 1px), linear-gradient(90deg, #BBDEFB 1px, transparent 1px) !important;
            background-size: 20px 20px !important;
            page-break-after: always;
          }
          html, body, .app-layout, .main-content, .container, .printable-seating-list {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            left: 0 !important;
          }
          .printable-seating-list {
            display: block !important;
            margin-top: 2rem;
          }
            padding-left: 0 !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
      
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Sidebar 1: Object Library */}
        <div className="no-print" style={{ width: '280px', display: showSidebars ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
          
          {/* NEW: Actions Grid */}
          <div className="glass-card" style={{ padding: '0.75rem', background: 'white', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={undo} 
              disabled={history.length === 0}
              style={{ padding: '0.4rem', fontSize: '0.85rem' }}
            >
              ↩️ Undo
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={redo} 
              disabled={future.length === 0}
              style={{ padding: '0.4rem', fontSize: '0.85rem' }}
            >
              ↪️ Redo
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setRulerMode(!rulerMode)} 
              style={{ padding: '0.4rem', fontSize: '0.85rem', background: rulerMode ? 'var(--accent-secondary)' : 'white' }}
            >
              📏 Measure
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => window.print()} 
              style={{ padding: '0.4rem', fontSize: '0.85rem' }}
            >
              🖨️ Print
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={clearCanvas} 
              style={{ padding: '0.4rem', fontSize: '0.85rem', color: 'var(--danger)', gridColumn: 'span 2' }}
            >
              🗑️ Clear Canvas
            </button>
          </div>

          {/* NEW: Seating Notes */}
          <div className="glass-card" style={{ padding: '1rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem', fontSize: '1rem' }}>Seating Notes</h3>
            <textarea
              value={seatingNotes}
              onChange={(e) => setSeatingNotes(e.target.value)}
              placeholder="Add additional notes for seating here..."
              style={{
                width: '100%',
                height: '100px',
                padding: '0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--neutral-gray)',
                fontSize: '0.85rem',
                resize: 'vertical',
                outline: 'none'
              }}
            />
          </div>

          <div className="glass-card" style={{ padding: '1rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Object Library</h3>
            
            {Object.entries(objectLibrary).map(([category, items]) => (
              <details key={category} style={{ marginBottom: '0.5rem' }}>
                <summary style={{ fontWeight: 'bold', cursor: 'pointer', padding: '0.25rem 0', color: 'var(--accent-primary)' }}>
                  {category}
                </summary>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.25rem', paddingLeft: '0.5rem', marginTop: '0.25rem' }}>
                  {items.map(item => (
                    <button 
                      key={item.label} 
                      className="btn btn-secondary" 
                      onClick={() => addObject(item)}
                      style={{ 
                        padding: '0.4rem', 
                        fontSize: '0.8rem', 
                        textAlign: 'left', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        background: 'white'
                      }}
                    >
                      <span>{item.icon}</span>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.width}x{item.height}</span>
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>

          {/* Active Layout */}
          <div className="glass-card" style={{ padding: '1rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Active Layout</h3>
            <select 
              value={currentLayout?._id} 
              onChange={(e) => {
                const selected = layouts.find(l => l._id === e.target.value);
                if (selected) setCurrentLayout(selected);
              }}
              style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }}
            >
              {layouts.map(l => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>
          </div>

          {/* NEW: Load Template */}
          <div className="glass-card" style={{ padding: '1rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Load Template</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Add a preset layout to your list:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem', textAlign: 'left' }} onClick={() => loadTemplate('Intimate Dinner')}>🍽️ Intimate Dinner</button>
              <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem', textAlign: 'left' }} onClick={() => loadTemplate('Cocktail Reception')}>🍸 Cocktail Reception</button>
            </div>
          </div>
        </div>

        {/* Canvas Area Wrapper (Print Target) */}
        <div className="canvas-to-print" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* NEW: Title for Floor Plan */}
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', textAlign: 'center' }}>
            WEDDING RECEPTION FLOOR PLAN
          </div>

          <div 
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerDown={(e) => {
              if (rulerMode) {
                const rect = canvasRef.current!.getBoundingClientRect();
                const x = (e.clientX - rect.left) / scale;
                const y = (e.clientY - rect.top) / scale;
                setRulerStart({ x, y });
                setRulerEnd({ x, y });
                setIsMeasuring(true);
              }
            }}
            onPointerUp={() => {
              if (rulerMode) {
                setIsMeasuring(false);
              }
            }}
            style={{ 
              flex: 1, 
              height: '700px', // Made taller
              background: 'white', 
              border: '2px solid var(--neutral-gray)', 
              borderRadius: 'var(--radius-lg)',
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: 'linear-gradient(#BBDEFB 1px, transparent 1px), linear-gradient(90deg, #BBDEFB 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
          {/* NEW: Zoom Controls */}
          <div className="no-print" style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '0.25rem', zIndex: 10 }}>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setShowSidebars(!showSidebars)}>
              {showSidebars ? '👁️ Hide Sidebars' : '👁️ Show Sidebars'}
            </button>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setScale(Math.min(2, scale + 0.1))}>➕</button>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setScale(Math.max(0.5, scale - 0.1))}>➖</button>
            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setScale(1)}>Reset</button>
            <span style={{ fontSize: '0.8rem', background: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }}>
              {Math.round(scale * 100)}%
            </span>
          </div>
          {/* NEW: Zooming Container */}
          <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
            
            {/* NEW: Ruler Line */}
            {rulerStart && rulerEnd && (
              <svg className="no-print" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line 
                  x1={rulerStart.x} y1={rulerStart.y} 
                  x2={rulerEnd.x} y2={rulerEnd.y} 
                  stroke="var(--accent-primary)" 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                />
                <circle cx={rulerStart.x} cy={rulerStart.y} r="4" fill="var(--accent-primary)" />
                <circle cx={rulerEnd.x} cy={rulerEnd.y} r="4" fill="var(--accent-primary)" />
                
                {/* Distance Text */}
                <text 
                  x={(rulerStart.x + rulerEnd.x) / 2} 
                  y={(rulerStart.y + rulerEnd.y) / 2 - 10} 
                  fill="var(--accent-primary)" 
                  fontSize="12" 
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {calculateDistance(rulerStart, rulerEnd)}
                </text>
              </svg>
            )}

            {currentLayout?.objects.map((obj) => (
            <div
              key={obj.id}
              onPointerDown={(e) => handlePointerDown(e, obj.id)}
              onPointerUp={handlePointerUp}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleGuestDrop(e, obj.id)}
              style={{
                position: 'absolute',
                left: `${obj.x}px`,
                top: `${obj.y}px`,
                width: `${obj.width}px`,
                height: `${obj.height}px`,
                background: obj.color || 'white',
                border: `2px solid ${obj.id === selectedTableId ? 'var(--accent-primary)' : 'var(--neutral-gray)'}`,
                borderRadius: obj.shape === 'round' ? '50%' : 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: draggedGuestId ? 'copy' : 'grab',
                userSelect: 'none',
                boxShadow: obj.id === selectedTableId ? '0 0 10px rgba(var(--accent-primary-rgb), 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                zIndex: obj.type === 'dancefloor' ? 1 : 2,
                transition: 'all 0.1s ease',
                padding: '0.25rem',
                textAlign: 'center'
              }}
              onClick={() => { if (!draggingId) setSelectedTableId(obj.id); }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{obj.icon}</div>
              
              {/* Outside Label */}
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: '50%', 
                transform: 'translateX(-50%)', 
                fontSize: '0.75rem', 
                fontWeight: 'bold', 
                whiteSpace: 'nowrap', 
                marginTop: '15px', 
                color: 'var(--text-primary)',
                background: 'rgba(255,255,255,0.8)',
                padding: '1px 4px',
                borderRadius: '3px'
              }}>
                {obj.label}
              </div>
              
              {obj.type === 'table' && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {obj.assignedGuests?.length || 0}
                </div>
              )}

              {/* NEW: Visual Chairs for Round Tables */}
              {obj.type === 'table' && obj.shape === 'round' && [0,1,2,3,4,5,6,7].map(i => {
                const angle = (i * 2 * Math.PI) / 8;
                const r = obj.width / 2 + 8; // 8px outside
                const x = obj.width / 2 + r * Math.cos(angle) - 6; // -6 to center 12px chair
                const y = obj.height / 2 + r * Math.sin(angle) - 6;
                return (
                  <div 
                    key={i} 
                    style={{ 
                      position: 'absolute', 
                      left: `${x}px`, 
                      top: `${y}px`, 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      background: 'white', 
                      border: '1px solid var(--neutral-gray)',
                      zIndex: 3 
                    }} 
                  />
                );
              })}
            </div>
            ))}
          </div>
        </div>
      </div>

        {/* Sidebar 3: Right Panel (Guests OR Table Details) */}
        <div className="no-print" style={{ width: '280px', display: showSidebars ? 'flex' : 'none', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Item Details (Shows if selected) */}
          {selectedTable ? (
            <div className="glass-card" style={{ padding: '1rem', background: 'white', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={selectedTable.label} 
                  onChange={(e) => updateItemLabel(selectedTable.id, e.target.value)}
                  style={{ 
                    fontFamily: 'var(--font-serif)', 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold', 
                    border: 'none', 
                    borderBottom: '1px solid var(--neutral-gray)', 
                    width: '100%',
                    outline: 'none',
                    background: 'transparent'
                  }} 
                  title="Click to rename"
                />
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSelectedTableId(null)}>✕</button>
              </div>
              
              {/* Table Specific UI */}
              {selectedTable.type === 'table' && (
                <div>
              
              {/* NEW: Meal & Dietary Summary */}
              <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Meal Summary:</div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {Object.entries(mealCounts).map(([meal, count]) => (
                    <span key={meal} style={{ background: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}>
                      {meal}: {count}
                    </span>
                  ))}
                  {Object.keys(mealCounts).length === 0 && <span style={{ color: 'var(--text-secondary)' }}>None</span>}
                </div>

                {dietaryAlerts.length > 0 && (
                  <div style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                    ⚠️ Dietary Alerts:
                    <ul style={{ margin: '0.25rem 0 0 1rem', padding: 0, fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 'normal' }}>
                      {dietaryAlerts.map((g, i) => (
                        <li key={i}>{g.name}: {g.dietary}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Seating order (top to bottom is clockwise)</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {selectedTable.assignedGuests?.map((guestName, index) => (
                  <div
                    key={guestName}
                    style={{
                      padding: '0.4rem',
                      background: 'white',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      border: '1px solid var(--neutral-gray)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{index + 1}. {guestName}</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}
                        onClick={() => reorderGuests(selectedTable.id, index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}
                        onClick={() => reorderGuests(selectedTable.id, index, Math.min((selectedTable.assignedGuests?.length || 1) - 1, index + 1))}
                        disabled={index === (selectedTable.assignedGuests?.length || 1) - 1}
                      >
                        ↓
                      </button>
                      <button 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--danger)' }}
                        onClick={() => removeGuestFromTable(selectedTable.label, guestName)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!selectedTable.assignedGuests || selectedTable.assignedGuests.length === 0) && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                    No guests assigned yet. Drag from the list!
                  </div>
                )}
              </div>
                </div>
              )}
            </div>
          ) : (
            /* Unassigned Guests (Shows if no table selected) */
            <div className="glass-card" style={{ padding: '1rem', background: 'white', flex: 1 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Unassigned Guests</h3>
              
              {/* NEW: CSV Import */}
              <div style={{ marginBottom: '1rem' }}>
                <input type="file" accept=".csv" onChange={handleCsvImport} style={{ display: 'none' }} id="csv-upload" />
                <label htmlFor="csv-upload" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block' }}>
                  📥 Import CSV
                </label>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Drag a guest to a table</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '500px', overflowY: 'auto' }}>
                {unassignedGuests.map(guest => (
                  <div
                    key={guest._id}
                    draggable={true}
                    onDragStart={(e) => handleGuestDragStart(e, guest._id!)}
                    style={{
                      padding: '0.4rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'grab',
                      fontSize: '0.8rem',
                      border: '1px solid var(--neutral-gray)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>👤 {guest.name}</span>
                    <span style={{ fontSize: '0.7rem', background: 'white', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{guest.meal}</span>
                  </div>
                ))}
                {unassignedGuests.length === 0 && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>
                    All guests seated!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* NEW: Printable Seating List */}
      <div className="printable-seating-list">
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', borderBottom: '3px solid var(--accent-primary)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>Seating List & Guest Info</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
          {currentLayout?.objects.filter(obj => obj.type === 'table').map(table => (
            <div key={table.id} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>{table.label}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {table.assignedGuests?.map((guestName, i) => {
                  const guestObj = allGuests.find(g => g.name === guestName);
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{guestName}</span>
                      {guestObj && (
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {guestObj.meal} {guestObj.dietary ? `| ${guestObj.dietary}` : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
                {(!table.assignedGuests || table.assignedGuests.length === 0) && (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>No guests seated</div>
                )}
              </div>
            </div>
          ))}
          
          {/* NEW: Unassigned Guests in Print */}
          {unassignedGuests.length > 0 && (
            <div style={{ gridColumn: '1 / -1', marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '2px solid var(--text-secondary)', paddingBottom: '0.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>Unassigned Guests</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {unassignedGuests.map((guest, i) => {
                  const guestObj = allGuests.find(g => g.name === guest.name);
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{guest.name}</span>
                      {guestObj && (
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {guestObj.meal} {guestObj.dietary ? `| ${guestObj.dietary}` : ''}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NEW: Seating Notes in Print */}
          {seatingNotes && (
            <div style={{ gridColumn: '1 / -1', marginTop: '2rem', borderTop: '2px solid var(--accent-primary)', paddingTop: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Seating Notes</h3>
              <p style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{seatingNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
