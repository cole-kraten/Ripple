'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <header style={{textAlign: 'center', marginBottom: '3rem'}}>
        <div style={{marginBottom: '1.5rem'}}>
          <img 
            src="/ripple_logo.svg" 
            alt="Ripple Logo" 
            style={{
              width: '120px',
              height: 'auto',
              margin: '0 auto'
            }}
          />
        </div>
        <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#166534', marginBottom: '1rem'}}>
          Ripple
        </h1>
        <p style={{fontSize: '1.25rem', color: '#4b5563', maxWidth: '36rem', margin: '0 auto'}}>
          A community-based exchange system where your contributions are valued
          and everyone's needs are met.
        </p>
      </header>
      
      <section style={{
        maxWidth: '48rem', 
        margin: '0 auto 4rem auto',
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#166534', marginBottom: '1rem'}}>
          What are Pebs?
        </h2>
        <p style={{marginBottom: '1rem'}}>
          Pebs (short for "digital pebbles") are not money or capital in the traditional sense. 
          They're a way to acknowledge someone's labor and thank them for their contribution 
          to the community.
        </p>
        <p style={{marginBottom: '1rem'}}>
          When you receive goods or services, you give pebs to the provider. This creates a negative 
          balance for you. When you provide your own goods or services, you receive pebs, creating 
          a positive balance.
        </p>
        <p>
          Negative balances are not penalized - they're a normal part of community exchange. 
          We all contribute what we can and receive what we need.
        </p>
      </section>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '48rem',
        margin: '0 auto'
      }}>
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#166534', marginBottom: '1rem'}}>
            Join Our Community
          </h2>
          <p style={{marginBottom: '1.5rem'}}>
            Create an account to start exchanging goods and services with other 
            community members. Everyone starts with zero pebs.
          </p>
          <Link href="/signup" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#22c55e',
            color: 'white',
            borderRadius: '0.375rem',
            display: 'inline-block',
            textDecoration: 'none'
          }}>
            Sign Up
          </Link>
        </div>
        
        <div style={{
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#166534', marginBottom: '1rem'}}>
            Explore Exchanges
          </h2>
          <p style={{marginBottom: '1.5rem'}}>
            See what goods and services are being exchanged in the community.
            All exchanges are public to maintain transparency.
          </p>
          <Link href="/exchanges" style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#22c55e',
            color: 'white',
            borderRadius: '0.375rem',
            display: 'inline-block',
            textDecoration: 'none'
          }}>
            View Public Ledger
          </Link>
        </div>
      </div>
      
      <footer style={{textAlign: 'center', marginTop: '4rem'}}>
        <nav>
          <Link href="/health" style={{
            color: '#166534',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            System Health
          </Link>
          {' | '}
          <Link href="/test" style={{
            color: '#166534',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Test Page
          </Link>
        </nav>
      </footer>
    </div>
  );
} 