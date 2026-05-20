"use client";

import { useState, useEffect, use } from 'react';
import styles from '../../create/builder.module.css';
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

export default function EditProposal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'content' | 'details'>('details');
  const [title, setTitle] = useState('Loading...');
  const [blocks, setBlocks] = useState<ProposalBlock[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);

  const [proposalDetails, setProposalDetails] = useState({
    status: 'Draft' as Proposal['status'],
    internalNotes: '',
    deliveryMethod: '',
    leadSource: '',
    weddingWebsite: '',
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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/proposals/${id}`);
        if (res.ok) {
          const data: Proposal = await res.json();
          setTitle(data.title);
          setBlocks(data.blocks);
          setIsEditable(data.status === 'Draft');

          setProposalDetails({
            status: data.status,
            internalNotes: data.internalNotes || '',
            deliveryMethod: data.deliveryMethod || '',
            leadSource: data.leadSource || '',
            weddingWebsite: data.weddingWebsite || '',
            officiant: data.officiant || { name: '', contact: '' },
            planner: data.planner || { name: '', contact: '' },
            venueContingency: data.venueContingency || '',
            weatherContingency: data.weatherContingency || '',
            specialRequests: data.specialRequests || '',
            dietaryRestrictions: data.dietaryRestrictions || '',
            musicPreferences: data.musicPreferences || '',
            shotList: data.shotList || '',
            setupInstructions: data.setupInstructions || '',
            cancellationPolicy: data.cancellationPolicy || '',
            reschedulePolicy: data.reschedulePolicy || '',
            insuranceRequired: data.insuranceRequired || false,
            permitsRequired: data.permitsRequired || '',
            vendorMealCount: data.vendorMealCount || 0,
            parkingInstructions: data.parkingInstructions || '',
            emergencyContact: data.emergencyContact || { name: '', phone: '' },
            language: data.language || 'English',
            currency: data.currency || 'USD',
            taxExemptionId: data.taxExemptionId || '',
            paymentMethods: data.paymentMethods || [],
            autoPaymentReminders: data.autoPaymentReminders || false,
            clientCredentials: data.clientCredentials || '',
            teamMember: data.teamMember || '',
            timezone: data.timezone || '',
            ceremonyStyle: data.ceremonyStyle || '',
            dressCode: data.dressCode || '',
            hotelBlock: data.hotelBlock || '',
            shuttleSchedule: data.shuttleSchedule || '',
            rehearsalDetails: data.rehearsalDetails || '',
            deliverablesTimeline: data.deliverablesTimeline || '',
            testimonialRequest: data.testimonialRequest || false,
            socialMediaPermissions: data.socialMediaPermissions || false,
            privacyConsent: data.privacyConsent || false,
            mobileOptimized: data.mobileOptimized || true,
          });
        }

        const leadsRes = await fetch('/api/leads');
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setLeads(leadsData);
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

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

  const updateBlock = (blockId: string, newContent: any) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, content: { ...block.content, ...newContent } } : block
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
    };

    const response = await fetch(`/api/proposals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal)
    });

    if (response.ok) {
      router.push('/proposals');
    } else {
      alert('Failed to save proposal.');
    }
  };

  if (loading) return <div className="container">Loading proposal...</div>;

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
          disabled={!isEditable}
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className={`btn ${activeTab === 'details' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('details')}>Details & Settings</button>
          <button className={`btn ${activeTab === 'content' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('content')}>Content Blocks</button>
          <button className="btn btn-primary" onClick={saveProposal}>Save Changes</button>
        </div>
      </div>

      <div className={styles.workspace} style={{ 
        display: 'grid', 
        gridTemplateColumns: (activeTab === 'content' && isEditable) ? '250px 1fr' : '1fr', 
        gap: '2rem' 
      }}>
        
        {activeTab === 'content' && isEditable && (
          <aside className={styles.sidebar} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Add Blocks</h3>
            <div className={styles.blockList} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={addTextBlock}>+ Text Block</button>
              <button className="btn btn-secondary" onClick={addInvoiceBlock}>+ Invoice</button>
              <button className="btn btn-secondary" onClick={addContractBlock}>+ Contract</button>
            </div>
          </aside>
        )}

        <main className={styles.document} style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
          
          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {blocks.map((block, index) => (
                <div key={block.id} className={styles.blockWrapper} style={{ position: 'relative', padding: '1.5rem', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  
                  {/* Block Actions */}
                  {isEditable && (
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
                            disabled={!isEditable}
                          >
                            <option value="">Select a Lead</option>
                            {leads.map(lead => (
                              <option key={lead._id} value={lead.name}>{lead.name}</option>
                            ))}
                          </select>
                          <input type="text" value={block.content.clientAddress} onChange={(e) => updateBlock(block.id, { clientAddress: e.target.value })} style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '200px', marginBottom: '0.25rem' }} placeholder="Address" disabled={!isEditable} />
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <input type="text" value={block.content.clientCity} onChange={(e) => updateBlock(block.id, { clientCity: e.target.value })} style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '100px' }} placeholder="City" disabled={!isEditable} />
                            <input type="text" value={block.content.clientState} onChange={(e) => updateBlock(block.id, { clientState: e.target.value })} style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '40px' }} placeholder="ST" disabled={!isEditable} />
                            <input type="text" value={block.content.clientZip} onChange={(e) => updateBlock(block.id, { clientZip: e.target.value })} style={{ textAlign: 'right', border: 'none', borderBottom: '1px solid var(--neutral-gray)', background: 'transparent', width: '60px' }} placeholder="Zip" disabled={!isEditable} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {block.type === 'text' && (
                    <div>
                      <input type="text" value={block.content.heading} onChange={(e) => updateBlock(block.id, { heading: e.target.value })} style={{ width: '100%', marginBottom: '0.5rem', fontWeight: 'bold', border: '1px solid var(--neutral-gray)', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }} disabled={!isEditable} />
                      <textarea value={block.content.body} onChange={(e) => updateBlock(block.id, { body: e.target.value })} style={{ width: '100%', minHeight: '100px', border: '1px solid var(--neutral-gray)', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }} disabled={!isEditable} />
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
                              <td style={{ padding: '0.5rem' }}><input type="text" value={item.description} onChange={(e) => updateInvoiceItem(block.id, itemIndex, 'description', e.target.value)} style={{ width: '100%', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }} disabled={!isEditable} /></td>
                              <td style={{ textAlign: 'right', padding: '0.5rem' }}><input type="number" value={item.quantity} onChange={(e) => updateInvoiceItem(block.id, itemIndex, 'quantity', parseInt(e.target.value))} style={{ width: '60px', textAlign: 'right', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }} disabled={!isEditable} /></td>
                              <td style={{ textAlign: 'right', padding: '0.5rem' }}><input type="number" value={item.price} onChange={(e) => updateInvoiceItem(block.id, itemIndex, 'price', parseFloat(e.target.value))} style={{ width: '100px', textAlign: 'right', border: '1px solid var(--neutral-gray)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }} disabled={!isEditable} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {isEditable && (
                        <button className="btn btn-secondary" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }} onClick={() => addInvoiceItem(block.id)}>+ Add Item</button>
                      )}
                    </div>
                  )}

                  {block.type === 'contract' && (
                    <div>
                      <h4 style={{ marginBottom: '0.5rem' }}>Contract Terms</h4>
                      <textarea value={block.content.terms} onChange={(e) => updateBlock(block.id, { terms: e.target.value })} style={{ width: '100%', minHeight: '150px', border: '1px solid var(--neutral-gray)', padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }} disabled={!isEditable} />
                      <div style={{ marginTop: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><input type="checkbox" checked={block.content.signatureRequired} onChange={(e) => updateBlock(block.id, { signatureRequired: e.target.checked })} disabled={!isEditable} />Signature Required</label>
                      </div>
                    </div>
                  )}

                </div>
              ))}
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
                      <option>Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Wedding Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Wedding Website</label>
                    <input type="text" value={proposalDetails.weddingWebsite} onChange={(e) => handleDetailsChange('weddingWebsite', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }} disabled={!isEditable} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Officiant Name</label>
                    <input type="text" value={proposalDetails.officiant.name} onChange={(e) => handleNestedDetailsChange('officiant', 'name', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }} disabled={!isEditable} />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Logistics & Policies</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Weather Contingency Plan</label>
                    <textarea value={proposalDetails.weatherContingency} onChange={(e) => handleDetailsChange('weatherContingency', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)', minHeight: '60px' }} disabled={!isEditable} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={proposalDetails.insuranceRequired} onChange={(e) => handleDetailsChange('insuranceRequired', e.target.checked)} disabled={!isEditable} />
                      Insurance Required
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Internal Notes</h3>
                <textarea
                  value={proposalDetails.internalNotes}
                  onChange={(e) => handleDetailsChange('internalNotes', e.target.value)}
                  placeholder="Keep your internal notes here. They won't be visible to the client."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)', minHeight: '100px' }}
                  disabled={!isEditable}
                />
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}
