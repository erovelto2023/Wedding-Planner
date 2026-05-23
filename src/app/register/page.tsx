"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Quick client-side check
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please check your inputs.');
      } else {
        setSuccess(true);
        // Clear forms
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        
        // Auto-redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected communication error occurred.');
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
        maxWidth: '440px',
        padding: '2.5rem',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Registration Headers */}
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
            Create Workspace
          </h1>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.4'
          }}>
            Register your couple profile to begin coordinating timelines, checklists, guest maps, and food tastings.
          </p>
        </div>

        {success ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            background: '#ecfdf5',
            color: '#047857',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid #a7f3d0',
            textAlign: 'center',
            animation: 'fadeIn 0.3s ease'
          }}>
            <span style={{ fontSize: '2rem' }}>🎉</span>
            <div>
              <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Workspace Registered Successfully!</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#065f46' }}>
                Redirecting you to the sign-in workspace in 2 seconds...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
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
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Jack & Jill Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '12px',
                  border: '1px solid var(--neutral-gray)',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
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
                Username
              </label>
              <input
                type="text"
                placeholder="e.g. jack_jill"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '12px',
                  border: '1px solid var(--neutral-gray)',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
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
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. couple@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '12px',
                  border: '1px solid var(--neutral-gray)',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '12px',
                  border: '1px solid var(--neutral-gray)',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  color: 'var(--text-primary)',
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
              {loading ? 'Creating Account...' : 'Register Workspace'}
            </button>
          </form>
        )}

        {/* Redirect to Login */}
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{
            color: 'var(--accent-primary)',
            fontWeight: '700',
            textDecoration: 'none'
          }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
