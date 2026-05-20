"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface InvitationGuest {
  _id?: string;
  name: string;
  email: string;
  table?: string;
  address?: string;
  sent: boolean;
  rsvp: 'Pending' | 'Yes' | 'No';
}

interface AveryTemplate {
  id: string;
  name: string;
  category: 'invitations' | 'stickers' | 'placecards' | 'labels';
  dimensions: string;
  cardWidth: string;   // Preview panel styling width
  cardHeight: string;  // Preview panel styling height
  aspectRatio: string;
  isRound?: boolean;
  description: string;
  perPage: number;
  columns: number;
  rows: number;
  printWidth: string;  // e.g. "5in"
  printHeight: string; // e.g. "7in"
  printPadding: string;
  fontSizeScale: number; // multiplier for typography
}

const AVERY_TEMPLATES: AveryTemplate[] = [
  // --- INVITATIONS & CARDS ---
  { 
    id: 'standard-5-7', 
    name: 'Standard Invitation Card', 
    category: 'invitations',
    dimensions: '5" x 7" (Portrait)', 
    cardWidth: '380px', 
    cardHeight: '532px', 
    aspectRatio: '5/7', 
    description: 'Standard elegant single invitation. Fits standard A7 envelopes.', 
    perPage: 1,
    columns: 1,
    rows: 1,
    printWidth: '5in',
    printHeight: '7in',
    printPadding: '2.5rem',
    fontSizeScale: 1.0
  },
  { 
    id: 'avery-5389', 
    name: 'Avery 5389 Postcard', 
    category: 'invitations',
    dimensions: '4" x 6" (Landscape)', 
    cardWidth: '480px', 
    cardHeight: '320px', 
    aspectRatio: '3/2', 
    description: 'Prints 2 postcards per sheet (Landscape) on standard letter cardstock.', 
    perPage: 2,
    columns: 1,
    rows: 2,
    printWidth: '6in',
    printHeight: '4in',
    printPadding: '1.5rem',
    fontSizeScale: 0.95
  },
  { 
    id: 'avery-5889', 
    name: 'Avery 5889 Large Card', 
    category: 'invitations',
    dimensions: '5.5" x 8.5" (Portrait)', 
    cardWidth: '360px', 
    cardHeight: '556px', 
    aspectRatio: '5.5/8.5', 
    description: 'Prints 2 half-fold large invitations per standard letter sheet.', 
    perPage: 2,
    columns: 1,
    rows: 2,
    printWidth: '5.5in',
    printHeight: '8.5in',
    printPadding: '2.5rem',
    fontSizeScale: 1.05
  },
  { 
    id: 'avery-8383', 
    name: 'Avery 8383 RSVP / Utility Card', 
    category: 'invitations',
    dimensions: '4.25" x 5.5" (Portrait)', 
    cardWidth: '320px', 
    cardHeight: '414px', 
    aspectRatio: '4.25/5.5', 
    description: 'Prints 4 cards per sheet (2x2 grid). Perfect for RSVP insert cards.', 
    perPage: 4,
    columns: 2,
    rows: 2,
    printWidth: '4.25in',
    printHeight: '5.5in',
    printPadding: '1.75rem',
    fontSizeScale: 0.85
  },

  // --- STICKERS & FAVORS ---
  { 
    id: 'avery-22807', 
    name: 'Avery 22807 Round Favor Sticker', 
    category: 'stickers',
    dimensions: '2" Round (Circular)', 
    cardWidth: '320px', 
    cardHeight: '320px', 
    aspectRatio: '1/1', 
    isRound: true,
    description: 'Prints 12 circular favor seals or envelope stickers per sheet (3x4 grid).', 
    perPage: 12,
    columns: 3,
    rows: 4,
    printWidth: '2in',
    printHeight: '2in',
    printPadding: '1.2rem',
    fontSizeScale: 0.65
  },
  { 
    id: 'avery-22802', 
    name: 'Avery 22802 Square Label', 
    category: 'stickers',
    dimensions: '2" x 2" (Square)', 
    cardWidth: '320px', 
    cardHeight: '320px', 
    aspectRatio: '1/1', 
    description: 'Prints 12 square favor stickers per sheet (3x4 grid).', 
    perPage: 12,
    columns: 3,
    rows: 4,
    printWidth: '2in',
    printHeight: '2in',
    printPadding: '1.2rem',
    fontSizeScale: 0.65
  },
  { 
    id: 'avery-22805', 
    name: 'Avery 22805 Gift / Favor Tag', 
    category: 'stickers',
    dimensions: '1.5" x 2.625" (Rectangle)', 
    cardWidth: '380px', 
    cardHeight: '217px', 
    aspectRatio: '2.625/1.5', 
    description: 'Prints 18 rectangle hangtags or favor labels per sheet (3x6 grid).', 
    perPage: 18,
    columns: 3,
    rows: 6,
    printWidth: '2.625in',
    printHeight: '1.5in',
    printPadding: '0.8rem',
    fontSizeScale: 0.55
  },

  // --- ESCORT & PLACE CARDS ---
  { 
    id: 'avery-5011', 
    name: 'Avery 5011 Escort / Place Card', 
    category: 'placecards',
    dimensions: '2" x 3.5" (Business Card size)', 
    cardWidth: '380px', 
    cardHeight: '217px', 
    aspectRatio: '3.5/2', 
    description: 'Prints 10 flat escort cards or food station cards per sheet (2x5 grid).', 
    perPage: 10,
    columns: 2,
    rows: 5,
    printWidth: '3.5in',
    printHeight: '2in',
    printPadding: '0.9rem',
    fontSizeScale: 0.65
  },
  { 
    id: 'avery-16109', 
    name: 'Avery 16109 Place / Tent Card', 
    category: 'placecards',
    dimensions: '2.5" x 3.75" (Portrait Flat)', 
    cardWidth: '360px', 
    cardHeight: '240px', 
    aspectRatio: '3.75/2.5', 
    description: 'Prints 6 folded place/table number tent cards per sheet (2x3 grid).', 
    perPage: 6,
    columns: 2,
    rows: 3,
    printWidth: '3.75in',
    printHeight: '2.5in',
    printPadding: '1.2rem',
    fontSizeScale: 0.75
  },

  // --- ENVELOPE ADDRESS LABELS ---
  { 
    id: 'avery-5160', 
    name: 'Avery 5160 Address Label', 
    category: 'labels',
    dimensions: '1" x 2.625" (Narrow Mailing)', 
    cardWidth: '380px', 
    cardHeight: '145px', 
    aspectRatio: '2.625/1', 
    description: 'Prints 30 narrow envelope/return address labels per sheet (3x10 grid).', 
    perPage: 30,
    columns: 3,
    rows: 10,
    printWidth: '2.625in',
    printHeight: '1in',
    printPadding: '0.4rem',
    fontSizeScale: 0.45
  },
  { 
    id: 'avery-5164', 
    name: 'Avery 5164 Shipping / Large Label', 
    category: 'labels',
    dimensions: '3.33" x 4" (Large Shipping)', 
    cardWidth: '340px', 
    cardHeight: '283px', 
    aspectRatio: '4/3.33', 
    description: 'Prints 6 large mailing or gift basket box labels per sheet (2x3 grid).', 
    perPage: 6,
    columns: 2,
    rows: 3,
    printWidth: '4in',
    printHeight: '3.33in',
    printPadding: '1.5rem',
    fontSizeScale: 0.8
  }
];

