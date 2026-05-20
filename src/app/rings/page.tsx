import Link from 'next/link';

export default function RingsPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-block' }}>← Back to Dashboard</Link>
      <div className="card">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>Rings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage details, insurance, and sizes for the wedding bands.</p>
        <div style={{ marginTop: '2rem', padding: '2rem', border: '2px dashed var(--neutral-gray)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Module Coming Soon</p>
        </div>
      </div>
    </div>
  );
}
