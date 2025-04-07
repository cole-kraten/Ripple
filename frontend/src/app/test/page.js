'use client';

import Link from 'next/link';

export default function TestPage() {
  return (
    <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>
      <h1 style={{color: '#78350f', fontSize: '2rem', marginBottom: '1rem'}}>
        Test Page - Ripple
      </h1>
      
      <p style={{marginBottom: '1rem'}}>
        This is a simple test page to check if routing is working correctly.
      </p>
      
      <div style={{marginTop: '2rem'}}>
        <Link href="/" style={{
          backgroundColor: '#f59e0b',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          textDecoration: 'none'
        }}>
          Back to Home
        </Link>
        
        <Link href="/health" style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem',
          textDecoration: 'none',
          marginLeft: '1rem'
        }}>
          View Health Status
        </Link>
      </div>
    </div>
  );
} 