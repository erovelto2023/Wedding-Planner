"use client";

import { useState, useEffect } from 'react';
import styles from './timelines.module.css';

interface TimelineItem {
  _id?: string;
  time: string;
  event: string;
  category?: string;
  location?: string;
  duration?: string;
  notes?: string;
  vendor?: string;
  priority?: string;
  assignedTo?: string;
  setupTime?: string;
  breakdownTime?: string;
  specialInstructions?: string;
  equipment?: string;
  photoMoments?: string;
  musicReq?: string;
  day?: number;
  isSettings?: boolean;
  daysConfig?: Array<{ num: number, date: string }>;
}

// NEW: Vendor interface for pulling from API
interface Vendor {
  _id?: string;
  name: string;
  category: string;
}

const categoryColors: Record<string, { bg: string, text: string }> = {
  'Preparation': { bg: '#FCE4EC', text: '#C2185B' }, // Pink
  'Ceremony': { bg: '#E8F5E9', text: '#2E7D32' },    // Green
  'Reception': { bg: '#E3F2FD', text: '#1565C0' },   // Blue
  'Photos': { bg: '#FFF3E0', text: '#E65100' },      // Orange
  'Logistics': { bg: '#ECEFF1', text: '#455A64' },   // Gray
  'General': { bg: '#F3E5F5', text: '#6A1B9A' }      // Purple
};

