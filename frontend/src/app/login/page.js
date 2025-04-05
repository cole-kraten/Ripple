'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Call login from auth context
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        throw new Error(result.error || 'Invalid credentials');
      }
      
      // Redirect to dashboard/home page after successful login
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state if auth system is still initializing
  if (authLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        maxWidth: '28rem', 
        margin: '0 auto' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '28rem', 
      margin: '0 auto' 
    }}>
      <Link href="/" style={{ 
        color: '#166534', 
        textDecoration: 'none',
        fontWeight: '500',
        display: 'block',
        marginBottom: '2rem'
      }}>
        &larr; Back to Home
      </Link>

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: '#166534', 
        marginBottom: '1.5rem' 
      }}>
        Sign In to PEBS
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {errorMessage && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1.5rem',
            borderRadius: '0.25rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c'
          }}>
            {errorMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="email" 
              style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500', 
                color: '#4b5563' 
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  fontWeight: '500', 
                  color: '#4b5563' 
                }}
              >
                Password
              </label>
              <Link href="/forgot-password" style={{ color: '#166534', textDecoration: 'none', fontSize: '0.875rem' }}>
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#4b5563',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{ marginRight: '0.5rem' }}
              />
              Remember me
            </label>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#6b7280' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: '#166534', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
} 