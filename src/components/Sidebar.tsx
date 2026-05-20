import Link from 'next/link';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import SidebarLinks from "./SidebarLinks"; // NEW: Import client component

export default async function Sidebar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '1.5rem', background: 'white', borderRight: '1px solid var(--neutral-gray)' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '2rem', fontFamily: 'var(--font-family)' }}>
        MeetCraft
      </div>
      
      {/* Scrollable links container */}
      <div className="sidebar-scrollable">
        <SidebarLinks />
      </div>

      {session?.user ? (
        <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--neutral-gray)' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{session.user.name}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{session.user.email}</p>
          <Link href="/api/auth/signout" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
            Logout
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <Link href="/login" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>Login</Link>
        </div>
      )}
    </div>
  );
}
