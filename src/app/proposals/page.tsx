"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './proposals.module.css';
import { Proposal } from '@/types/proposal';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  useEffect(() => {
    async function fetchProposals() {
      try {
        const res = await fetch('/api/proposals');
        if (res.ok) {
          const data = await res.json();
          setProposals(data);
        }
      } catch (error) {
        console.error('Failed to fetch proposals:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this proposal?')) return;

    const res = await fetch(`/api/proposals/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      setProposals(proposals.filter(p => p._id !== id));
    } else {
      alert('Failed to delete proposal.');
    }
  };

  const handleArchive = async (id: string) => {
    const res = await fetch(`/api/proposals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Archived' })
    });

    if (res.ok) {
      setProposals(proposals.map(p => p._id === id ? { ...p, status: 'Archived' as any } : p));
    } else {
      alert('Failed to archive proposal.');
    }
  };

  const handleUnarchive = async (id: string) => {
    const res = await fetch(`/api/proposals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Draft' }) // Move back to Draft on unarchive
    });

    if (res.ok) {
      setProposals(proposals.map(p => p._id === id ? { ...p, status: 'Draft' as any } : p));
    } else {
      alert('Failed to unarchive proposal.');
    }
  };

  const filteredProposals = proposals.filter(p => 
    activeTab === 'active' ? p.status !== 'Archived' : p.status === 'Archived'
  );

  if (loading) return <div className="container">Loading proposals...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Proposals</h1>
        <Link href="/proposals/create" className="btn btn-primary">
          Create Proposal
        </Link>
      </div>

      {/* NEW: Tabs for Active vs Archived */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('active')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1rem', 
            fontWeight: activeTab === 'active' ? 'bold' : 'normal',
            color: activeTab === 'active' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            borderBottom: activeTab === 'active' ? '2px solid var(--accent-primary)' : 'none',
            padding: '0.5rem 1rem',
            marginBottom: '-0.5rem'
          }}
        >
          Active ({proposals.filter(p => p.status !== 'Archived').length})
        </button>
        <button 
          onClick={() => setActiveTab('archived')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '1rem', 
            fontWeight: activeTab === 'archived' ? 'bold' : 'normal',
            color: activeTab === 'archived' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            borderBottom: activeTab === 'archived' ? '2px solid var(--accent-primary)' : 'none',
            padding: '0.5rem 1rem',
            marginBottom: '-0.5rem'
          }}
        >
          Archived ({proposals.filter(p => p.status === 'Archived').length})
        </button>
      </div>

      {filteredProposals.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
          {activeTab === 'active' ? 'No active proposals found.' : 'No archived proposals found.'}
        </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProposals.map((proposal) => (
              <tr key={proposal._id}>
                <td>{proposal.title}</td>
                <td>
                  <span className={`${styles.status} ${styles[`status${proposal.status}`]}`}>
                    {proposal.status}
                  </span>
                </td>
                <td>{proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div className={styles.actions}>
                    <Link href={`/proposals/${proposal._id}`} className={styles.actionBtn}>
                      View
                    </Link>
                    <Link href={`/proposals/${proposal._id}/edit`} className={styles.actionBtn}>
                      Edit
                    </Link>
                    {activeTab === 'active' ? (
                      <button onClick={() => handleArchive(proposal._id!)} className={styles.actionBtn} style={{ background: 'var(--neutral-gray)', color: 'var(--text-primary)' }}>
                        Archive
                      </button>
                    ) : (
                      <button onClick={() => handleUnarchive(proposal._id!)} className={styles.actionBtn} style={{ background: 'var(--accent-primary)', color: 'white' }}>
                        Unarchive
                      </button>
                    )}
                    <button onClick={() => handleDelete(proposal._id!)} className={styles.actionBtn} style={{ background: 'var(--danger)', color: 'white' }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
