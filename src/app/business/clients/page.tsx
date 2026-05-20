'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Client {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  status: string;
}

export default function ClientsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchClients() {
        try {
          const res = await fetch('/api/leads');
          const data = await res.json();
          // Filter leads with status 'Client'
          const clientLeads = data.filter((lead: any) => lead.status === 'Client');
          setClients(clientLeads);
        } catch (error) {
          console.error('Failed to fetch clients:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchClients();
    }
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return <div className="container" style={{ padding: '2rem' }}>Loading clients...</div>;
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)' }}>Clients</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your active clients.</p>
        </div>
        <Link href="/business" className="btn btn-secondary">← Back to Accounting</Link>
      </div>

      {/* Clients Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Active Clients</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem' }}>Name</th>
              <th style={{ padding: '0.75rem' }}>Email</th>
              <th style={{ padding: '0.75rem' }}>Phone</th>
              <th style={{ padding: '0.75rem' }}>Wedding Date</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                <td style={{ padding: '0.75rem' }}>{client.name}</td>
                <td style={{ padding: '0.75rem' }}>{client.email}</td>
                <td style={{ padding: '0.75rem' }}>{client.phone || 'N/A'}</td>
                <td style={{ padding: '0.75rem' }}>{client.date}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '10px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    background: '#E1BEE7',
                    color: '#7B1FA2'
                  }}>
                    {client.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No clients found. Convert leads to clients to see them here.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
