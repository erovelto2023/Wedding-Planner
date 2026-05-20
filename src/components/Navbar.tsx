import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link href="/">💍 WeddingBox</Link>
      </div>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/proposals">Proposals</Link>
        <Link href="/budget">Budget</Link>
        <Link href="/timelines">Timelines</Link>
        <Link href="/floorplans">Floor Plans</Link>
        <Link href="/leads">Leads</Link>
        <Link href="/ai-assistant">AI Assistant</Link>
      </div>
    </nav>
  );
}
