"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [summary, setSummary] = useState({
    budget: { spent: 0, remaining: 0, total: 0 },
    proposals: { draft: 0, sent: 0 },
    leads: { active: 0 },
    guests: { total: 0 },
    revenue: { paid: 0 },
    projects: { active: [] as string[], total: 0 },
    alerts: [] as any[],
    events: [] as any[]
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Search Query State
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredHubLink, setHoveredHubLink] = useState<string | null>(null);
  
  // Rich Task Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    dueDate: '',
    priority: 'Medium',
    category: 'Planning'
  });

  // Rich Meeting Modals State
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<any | null>(null);
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    time: '',
    date: '',
    description: '',
    location: ''
  });

  // Upcoming Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    progress: 0
  });

  // Custom Alert Modal State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertForm, setAlertForm] = useState({
    message: '',
    project: 'General Reminder',
    type: 'warning'
  });

  // Live Search Query Filters
  const filteredTasks = tasks.filter((t: any) => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMeetings = meetings.filter((m: any) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter((ev: any) =>
    ev.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlerts = (summary.alerts || []).filter((a: any) =>
    a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.project || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLinkMatch = (label: string) => {
    if (!searchQuery) return true;
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchData() {
        try {
          const [dashboardRes, tasksRes, meetingsRes, eventsRes] = await Promise.all([
            fetch('/api/dashboard'),
            fetch('/api/tasks'),
            fetch('/api/meetings'),
            fetch('/api/events')
          ]);
          
          const dashboardData = await dashboardRes.json();
          const tasksData = await tasksRes.json();
          const meetingsData = await meetingsRes.json();
          const eventsData = await eventsRes.json();
          
          setSummary(prev => ({ ...prev, ...dashboardData }));
          setTasks(tasksData);
          setMeetings(meetingsData);
          setEvents(eventsData);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [status]);

  async function toggleTask(id: string, completed: boolean) {
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, completed })
      });
      setTasks(tasks.map((t: any) => t._id === id ? { ...t, completed } : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  async function saveTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskForm.title.trim()) return;

    try {
      if (editingTask) {
        await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingTask._id, ...taskForm })
        });
        setTasks(tasks.map((t: any) => t._id === editingTask._id ? { ...t, ...taskForm } : t));
      } else {
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskForm)
        });
        const data = await res.json();
        setTasks([...tasks, data]);
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      setTaskForm({ title: '', dueDate: '', priority: 'Medium', category: 'Planning' });
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  }

  async function deleteTask(id: string) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE'
      });
      setTasks(tasks.filter((t: any) => t._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }

  async function saveMeeting(e: React.FormEvent) {
    e.preventDefault();
    if (!meetingForm.title.trim()) return;

    try {
      if (editingMeeting) {
        await fetch('/api/meetings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingMeeting._id, ...meetingForm })
        });
        setMeetings(meetings.map((m: any) => m._id === editingMeeting._id ? { ...m, ...meetingForm } : m));
      } else {
        const res = await fetch('/api/meetings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(meetingForm)
        });
        const data = await res.json();
        setMeetings([...meetings, data]);
      }
      setIsMeetingModalOpen(false);
      setEditingMeeting(null);
      setMeetingForm({ title: '', time: '', date: '', description: '', location: '' });
    } catch (error) {
      console.error('Failed to save meeting:', error);
    }
  }

  async function deleteMeeting(id: string) {
    if (!confirm('Are you sure you want to delete this meeting?')) return;
    try {
      await fetch(`/api/meetings?id=${id}`, {
        method: 'DELETE'
      });
      setMeetings(meetings.filter((m: any) => m._id !== id));
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    }
  }

  // Save Event Handler (Create & Update)
  async function saveEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    try {
      if (editingEvent) {
        await fetch('/api/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: editingEvent._id, ...eventForm })
        });
        setEvents(events.map((ev: any) => ev._id === editingEvent._id ? { ...ev, ...eventForm } : ev));
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventForm)
        });
        const data = await res.json();
        setEvents([...events, data]);
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
      setEventForm({ title: '', date: '', progress: 0 });
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  }

  // Delete Event Handler
  async function deleteEvent(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`/api/events?id=${id}`, {
        method: 'DELETE'
      });
      setEvents(events.filter((ev: any) => ev._id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }

  // Save Custom Alert Handler
  async function saveAlert(e: React.FormEvent) {
    e.preventDefault();
    if (!alertForm.message.trim()) return;

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertForm)
      });
      const data = await res.json();
      
      const formattedAlert = {
        _id: data._id,
        type: data.type,
        message: data.message,
        project: data.project,
        isCustom: true
      };

      setSummary(prev => ({
        ...prev,
        alerts: [...prev.alerts, formattedAlert]
      }));

      setIsAlertModalOpen(false);
      setAlertForm({ message: '', project: 'General Reminder', type: 'warning' });
    } catch (error) {
      console.error('Failed to save alert:', error);
    }
  }

  // Clear/Acknowledge Custom Alert
  async function acknowledgeAlert(id: string) {
    try {
      await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id, acknowledged: true })
      });
      setSummary(prev => ({
        ...prev,
        alerts: prev.alerts.filter((a: any) => a._id !== id)
      }));
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  }

  function printTasks() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const taskRows = tasks.map((t: any) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 14px;">${t.completed ? '☑ Completed' : '☐ Pending'}</td>
        <td style="padding: 10px; font-size: 14px; font-weight: bold; ${t.completed ? 'text-decoration: line-through; color: #888;' : ''}">${t.title}</td>
        <td style="padding: 10px; font-size: 14px;">${t.category || 'Planning'}</td>
        <td style="padding: 10px; font-size: 14px; font-weight: bold; color: ${t.priority === 'High' ? '#d32f2f' : t.priority === 'Medium' ? '#f57c00' : '#388e3c'};">${t.priority || 'Medium'}</td>
        <td style="padding: 10px; font-size: 14px;">${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Wedding Tasks Manifest</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
            h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; text-align: center; margin-bottom: 10px; color: #2c3e50; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8f9fa; padding: 12px; font-size: 14px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057; }
          </style>
        </head>
        <body>
          <h1>📋 Wedding Planning Task Manifest</h1>
          <p style="text-align: center; color: #6c757d; font-size: 12px; margin-bottom: 30px;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <table>
            <thead>
              <tr>
                <th style="width: 100px;">Status</th>
                <th>Task Description</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${taskRows || '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">No tasks found.</td></tr>'}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  function printMeetings() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const sortedMeetings = [...meetings].sort((a: any, b: any) => new Date(a.date + 'T' + (a.time || '00:00')).getTime() - new Date(b.date + 'T' + (b.time || '00:00')).getTime());
    const meetingRows = sortedMeetings.map((m: any) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 14px; font-weight: bold;">${m.date}</td>
        <td style="padding: 10px; font-size: 14px; font-weight: bold; color: #e91e63;">${m.time || 'N/A'}</td>
        <td style="padding: 10px; font-size: 14px; font-weight: bold;">${m.title}</td>
        <td style="padding: 10px; font-size: 14px; color: #555;">${m.description || 'N/A'}</td>
        <td style="padding: 10px; font-size: 14px; color: #777;">${m.location || 'N/A'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Wedding Meetings & Consultations Schedule</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
            h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 28px; text-align: center; margin-bottom: 10px; color: #2c3e50; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8f9fa; padding: 12px; font-size: 14px; text-align: left; border-bottom: 2px solid #dee2e6; color: #495057; }
          </style>
        </head>
        <body>
          <h1>📅 Wedding Meetings & Consultations Schedule</h1>
          <p style="text-align: center; color: #6c757d; font-size: 12px; margin-bottom: 30px;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <table>
            <thead>
              <tr>
                <th style="width: 100px;">Date</th>
                <th style="width: 80px;">Time</th>
                <th>Meeting Title</th>
                <th>Details / Description</th>
                <th>Location / Connection Link</th>
              </tr>
            </thead>
            <tbody>
              ${meetingRows || '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #999;">No scheduled meetings found.</td></tr>'}
            </tbody>
          </table>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }

  // Calculate remaining days for events dynamically
  const getEventDaysLeft = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateStr + 'T00:00:00');
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `❌ Passed (${Math.abs(diffDays)}d ago)`;
    } else if (diffDays === 0) {
      return `🎉 Today!`;
    } else if (diffDays === 1) {
      return `📅 Tomorrow`;
    } else {
      return `${diffDays} days left`;
    }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <div className="container">Loading dashboard...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>🔍</span>
          <input
            type="text"
            placeholder="Live search milestones, tasks, meetings, or hub links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-primary)', background: 'var(--bg-secondary)', fontSize: '0.85rem' }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
            >
              ❌
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/icon.png" 
              alt="AURA" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-secondary)' }}
            />
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{session?.user?.name || 'Maya Brooks'}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Event Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search status feedback */}
      {searchQuery && (
        <div style={{ background: '#f5f3ff', borderLeft: '4px solid var(--accent-primary)', padding: '0.75rem 1rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#5b21b6', fontWeight: 500 }}>
            ⚡ Showing search results for "<strong>{searchQuery}</strong>" — matched {filteredTasks.length} tasks, {filteredMeetings.length} meetings, {filteredEvents.length} milestones, and {filteredAlerts.length} alerts.
          </p>
          <button 
            onClick={() => setSearchQuery('')} 
            style={{ background: 'none', border: 'none', color: '#5b21b6', textDecoration: 'underline', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Top Row: Tasks, Meetings, Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        
        {/* Today's Tasks */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '380px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📋 Today's Tasks 
              <span style={{ color: 'white', fontSize: '0.75rem', background: 'var(--accent-primary)', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                {filteredTasks.filter((t: any) => !t.completed).length} pending
              </span>
            </h3>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button 
                onClick={printTasks} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} 
                title="Print Task Manifest"
              >
                🖨️
              </button>
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setTaskForm({ title: '', dueDate: '', priority: 'Medium', category: 'Planning' });
                  setIsTaskModalOpen(true);
                }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }} 
                title="Add Task"
              >
                ➕
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
            {filteredTasks.map((task: any) => (
              <div 
                key={task._id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.5rem', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '6px',
                  borderLeft: `4px solid ${task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : '#388e3c'}`
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => toggleTask(task._id, !task.completed)} 
                    style={{ cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: '500', 
                      textDecoration: task.completed ? 'line-through' : 'none', 
                      color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                      wordBreak: 'break-word',
                      margin: 0
                    }}>
                      {task.title}
                    </p>
                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.65rem', background: '#e0f7fa', color: '#006064', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                        {task.category || 'Planning'}
                      </span>
                      {task.dueDate && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                          📅 {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', marginLeft: '0.5rem', flexShrink: 0 }}>
                  <button 
                    onClick={() => {
                      setEditingTask(task);
                      setTaskForm({
                        title: task.title,
                        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
                        priority: task.priority || 'Medium',
                        category: task.category || 'Planning'
                      });
                      setIsTaskModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                    title="Edit Task"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteTask(task._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                    title="Delete Task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                {searchQuery ? '🔍 No matching tasks found.' : '🎉 No tasks scheduled! You\'re all caught up.'}
              </p>
            )}
          </div>
        </div>

        {/* Today's Meetings */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '380px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📅 Today's Meetings 
              <span style={{ color: 'white', fontSize: '0.75rem', background: '#0288d1', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                {filteredMeetings.length} scheduled
              </span>
            </h3>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button 
                onClick={printMeetings} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} 
                title="Print Consultation Schedule"
              >
                🖨️
              </button>
              <button 
                onClick={() => {
                  setEditingMeeting(null);
                  setMeetingForm({ title: '', time: '', date: '', description: '', location: '' });
                  setIsMeetingModalOpen(true);
                }} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#0288d1', fontWeight: 'bold' }} 
                title="Schedule Meeting"
              >
                ➕
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
            {filteredMeetings.map((meeting: any) => (
              <div 
                key={meeting._id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '0.6rem', 
                  background: 'var(--bg-secondary)', 
                  borderRadius: '6px',
                  borderLeft: '4px solid #0288d1'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
                      {meeting.title}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#0288d1', fontWeight: 'bold', flexShrink: 0 }}>
                      ⏰ {meeting.time || 'All Day'}
                    </span>
                  </div>
                  {meeting.date && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.1rem 0' }}>
                      📅 {meeting.date}
                    </p>
                  )}
                  {meeting.description && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontStyle: 'italic', wordBreak: 'break-word' }}>
                      "{meeting.description}"
                    </p>
                  )}
                  {meeting.location && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', margin: '0.2rem 0 0 0', fontWeight: '500' }}>
                      📍 {meeting.location}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', marginLeft: '0.5rem', flexShrink: 0 }}>
                  <button 
                    onClick={() => {
                      setEditingMeeting(meeting);
                      setMeetingForm({
                        title: meeting.title,
                        time: meeting.time || '',
                        date: meeting.date || '',
                        description: meeting.description || '',
                        location: meeting.location || ''
                      });
                      setIsMeetingModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                    title="Edit Meeting"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteMeeting(meeting._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                    title="Delete Meeting"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {filteredMeetings.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                {searchQuery ? '🔍 No matching consultations found.' : '📅 No consultations scheduled.'}
              </p>
            )}
          </div>
        </div>

        {/* Projects Worked */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}>Projects Worked</h3>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>See All</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <svg width="100" height="100" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#E9ECEF" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent-primary)" strokeWidth="10" strokeDasharray="314" strokeDashoffset={`${314 - (314 * Math.min((summary as any).projects?.total || 0, 10) / 10)}`} />
              <text x="60" y="65" textAnchor="middle" fontSize="1.5rem" fontWeight="bold" fill="var(--text-primary)">{(summary as any).projects?.total || 0}</text>
              <text x="60" y="82" textAnchor="middle" fontSize="0.75rem" fill="var(--text-secondary)">clients</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(summary as any).projects?.active?.map((project: string, index: number) => {
                const colors = ['var(--accent-primary)', '#E91E63', '#00BCD4', '#FF9800'];
                return (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[index % colors.length] }}></span>
                    <span>{project}</span>
                  </div>
                );
              })}
              {(summary as any).projects?.active?.length === 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No active projects</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Middle Row: Upcoming Events & Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 3fr', gap: '1.5rem' }}>
        
        {/* Upcoming Events Container */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📅 Upcoming Milestones
              <span style={{ color: 'white', fontSize: '0.75rem', background: 'var(--accent-primary)', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                {filteredEvents.length} active
              </span>
            </h3>
            <button 
              onClick={() => {
                setEditingEvent(null);
                setEventForm({ title: '', date: '', progress: 0 });
                setIsEventModalOpen(true);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}
              title="Add Event"
            >
              ➕ Add Event
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', flex: 1 }}>
            {filteredEvents.map((event: any, index: number) => {
              const colors = [
                { bg: '#E3F2FD', fill: '#0288D1' }, // Blue
                { bg: '#E0F7FA', fill: '#00BCD4' }, // Cyan
                { bg: '#FCE4EC', fill: '#E91E63' }, // Pink
                { bg: '#FFF3E0', fill: '#F57C00' }  // Orange
              ];
              const color = colors[index % colors.length];
              const daysLeftLabel = getEventDaysLeft(event.date);

              return (
                <div 
                  key={event._id} 
                  style={{ 
                    background: color.bg, 
                    borderRadius: 'var(--radius-md)', 
                    padding: '1.25rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.75rem',
                    position: 'relative'
                  }}
                >
                  {/* Edit and Delete Actions */}
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.35rem' }}>
                    <button 
                      onClick={() => {
                        setEditingEvent(event);
                        setEventForm({
                          title: event.title,
                          date: event.date || '',
                          progress: event.progress || 0
                        });
                        setIsEventModalOpen(true);
                      }}
                      style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Edit Event"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => deleteEvent(event._id)}
                      style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}
                      title="Delete Event"
                    >
                      🗑️
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '4rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'white', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 'bold' }}>
                      {daysLeftLabel}
                    </span>
                  </div>
                  
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, minHeight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                    {event.title}
                  </p>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <span>Progress</span>
                      <span>{event.progress}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.5)', borderRadius: '3px' }}>
                      <div className="progress-fill" style={{ width: `${event.progress}%`, background: color.fill, height: '100%', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredEvents.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', width: '100%', padding: '2rem' }}>
                {searchQuery ? '🔍 No matching milestones found.' : '📅 No upcoming milestones logged. Click "Add Event" to begin!'}
              </p>
            )}
          </div>
        </div>

        {/* Alerts panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}>🚨 Live Alerts</h3>
            <button 
              onClick={() => setIsAlertModalOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ➕ Custom Alert
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
            {filteredAlerts.map((alert: any, index: number) => (
              <div 
                key={alert._id || index} 
                style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  alignItems: 'flex-start', 
                  background: alert.type === 'danger' ? '#fdf2f2' : '#fffbeb', 
                  padding: '0.5rem', 
                  borderRadius: '6px',
                  borderLeft: `3px solid ${alert.type === 'danger' ? 'var(--danger)' : 'var(--warning)'}`
                }}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>
                  {alert.type === 'danger' ? '🚨' : '⚠️'}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
                    {alert.message}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Category: {alert.project}
                  </span>
                </div>
                {alert.isCustom && (
                  <button 
                    onClick={() => acknowledgeAlert(alert._id)}
                    style={{ background: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '0.15rem 0.35rem', fontSize: '0.65rem', cursor: 'pointer', flexShrink: 0 }}
                  >
                    Clear
                  </button>
                )}
              </div>
            ))}
            {filteredAlerts.length === 0 && (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <p>{searchQuery ? '🔍 No matching alerts.' : '✅ All alerts cleared! Nice job.'}</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row: Wedding Planning Hub */}
      <div className="card" style={{ padding: '2.5rem', background: '#ffffff', borderRadius: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>Wedding Planning Hub</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>A structured, phase-by-phase workspace to coordinate your wedding journey.</p>
          </div>
        </div>

        {[
          {
            title: "Phase 1: Planning & Legal",
            badgeColor: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
            items: [
              { href: "/timelines", icon: "🕒", label: "Timelines", desc: "Schedule key events & milestones" },
              { href: "/vendors", icon: "🤝", label: "Vendors", desc: "Manage contracts, rates & contacts" },
              { href: "/leads", icon: "👥", label: "Leads", desc: "Track prospect conversions & deals" },
              { href: "/legal", icon: "⚖️", label: "Legal Hub", desc: "Organize permits & official papers" }
            ]
          },
          {
            title: "Phase 2: Design & Media",
            badgeColor: "linear-gradient(135deg, #fff1f2, #ffe4e6)",
            items: [
              { href: "/moodboard", icon: "🎨", label: "Vision Board", desc: "Swatches, colors & visual layouts" },
              { href: "/music", icon: "🎵", label: "Music & Playlists", desc: "Setlists, song items & DJ notes" },
              { href: "/photo-video", icon: "📸", label: "Photo & Video", desc: "Capture files, guides & details" }
            ]
          },
          {
            title: "Phase 3: Events & Catering",
            badgeColor: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
            items: [
              { href: "/food-beverage", icon: "🍽️", label: "Food & Beverage", desc: "Tasting reviews & catering menus" },
              { href: "/bridal-shower", icon: "👰", label: "Bridal Shower", desc: "Showers checklists & gift registry" },
              { href: "/bachelor-party", icon: "🍾", label: "Bachelor & Bachelorette", desc: "Party schedules, RSVPs & itineraries" },
              { href: "/rehearsal-dinner", icon: "🍽️", label: "Rehearsal Dinner", desc: "Dining guest manifest & seating lists" },
              { href: "/invitations", icon: "✉️", label: "Invitation Builder", desc: "Sleek stationery letters & templates" }
            ]
          },
          {
            title: "Phase 4: Day-Of Logistics",
            badgeColor: "linear-gradient(135deg, #fef3c7, #fde68a)",
            items: [
              { href: "/guests", icon: "👥", label: "Guests", desc: "Verify RSVPs & seating analytics" },
              { href: "/floorplans", icon: "📐", label: "Floor Plans", desc: "Map table layouts & seating blueprints" },
              { href: "/transportation", icon: "🚚", label: "Transportation", desc: "Log vehicle carriers & routes" }
            ]
          },
          {
            title: "Phase 5: Return & Registry",
            badgeColor: "linear-gradient(135deg, #ecfeff, #cffafe)",
            items: [
              { href: "/honeymoon", icon: "✈️", label: "Honeymoon Planner", desc: "Voyages, packing checklist & budgets" },
              { href: "/registry", icon: "🎁", label: "Registry & Gifts", desc: "AI thank-you notes & returns list" }
            ]
          }
        ].map((phase, pIndex) => (
          <div key={pIndex} style={{ marginBottom: pIndex === 4 ? 0 : '2.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', fontSize: '0.7rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                {pIndex + 1}
              </span>
              {phase.title}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {phase.items.map((item, iIndex) => {
                const active = isLinkMatch(item.label);
                const isHovered = hoveredHubLink === item.label;
                return (
                  <Link href={item.href} key={iIndex} style={{ textDecoration: 'none' }}>
                    <div 
                      onMouseEnter={() => setHoveredHubLink(item.label)}
                      onMouseLeave={() => setHoveredHubLink(null)}
                      style={{
                        display: 'block',
                        opacity: active ? 1 : 0.25,
                        transform: isHovered ? 'translateY(-4px)' : 'none',
                        boxShadow: isHovered ? '0 12px 24px rgba(111, 66, 193, 0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
                        border: active && searchQuery ? '2px solid var(--accent-primary)' : isHovered ? '1px solid rgba(111, 66, 193, 0.25)' : '1px solid rgba(0,0,0,0.06)',
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: phase.badgeColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.35rem',
                          flexShrink: 0
                        }}>
                          {item.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                              {item.label}
                            </span>
                            <span style={{
                              color: 'var(--accent-primary)',
                              opacity: isHovered ? 1 : 0,
                              transform: isHovered ? 'translateX(0)' : 'translateX(-5px)',
                              transition: 'all 0.2s ease',
                              fontSize: '1rem',
                              fontWeight: 'bold',
                              lineHeight: 1
                            }}>
                              ➔
                            </span>
                          </div>
                          <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            margin: '0.2rem 0 0 0',
                            lineHeight: '1.3',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal Overlay */}
      {isTaskModalOpen && (
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
          <div className="card" style={{ width: '450px', padding: '1.5rem', background: 'white' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              {editingTask ? '✏️ Edit Planning Task' : '📋 Add Planning Task'}
            </h2>
            <form onSubmit={saveTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Task Description*</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  placeholder="e.g. Schedule final florist consultation"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟠 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Design">Design</option>
                    <option value="Vendors">Vendors</option>
                    <option value="Legal">Legal</option>
                    <option value="Day-Of">Day-Of</option>
                    <option value="Return">Return</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Due Date</label>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsTaskModalOpen(false)}
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meeting Modal Overlay */}
      {isMeetingModalOpen && (
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
          <div className="card" style={{ width: '480px', padding: '1.5rem', background: 'white' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              {editingMeeting ? '✏️ Edit Consultation Meeting' : '📅 Schedule Consultation Meeting'}
            </h2>
            <form onSubmit={saveMeeting} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Meeting Title*</label>
                <input
                  type="text"
                  required
                  value={meetingForm.title}
                  onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  placeholder="e.g. Wedding Cake Tasting Session"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Date*</label>
                  <input
                    type="date"
                    required
                    value={meetingForm.date}
                    onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Time</label>
                  <input
                    type="time"
                    value={meetingForm.time}
                    onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Location / Virtual Link</label>
                <input
                  type="text"
                  value={meetingForm.location}
                  onChange={(e) => setMeetingForm({ ...meetingForm, location: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  placeholder="e.g. Sweet Treats Bakery or Zoom Link"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Notes / Description</label>
                <textarea
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm({ ...meetingForm, description: e.target.value })}
                  style={{ width: '100%', height: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem', resize: 'none' }}
                  placeholder="Specify agenda or details here..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsMeetingModalOpen(false)}
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  {editingMeeting ? 'Save Changes' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upcomming Event Modal Overlay */}
      {isEventModalOpen && (
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
          <div className="card" style={{ width: '450px', padding: '1.5rem', background: 'white' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              {editingEvent ? '✏️ Edit Upcoming Milestone' : '📅 Add Upcoming Milestone'}
            </h2>
            <form onSubmit={saveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Milestone Title*</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  placeholder="e.g. Floral Mockup & Ballroom Design Review"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Date*</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={eventForm.progress}
                    onChange={(e) => setEventForm({ ...eventForm, progress: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEventModalOpen(false)}
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  {editingEvent ? 'Save Changes' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Alert Modal Overlay */}
      {isAlertModalOpen && (
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
          <div className="card" style={{ width: '450px', padding: '1.5rem', background: 'white' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              🚨 Log Custom Dashboard Alert
            </h2>
            <form onSubmit={saveAlert} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Alert Message*</label>
                <input
                  type="text"
                  required
                  value={alertForm.message}
                  onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  placeholder="e.g. Caterer final headcount due in 2 days!"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Category / Project</label>
                  <input
                    type="text"
                    value={alertForm.project}
                    onChange={(e) => setAlertForm({ ...alertForm, project: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                    placeholder="e.g. Catering, Florist"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Severity Level</label>
                  <select
                    value={alertForm.type}
                    onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', fontSize: '0.9rem' }}
                  >
                    <option value="warning">🟡 Warning Reminder</option>
                    <option value="danger">🔴 Danger Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAlertModalOpen(false)}
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
                >
                  Post Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
