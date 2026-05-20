"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarLinks() {
  const pathname = usePathname();

  interface SidebarLinkItem {
    href: string;
    icon: string;
    label: string;
    description?: string;
  }

  interface SidebarSection {
    title: string;
    links: SidebarLinkItem[];
  }

  const sections: SidebarSection[] = [
    {
      title: 'Phase 1: Planning & Legal',
      links: [
        { href: '/', icon: '📊', label: 'Dashboard' },
        { href: '/timelines', icon: '🕒', label: 'Timelines' },
        { href: '/budget', icon: '💰', label: 'Budget Tracker' },
        { href: '/vendors', icon: '🤝', label: 'Vendors' },
        { href: '/legal', icon: '⚖️', label: 'Legal Hub' },
      ]
    },
    {
      title: 'Phase 2: Music & Media',
      links: [
        { href: '/music', icon: '🎵', label: 'Music & Playlists' },
        { href: '/photo-video', icon: '📸', label: 'Photo & Video' },
      ]
    },
    {
      title: 'Phase 3: Events & Catering',
      links: [
        { href: '/food-beverage', icon: '🍽️', label: 'Food & Beverage' },
        { href: '/bridal-shower', icon: '👰', label: 'Bridal Shower' },
        { href: '/bachelor-party', icon: '🍾', label: 'Bachelor & Bachelorette' },
        { href: '/rehearsal-dinner', icon: '🍽️', label: 'Rehearsal Dinner' },
        { href: '/invitations', icon: '✉️', label: 'Invitation Builder' },
      ]
    },
    {
      title: 'Phase 4: Day-Of Logistics',
      links: [
        { href: '/guests', icon: '👥', label: 'Guests' },
        { href: '/floorplans', icon: '📐', label: 'Floor Plans' },
        { href: '/transportation', icon: '🚚', label: 'Transportation' },
      ]
    },
    {
      title: 'Phase 5: Return & Registry',
      links: [
        { href: '/honeymoon', icon: '✈️', label: 'Honeymoon Planner' },
        { href: '/registry', icon: '🎁', label: 'Registry & Gifts' },
      ]
    },
    {
      title: 'Business & Settings',
      links: [
        { href: '/business', icon: '📊', label: 'Invoices', description: 'QuickBooks' },
        { href: '/leads', icon: '👥', label: 'Leads' },
        { href: '/proposals', icon: '📜', label: 'Proposal Builder' },
        { href: '/settings/company', icon: '⚙️', label: 'Company Settings' },
      ]
    }
  ];

  return (
    <nav className="sidebar-nav">
      {sections.map(section => (
        <div key={section.title} style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {section.title}
          </div>
          {section.links.map(link => {
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(link.href);
              
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--text-primary)',
                  background: isActive ? 'var(--accent-primary)' : 'transparent',
                  transition: 'all 0.2s ease',
                  marginBottom: '0.25rem'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 'bold' : 'normal' }}>{link.label}</div>
                  {link.description && <div style={{ fontSize: '0.7rem', color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)' }}>{link.description}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