export default function TimelinesPage() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTime, setNewTime] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState('All');
  
  // NEW: Vendors list state
  const [vendorsList, setVendorsList] = useState<Vendor[]>([]);

  const [daysConfig, setDaysConfig] = useState<Array<{ num: number, date: string }>>([
    { num: 1, date: '' },
    { num: 2, date: '' },
    { num: 3, date: '' }
  ]);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch timeline items
        const res = await fetch('/api/timelines');
        if (res.ok) {
          const data: TimelineItem[] = await res.json();
          setItems(data);
          
          const settings = data.find(i => i.isSettings);
          if (settings && settings.daysConfig) {
            setDaysConfig(settings.daysConfig);
            setSettingsId(settings._id!);
          }
        }

        // NEW: Fetch vendors
        const vendorsRes = await fetch('/api/vendors');
        if (vendorsRes.ok) {
          const vendorsData = await vendorsRes.json();
          setVendorsList(vendorsData);
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const saveDaysConfig = async (newConfig: Array<{ num: number, date: string }>) => {
    setDaysConfig(newConfig);
    
    if (settingsId) {
      await fetch('/api/timelines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: settingsId, isSettings: true, daysConfig: newConfig, time: '00:00', event: 'Settings' })
      });
    } else {
      const res = await fetch('/api/timelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSettings: true, daysConfig: newConfig, time: '00:00', event: 'Settings' })
      });
      if (res.ok) {
        const data = await res.json();
        setSettingsId(data._id);
      }
    }
  };

  const addDay = () => {
    const nextDayNum = daysConfig.length > 0 ? Math.max(...daysConfig.map(d => d.num)) + 1 : 1;
    const newConfig = [...daysConfig, { num: nextDayNum, date: '' }];
    saveDaysConfig(newConfig);
    setCurrentDay(nextDayNum);
  };

  const setDayDate = (num: number, date: string) => {
    const newConfig = daysConfig.map(d => d.num === num ? { ...d, date } : d);
    saveDaysConfig(newConfig);
  };

  const addItem = async () => {
    if (!newTime || !newEvent) return;
    const item: TimelineItem = {
      time: newTime,
      event: newEvent,
      category: 'General',
      day: currentDay
    };

    const res = await fetch('/api/timelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });

    if (res.ok) {
      const savedItem = await res.json();
      const updated = [...items, savedItem].sort((a, b) => a.time.localeCompare(b.time));
      setItems(updated);
      setNewTime('');
      setNewEvent('');
    } else {
      alert('Failed to add event.');
    }
  };

  const updateItem = async (updatedItem: TimelineItem) => {
    const res = await fetch('/api/timelines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedItem)
    });

    if (res.ok) {
      setItems(items.map(item => item._id === updatedItem._id ? updatedItem : item));
      setIsModalOpen(false);
      setSelectedItem(null);
    } else {
      alert('Failed to update event.');
    }
  };

  const deleteItem = async (id: string) => {
    if (!id) {
      alert('Failed to delete event: Missing ID.');
      return;
    }
    if (!confirm('Are you sure you want to delete this event?')) return;

    const res = await fetch(`/api/timelines?id=${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setItems(items.filter(item => item._id !== id));
      if (selectedItem?._id === id) {
        setIsModalOpen(false);
        setSelectedItem(null);
      }
    } else {
      alert('Failed to delete event.');
    }
  };

  const openDetails = (item: TimelineItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryStyle = (category: string = 'General') => {
    return categoryColors[category] || categoryColors['General'];
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    
    const updatedItems = [...items];
    const draggedItem = updatedItems[draggedItemIndex];
    
    updatedItems.splice(draggedItemIndex, 1);
    updatedItems.splice(dropIndex, 0, draggedItem);
    
    setItems(updatedItems);
    setDraggedItemIndex(null);
  };

  const budgetItems = items.filter(i => !i.isSettings);

  const filteredItems = budgetItems.filter(item => 
    (item.day || 1) === currentDay &&
    (selectedVendor === 'All' || item.vendor === selectedVendor)
  );

  const currentDayConfig = daysConfig.find(d => d.num === currentDay);

  if (loading) return <div className="container">Loading timeline...</div>;

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
      
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #timeline-print-area, #timeline-print-area * {
            visibility: visible;
          }
          #timeline-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 2rem !important;
          }
          .no-print {
            display: none !important;
          }
          .timeline-row-print {
            border-bottom: 1px solid #ccc !important;
            padding: 1rem 0 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="title">Wedding Timeline</h1>
        <button className="btn btn-secondary no-print" onClick={handlePrint}>
          Save as PDF / Print
        </button>
      </div>

      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Day Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {daysConfig.map(day => (
            <button
              key={day.num}
              onClick={() => setCurrentDay(day.num)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--neutral-gray)',
                background: currentDay === day.num ? 'var(--accent-primary)' : 'white',
                color: currentDay === day.num ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Day {day.num} {day.date && `(${day.date})`}
            </button>
          ))}
          <button className="btn btn-secondary" onClick={addDay} style={{ padding: '0.5rem' }}>+ Add Day</button>
        </div>

        {/* NEW: Vendor Filter Dropdown populated from vendorsList */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Filter by Vendor:</label>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'white' }}
          >
            <option value="All">All Vendors</option>
            {vendorsList.map(v => (
              <option key={v._id} value={v.name}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Date setter for current day */}
      <div className="no-print" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Set Date for Day {currentDay}:</label>
        <input
          type="date"
          value={currentDayConfig?.date || ''}
          onChange={(e) => setDayDate(currentDay, e.target.value)}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }}
        />
      </div>
      
      <div id="timeline-print-area" className="glass-card" style={{ padding: '2rem', textAlign: 'left', background: 'white' }}>
        
        {/* Printable & Screen Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid var(--neutral-gray)', paddingBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: 0, color: 'var(--text-primary)' }}>
            Wedding Timeline — Day {currentDay}
          </h2>
          {currentDayConfig?.date ? (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
              📅 Date: {new Date(currentDayConfig.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          ) : (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              📅 Date: [Not Selected]
            </p>
          )}
          {selectedVendor && selectedVendor !== 'All' && (
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
              🏷️ Vendor: {selectedVendor}
            </p>
          )}
        </div>

        {/* Quick Add Form */}
        <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}
          />
          <input
            type="text"
            placeholder="Event Name (e.g., Cake Cutting)"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}
          />
          <button className="btn btn-primary" onClick={addItem}>Add Event</button>
        </div>

        {/* Timeline List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
          
          {/* Vertical line connecting events */}
          <div style={{ position: 'absolute', left: '120px', top: '10px', bottom: '10px', width: '2px', background: 'var(--neutral-gray)', zIndex: 0 }}></div>

          {filteredItems.map((item, index) => {
            const colors = getCategoryStyle(item.category);
            const mainIndex = items.findIndex(i => i._id === item._id);

            return (
              <div 
                key={item._id} 
                className={`${styles.timelineRow} timeline-row-print`}
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest('button')) {
                    openDetails(item);
                  }
                }}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, mainIndex)}
                onDragOver={(e) => handleDragOver(e, mainIndex)}
                onDrop={(e) => handleDrop(e, mainIndex)}
                style={{ 
                  display: 'flex', 
                  gap: '2rem', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)',
                  background: 'white',
                  border: '1px solid transparent',
                  cursor: 'grab',
                  position: 'relative',
                  zIndex: 1,
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  opacity: draggedItemIndex === mainIndex ? 0.5 : 1
                }}
              >
                {/* Time column */}
                <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', minWidth: '80px', textAlign: 'right' }}>
                  {item.time}
                </div>
                
                {/* Dot on the line (Color-coded!) */}
                <div style={{ 
                  width: '14px', 
                  height: '14px', 
                  borderRadius: '50%', 
                  background: colors.bg, 
                  border: `2px solid ${colors.text}`,
                  marginLeft: '-7px' 
                }}></div>
                
                {/* Content column */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{item.event}</div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', alignItems: 'center' }}>
                    {item.category && (
                      <span style={{ 
                        background: colors.bg, 
                        color: colors.text,
                        padding: '0.1rem 0.6rem', 
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '0.75rem'
                      }}>
                        {item.category}
                      </span>
                    )}
                    {item.location && <span>📍 {item.location}</span>}
                    {item.duration && <span>⏱️ {item.duration}</span>}
                    {item.vendor && <span style={{ color: 'var(--accent-primary)' }}>🏷️ {item.vendor}</span>}
                  </div>
                  {item.notes && <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{item.notes}</div>}
                </div>
                
                {/* Actions */}
                <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                    onClick={(e) => { e.stopPropagation(); openDetails(item); }}
                  >
                    Details
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', color: 'var(--danger)' }}
                    onClick={(e) => { e.stopPropagation(); deleteItem(item._id!); }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No events found for Day {currentDay} with filter "{selectedVendor}".
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedItem && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)' }}>Edit Event Details</h2>
              <button style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Event Name</label>
                <input type="text" value={selectedItem.event} onChange={(e) => setSelectedItem({ ...selectedItem, event: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Start Time</label>
                <input type="time" value={selectedItem.time} onChange={(e) => setSelectedItem({ ...selectedItem, time: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Duration (e.g., 30 mins)</label>
                <input type="text" value={selectedItem.duration || ''} onChange={(e) => setSelectedItem({ ...selectedItem, duration: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Day</label>
                <select value={selectedItem.day || 1} onChange={(e) => setSelectedItem({ ...selectedItem, day: parseInt(e.target.value) || 1 })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}>
                  {daysConfig.map(d => (
                    <option key={d.num} value={d.num}>Day {d.num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
                <input type="text" value={selectedItem.category || ''} onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Location</label>
                <input type="text" value={selectedItem.location || ''} onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} />
              </div>

              {/* NEW: Dropdown for Assigned Vendor pulling from vendorsList */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Assigned Vendor</label>
                <select 
                  value={selectedItem.vendor || ''} 
                  onChange={(e) => setSelectedItem({ ...selectedItem, vendor: e.target.value })} 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'white' }}
                >
                  <option value="">Select Vendor</option>
                  {vendorsList.map(v => (
                    <option key={v._id} value={v.name}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Priority Level</label>
                <select value={selectedItem.priority || ''} onChange={(e) => setSelectedItem({ ...selectedItem, priority: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}>
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Event Description / Notes</label>
                <textarea value={selectedItem.notes || ''} onChange={(e) => setSelectedItem({ ...selectedItem, notes: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', minHeight: '80px' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Special Instructions</label>
                <textarea value={selectedItem.specialInstructions || ''} onChange={(e) => setSelectedItem({ ...selectedItem, specialInstructions: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', minHeight: '60px' }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Photo/Video Must-Have Moments</label>
                <input type="text" value={selectedItem.photoMoments || ''} onChange={(e) => setSelectedItem({ ...selectedItem, photoMoments: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }} placeholder="e.g., First Kiss, Cake Cutting" />
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => updateItem(selectedItem)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
