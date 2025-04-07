'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated once the auth state is loaded
    if (!loading && !isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        maxWidth: '64rem', 
        margin: '0 auto' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect in useEffect)
  if (!isAuthenticated()) {
    return null;
  }

  // User is authenticated, render children
  return children;
} 