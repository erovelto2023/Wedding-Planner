"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials');
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem' }}>Login</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}
              required
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--neutral-gray)', background: 'var(--bg-primary)' }}
              required
            />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Login</button>
        </form>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.5rem', textAlign: 'center' }}>
          Default Demo Account:<br />
          <strong>admin</strong> / <strong>password</strong>
        </p>
      </div>
    </div>
  );
}
