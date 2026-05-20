"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

const legalData = [
  {
    category: "Pre-Marriage Legal Requirements",
    items: [
      "Marriage license application process and waiting periods",
      "Age of consent and parental consent requirements for minors",
      "Prohibited degrees of consanguinity (blood relation restrictions)",
      "Prior marriage dissolution documentation (divorce decrees, death certificates)",
      "Blood test or medical certificate requirements (jurisdiction-dependent)",
      "Residency requirements for obtaining a license",
      "Officiant authorization and registration requirements",
      "Witness requirements for ceremony validity",
      "Marriage license expiration dates and validity windows",
      "Recognition of common-law marriage (where applicable)"
    ]
  },
  {
    category: "Marriage License & Ceremony Legality",
    items: [
      "Jurisdiction where the license must be obtained vs. where ceremony occurs",
      "Authorized officiants (religious, civil, judicial, online-ordained)",
      "Ceremony location permits (public parks, beaches, historic sites)",
      "Legal wording requirements for vows or pronouncements",
      "Filing the signed license with the appropriate government office",
      "Obtaining certified copies of the marriage certificate",
      "International recognition of your marriage certificate",
      "Apostille/authentication for use in foreign countries",
      "Name of marriage on legal documents (spelling, format consistency)",
      "Timeline for license pickup, ceremony, and return filing"
    ]
  },
  {
    category: "Name Change Procedures",
    items: [
      "Legal process for changing surname post-marriage (varies by jurisdiction)",
      "Updating Social Security Administration records",
      "Updating driver's license/state ID with DMV",
      "Updating passport with Department of State",
      "Updating bank accounts, credit cards, and financial institutions",
      "Updating employer records, payroll, and benefits enrollment",
      "Updating insurance policies (health, auto, life, home)",
      "Updating professional licenses and certifications",
      "Updating voter registration and jury duty records",
      "Updating titles and deeds for property ownership",
      "Updating utility accounts, subscriptions, and memberships",
      "Notifying IRS and updating tax filing status",
      "Updating digital accounts, email, and social media (optional but practical)",
      "Keeping documentation chain for each name change step"
    ]
  },
  {
    category: "Financial & Property Considerations",
    items: [
      "Community property vs. equitable distribution states (U.S.)",
      "Premarital asset disclosure and protection",
      "Joint vs. separate bank accounts and financial management",
      "Debt liability: pre-marital vs. marital debt responsibility",
      "Real estate ownership structures (joint tenancy, tenants in common)",
      "Vehicle titles and registration updates",
      "Business ownership interests and partnership agreements",
      "Intellectual property rights and royalties",
      "Retirement account beneficiary designations",
      "Stock options, RSUs, and equity compensation considerations",
      "Cryptocurrency and digital asset ownership documentation",
      "Co-signing loans or credit applications post-marriage",
      "Financial power of attorney considerations"
    ]
  },
  {
    category: "Prenuptial & Postnuptial Agreements",
    items: [
      "Enforceability requirements (full disclosure, independent counsel, timing)",
      "What can/cannot be included (child custody/support typically excluded)",
      "Sunset clauses or review triggers for agreement terms",
      "International enforceability considerations",
      "Modification procedures post-marriage (postnuptial agreements)",
      "Legal counsel requirements for both parties",
      "Notarization and witnessing requirements",
      "Storage and accessibility of executed agreements",
      "Disclosure of assets, debts, and expectations",
      "Waiver of spousal support/alimony provisions (jurisdiction-dependent)"
    ]
  },
  {
    category: "Tax Implications",
    items: [
      "Filing status options: Married Filing Jointly vs. Separately",
      "Marriage penalty or bonus impacts on federal/state taxes",
      "Dependent exemption and child tax credit considerations",
      "Capital gains implications for asset transfers between spouses",
      "Gift tax exclusions for interspousal transfers",
      "Estate tax marital deduction and portability elections",
      "State tax residency changes due to marriage",
      "Tax implications of name changes on W-2s and 1099s",
      "Deductibility of wedding expenses (generally not deductible, but exceptions exist)",
      "Impact on student loan repayment plans and income-driven calculations"
    ]
  },
  {
    category: "Insurance & Benefits",
    items: [
      "Health insurance enrollment windows and qualifying life events",
      "COBRA eligibility and spousal coverage options",
      "Life insurance beneficiary updates and policy ownership",
      "Disability insurance and income protection coordination",
      "Auto insurance multi-policy discounts and named driver updates",
      "Homeowners/renters insurance policy adjustments",
      "Long-term care insurance considerations",
      "Employer-sponsored benefits: FSA/HSA eligibility, dependent coverage",
      "Military benefits: TRICARE, VA benefits, BAH eligibility",
      "Social Security spousal and survivor benefit eligibility",
      "Pension plan survivor benefits and QDRO requirements"
    ]
  },
  {
    category: "Estate Planning & Inheritance",
    items: [
      "Will creation or updates to reflect spousal rights",
      "Revocable living trusts for asset management and probate avoidance",
      "Beneficiary designations on retirement accounts, life insurance, POD/TOD accounts",
      "Durable financial power of attorney for spouse",
      "Healthcare proxy/medical power of attorney designation",
      "HIPAA authorization for medical information sharing",
      "Digital asset legacy planning (passwords, accounts, crypto keys)",
      "Intestate succession laws if no will exists (spousal inheritance rights)",
      "Elective share statutes protecting spouses from disinheritance",
      "Funeral and burial preference documentation"
    ]
  },
  {
    category: "Immigration & Citizenship",
    items: [
      "Spousal visa petitions (CR-1/IR-1, K-1 fiancé(e) visa in U.S.)",
      "Adjustment of status vs. consular processing pathways",
      "Affidavit of Support (I-864) financial sponsorship requirements",
      "Conditional residency removal (I-751) for marriages under 2 years",
      "Citizenship eligibility timelines for foreign spouses",
      "Documentation requirements: bona fide marriage evidence",
      "Travel restrictions and advance parole considerations",
      "Work authorization timelines for immigrant spouses",
      "State department recognition of foreign marriages",
      "Dual citizenship implications and passport considerations"
    ]
  },
  {
    category: "Parental Rights & Family Law",
    items: [
      "Presumption of paternity for children born during marriage",
      "Stepparent adoption procedures and consent requirements",
      "Child custody and support obligations (marriage doesn't eliminate prior obligations)",
      "Surrogacy or assisted reproduction legal agreements",
      "Parental leave eligibility (FMLA, state programs)",
      "School enrollment and emergency contact authorizations",
      "Travel consent documentation for minor children",
      "Guardianship designations in estate planning",
      "Religious upbringing agreements (if applicable)",
      "International child abduction prevention (Hague Convention considerations)"
    ]
  },
  {
    category: "Employment & Professional Considerations",
    items: [
      "Workplace policies on spousal employment (conflicts of interest)",
      "Non-compete agreements and geographic restrictions affecting spouse's career",
      "Professional licensing board notifications (if name changes)",
      "Malpractice or professional liability insurance updates",
      "Partnership agreements in professional practices (law, medicine, etc.)",
      "Government security clearance updates for married status",
      "Relocation assistance and spousal employment support programs",
      "Military spousal employment protections and licensure portability"
    ]
  },
  {
    category: "International & Cross-Border Considerations",
    items: [
      "Recognition of marriage in foreign jurisdictions",
      "Conflict of laws: which country's marriage laws apply",
      "International prenuptial agreement enforceability",
      "Dual tax residency and treaty considerations",
      "Foreign property ownership and inheritance laws",
      "International child custody jurisdiction (Hague Convention)",
      "Visa and residency rights in spouse's home country",
      "Apostille requirements for document authentication abroad",
      "Translation and notarization of legal documents for foreign use",
      "Exit strategies: divorce jurisdiction and enforcement across borders"
    ]
  },
  {
    category: "Religious vs. Civil Marriage Distinctions",
    items: [
      "Legal validity of religious-only ceremonies (often not legally binding)",
      "Requirement for separate civil registration",
      "Religious annulment vs. civil divorce procedures",
      "Faith-based marital counseling or pre-Cana requirements",
      "Religious restrictions on divorce, remarriage, or interfaith unions",
      "Conscience clauses for officiants refusing to perform certain marriages",
      "Religious property ownership and community rules affecting marital assets"
    ]
  },
  {
    category: "Divorce, Dissolution & Contingency Planning",
    items: [
      "Residency requirements for filing divorce in your jurisdiction",
      "No-fault vs. fault-based divorce grounds and implications",
      "Spousal support/alimony calculation factors and duration",
      "Property division methodologies and valuation processes",
      "Child custody, visitation, and support guidelines",
      "Enforcement mechanisms for separation agreements",
      "Modification procedures for changed circumstances",
      "International divorce recognition and enforcement challenges",
      "Legal separation vs. divorce distinctions and benefits",
      "Mediation, collaborative law, or litigation pathway considerations"
    ]
  },
  {
    category: "Special Circumstances & Protections",
    items: [
      "Domestic violence protections and restraining order implications",
      "Elder marriage considerations: capacity, undue influence, guardianship",
      "Disability accommodations in marriage licensing and ceremony",
      "Incarcerated individuals' marriage rights and procedures",
      "Military marriages: SCRA protections, deployment considerations",
      "Tribal sovereignty and Native American marriage jurisdiction",
      "Polygamous or plural marriage recognition (generally not recognized in most jurisdictions)",
      "Posthumous marriage provisions (rare, jurisdiction-specific)"
    ]
  },
  {
    category: "Documentation & Recordkeeping",
    items: [
      "Secure storage of marriage license, certificate, and certified copies",
      "Digital backups and cloud storage of critical legal documents",
      "Organization system for contracts, agreements, and correspondence",
      "Timeline for document updates post-marriage (checklist approach)",
      "Notarization requirements for key documents",
      "Witness signatures and authentication protocols",
      "Translation requirements for non-English documents",
      "Retention periods for tax, legal, and financial records"
    ]
  },
  {
    category: "Emerging Legal Areas",
    items: [
      "Digital marriage licenses and e-signature validity",
      "Blockchain-based marriage records or smart contracts",
      "AI-generated prenuptial agreements and enforceability questions",
      "Metaverse or virtual ceremony legal recognition",
      "Cryptocurrency division and valuation in marital property",
      "Social media and digital privacy agreements between spouses",
      "Genetic testing results and disclosure obligations pre-marriage",
      "Climate migration impacts on marital jurisdiction and asset location"
    ]
  }
];

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function LegalPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [deadlines, setDeadlines] = useState({ appliedDate: '', expirationDate: '' });
  const [selectedState, setSelectedState] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Prompt Builder State
  const [selectedDocType, setSelectedDocType] = useState('');
  const [promptForm, setPromptForm] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const docTypes = [
    { value: 'prenup', label: 'Prenuptial Agreement Outline' },
    { value: 'ceremony', label: 'Ceremony Script & Vows' },
    { value: 'name_change', label: 'Name Change Notification Letter' }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/legal');
        const data = await res.json();
        if (data && !data.error) {
          setCheckedItems(data.checkedItems || []);
          setDeadlines(data.deadlines || { appliedDate: '', expirationDate: '' });
          setSelectedState(data.selectedState || '');
          setNotes(data.notes || {});
        }
      } catch (error) {
        console.error('Failed to fetch legal data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function saveData(updatedFields: any) {
    try {
      await fetch('/api/legal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkedItems,
          deadlines,
          selectedState,
          notes,
          ...updatedFields
        })
      });
    } catch (error) {
      console.error('Failed to save legal data:', error);
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleItem = (item: string) => {
    setCheckedItems(prev => {
      const updated = prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item];
      saveData({ checkedItems: updated });
      return updated;
    });
  };

  const updateNotes = (category: string, note: string) => {
    setNotes(prev => {
      const updated = { ...prev, [category]: note };
      saveData({ notes: updated });
      return updated;
    });
  };

  const updateDeadlines = (field: string, value: string) => {
    setDeadlines(prev => {
      const updated = { ...prev, [field]: value };
      saveData({ deadlines: updated });
      return updated;
    });
  };

  const updateState = (state: string) => {
    setSelectedState(state);
    saveData({ selectedState: state });
  };

  const generatePrompt = () => {
    let prompt = '';
    if (selectedDocType === 'prenup') {
      prompt = `Act as a family law expert. I need a sample outline for a prenuptial agreement for a couple living in ${selectedState || promptForm.state || 'my state'}. 
Party 1 assets include: ${promptForm.party1Assets || 'various assets'}. 
Party 2 assets include: ${promptForm.party2Assets || 'various assets'}. 
Specific concerns: ${promptForm.concerns || 'none'}. 
Please generate a structured outline covering asset division, debt liability, and protection of interests. Include a heavy disclaimer that this is a sample template and not legal advice.`;
    } else if (selectedDocType === 'ceremony') {
      prompt = `Act as a wedding officiant. I need a wedding ceremony script with the following details:
Tone: ${promptForm.tone || 'modern and lighthearted'}.
Style: ${promptForm.style || 'secular'}.
Special elements: ${promptForm.elements || 'none'}.
Please include opening remarks, a reading or story, vow exchange placeholders, and the pronouncement.`;
    } else if (selectedDocType === 'name_change') {
      prompt = `Act as a professional writer. I need a template letter to notify an institution about a legal name change post-marriage.
Recipient: ${promptForm.recipient || 'a bank/employer'}.
Old Name: ${promptForm.oldName || '[Old Name]'}.
New Name: ${promptForm.newName || '[New Name]'}.
Please generate a formal and clear letter requesting the update of records, mentioning that the marriage certificate can be provided upon request.`;
    }
    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('Prompt copied to clipboard!');
  };

  if (loading) {
    return <div className="container">Loading legal data...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link href="/" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Dashboard</Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>Legal Hub</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Comprehensive checklists and considerations for your wedding legalities.</p>
        </div>
        
        {/* State Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Jurisdiction</label>
          <select 
            value={selectedState} 
            onChange={(e) => updateState(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'white' }}
          >
            <option value="">Select State</option>
            {usStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {selectedState && (
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(selectedState + ' marriage license requirements')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textDecoration: 'none' }}
            >
              View State Requirements ↗
            </a>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ background: 'rgba(255, 193, 7, 0.05)', border: '1px solid rgba(255, 193, 7, 0.3)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#856404', marginBottom: '0.25rem' }}>Important Disclaimer</h3>
            <p style={{ fontSize: '0.85rem', color: '#856404', lineHeight: '1.5' }}>
              Marriage laws vary significantly by country, state, province, and locality. This list is for informational purposes only and does not constitute legal advice. Always consult with a qualified family law attorney, immigration specialist, tax professional, or estate planner in your jurisdiction to address your specific circumstances. Laws change frequently—verify current requirements with official government sources before making legal decisions.
            </p>
          </div>
        </div>
      </div>
          {/* Prenup Builder Link Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>📝 Custom Prenuptial Agreement Builder</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          We have created a dedicated, highly-detailed Prenup Builder. Answer questions for both parties to generate a master prompt for AI drafting.
        </p>
        <Link href="/legal/prenup" className="btn btn-primary" style={{ display: 'inline-block' }}>
          Open Prenup Builder
        </Link>
      </div>

      {/* Grid of Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {legalData.map((section, index) => {
          const isExpanded = expandedCategories.includes(section.category);
          const checkedCount = section.items.filter(item => checkedItems.includes(item)).length;
          const progress = Math.round((checkedCount / section.items.length) * 100);
          
          return (
            <div key={index} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
              <div 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => toggleCategory(section.category)}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)' }}>{section.category}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <div style={{ width: '100px', height: '4px', background: 'var(--neutral-gray)', borderRadius: '2px' }}>
                      <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{progress}%</span>
                  </div>
                </div>
                <span style={{ fontSize: '1.2rem', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  ▼
                </span>
              </div>
              
              <div style={{ 
                marginTop: '1rem', 
                maxHeight: isExpanded ? '1000px' : '0', 
                overflow: 'hidden', 
                transition: 'maxHeight 0.3s ease, opacity 0.3s ease',
                opacity: isExpanded ? 1 : 0
              }}>
                
                {/* Specific field for Marriage License deadlines */}
                {section.category === "Pre-Marriage Legal Requirements" && (
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Date Applied</label>
                      <input 
                        type="date" 
                        value={deadlines.appliedDate} 
                        onChange={(e) => updateDeadlines('appliedDate', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Expiration Date</label>
                      <input 
                        type="date" 
                        value={deadlines.expirationDate} 
                        onChange={(e) => updateDeadlines('expirationDate', e.target.value)}
                        style={{ width: '100%', padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                      />
                    </div>
                  </div>
                )}

                {/* Checklist */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {section.items.map((item, i) => {
                    const isChecked = checkedItems.includes(item);
                    return (
                      <li key={i} style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked} 
                          onChange={() => toggleItem(item)}
                          style={{ marginTop: '0.2rem' }}
                        />
                        <span style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {section.category === "Prenuptial & Postnuptial Agreements" && (
                  <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <Link href="/legal/prenup" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>
                      Open Prenup Builder
                    </Link>
                  </div>
                )}

                {/* Notes */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--neutral-gray)', paddingTop: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', display: 'block', marginBottom: '0.25rem' }}>Section Notes</label>
                  <textarea 
                    value={notes[section.category] || ''} 
                    onChange={(e) => updateNotes(section.category, e.target.value)}
                    placeholder="Add specific notes for this section..."
                    style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', fontSize: '0.85rem', minHeight: '60px' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
