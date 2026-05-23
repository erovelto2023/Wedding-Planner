"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid username, email, or password.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected system error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      padding: '1.5rem',
      fontFamily: 'var(--font-family)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.5rem',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Workspace Brand Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <img 
            src="/icon.png" 
            alt="AURA" 
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
          />
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.85rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0.25rem 0'
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4'
          }}>
            Coordinate timelines, vendors, guest registries, and events in one unified workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              display: 'block',
              marginBottom: '0.35rem'
            }}>
              Username or Email
            </label>
            <input
              type="text"
              placeholder="Enter admin or email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--neutral-gray)',
                background: '#ffffff',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-secondary)',
              display: 'block',
              marginBottom: '0.35rem'
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid var(--neutral-gray)',
                background: '#ffffff',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              required
            />
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fdf2f2',
              color: 'var(--danger)',
              padding: '0.75rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: '500',
              borderLeft: '4px solid var(--danger)'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              padding: '0.8rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '700',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Redirect to Register */}
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          Don't have an account?{' '}
          <Link href="/register" style={{
            color: 'var(--accent-primary)',
            fontWeight: '700',
            textDecoration: 'none'
          }}>
            Create one free
          </Link>
        </p>

        {/* Default Account Seeding Notice */}
        <div style={{
          marginTop: '2rem',
          background: 'rgba(111, 66, 193, 0.05)',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
          border: '1px dashed rgba(111, 66, 193, 0.25)',
          fontSize: '0.75rem',
          color: 'var(--accent-primary)',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          💡 <strong>Demo Account:</strong> Sign in using <strong>admin</strong> and password <strong>password</strong>.
        </div>
      </div>
    </div>
  );
}
