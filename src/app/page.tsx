"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
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
    events: [
      { time: '14:00', event: 'Ceremony' },
      { time: '15:00', event: 'Photoshoot' }
    ]
  });
  const [tasks, setTasks] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingTime, setNewMeetingTime] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');

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
        body: JSON.stringify({ id, completed })
      });
      setTasks(tasks.map((t: any) => t._id === id ? { ...t, completed } : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }

  async function addTask() {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTaskTitle })
      });
      const data = await res.json();
      setTasks([...tasks, data] as any);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }

  async function addMeeting() {
    if (!newMeetingTitle.trim()) return;
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newMeetingTitle, time: newMeetingTime, date: newMeetingDate })
      });
      const data = await res.json();
      setMeetings([...meetings, data] as any);
      setNewMeetingTitle('');
      setNewMeetingTime('');
      setNewMeetingDate('');
    } catch (error) {
      console.error('Failed to add meeting:', error);
    }
  }

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
            placeholder="Search..."
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-secondary)' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button className="btn btn-primary" style={{ gap: '0.5rem' }}><span>+</span> New Event</button>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.5rem' }}>🔔</span>
            <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {session?.user?.name?.charAt(0) || 'M'}
            </div>
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{session?.user?.name || 'Maya Brooks'}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Event Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Row: Tasks, Meetings, Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        
        {/* Today's Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}>Today's Tasks <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', background: 'var(--neutral-gray)', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>{tasks.filter((t: any) => !t.completed).length}</span></h3>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>See All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
            {tasks.map((task: any) => (
              <div key={task._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <input type="checkbox" checked={task.completed} style={{ marginTop: '0.25rem' }} onChange={() => toggleTask(task._id, !task.completed)} />
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '500', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{task.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>Emma & Liam's Wedding</p>
                </div>
              </div>
            ))}
            {tasks.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No tasks for today!</p>
            )}
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem', fontSize: '0.85rem', padding: '0.5rem' }} onClick={() => {}}>+ Add Task</button>
        </div>

        {/* Today's Meetings */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}>Today's Meetings <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', background: 'var(--neutral-gray)', padding: '0.1rem 0.4rem', borderRadius: '10px' }}>{meetings.length}</span></h3>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>See All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
            {meetings.map((meeting: any) => (
              <div key={meeting._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.2rem' }}>📅</div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>{meeting.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{meeting.time} | {meeting.date}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Client - Brann Callahan</p>
                </div>
              </div>
            ))}
            {meetings.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No meetings for today!</p>
            )}
          </div>
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem', fontSize: '0.85rem', padding: '0.5rem' }} onClick={() => {}}>+ Schedule Meeting</button>
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
        
        {/* Upcoming Events */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}>Upcoming Events</h3>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>See All</Link>
          </div>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {events.map((event: any, index: number) => {
              const colors = [
                { bg: '#E3F2FD', fill: '#0288D1' }, // Blue
                { bg: '#E0F7FA', fill: '#00BCD4' }, // Cyan
                { bg: '#FCE4EC', fill: '#E91E63' }  // Pink
              ];
              const color = colors[index % colors.length];
              return (
                <div key={event._id} style={{ minWidth: '250px', background: color.bg, borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '-0.5rem' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#6C757D', border: '2px solid white' }}></div>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ADB5BD', border: '2px solid white', marginLeft: '-8px' }}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'white', padding: '0.2rem 0.5rem', borderRadius: '10px', fontWeight: 'bold' }}>3 days left</span>
                  </div>
                  <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{event.title}</p>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <span>Progress</span>
                      <span>{event.progress}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.5)' }}>
                      <div className="progress-fill" style={{ width: `${event.progress}%`, background: color.fill }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
            {events.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', width: '100%' }}>No upcoming events!</p>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}>Alerts</h3>
            <Link href="#" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>See All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(summary as any).alerts?.map((alert: any, index: number) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ color: alert.type === 'danger' ? 'var(--danger)' : 'var(--warning)' }}>
                  {alert.type === 'danger' ? '❗' : '⚠'}
                </span>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{alert.message}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>{alert.project}</p>
                </div>
              </div>
            ))}
            {(summary as any).alerts?.length === 0 && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center' }}>No alerts!</p>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Row: Wedding Planning Hub */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)' }}>Wedding Planning Hub</h3>
        
        {/* Phase 1: Planning & Legal */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase 1: Planning & Legal</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            <Link href="/timelines" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>🕒</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Timelines</p>
              </div>
            </Link>
            <Link href="/vendors" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>🤝</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Vendors</p>
              </div>
            </Link>
            <Link href="/leads" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>👥</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Leads</p>
              </div>
            </Link>
            <Link href="/legal" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>⚖️</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Legal Hub</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Phase 2: Music & Media */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase 2: Music & Media</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            <Link href="/music" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>🎵</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Music & Playlists</p>
              </div>
            </Link>
            <Link href="/photo-video" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>📸</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Photo & Video</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Phase 3: Events & Catering */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase 3: Events & Catering</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            <Link href="/food-beverage" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>🍽️</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Food & Beverage</p>
              </div>
            </Link>
            <Link href="/bridal-shower" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>👰</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Bridal Shower</p>
              </div>
            </Link>
            <Link href="/bachelor-party" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>🍾</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Bachelor & Bachelorette</p>
              </div>
            </Link>
            <Link href="/rehearsal-dinner" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>🍽️</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Rehearsal Dinner</p>
              </div>
            </Link>
            <Link href="/invitations" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>✉️</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Invitation Builder</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Phase 4: Day-Of Logistics */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase 4: Day-Of Logistics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            <Link href="/guests" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>👥</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Guests</p>
              </div>
            </Link>
            <Link href="/floorplans" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>📐</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Floor Plans</p>
              </div>
            </Link>
            <Link href="/transportation" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>🚚</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Transportation</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Phase 5: Return & Registry */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase 5: Return & Registry</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            <Link href="/honeymoon" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>✈️</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Honeymoon Planner</p>
              </div>
            </Link>
            <Link href="/registry" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
                <span style={{ fontSize: '2rem' }}>🎁</span>
                <p style={{ fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Registry & Gifts</p>
              </div>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
