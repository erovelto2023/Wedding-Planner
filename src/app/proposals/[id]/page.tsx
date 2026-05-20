"use client";

import { useState, useEffect, use } from 'react';
import { Proposal } from '@/types/proposal';
import styles from '../proposals.module.css';
import builderStyles from '../create/builder.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProposalViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  const handleConvertToInvoice = async () => {
    if (!proposal) return;

    const invoiceBlock = proposal.blocks.find(b => b.type === 'invoice');
    const headerBlock = proposal.blocks.find(b => b.type === 'header');

    if (!invoiceBlock) {
      alert('This proposal does not contain an invoice block.');
      return;
    }

    const clientName = headerBlock?.type === 'header' ? headerBlock.content.clientName : 'Unknown Client';
    const items = invoiceBlock.type === 'invoice' ? invoiceBlock.content.items : [];
    const amount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          amount,
          items,
          status: 'pending',
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (res.ok) {
        alert('Proposal converted to invoice successfully!');
        router.push('/business/invoices');
      } else {
        alert('Failed to convert proposal to invoice.');
      }
    } catch (error) {
      console.error('Error converting proposal to invoice:', error);
      alert('An error occurred.');
    }
  };

  useEffect(() => {
    async function fetchProposal() {
      try {
        const res = await fetch(`/api/proposals/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProposal(data);
        }
      } catch (error) {
        console.error('Failed to fetch proposal:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProposal();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="container">Loading proposal...</div>;

  if (!proposal) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
        <h1>Proposal Not Found</h1>
        <p>The proposal you are looking for does not exist.</p>
        <Link href="/proposals" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Proposals
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', padding: '3rem 1rem' }}>
      
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #proposal-print-area, #proposal-print-area * {
            visibility: visible;
          }
          #proposal-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* NEW: Back button added here */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="no-print">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/proposals" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            ← Back
          </Link>
          <span className={`${styles.status} ${styles[`status${proposal.status}`]}`}>
            Status: {proposal.status}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={handleConvertToInvoice}>
            Convert to Invoice
          </button>
          <button className="btn btn-secondary" onClick={handlePrint}>
            Save as PDF / Print
          </button>
        </div>
      </div>

      <main id="proposal-print-area" className={builderStyles.document} style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: '2rem', textAlign: 'center' }}>
          {proposal.title}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {proposal.blocks.map((block) => (
            <div key={block.id}>
              
              {block.type === 'header' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--neutral-gray)', paddingBottom: '1rem' }}>
                  <div style={{ width: '45%' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{block.content.companyName}</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{block.content.address}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {block.content.city ? `${block.content.city}, ` : ''}{block.content.state} {block.content.zip}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{block.content.phone}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{block.content.website}</p>
                  </div>
                  <div style={{ width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
                    {block.content.logoUrl && (
                      <img src={block.content.logoUrl} alt="Logo" style={{ maxHeight: '60px', marginBottom: '1rem' }} />
                    )}
                    <div>
                      <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Bill To:</h4>
                      <p style={{ fontWeight: 'bold' }}>{block.content.clientName}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{block.content.clientAddress}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {block.content.clientCity ? `${block.content.clientCity}, ` : ''}{block.content.clientState} {block.content.clientZip}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {block.type === 'text' && (
                <div style={{ padding: '1rem 0' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>{block.content.heading}</h3>
                  <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{block.content.body}</p>
                </div>
              )}

              {block.type === 'invoice' && (
                <div style={{ padding: '1rem 0' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Invoice</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--neutral-gray)' }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem' }}>Description</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }}>Qty</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }}>Price</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.content.items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                          <td style={{ padding: '0.5rem' }}>{item.description}</td>
                          <td style={{ textAlign: 'right', padding: '0.5rem' }}>{item.quantity}</td>
                          <td style={{ textAlign: 'right', padding: '0.5rem' }}>${item.price.toFixed(2)}</td>
                          <td style={{ textAlign: 'right', padding: '0.5rem' }}>${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'right', padding: '1rem 0.5rem', fontWeight: 'bold' }}>Total Amount:</td>
                        <td style={{ textAlign: 'right', padding: '1rem 0.5rem', fontWeight: 'bold' }}>
                          ${block.content.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {block.type === 'contract' && (
                <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Contract Terms</h3>
                  <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{block.content.terms}</p>
                  {block.content.signatureRequired && (
                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--neutral-gray)', paddingTop: '1rem', maxWidth: '300px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Authorized Signature</p>
                      <div style={{ height: '60px', border: '1px dashed var(--neutral-gray)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Click to sign</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3rem' }} className="no-print">
          <button className="btn btn-primary" onClick={() => alert('Accept & Pay feature coming soon!')}>
            Accept & Pay
          </button>
        </div>
      </main>
    </div>
  );
}
