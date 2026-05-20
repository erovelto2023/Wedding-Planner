'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AIAssistantPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [prompts, setPrompts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Form state for new prompt
  const [newPromptCategory, setNewPromptCategory] = useState('');
  const [newPromptText, setNewPromptText] = useState('');
  const [isNewCategory, setIsNewCategory] = useState(false);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

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
        
        // Fetch favorites
        try {
          const favRes = await fetch('/api/favorites');
          if (favRes.ok) {
            const favData = await favRes.json();
            setFavorites(favData);
          }
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
        }
        
        // Extract unique categories
        const cats: string[] = Array.from(new Set(data.map((p: any) => p.category)));
        cats.sort(); // Sort alphabetically
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

  const toggleFavorite = async (promptId: string) => {
    const isFav = favorites.includes(promptId);
    const method = isFav ? 'DELETE' : 'POST';
    const url = isFav ? `/api/favorites?promptId=${promptId}` : '/api/favorites';
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: isFav ? null : JSON.stringify({ promptId })
      });
      
      if (res.ok) {
        if (isFav) {
          setFavorites(favorites.filter(id => id !== promptId));
        } else {
          setFavorites([...favorites, promptId]);
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleAddPrompt = async () => {
    if (!newPromptCategory || !newPromptText) return;
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newPromptCategory, prompt: newPromptText })
      });
      const data = await res.json();
      setPrompts([...prompts, data]);
      
      // Update categories if new
      if (!categories.includes(newPromptCategory)) {
        const updatedCats = [...categories, newPromptCategory];
        updatedCats.sort(); // Sort alphabetically
        setCategories(updatedCats);
      }
      
      setNewPromptCategory('');
      setNewPromptText('');
      setIsNewCategory(false);
    } catch (error) {
      console.error('Failed to add prompt:', error);
    }
  };

  const handleUpdatePrompt = async (id: string) => {
    if (!editingText) return;
    try {
      const res = await fetch('/api/prompts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, prompt: editingText, category: selectedCategory })
      });
      
      if (res.ok) {
        setPrompts(prompts.map(p => p._id === id ? { ...p, prompt: editingText } : p));
        setEditingId(null);
        setEditingText('');
      }
    } catch (error) {
      console.error('Failed to update prompt:', error);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="container">Loading AI Assistant...</div>;
  }

  const filteredPrompts = prompts.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchesSearch = p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = showFavoritesOnly ? favorites.includes(p._id) : true;
    return matchesCategory && matchesSearch && matchesFavorites;
  });

  return (
    <div className="container" style={{ padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--text-primary)' }}>AI Wedding Assistant</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Powerful prompts to copy and use in your favorite AI tool.</p>
        </div>
        <Link href="/" className="btn btn-secondary">← Back to Dashboard</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 7.5fr', gap: '2rem' }}>
        
        {/* Sidebar - Categories */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}>Categories</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              style={{
                textAlign: 'left',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--neutral-gray)',
                background: showFavoritesOnly ? 'var(--accent-primary)' : 'white',
                color: showFavoritesOnly ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: showFavoritesOnly ? 'bold' : 'normal',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{showFavoritesOnly ? '★' : '☆'}</span>
              <span>{showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites Only'}</span>
            </button>
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

        {/* Main Content - Prompts List & Forms */}
        <div>
          
          {/* Add Prompt Form */}
          <div className="card" style={{ marginBottom: '2rem', background: '#F9F9F9' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Add New Prompt</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Category</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select 
                    value={isNewCategory ? 'NEW' : newPromptCategory} 
                    onChange={(e) => {
                      if (e.target.value === 'NEW') {
                        setIsNewCategory(true);
                        setNewPromptCategory('');
                      } else {
                        setIsNewCategory(false);
                        setNewPromptCategory(e.target.value);
                      }
                    }}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }}
                  >
                    <option value="">Select Category...</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="NEW">+ Add New Category</option>
                  </select>
                  {isNewCategory && (
                    <input 
                      type="text" 
                      value={newPromptCategory} 
                      onChange={(e) => setNewPromptCategory(e.target.value)} 
                      placeholder="New category name..." 
                      style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)' }} 
                    />
                  )}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Prompt Text</label>
                <textarea 
                  value={newPromptText} 
                  onChange={(e) => setNewPromptText(e.target.value)} 
                  placeholder="Type your powerful prompt here..." 
                  style={{ width: '100%', minHeight: '80px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', fontFamily: 'inherit' }} 
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddPrompt} style={{ alignSelf: 'flex-start' }}>Add Prompt</button>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search prompts in this category..." 
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', fontSize: '1rem' }} 
            />
          </div>

          {/* Prompts List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredPrompts.map((p) => {
              const id = p._id;
              const isEditing = editingId === id;

              return (
                <div key={id} className="card" style={{ background: 'white', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    {isEditing ? (
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        style={{ width: '100%', minHeight: '80px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--neutral-gray)', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>"{p.prompt}"</p>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isEditing ? (
                      <>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                          onClick={() => handleUpdatePrompt(id)}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                          onClick={() => { setEditingId(null); setEditingText(''); }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn" 
                          style={{ 
                            padding: '0.4rem 0.75rem', 
                            fontSize: '0.85rem',
                            background: favorites.includes(id) ? '#FFD700' : '#E0E0E0',
                            color: 'black',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)'
                          }}
                          onClick={() => toggleFavorite(id)}
                        >
                          {favorites.includes(id) ? '★' : '☆'}
                        </button>
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
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                          onClick={() => { setEditingId(id); setEditingText(p.prompt); }}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
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