export default function InvitationBuilderPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'invitations' | 'stickers' | 'placecards' | 'labels'>('all');
  const [selectedAvery, setSelectedAvery] = useState<AveryTemplate>(AVERY_TEMPLATES[0]);
  const [templateTheme, setTemplateTheme] = useState<'obsidian' | 'rosewater' | 'minimalist' | 'champagne'>('rosewater');
  
  // Wording Fields
  const [title, setTitle] = useState('Emma & Liam\'s Wedding');
  const [hosts, setHosts] = useState('Hosted by Mr. & Mrs. Sterling');
  const [date, setDate] = useState('Saturday, October 24, 2026');
  const [time, setTime] = useState('4:00 in the Afternoon');
  const [location, setLocation] = useState('The Oak Ridge Chapel, 456 Vineyard Way');
  const [rsvpDate, setRsvpDate] = useState('September 1, 2026');
  const [dressCode, setDressCode] = useState('Black Tie Preferred');
  const [customNotes, setCustomNotes] = useState('Dinner and dancing to follow the ceremony.');

  // Escort Card Wording Preset
  const [placeCardName, setPlaceCardName] = useState('Mr. Christopher Sterling');
  const [placeCardTable, setPlaceCardTable] = useState('Table 7');

  // Address Label Wording Preset
  const [returnAddressName, setReturnAddressName] = useState('Emma & Liam Sterling');
  const [returnAddressLines, setReturnAddressLines] = useState('789 Honeymoon Suite Ave\nChampagne Hills, CA 90210');

  // Guests list
  const [guests, setGuests] = useState<InvitationGuest[]>([
    { name: 'Mr. John Doe', email: 'john@example.com', table: 'Table 1', address: '123 Main St, New York NY 10001', sent: true, rsvp: 'Yes' },
    { name: 'Dr. Sarah Connor', email: 'sarah@example.com', table: 'Table 2', address: '456 Cyberdyne Blvd, Los Angeles CA 90028', sent: true, rsvp: 'Pending' },
    { name: 'Mr. Bruce Wayne', email: 'bruce@example.com', table: 'VIP Suite', address: '1007 Mountain Dr, Gotham City NJ 07001', sent: false, rsvp: 'Pending' },
    { name: 'Ms. Clara Kent', email: 'clara@example.com', table: 'Table 1', address: '344 Clinton St Apt 3B, Metropolis NY 10002', sent: true, rsvp: 'No' }
  ]);

  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestTable, setNewGuestTable] = useState('');
  const [newGuestAddress, setNewGuestAddress] = useState('');

  // Load guests from DB on mount
  useEffect(() => {
    async function loadGuests() {
      try {
        const res = await fetch('/api/guests');
        if (res.ok) {
          const dbGuests = await res.json();
          if (dbGuests.length > 0) {
            const mapped = dbGuests.map((g: any) => ({
              _id: g._id,
              name: g.name,
              email: g.email || `${g.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
              table: g.table || 'Table 1',
              address: g.address || '123 Guest Lane, CA 90210',
              sent: g.sent ?? false,
              rsvp: g.status === 'Confirmed' ? 'Yes' : g.status === 'Declined' ? 'No' : 'Pending'
            }));
            setGuests(mapped);
          }
        }
      } catch (error) {
        console.error('Failed to load guests:', error);
      }
    }
    loadGuests();
  }, []);

  // Handle template selection changes and auto-load presets
  const handleAverySelection = (item: AveryTemplate) => {
    setSelectedAvery(item);
    
    // Auto populate text presets so they look beautiful instantly out of the box!
    if (item.category === 'stickers') {
      setTitle('THANK YOU!');
      setHosts('E & L — 10.24.26');
      setDate('');
      setTime('');
      setLocation('');
      setDressCode('');
      setCustomNotes('Made with love to celebrate our marriage.');
      setTemplateTheme('rosewater');
    } else if (item.category === 'placecards') {
      // Place cards presets
      setPlaceCardName('Mr. Christopher Sterling');
      setPlaceCardTable('Table 7');
      setTemplateTheme('champagne');
    } else if (item.category === 'labels') {
      // Return Address Label preset
      setReturnAddressName('Emma & Liam Sterling');
      setReturnAddressLines('789 Honeymoon Suite Ave\nChampagne Hills, CA 90210');
      setTemplateTheme('minimalist');
    } else {
      // Classic invitations preset
      setTitle('The Wedding of Emma & Liam');
      setDate('Saturday, October 24, 2026');
      setTime('4:00 in the Afternoon');
      setLocation('The Oak Ridge Chapel, 456 Vineyard Way');
      setRsvpDate('September 1, 2026');
      setHosts('Hosted by the Bride & Groom');
      setDressCode('Formal / Black Tie Preferred');
      setCustomNotes('Cocktail hour, dinner reception, and dancing to follow.');
      setTemplateTheme('rosewater');
    }
  };

  const addGuest = async () => {
    if (newGuestName.trim()) {
      const newG = {
        name: newGuestName.trim(),
        email: newGuestEmail.trim() || `${newGuestName.trim().toLowerCase().replace(/\s+/g, '')}@example.com`,
        table: newGuestTable.trim() || 'Table 1',
        address: newGuestAddress.trim() || '123 Guest Lane, CA 90210',
        sent: false,
        status: 'Pending'
      };

      try {
        const res = await fetch('/api/guests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newG)
        });
        if (res.ok) {
          const saved = await res.json();
          setGuests([
            ...guests,
            {
              _id: saved._id,
              name: saved.name,
              email: saved.email,
              table: saved.table,
              address: saved.address,
              sent: saved.sent ?? false,
              rsvp: 'Pending'
            }
          ]);
        }
      } catch (e) {
        console.error('Failed to sync new guest:', e);
        // Fallback local update
        setGuests([
          ...guests,
          {
            name: newG.name,
            email: newG.email,
            table: newG.table,
            address: newG.address,
            sent: false,
            rsvp: 'Pending'
          }
        ]);
      }

      setNewGuestName('');
      setNewGuestEmail('');
      setNewGuestTable('');
      setNewGuestAddress('');
    }
  };

  // Filter templates list based on category
  const filteredTemplates = AVERY_TEMPLATES.filter(
    t => activeCategory === 'all' || t.category === activeCategory
  );

  // Sync templates on category change
  useEffect(() => {
    const list = AVERY_TEMPLATES.filter(t => activeCategory === 'all' || t.category === activeCategory);
    if (list.length > 0 && !list.includes(selectedAvery)) {
      handleAverySelection(list[0]);
    }
  }, [activeCategory]);

  // Design Theme styles generator
  const getThemeStyles = () => {
    switch (templateTheme) {
      case 'obsidian':
        return {
          cardBg: 'linear-gradient(135deg, #111, #222)',
          color: '#fff',
          borderColor: '#cca43b',
          accentColor: '#cca43b',
          fontFamily: 'Georgia, serif',
          letterSpacing: '0.08em',
          textShadow: '0 0 10px rgba(204,164,59,0.3)',
        };
      case 'minimalist':
        return {
          cardBg: '#fafafa',
          color: '#111',
          borderColor: '#111',
          accentColor: '#6c757d',
          fontFamily: '"Helvetica Neue", Arial, sans-serif',
          letterSpacing: '0.12em',
          textShadow: 'none',
        };
      case 'champagne':
        return {
          cardBg: 'linear-gradient(135deg, #fdfbf7, #f5f0e1)',
          color: '#4e3b31',
          borderColor: '#d4af37',
          accentColor: '#9e7a28',
          fontFamily: 'Palatino, "Book Antiqua", serif',
          letterSpacing: '0.04em',
          textShadow: 'none',
        };
      case 'rosewater':
      default:
        return {
          cardBg: 'linear-gradient(135deg, #fff3f5, #ffe5ec)',
          color: '#5c3d42',
          borderColor: '#e5989b',
          accentColor: '#ffb5a7',
          fontFamily: '"Baskerville", Georgia, serif',
          letterSpacing: '0.06em',
          textShadow: '0 1px 4px rgba(229,152,155,0.2)',
        };
    }
  };

  const themeStyles = getThemeStyles();

  // Core JSX card renderer that handles scaling and styling dynamically
  const renderCardContent = (guestIndex?: number, isPrint = false) => {
    const isSticker = selectedAvery.category === 'stickers';
    const isPlaceCard = selectedAvery.category === 'placecards';
    const isLabel = selectedAvery.category === 'labels';

    // Grab dynamic guest data if iterating (for place cards or envelope addressing!)
    const currentGuest = guestIndex !== undefined ? guests[guestIndex % guests.length] : null;

    // Custom CSS styling based on type
    const scale = selectedAvery.fontSizeScale;
    const cardSizing = isPrint ? {
      width: selectedAvery.printWidth,
      height: selectedAvery.printHeight,
      padding: selectedAvery.printPadding,
    } : {
      width: selectedAvery.cardWidth,
      height: selectedAvery.cardHeight,
      aspectRatio: selectedAvery.aspectRatio,
      padding: selectedAvery.printPadding
    };

    return (
      <div 
        className="invitation-card"
        style={{
          ...cardSizing,
          background: themeStyles.cardBg,
          color: themeStyles.color,
          border: `4px double ${themeStyles.borderColor}`,
          borderRadius: selectedAvery.isRound ? '50%' : themeStyles.borderColor === '#111' ? '0px' : '12px',
          fontFamily: themeStyles.fontFamily,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: isPrint ? 'none' : '0 10px 30px rgba(0,0,0,0.12)',
          transition: 'all 0.4s ease',
          letterSpacing: themeStyles.letterSpacing,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* --- 1. SQUARE / ROUND STICKERS FAVORS --- */}
        {isSticker && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ border: `1px solid ${themeStyles.borderColor}`, borderRadius: selectedAvery.isRound ? '50%' : '4px', padding: '0.4rem', width: '90%', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ fontSize: `${1.4 * scale}rem`, fontWeight: 'bold', fontFamily: themeStyles.fontFamily, lineHeight: '1.2' }}>{title}</div>
              <div style={{ fontSize: `${0.95 * scale}rem`, fontStyle: 'italic', margin: '0.2rem 0', opacity: 0.85 }}>{hosts}</div>
              {customNotes && <div style={{ fontSize: `${0.75 * scale}rem`, opacity: 0.7, borderTop: `1px dashed ${themeStyles.borderColor}`, paddingTop: '0.25rem', marginTop: '0.25rem', width: '80%' }}>{customNotes}</div>}
            </div>
          </div>
        )}

        {/* --- 2. ESCORT & PLACE CARDS --- */}
        {isPlaceCard && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'space-between', padding: '0.25rem' }}>
            <div style={{ textTransform: 'uppercase', fontSize: `${0.6 * scale}rem`, letterSpacing: '0.15em', opacity: 0.8 }}>
              {title || 'Emma & Liam\'s Wedding'}
            </div>
            
            <div style={{ margin: 'auto 0' }}>
              <div style={{ fontSize: `${1.4 * scale}rem`, fontWeight: 'bold', fontFamily: themeStyles.fontFamily, color: themeStyles.borderColor }}>
                {currentGuest ? currentGuest.name : placeCardName}
              </div>
              <div style={{ fontSize: `${0.95 * scale}rem`, letterSpacing: '0.05em', marginTop: '0.25rem', fontWeight: '500' }}>
                {currentGuest ? currentGuest.table : placeCardTable}
              </div>
            </div>

            <div style={{ fontSize: `${0.65 * scale}rem`, fontStyle: 'italic', opacity: 0.7 }}>
              Thank You for Celebrating With Us
            </div>
          </div>
        )}

        {/* --- 3. ENVELOPE return or shipping address Labels --- */}
        {isLabel && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', justifyContent: 'center', textAlign: 'left', padding: '0.25rem 0.5rem' }}>
            {selectedAvery.id === 'avery-5160' ? (
              // Return Address Label (Single address printed across whole sheet)
              <div style={{ lineHeight: '1.3' }}>
                <div style={{ fontSize: `${0.85 * scale}rem`, fontWeight: 'bold', fontFamily: themeStyles.fontFamily, color: themeStyles.borderColor }}>{returnAddressName}</div>
                <div style={{ fontSize: `${0.75 * scale}rem`, whiteSpace: 'pre-line', color: 'var(--text-primary)', opacity: 0.85 }}>{returnAddressLines}</div>
              </div>
            ) : (
              // Large shipping/envelope label (Loops guest list addresses if printing)
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                <div style={{ fontSize: `${0.65 * scale}rem`, textTransform: 'uppercase', borderBottom: `1px solid ${themeStyles.borderColor}`, paddingBottom: '0.2rem', opacity: 0.8, color: themeStyles.borderColor }}>
                  Wedding Invitation
                </div>
                <div style={{ margin: 'auto 0', paddingLeft: '1rem' }}>
                  <div style={{ fontSize: `${1.1 * scale}rem`, fontWeight: 'bold' }}>
                    {currentGuest ? currentGuest.name : 'The Wayne Family'}
                  </div>
                  <div style={{ fontSize: `${0.85 * scale}rem`, whiteSpace: 'pre-line', marginTop: '0.25rem', opacity: 0.85 }}>
                    {currentGuest ? currentGuest.address : '1007 Mountain Dr\nGotham City, NJ 07001'}
                  </div>
                </div>
                <div style={{ fontSize: `${0.6 * scale}rem`, fontStyle: 'italic', textAlign: 'right', opacity: 0.7 }}>
                  Kindly Deliver to Honored Guest
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 4. STANDARD CARDS & INVITATIONS --- */}
        {!isSticker && !isPlaceCard && !isLabel && (
          <>
            {/* Elegant Header Frame */}
            <div style={{ textTransform: 'uppercase', fontSize: `${0.65 * scale}rem`, fontWeight: 'bold', opacity: 0.8, borderBottom: `1px solid ${themeStyles.borderColor}`, paddingBottom: '0.35rem', width: '80%' }}>
              You are Cordially Invited
            </div>

            {/* Content Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
              <div style={{ fontSize: `${0.8 * scale}rem`, fontStyle: 'italic' }}>
                {hosts}
              </div>
              
              <div style={{ fontSize: `${1.6 * scale}rem`, fontWeight: 'bold', fontFamily: themeStyles.fontFamily, margin: '0.2rem 0', textShadow: themeStyles.textShadow, lineHeight: '1.2' }}>
                {title}
              </div>

              <div>
                <div style={{ fontWeight: 'bold', fontSize: `${0.95 * scale}rem`, textTransform: 'uppercase' }}>{date}</div>
                {time && <div style={{ fontSize: `${0.85 * scale}rem`, fontStyle: 'italic', marginTop: '0.15rem' }}>{time}</div>}
              </div>

              <div style={{ borderTop: `1px solid ${themeStyles.borderColor}`, borderBottom: `1px solid ${themeStyles.borderColor}`, padding: '0.4rem 0', margin: '0.2rem 0' }}>
                {location && (
                  <>
                    <div style={{ textTransform: 'uppercase', fontSize: `${0.6 * scale}rem`, fontWeight: 'bold', letterSpacing: '0.15em' }}>Location</div>
                    <div style={{ fontSize: `${0.85 * scale}rem`, fontWeight: '500', marginTop: '0.15rem', lineHeight: '1.3' }}>{location}</div>
                  </>
                )}
              </div>

              {dressCode && (
                <div style={{ fontSize: `${0.8 * scale}rem`, letterSpacing: '0.05em' }}>
                  <strong>Dress Code:</strong> {dressCode}
                </div>
              )}
            </div>

            {/* Footer Notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
              <div style={{ fontSize: `${0.75 * scale}rem`, fontStyle: 'italic', opacity: 0.85, lineHeight: '1.3' }}>
                {customNotes}
              </div>
              <div style={{ fontSize: `${0.7 * scale}rem`, opacity: 0.7, borderTop: `1px dashed ${themeStyles.borderColor}`, paddingTop: '0.35rem', textTransform: 'uppercase' }}>
                Kindly RSVP by {rsvpDate}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="printable-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Universal Grid Printing Styles for Avery Sheets */}
      <style>{`
        @media screen {
          .only-print {
            display: none !important;
          }
        }
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, .sidebar, .nav, nav, header, footer {
            display: none !important;
          }
          html, body, .app-layout, .main-content, .container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          /* Full Page Printable Area */
          .only-print {
            display: block !important;
          }
          .printable-sheet-container {
            width: 8.5in !important;
            height: 11in !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            background: white !important;
            page-break-after: always !important;
          }

          /* General Avery sheets setup */
          .avery-print-grid {
            display: grid !important;
            width: 8.5in !important;
            height: 11in !important;
            box-sizing: border-box !important;
            background: white !important;
          }

          /* --- CATEGORY GRIDS BASED ON SKUS --- */
          
          /* Standard centered single (5x7) */
          .avery-print-grid.standard-5-7 {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            justify-items: center;
            align-items: center;
            padding: 0.5in;
          }
          
          /* Avery 5389 (2 per sheet, 4"x6" Landscape Postcards) */
          .avery-print-grid.avery-5389 {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            justify-items: center;
            align-items: center;
            padding: 0.75in 1.25in;
            gap: 0.5in;
          }

          /* Avery 5889 (2 per sheet, 5.5"x8.5" Portrait) */
          .avery-print-grid.avery-5889 {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            justify-items: center;
            align-items: center;
            padding: 0.5in 1.5in;
            gap: 0.5in;
          }

          /* Avery 8383 (4 per sheet, 4.25"x5.5" Portrait) */
          .avery-print-grid.avery-8383 {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            justify-items: center;
            align-items: center;
            padding: 0.5in;
            gap: 0.25in;
          }

          /* Avery 22807 Round & 22802 Square (12 per sheet, 3x4 grid) */
          .avery-print-grid.avery-22807, 
          .avery-print-grid.avery-22802 {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(4, 1fr);
            justify-items: center;
            align-items: center;
            padding: 0.5in 0.75in;
            gap: 0.25in;
          }

          /* Avery 22805 Rectangle Tags (18 per sheet, 3x6 grid) */
          .avery-print-grid.avery-22805 {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(6, 1fr);
            justify-items: center;
            align-items: center;
            padding: 0.5in;
            gap: 0.15in;
          }

          /* Avery 5011 Flat Escort Cards (10 per sheet, 2x5 grid) */
          .avery-print-grid.avery-5011 {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(5, 1fr);
            justify-items: center;
            align-items: center;
            padding: 0.5in;
            gap: 0.15in;
          }

          /* Avery 16109 Place Tent Cards (6 per sheet, 2x3 grid) */
          .avery-print-grid.avery-16109 {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            justify-items: center;
            align-items: center;
            padding: 0.5in;
            gap: 0.25in;
          }

          /* Avery 5160 Address Labels (30 per sheet, 3x10 grid) */
          .avery-print-grid.avery-5160 {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(10, 1fr);
            justify-items: center;
            align-items: center;
            padding: 0.5in 0.186in;
            column-gap: 0.14in;
            row-gap: 0.02in;
          }

          /* Avery 5164 shipping / Wine bottle (6 per sheet, 2x3 grid) */
          .avery-print-grid.avery-5164 {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            justify-items: center;
            align-items: center;
            padding: 0.5in;
            gap: 0.25in;
          }

          /* strict printed card dimensional bounding box constraints */
          .standard-5-7 .invitation-card { width: 5in !important; height: 7in !important; }
          .avery-5389 .invitation-card { width: 6in !important; height: 4in !important; }
          .avery-5889 .invitation-card { width: 5.5in !important; height: 8.5in !important; }
          .avery-8383 .invitation-card { width: 4.25in !important; height: 5.5in !important; }
          .avery-22807 .invitation-card { width: 2in !important; height: 2in !important; border-radius: 50% !important; }
          .avery-22802 .invitation-card { width: 2in !important; height: 2in !important; }
          .avery-22805 .invitation-card { width: 2.625in !important; height: 1.5in !important; }
          .avery-5011 .invitation-card { width: 3.5in !important; height: 2in !important; }
          .avery-16109 .invitation-card { width: 3.75in !important; height: 2.5in !important; }
          .avery-5160 .invitation-card { width: 2.625in !important; height: 1in !important; border-width: 1px !important; }
          .avery-5164 .invitation-card { width: 4in !important; height: 3.33in !important; }

          .invitation-card {
            box-shadow: none !important;
            margin: 0 !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Header controls */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link href="/" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Dashboard</Link>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--text-primary)' }}>Wedding Print Shop</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Design invitations, favor stickers, tags, place cards, and envelope labels.</p>
        </div>
        <button 
          className="btn" 
          onClick={() => window.print()}
          style={{ background: '#cca43b', color: 'white', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', cursor: 'pointer', borderRadius: '4px' }}
        >
          🖨️ Print Avery Label Sheet ({selectedAvery.perPage} per page)
        </button>
      </div>

      {/* Category selector filter */}
      <div className="no-print" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '1rem' }}>
        <button className={`btn btn-sm ${activeCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveCategory('all')}>📁 All Templates</button>
        <button className={`btn btn-sm ${activeCategory === 'invitations' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveCategory('invitations')}>✉️ Invitations & Cards</button>
        <button className={`btn btn-sm ${activeCategory === 'stickers' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveCategory('stickers')}>🏷️ Stickers & Favors</button>
        <button className={`btn btn-sm ${activeCategory === 'placecards' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveCategory('placecards')}>👥 Escort & Place Cards</button>
        <button className={`btn btn-sm ${activeCategory === 'labels' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveCategory('labels')}>📬 Address Labels</button>
      </div>

      {/* Selection Control Bar */}
      <div className="no-print" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap', background: 'var(--neutral-light)', padding: '1.5rem', borderRadius: 'var(--radius-sm)' }}>
        
        {/* Dropdown with templates based on category filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 2, minWidth: '250px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📐 Avery Template SKU / Size</span>
          <select 
            value={selectedAvery.id} 
            onChange={(e) => {
              const matched = AVERY_TEMPLATES.find(t => t.id === e.target.value);
              if (matched) handleAverySelection(matched);
            }}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid var(--neutral-gray)', 
              background: 'white',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              width: '100%'
            }}
          >
            {filteredTemplates.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.dimensions} ({t.perPage} per sheet)
              </option>
            ))}
          </select>
        </div>

        {/* Template Theme Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Design Color Palette</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn btn-sm ${templateTheme === 'rosewater' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTemplateTheme('rosewater')}>🌸 Blush</button>
            <button className={`btn btn-sm ${templateTheme === 'obsidian' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTemplateTheme('obsidian')}>🖤 Luxe</button>
            <button className={`btn btn-sm ${templateTheme === 'minimalist' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTemplateTheme('minimalist')}>⬜ Clean</button>
            <button className={`btn btn-sm ${templateTheme === 'champagne' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTemplateTheme('champagne')}>🥂 Gold</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* 1. Dynamic Wording Input Panel based on Category */}
        <div className="card no-print" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
            {selectedAvery.category === 'labels' ? 'Address Details' : selectedAvery.category === 'placecards' ? 'Place Card Presets' : 'Custom Wording'}
          </h2>
          
          {/* A. Labels category details form */}
          {selectedAvery.category === 'labels' && (
            <>
              {selectedAvery.id === 'avery-5160' ? (
                <>
                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Sender Name</label>
                    <input type="text" value={returnAddressName} onChange={(e) => setReturnAddressName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Address Lines</label>
                    <textarea value={returnAddressLines} onChange={(e) => setReturnAddressLines(e.target.value)} rows={3} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem', fontFamily: 'monospace' }} />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Note: Avery 5160 prints this return address repeatedly across all 30 labels on the sheet.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Large shipping/envelope labels print dynamic recipient addresses from your Guest Invitation Tracker below.
                  </p>
                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Generic Preview Recipient</label>
                    <input type="text" placeholder="The Wayne Family" disabled style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem', background: '#eee' }} />
                  </div>
                </>
              )}
            </>
          )}

          {/* B. Placecard category details form */}
          {selectedAvery.category === 'placecards' && (
            <>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Place Card Header (Event Name)</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Sample Guest Name</label>
                  <input type="text" value={placeCardName} onChange={(e) => setPlaceCardName(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Sample Table</label>
                  <input type="text" value={placeCardTable} onChange={(e) => setPlaceCardTable(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                When printed, escort cards print each guest name and table number dynamically from the Guest Tracker!
              </p>
            </>
          )}

          {/* C. Invitation & Sticker category details form */}
          {selectedAvery.category !== 'labels' && selectedAvery.category !== 'placecards' && (
            <>
              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{selectedAvery.category === 'stickers' ? 'Sticker Main Text' : 'Invitation Title / Couple'}</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
              </div>

              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{selectedAvery.category === 'stickers' ? 'Sticker Subtitle / Initials' : 'Event Hosts / Organizers'}</label>
                <input type="text" value={hosts} onChange={(e) => setHosts(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
              </div>

              {selectedAvery.category !== 'stickers' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Date</label>
                      <input type="text" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Time</label>
                      <input type="text" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Venue & Address</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>RSVP Deadline</label>
                      <input type="text" value={rsvpDate} onChange={(e) => setRsvpDate(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
                    </div>
                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Dress Code</label>
                      <input type="text" value={dressCode} onChange={(e) => setDressCode(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Custom Note / Footer Message</label>
                <textarea value={customNotes} onChange={(e) => setCustomNotes(e.target.value)} rows={3} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)', marginTop: '0.25rem' }} />
              </div>
            </>
          )}
        </div>

        {/* 2. Interactive Screen Preview Panel */}
        <div className="no-print" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>🖥️ Screen Canvas Preview</strong> ({selectedAvery.dimensions})
            <br />
            <span style={{ fontSize: '0.75rem' }}>{selectedAvery.description}</span>
          </div>

          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              background: '#f0f0f0',
              padding: '2rem',
              borderRadius: '8px',
              border: '1px dashed var(--neutral-gray)',
              width: '100%',
              maxWidth: '520px',
              boxSizing: 'border-box'
            }}
          >
            {renderCardContent(undefined, false)}
          </div>
        </div>

        {/* 3. Dispatch & Guest Tracker Center */}
        <div className="card no-print" style={{ padding: '2rem', gridColumn: 'span 2', marginTop: '1rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '1rem', borderBottom: '1px solid var(--neutral-gray)', paddingBottom: '0.5rem' }}>
            Guest Information & Address Dispatch Center
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Manage mailing addresses and RSVP tables. Dynamic tags and escort place cards print guest-by-guest automatically using this database!
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--neutral-gray)', textAlign: 'left', fontSize: '0.9rem' }}>
                <th style={{ padding: '0.5rem' }}>Guest Name</th>
                <th style={{ padding: '0.5rem' }}>Mailing Address</th>
                <th style={{ padding: '0.5rem' }}>Table No.</th>
                <th style={{ padding: '0.5rem' }}>RSVP Response</th>
                <th style={{ padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={index} style={{ borderBottom: '1px solid var(--neutral-light)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{guest.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{guest.address}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{guest.table}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <select 
                      value={guest.rsvp} 
                      onChange={async (e) => {
                        const val = e.target.value as any;
                        const updated = [...guests];
                        updated[index].rsvp = val;
                        setGuests(updated);

                        if (guest._id) {
                          try {
                            await fetch('/api/guests', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                _id: guest._id,
                                status: val === 'Yes' ? 'Confirmed' : val === 'No' ? 'Declined' : 'Pending'
                              })
                            });
                          } catch (err) {
                            console.error('Failed to sync RSVP:', err);
                          }
                        }
                      }}
                      style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--neutral-gray)' }}
                    >
                      <option value="Pending">🕒 Pending</option>
                      <option value="Yes">✓ Attending (Yes)</option>
                      <option value="No">✕ Declining (No)</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      onClick={async () => {
                        setGuests(guests.filter((_, i) => i !== index));
                        if (guest._id) {
                          try {
                            await fetch(`/api/guests?id=${guest._id}`, {
                              method: 'DELETE'
                            });
                          } catch (err) {
                            console.error('Failed to delete guest:', err);
                          }
                        }
                      }} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                    >
                      ✕ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Guest Tracker Form */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--neutral-light)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Add Guest Address & Details:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              <input 
                type="text" 
                placeholder="Guest Full Name (e.g. Mr. Bruce Wayne)" 
                value={newGuestName} 
                onChange={(e) => setNewGuestName(e.target.value)} 
                style={{ padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px' }} 
              />
              <input 
                type="text" 
                placeholder="Guest Email Address" 
                value={newGuestEmail} 
                onChange={(e) => setNewGuestEmail(e.target.value)} 
                style={{ padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px' }} 
              />
              <input 
                type="text" 
                placeholder="Table Assignment (e.g. Table 4)" 
                value={newGuestTable} 
                onChange={(e) => setNewGuestTable(e.target.value)} 
                style={{ padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px' }} 
              />
              <input 
                type="text" 
                placeholder="Postal Address (e.g. 1007 Mountain Dr, Gotham NJ)" 
                value={newGuestAddress} 
                onChange={(e) => setNewGuestAddress(e.target.value)} 
                style={{ padding: '0.4rem', border: '1px solid var(--neutral-gray)', borderRadius: '4px' }} 
              />
            </div>
            <button className="btn btn-primary" onClick={addGuest} style={{ padding: '0.5rem 1.5rem', marginTop: '0.75rem' }}>+ Add to Guest List</button>
          </div>
        </div>

      </div>

      {/* --- Printable Avery Sheet Layout (Only active on print, completely hidden on screen) --- */}
      <div className="only-print printable-sheet-container">
        <div className={`avery-print-grid ${selectedAvery.id}`}>
          {Array.from({ length: selectedAvery.perPage }).map((_, idx) => {
            // Dynamic generation support:
            // For escort place cards or shipping address labels, loop through different guests.
            // For general stickers or return address labels, repeat the exact same card.
            const guestIndex = (selectedAvery.category === 'placecards' || (selectedAvery.category === 'labels' && selectedAvery.id !== 'avery-5160')) 
              ? idx 
              : undefined;

            return (
              <div key={idx}>
                {renderCardContent(guestIndex, true)}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
