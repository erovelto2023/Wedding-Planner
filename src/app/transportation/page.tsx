"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Guest {
  _id: string;
  name: string;
  status: string;
  relation?: string;
  dietary?: string;
}

interface LogItem {
  _id: string;
  message: string;
  createdAt?: string;
}

interface AssignedGuest {
  name: string;
  flags: string[]; // 'Mobility Aid', 'Elderly Seat', 'Child Seat'
}

interface Vehicle {
  _id?: string;
  name: string;
  type: string;
  route: string;
  time: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  status: string; // 'Scheduled', 'In Transit', 'Completed'
  assignedGuests: AssignedGuest[];
  
  // Luxury Features & Outline Integration
  event: string; // 'Ceremony & Reception', 'Rehearsal Dinner', 'Welcome Party', 'Farewell Brunch'
  style: string; // 'Luxury', 'Classic', 'Vintage', 'Eco-Friendly'
  amenities: string[]; // 'AC', 'WiFi', 'Bar', 'Sound System', 'Restroom', 'Accessibility'
  cost: number;
  depositPaid: number;
  tipEstimated: number;
  uniform: string; // 'Formal White-Glove', 'Semi-Formal Suit', 'Casual Smart'
  bufferTime: number; // in minutes
}

export default function TransportationPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('All Events');
  const [totalBudgetAllocated, setTotalBudgetAllocated] = useState<number>(5000);

  // Day-of operations live feed
  const [opsFeed, setOpsFeed] = useState<LogItem[]>([]);
  const [newFeedMsg, setNewFeedMsg] = useState<string>('');
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingLogText, setEditingLogText] = useState<string>('');

  // Form State for Adding Vehicle
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    name: '',
    type: 'Luxury Shuttle Bus',
    route: '',
    time: '',
    capacity: 24,
    driverName: '',
    driverPhone: '',
    status: 'Scheduled',
    event: 'Ceremony & Reception',
    style: 'Luxury',
    amenities: ['AC', 'Sound System'],
    cost: 850,
    depositPaid: 200,
    tipEstimated: 150,
    uniform: 'Semi-Formal Suit',
    bufferTime: 20,
    assignedGuests: []
  });

  // Assign Guest Modal states
  const [assigningVehicle, setAssigningVehicle] = useState<Vehicle | null>(null);
  const [selectedGuestName, setSelectedGuestName] = useState<string>('');
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [vehiclesRes, guestsRes, budgetRes, logsRes] = await Promise.all([
          fetch('/api/transportation'),
          fetch('/api/guests'),
          fetch('/api/budget'),
          fetch('/api/transportation/logs')
        ]);
        if (vehiclesRes.ok && guestsRes.ok) {
          let vehiclesData: Vehicle[] = await vehiclesRes.json();
          const guestsData = await guestsRes.json();

          // Ensure legacy documents have assignedGuests as array of objects
          vehiclesData = vehiclesData.map(v => ({
            ...v,
            assignedGuests: Array.isArray(v.assignedGuests) 
              ? v.assignedGuests.map((g: any) => typeof g === 'string' ? { name: g, flags: [] } : g)
              : [],
            event: v.event || 'Ceremony & Reception',
            style: v.style || 'Luxury',
            amenities: v.amenities || ['AC', 'WiFi'],
            cost: v.cost || 500,
            depositPaid: v.depositPaid || 150,
            tipEstimated: v.tipEstimated || 100,
            uniform: v.uniform || 'Semi-Formal Suit',
            bufferTime: v.bufferTime || 15
          }));

          setVehicles(vehiclesData);
          setGuests(guestsData);
        }
        if (budgetRes.ok) {
          const budgetData = await budgetRes.json();
          const transportBudgetItems = budgetData.filter((item: any) => item.category === 'Transport');
          const transportSum = transportBudgetItems.reduce((sum: number, item: any) => sum + (item.estimated || 0), 0);
          setTotalBudgetAllocated(transportSum || 5000);
        }
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          const normalizedLogs = logsData.map((l: any, index: number) => {
            if (typeof l === 'string') {
              return { _id: `legacy-${index}`, message: l };
            }
            return l;
          });
          setOpsFeed(normalizedLogs);
        }
      } catch (error) {
        console.error('Failed to load transportation data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const startCreateVehicle = () => {
    setEditingVehicle(null);
    setNewVehicle({
      name: '',
      type: 'Luxury Shuttle Bus',
      route: '',
      time: '',
      capacity: 24,
      driverName: '',
      driverPhone: '',
      status: 'Scheduled',
      event: 'Ceremony & Reception',
      style: 'Luxury',
      amenities: ['AC', 'Sound System'],
      cost: 850,
      depositPaid: 200,
      tipEstimated: 150,
      uniform: 'Semi-Formal Suit',
      bufferTime: 20,
      assignedGuests: []
    });
    setIsModalOpen(true);
  };

  const startEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle(vehicle);
    setIsModalOpen(true);
  };

  // Add Vehicle to DB
  const addVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.name || !newVehicle.route || !newVehicle.time) {
      alert('Please fill out all required fields.');
      return;
    }

    if (editingVehicle) {
      const payload = {
        ...editingVehicle,
        ...newVehicle
      } as Vehicle;

      try {
        const res = await fetch('/api/transportation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setVehicles(vehicles.map(v => v._id === editingVehicle._id ? payload : v));
          setIsModalOpen(false);
          setEditingVehicle(null);
          setNewVehicle({
            name: '',
            type: 'Luxury Shuttle Bus',
            route: '',
            time: '',
            capacity: 24,
            driverName: '',
            driverPhone: '',
            status: 'Scheduled',
            event: 'Ceremony & Reception',
            style: 'Luxury',
            amenities: ['AC', 'Sound System'],
            cost: 850,
            depositPaid: 200,
            tipEstimated: 150,
            uniform: 'Semi-Formal Suit',
            bufferTime: 20,
            assignedGuests: []
          });
        } else {
          alert('Failed to update vehicle.');
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    const payload = {
      ...newVehicle,
      assignedGuests: []
    };

    try {
      const res = await fetch('/api/transportation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const created = await res.json();
        created.assignedGuests = []; // Ensure initial array format matches AssingedGuest[]
        setVehicles([...vehicles, created]);
        setIsModalOpen(false);
        setNewVehicle({
          name: '',
          type: 'Luxury Shuttle Bus',
          route: '',
          time: '',
          capacity: 24,
          driverName: '',
          driverPhone: '',
          status: 'Scheduled',
          event: 'Ceremony & Reception',
          style: 'Luxury',
          amenities: ['AC', 'Sound System'],
          cost: 850,
          depositPaid: 200,
          tipEstimated: 150,
          uniform: 'Semi-Formal Suit',
          bufferTime: 20,
        });
      } else {
        alert('Failed to add vehicle.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Vehicle
  const deleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle/shuttle?')) return;

    try {
      const res = await fetch(`/api/transportation?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setVehicles(vehicles.filter(v => v._id !== id));
      } else {
        alert('Failed to delete vehicle.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Save full vehicle object changes
  const saveVehicle = async (updated: Vehicle) => {
    try {
      const res = await fetch('/api/transportation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        setVehicles(vehicles.map(v => v._id === updated._id ? updated : v));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Update Status Dropdown
  const updateStatus = (vehicle: Vehicle, status: string) => {
    saveVehicle({ ...vehicle, status });
  };

  // Execute assigning guest with flags
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningVehicle || !selectedGuestName) return;

    if (assigningVehicle.assignedGuests.some(g => g.name === selectedGuestName)) {
      alert('This passenger is already assigned to this vehicle!');
      return;
    }
    if (assigningVehicle.assignedGuests.length >= assigningVehicle.capacity) {
      alert('This vehicle has reached maximum seat capacity!');
      return;
    }

    const updated = {
      ...assigningVehicle,
      assignedGuests: [
        ...assigningVehicle.assignedGuests,
        { name: selectedGuestName, flags: selectedFlags }
      ]
    };

    saveVehicle(updated);
    setAssigningVehicle(null);
    setSelectedGuestName('');
    setSelectedFlags([]);
  };

  // Unassign Guest
  const unassignGuest = (vehicle: Vehicle, guestName: string) => {
    const updated = {
      ...vehicle,
      assignedGuests: vehicle.assignedGuests.filter(g => g.name !== guestName)
    };
    saveVehicle(updated);
  };

  // Add operational log
  const addOpLog = async () => {
    if (!newFeedMsg.trim()) return;
    try {
      const res = await fetch('/api/transportation/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newFeedMsg })
      });
      if (res.ok) {
        const data = await res.json();
        setOpsFeed([data, ...opsFeed]);
        setNewFeedMsg('');
      } else {
        alert('Failed to post dispatch log.');
      }
    } catch (error) {
      console.error('Failed to post dispatch log:', error);
    }
  };

  // Update operational log
  const updateOpLog = async (id: string, newMessage: string) => {
    try {
      const res = await fetch('/api/transportation/logs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, message: newMessage })
      });
      if (res.ok) {
        setOpsFeed(opsFeed.map(log => log._id === id ? { ...log, message: newMessage } : log));
        setEditingLogId(null);
      } else {
        alert('Failed to update operational log.');
      }
    } catch (error) {
      console.error('Failed to update operational log:', error);
    }
  };

  // Delete operational log
  const deleteOpLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this dispatch log?')) return;
    try {
      const res = await fetch(`/api/transportation/logs?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOpsFeed(opsFeed.filter(log => log._id !== id));
      } else {
        alert('Failed to delete operational log.');
      }
    } catch (error) {
      console.error('Failed to delete operational log:', error);
    }
  };

  // Calculations
  const filteredVehicles = activeTab === 'All Events' 
    ? vehicles 
    : vehicles.filter(v => v.event === activeTab);

  const totalCapacity = filteredVehicles.reduce((sum, v) => sum + Number(v.capacity), 0);
  const totalAssigned = filteredVehicles.reduce((sum, v) => sum + v.assignedGuests.length, 0);
  
  const confirmedGuests = guests.filter(g => g.status === 'Confirmed');
  const unassignedGuests = confirmedGuests.filter(
    g => !vehicles.some(v => v.assignedGuests.some(ag => ag.name === g.name))
  );

  // Budget calculations
  const actualCosts = vehicles.reduce((sum, v) => sum + Number(v.cost || 0) + Number(v.tipEstimated || 0), 0);
  const depositsTotal = vehicles.reduce((sum, v) => sum + Number(v.depositPaid || 0), 0);
  const balanceOutstanding = actualCosts - depositsTotal;

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>Loading premium transportation management dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <style>{`
        @media print {
          .no-print, .sidebar, .btn, .tab-bar, select, button {
            display: none !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid var(--neutral-gray) !important;
            break-inside: avoid;
            margin-bottom: 1rem !important;
          }
          body {
            background: white !important;
          }
        }
        .tab-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }
        .tab-btn.active {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
        }
        .pill-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 8px;
        }
        .flag-tag {
          font-size: 0.7rem;
          background: rgba(124, 58, 237, 0.1);
          color: var(--accent-primary);
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          font-weight: 600;
        }
      `}</style>

      <Link href="/" className="btn btn-secondary no-print" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
        ← Back to Wedding Dashboard
      </Link>

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--text-primary)' }}>
            Transportation Logistics Planner
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Schedule wedding shuttles, manage VIP limousines, view passenger lists, and balance budgets.
          </p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={startCreateVehicle}>
            🚐 Create Vehicle / Shuttle
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            🖨️ Print Manifests
          </button>
        </div>
      </div>

      {/* Event Filters Tab Bar */}
      <div className="tab-bar no-print" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['All Events', 'Ceremony & Reception', 'Rehearsal Dinner', 'Welcome Party', 'Farewell Brunch'].map(tab => (
          <button 
            key={tab} 
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dashboard Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Active Fleet ({activeTab})
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: 'var(--accent-primary)' }}>
            {filteredVehicles.length} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Vehicles</span>
          </p>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Seats Available
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: 'var(--text-primary)' }}>
            {totalCapacity} <span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>Total Capacity</span>
          </p>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Assigned Passenger Ratio
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: 'var(--success, #2e7d32)' }}>
            {totalAssigned} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>/ {confirmedGuests.length} Confirmed Guests</span>
          </p>
          <div style={{ width: '100%', height: '6px', background: 'var(--neutral-gray)', borderRadius: '3px', marginTop: '0.75rem', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (totalAssigned / Math.max(1, confirmedGuests.length)) * 100)}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '3px' }} />
          </div>
        </div>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
            Unassigned Passengers
          </h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: unassignedGuests.length > 0 ? 'var(--warning, #e65100)' : 'var(--success, #2e7d32)' }}>
            {unassignedGuests.length}
          </p>
        </div>
      </div>

      {/* Budget Tracker Widget */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, white 0%, var(--bg-secondary) 100%)' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          💳 Transportation Cost & Budget Tracker
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Allocated Budget</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>${totalBudgetAllocated}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Actual Vehicle Costs + Driver Tips</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>${actualCosts}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Paid Deposits</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success, #2e7d32)' }}>${depositsTotal}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Outstanding Balance</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--warning, #e65100)' }}>${balanceOutstanding}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Budget Capacity Meter</span>
            <div style={{ width: '100%', height: '8px', background: 'var(--neutral-gray)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min(100, (actualCosts / totalBudgetAllocated) * 100)}%`, 
                height: '100%', 
                background: actualCosts > totalBudgetAllocated ? 'var(--danger)' : 'var(--accent-primary)', 
                borderRadius: '4px' 
              }} />
            </div>
            {actualCosts > totalBudgetAllocated && (
              <span style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 'bold', display: 'block', marginTop: '0.25rem' }}>
                ⚠️ Budget exceeded by ${actualCosts - totalBudgetAllocated}!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Vehicles Display Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Fleet Manifest & Route Schedule ({activeTab})
          </h2>

          {filteredVehicles.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No vehicles found for this event filter.</p>
              <button className="btn btn-primary" onClick={startCreateVehicle} style={{ marginTop: '1rem' }}>
                + Add Custom Vehicle
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {filteredVehicles.map(vehicle => {
                const isOverCap = vehicle.assignedGuests.length > vehicle.capacity;
                const progressPercent = (vehicle.assignedGuests.length / vehicle.capacity) * 100;
                
                return (
                  <div key={vehicle._id} className="card" style={{ padding: '1.75rem', background: 'white', borderLeft: `6px solid ${vehicle.style === 'Eco-Friendly' ? 'var(--success, #2e7d32)' : 'var(--accent-primary)'}` }}>
                    
                    {/* Header Tags & Metadata */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div>
                        <span className="pill-badge" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-primary)', marginRight: '0.5rem' }}>
                          🚐 {vehicle.type}
                        </span>
                        <span className="pill-badge" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-primary)', marginRight: '0.5rem' }}>
                          📅 {vehicle.event}
                        </span>
                        <span className="pill-badge" style={{ 
                          background: vehicle.style === 'Eco-Friendly' ? 'rgba(46, 125, 50, 0.1)' : 'var(--bg-secondary)', 
                          color: vehicle.style === 'Eco-Friendly' ? '#2e7d32' : 'var(--text-secondary)' 
                        }}>
                          {vehicle.style === 'Eco-Friendly' ? '🌿 Eco-Friendly (Carbon Offset)' : `✨ Style: ${vehicle.style}`}
                        </span>
                      </div>
                      
                      <div className="no-print" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select 
                          value={vehicle.status}
                          onChange={(e) => updateStatus(vehicle, e.target.value)}
                          style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.8rem', background: 'white' }}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Vehicle Identity */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)' }}>
                        {vehicle.name}
                      </h3>
                      <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                        ⏱️ Departure: {vehicle.time}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                      📍 Route Details: <strong style={{ color: 'var(--text-primary)' }}>{vehicle.route}</strong>
                    </p>

                    {/* Timeline & Buffer Tracker */}
                    <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                      <div>🕰️ <strong>Boarding Window:</strong> 10 mins prior</div>
                      <div>⏱️ <strong>Buffer Integrated:</strong> {vehicle.bufferTime} mins</div>
                      <div>🤵 <strong>Driver Uniform:</strong> {vehicle.uniform}</div>
                    </div>

                    {/* Amenities list */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      {vehicle.amenities.map(amenity => (
                        <span key={amenity} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                          ✔️ {amenity}
                        </span>
                      ))}
                    </div>

                    {/* Capacity and Meter */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        <span>Seat Capacity Loading:</span>
                        <strong style={{ color: isOverCap ? 'var(--danger)' : 'var(--text-primary)' }}>
                          {vehicle.assignedGuests.length} / {vehicle.capacity} seats assigned
                        </strong>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--neutral-gray)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${Math.min(100, progressPercent)}%`, 
                          height: '100%', 
                          background: isOverCap ? 'var(--danger)' : progressPercent >= 100 ? 'var(--warning, #e65100)' : 'var(--success, #2e7d32)', 
                          borderRadius: '4px' 
                        }} />
                      </div>
                      {isOverCap && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 'bold' }}>
                          ⚠️ Overbooked Alert: Capacity exceeded by {vehicle.assignedGuests.length - vehicle.capacity} guest(s)!
                        </div>
                      )}
                    </div>

                    {/* Passengers Lists & Accessibility Logs */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Passenger Seat Assignments:</h4>
                      {vehicle.assignedGuests.length === 0 ? (
                        <p style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                          No passengers assigned yet. Select from dropdown below to fill.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {vehicle.assignedGuests.map(ag => (
                            <span key={ag.name} style={{ 
                              background: 'var(--bg-secondary)', 
                              fontSize: '0.8rem', 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '8px', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.35rem' 
                            }}>
                              👤 <strong>{ag.name}</strong>
                              {ag.flags.map(f => (
                                <span key={f} className="flag-tag" title={f}>
                                  {f === 'Mobility Aid' ? '♿' : f === 'Elderly Seat' ? '👵' : '👶'} {f}
                                </span>
                              ))}
                              <button 
                                onClick={() => unassignGuest(vehicle, ag.name)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                                className="no-print"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Interactive quick assign button */}
                    <div className="no-print" style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--neutral-gray)', paddingTop: '1rem' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                        onClick={() => {
                          setAssigningVehicle(vehicle);
                          setSelectedGuestName('');
                          setSelectedFlags([]);
                        }}
                      >
                        ➕ Assign Guest
                      </button>
                    </div>

                    {/* Card Footer Details */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--neutral-gray)', paddingTop: '0.75rem' }}>
                      <div>
                        🚘 <strong>Driver:</strong> {vehicle.driverName} | 📞 {vehicle.driverPhone}
                      </div>
                      <div>
                        💰 <strong>Cost:</strong> ${vehicle.cost} (+${vehicle.tipEstimated} tip)
                      </div>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          onClick={() => startEditVehicle(vehicle)}
                          className="btn btn-secondary no-print" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => deleteVehicle(vehicle._id!)}
                          className="btn btn-secondary no-print" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)' }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right-Hand Sidebar Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Driver Directory */}
          <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📇 Driver Contact Sheets
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {vehicles.map(v => (
                <div key={v._id} style={{ borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: 'bold' }}>👤 {v.driverName}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>📞 {v.driverPhone}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.2rem' }}>
                    🚖 vehicle: {v.name} ({v.type})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    🎩 Dress Code: {v.uniform}
                  </div>
                </div>
              ))}
            </div>
          </div>



          {/* Real-time operations feed */}
          <div className="card" style={{ padding: '1.5rem', background: 'white' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📡 Day-Of Coordination Feed
            </h3>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text" 
                placeholder="Log dispatch event..." 
                value={newFeedMsg}
                onChange={(e) => setNewFeedMsg(e.target.value)}
                style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.85rem' }}
              />
              <button className="btn btn-primary" onClick={addOpLog} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                Post
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {opsFeed.map((feed) => {
                const isEditing = editingLogId === feed._id;
                return (
                  <div 
                    key={feed._id} 
                    style={{ 
                      fontSize: '0.8rem', 
                      background: 'var(--bg-secondary)', 
                      padding: '0.5rem', 
                      borderRadius: '4px', 
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <input
                          type="text"
                          value={editingLogText}
                          onChange={(e) => setEditingLogText(e.target.value)}
                          style={{ 
                            flex: 1, 
                            padding: '0.2rem 0.4rem', 
                            fontSize: '0.8rem', 
                            borderRadius: '4px', 
                            border: '1px solid var(--neutral-gray)',
                            background: 'var(--bg-primary)'
                          }}
                        />
                        <button
                          onClick={() => updateOpLog(feed._id, editingLogText)}
                          style={{
                            border: 'none',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingLogId(null)}
                          style={{
                            border: 'none',
                            background: 'var(--neutral-gray)',
                            color: 'var(--text-secondary)',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '0.5rem' }}>
                        <span style={{ wordBreak: 'break-word', flex: 1 }}>{feed.message}</span>
                        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                          <button
                            onClick={() => {
                              setEditingLogId(feed._id);
                              setEditingLogText(feed.message);
                            }}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              padding: '0.1rem 0.25rem',
                              fontSize: '0.75rem'
                            }}
                            title="Edit dispatch message"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteOpLog(feed._id)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              padding: '0.1rem 0.25rem',
                              fontSize: '0.75rem'
                            }}
                            title="Delete dispatch message"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal Form */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div className="card" style={{ width: '550px', padding: '2rem', background: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              {editingVehicle ? '✏️ Edit Vehicle Details' : '🚐 Add Luxury Vehicle / Shuttle'}
            </h2>
            <form onSubmit={addVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                  Vehicle Name (e.g. Guest Shuttle Alpha)*
                </label>
                <input 
                  type="text" 
                  required
                  value={newVehicle.name} 
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Vehicle Type*
                  </label>
                  <select 
                    value={newVehicle.type} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
                  >
                    <option value="Luxury Shuttle Bus">Luxury Shuttle Bus</option>
                    <option value="Stretch Limousine">Stretch Limousine</option>
                    <option value="Classic Rolls Royce">Classic Rolls Royce</option>
                    <option value="Executive Town Car">Executive Town Car</option>
                    <option value="Sprinter Passenger Van">Sprinter Passenger Van</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Linked Wedding Event Segment*
                  </label>
                  <select 
                    value={newVehicle.event} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, event: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
                  >
                    <option value="Ceremony & Reception">Ceremony & Reception</option>
                    <option value="Rehearsal Dinner">Rehearsal Dinner</option>
                    <option value="Welcome Party">Welcome Party</option>
                    <option value="Farewell Brunch">Farewell Brunch</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Style Theme
                  </label>
                  <select 
                    value={newVehicle.style} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, style: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
                  >
                    <option value="Luxury">Luxury Gold Standard</option>
                    <option value="Classic">Classic Wedding White</option>
                    <option value="Vintage">Vintage Traditional</option>
                    <option value="Eco-Friendly">Eco-Friendly Offset</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Max Seat Capacity*
                  </label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={newVehicle.capacity} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, capacity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Route Details (Hotel ➔ Venue)*
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newVehicle.route} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, route: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Time (HH:MM)*
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 14:30"
                    value={newVehicle.time} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, time: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Cost ($)
                  </label>
                  <input 
                    type="number" 
                    value={newVehicle.cost} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, cost: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Deposit Paid ($)
                  </label>
                  <input 
                    type="number" 
                    value={newVehicle.depositPaid} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, depositPaid: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Estimated Tip ($)
                  </label>
                  <input 
                    type="number" 
                    value={newVehicle.tipEstimated} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, tipEstimated: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Driver Uniform
                  </label>
                  <select 
                    value={newVehicle.uniform} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, uniform: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
                  >
                    <option value="Formal White-Glove">Formal White-Glove</option>
                    <option value="Semi-Formal Suit">Semi-Formal Suit</option>
                    <option value="Casual Smart">Casual Smart</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Traffic Buffer (mins)
                  </label>
                  <input 
                    type="number" 
                    value={newVehicle.bufferTime} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, bufferTime: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Driver Name
                  </label>
                  <input 
                    type="text" 
                    value={newVehicle.driverName} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, driverName: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>
                    Driver Phone
                  </label>
                  <input 
                    type="text" 
                    value={newVehicle.driverPhone} 
                    onChange={(e) => setNewVehicle({ ...newVehicle, driverPhone: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVehicle ? '💾 Save Changes' : 'Save Custom Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Guest Modal with Accessibility flags */}
      {assigningVehicle && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 1000 
        }}>
          <div className="card" style={{ width: '450px', padding: '2rem', background: 'white' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
              👤 Assign Passenger Seat
            </h2>
            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Select Confirmed Wedding Guest
                </label>
                <select 
                  required
                  value={selectedGuestName}
                  onChange={(e) => setSelectedGuestName(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', background: 'white' }}
                >
                  <option value="">-- Select Guest --</option>
                  {confirmedGuests
                    .filter(g => !assigningVehicle.assignedGuests.some(ag => ag.name === g.name))
                    .map(g => (
                      <option key={g._id} value={g.name}>
                        {g.name} {g.relation ? `(${g.relation})` : ''}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Special Accommodations (Optional Accessibility Flags)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['Mobility Aid Required', 'Elderly Priority Seating', 'Child Seat Required'].map(flag => (
                    <label key={flag} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedFlags.includes(flag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFlags([...selectedFlags, flag]);
                          } else {
                            setSelectedFlags(selectedFlags.filter(f => f !== flag));
                          }
                        }}
                      />
                      {flag === 'Mobility Aid Required' ? '♿ Mobility Aid' : flag === 'Elderly Priority Seating' ? '👵 Elderly Priority' : '👶 Child Seat'}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setAssigningVehicle(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Assign Seats
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
