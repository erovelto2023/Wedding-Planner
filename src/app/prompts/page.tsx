'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PromptsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const res = await fetch('/api/prompts');
        const data = await res.json();
        setPrompts(data);
        
        // Extract unique categories
        const cats: string[] = Array.from(new Set(data.map((p: any) => p.category)));
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategory(cats[0]);
        }
      } catch (error) {
        console.error('Failed to fetch prompts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPrompts();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (status === 'loading' || loading) {
    return <div className="container">Loading prompts...</div>;
  }

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)' }}>AI Prompt Library</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Powerful prompts to help you plan your wedding with AI.</p>
        </div>
        <Link href="/" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 7.5fr', gap: '2rem' }}>
        
        {/* Sidebar - Categories */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  textAlign: 'left',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--neutral-gray)',
                  background: selectedCategory === cat ? 'var(--accent-primary)' : 'white',
                  color: selectedCategory === cat ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer',
                  fontWeight: selectedCategory === cat ? 'bold' : 'normal',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Prompts List */}
        <div>
          
          {/* Search Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search prompts..." 
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', fontSize: '1rem' }} 
            />
          </div>

          {/* Prompts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredPrompts.map((p, index) => {
              const id = `${p.category}-${index}`;
              return (
                <div key={id} className="card" style={{ background: 'white', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>"{p.prompt}"</p>
                  </div>
                  <button 
                    className="btn" 
                    style={{ 
                      padding: '0.4rem 0.75rem', 
                      fontSize: '0.85rem',
                      background: copiedId === id ? 'var(--success)' : 'var(--accent-primary)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    onClick={() => handleCopy(p.prompt, id)}
                  >
                    {copiedId === id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              );
            })}
            {filteredPrompts.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No prompts found matching your search.</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
