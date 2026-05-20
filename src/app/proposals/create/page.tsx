"use client";

import { useState, useEffect } from 'react';
import styles from './builder.module.css';
import { Proposal, ProposalBlock, TextBlock, InvoiceBlock, ContractBlock, HeaderBlock } from '@/types/proposal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export default function CreateProposal() {
  const [activeTab, setActiveTab] = useState<'content' | 'details'>('details');
  const [title, setTitle] = useState('Untitled Proposal');
  const [blocks, setBlocks] = useState<ProposalBlock[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const router = useRouter();

  const [proposalDetails, setProposalDetails] = useState({
    status: 'Draft' as Proposal['status'],
    version: '1.0',
    category: '',
    templateName: '',
    internalNotes: '',
    deliveryMethod: '',
    leadSource: '',
    weddingWebsite: '',
    weddingHashtag: '',
    officiant: { name: '', contact: '' },
    planner: { name: '', contact: '' },
    venueContingency: '',
    weatherContingency: '',
    specialRequests: '',
    dietaryRestrictions: '',
    musicPreferences: '',
    shotList: '',
    setupInstructions: '',
    cancellationPolicy: '',
    reschedulePolicy: '',
    insuranceRequired: false,
    permitsRequired: '',
    vendorMealCount: 0,
    parkingInstructions: '',
    emergencyContact: { name: '', phone: '' },
    language: 'English',
    currency: 'USD',
    taxExemptionId: '',
    paymentMethods: [] as string[],
    autoPaymentReminders: false,
    clientCredentials: '',
    teamMember: '',
    timezone: '',
    ceremonyStyle: '',
    dressCode: '',
    hotelBlock: '',
    shuttleSchedule: '',
    rehearsalDetails: '',
    deliverablesTimeline: '',
    testimonialRequest: false,
    socialMediaPermissions: false,
    privacyConsent: false,
    mobileOptimized: true,
  });

  const [companySettings, setCompanySettings] = useState({
    companyName: 'My Company',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    website: '',
    logoUrl: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const companyRes = await fetch('/api/company');
        let companyData = { companyName: 'My Company', address: '', city: '', state: '', zip: '', phone: '', website: '', logoUrl: '' };
        if (companyRes.ok) {
          companyData = await companyRes.json();
          setCompanySettings(companyData);
        }

        const leadsRes = await fetch('/api/leads');
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData);
        }

        const headerBlock: HeaderBlock = {
          id: 'header-1',
          type: 'header',
          content: {
            companyName: companyData.companyName,
            address: companyData.address,
            city: companyData.city,
            state: companyData.state,
            zip: companyData.zip,
            phone: companyData.phone,
            website: companyData.website,
            logoUrl: companyData.logoUrl,
            clientName: '',
            clientAddress: '',
            clientCity: '',
            clientState: '',
            clientZip: ''
          }
        };
        setBlocks([headerBlock]);

      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();
  }, []);

  const handleDetailsChange = (field: string, value: any) => {
    setProposalDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedDetailsChange = (group: string, field: string, value: any) => {
    setProposalDetails(prev => ({
      ...prev,
      [group]: { ...((prev as any)[group]), [field]: value }
    }));
  };

  const addTextBlock = () => {
    const newBlock: TextBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      content: { heading: 'New Text Block', body: 'Click to edit text content.' }
    };
    setBlocks([...blocks, newBlock]);
  };

  const addInvoiceBlock = () => {
    const newBlock: InvoiceBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'invoice',
      content: {
        items: [{ description: 'Wedding Photography', quantity: 1, price: 2500 }],
        notes: 'Thank you for your business!'
      }
    };
    setBlocks([...blocks, newBlock]);
  };

  const addContractBlock = () => {
    const newBlock: ContractBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'contract',
      content: { terms: 'This agreement is made between...', signatureRequired: true }
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const updateBlock = (id: string, newContent: any) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content: { ...block.content, ...newContent } } : block
    ));
  };

  const updateInvoiceItem = (blockId: string, itemIndex: number, field: string, value: string | number) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId && block.type === 'invoice') {
        const newItems = [...block.content.items];
        newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
        return { ...block, content: { ...block.content, items: newItems } };
      }
      return block;
    }));
  };

  const addInvoiceItem = (blockId: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId && block.type === 'invoice') {
        const newItems = [...block.content.items, { description: 'New Item', quantity: 1, price: 0 }];
        return { ...block, content: { ...block.content, items: newItems } };
      }
      return block;
    }));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[targetIndex];
      newBlocks[targetIndex] = temp;
      setBlocks(newBlocks);
    }
  };

  const saveProposal = async () => {
    const proposal: Proposal = {
      title,
      blocks,
      ...proposalDetails,
      createdAt: new Date(),
    };

    const response = await fetch('/api/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal)
    });

    if (response.ok) {
      router.push('/proposals');
    } else {
      alert('Failed to save proposal.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      
      {/* NEW: Back button */}
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/proposals" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          ← Back to Proposals
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <input
          type="text"
          className={styles.titleInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ fontSize: '1.8rem', border: 'none', background: 'transparent', fontWeight: 'bold', width: '60%' }}
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className={`btn ${activeTab === 'details' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('details')}>Details & Settings</button>
          <button className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('content')}>Content Blocks</button>
          <button className="btn btn-primary" onClick={saveProposal}>Save Proposal</button>
        </div>
      </div>

      <div className={styles.workspace} style={{ 
        display: 'grid', 
        gridTemplateColumns: (activeTab === 'content' && proposalDetails.status === 'Draft') ? '250px 1fr' : '1fr', 
        gap: '2rem' 
      }}>
        
        {activeTab === 'content' && proposalDetails.status === 'Draft' && (
          <aside className={styles.sidebar} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Add Blocks</h3>
            <div className={styles.blockList} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={addTextBlock}>+ Text Block</button>
              <button className="btn btn-secondary" onClick={addInvoiceBlock}>+ Invoice</button>
              <button className="btn btn-secondary" onClick={addContractBlock}>+ Contract</button>
            </div>
          </aside>
        )}

        <main className={styles.document} style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
          
          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {blocks.map((block, index) => (
                <div key={block.id} className={styles.blockWrapper} style={{ position: 'relative', padding: '1.5rem', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  
                  {/* Block Actions */}
                  {proposalDetails.status === 'Draft' && (
                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: index === 0 ? 0.3 : 1 }}>▲</button>
                      <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: index === blocks.length - 1 ? 0.3 : 1 }}>▼</button>
                      {block.type !== 'header' && (
                        <button className={styles.removeBtn} onClick={() => removeBlock(block.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>✕</button>
                      )}
                    </div>
                  )}
                  
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
                          <select 
                            value={block.content.clientName} 
                            onChange={(e) => {
                              const selectedLead = leads.find(l => l.name === e.target.value);
                              updateBlock(block.id, { 
                                clientName: e.target.value,
                                clientAddress: selectedLead?.address || '',
                                clientCity: selectedLead?.city || '',
                                clientState: selectedLead?.state || '',
                                clientZip: selectedLead?.zip || ''
                              });
                            }}
                            style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '200px', marginBottom: '0.25rem' }}
                          >
                            <option value="">Select a Lead</option>
                            {leads.map(lead => (
                              <option key={lead._id} value={lead.name}>{lead.name}</option>
                            ))}
                          </select>
                          <input 
                            type="text" 
                            value={block.content.clientAddress} 
                            onChange={(e) => updateBlock(block.id, { clientAddress: e.target.value })}
                            style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '200px', marginBottom: '0.25rem' }}
                            placeholder="Address"
                          />
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <input type="text" value={block.content.clientCity} onChange={(e) => updateBlock(block.id, { clientCity: e.target.value })} style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '100px' }} placeholder="City" />
                            <input type="text" value={block.content.clientState} onChange={(e) => updateBlock(block.id, { clientState: e.target.value })} style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '40px' }} placeholder="ST" />
                            <input type="text" value={block.content.clientZip} onChange={(e) => updateBlock(block.id, { clientZip: e.target.value })} style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '60px' }} placeholder="Zip" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div>
                      <input type="text" value={block.content.heading} onChange={(e) => updateBlock(block.id, { heading: e.target.value })} style={{ width: '100%', marginBottom: '0.5rem', fontWeight: 'bold', border: '1px solid var(--neutral-gray)', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }} />
                      <textarea value={block.content.body} onChange={(e) => updateBlock(block.id, { body: e.target.value })} style={{ width: '100%', minHeight: '100px', border: '1px solid var(--neutral-gray)', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }} />
                    </div>
                  )}

                  {block.type === 'invoice' && (
                    <div>
                      <h4 style={{ marginBottom: '0.5rem' }}>Invoice Block</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--neutral-gray)' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Description</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Qty</th>
                            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {block.content.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td style={{ padding: '0.5rem' }}><input type="text" value={item.description} onChange={(e) => updateInvoiceItem(block.id, itemIndex, 'description', e.target.value)} style={{ width: '100%', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }} /></td>
                              <td style={{ textAlign: 'right', padding: '0.5rem' }}><input type="number" value={item.quantity} onChange={(e) => updateInvoiceItem(block.id, itemIndex, 'quantity', parseInt(e.target.value))} style={{ width: '60px', textAlign: 'right', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }} /></td>
                              <td style={{ textAlign: 'right', padding: '0.5rem' }}><input type="number" value={item.price} onChange={(e) => updateInvoiceItem(block.id, itemIndex, 'price', parseFloat(e.target.value))} style={{ width: '100px', textAlign: 'right', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button className="btn btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }} onClick={() => addInvoiceItem(block.id)}>+ Add Item</button>
                    </div>
                  )}

                  {block.type === 'contract' && (
                    <div>
                      <h4 style={{ marginBottom: '0.5rem' }}>Contract Terms</h4>
                      <textarea value={block.content.terms} onChange={(e) => updateBlock(block.id, { terms: e.target.value })} style={{ width: '100%', minHeight: '150px', border: '1px solid var(--neutral-gray)', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }} />
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={block.content.signatureRequired} onChange={(e) => updateBlock(block.id, { signatureRequired: e.target.checked })} />Signature Required</label>
                      </div>
                    </div>
                  )}

                </div>
              ))}
              
              <button className="btn btn-primary" style={{ alignSelf: 'flex-end', marginTop: '1rem' }} onClick={saveProposal}>
                Save Proposal
              </button>
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>General & Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</label>
                    <select value={proposalDetails.status} onChange={(e) => handleDetailsChange('status', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}>
                      <option>Draft</option>
                      <option>Sent</option>
                      <option>Viewed</option>
                      <option>Accepted</option>
                      <option>Declined</option>
                      <option>Expired</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
