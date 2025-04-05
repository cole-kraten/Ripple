'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        color: '#1f2937', 
        marginBottom: '2rem' 
      }}>
        About Ripple
      </h1>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '1rem' 
        }}>
          What are Pebs?
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Pebs (Personal Exchange Benefit System) is a community-based currency that facilitates 
          the exchange of goods and services within our network. Unlike traditional money, 
          Pebs are earned and spent through direct community contributions, creating a 
          sustainable ecosystem of mutual support and value exchange.
        </p>
        
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#1f2937',
          marginBottom: '1rem' 
        }}>
          Our Mission
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Ripple aims to foster a thriving community where members can share their skills, 
          knowledge, and resources in a fair and transparent way. We believe in the power of 
          mutual aid and community resilience, enabling people to support each other while 
          building meaningful connections.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#166534',
            marginBottom: '1rem' 
          }}>
            How It Works
          </h3>
          <ul style={{ color: '#4b5563', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '0.75rem' }}>Join the community and create your profile</li>
            <li style={{ marginBottom: '0.75rem' }}>Offer your skills or services to earn Pebs</li>
            <li style={{ marginBottom: '0.75rem' }}>Request services from other members using your Pebs</li>
            <li style={{ marginBottom: '0.75rem' }}>Build trust through successful exchanges</li>
            <li>Contribute to a stronger, more connected community</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#166534',
            marginBottom: '1rem' 
          }}>
            Community Values
          </h3>
          <ul style={{ color: '#4b5563', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '0.75rem' }}>Trust and transparency in all exchanges</li>
            <li style={{ marginBottom: '0.75rem' }}>Mutual respect and support</li>
            <li style={{ marginBottom: '0.75rem' }}>Fair value exchange</li>
            <li style={{ marginBottom: '0.75rem' }}>Skill sharing and continuous learning</li>
            <li>Environmental and social responsibility</li>
          </ul>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f0fdf4',
        padding: '2rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#166534',
          marginBottom: '1rem' 
        }}>
          Get Started Today
        </h2>
        <p style={{ color: '#166534', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Join our growing community and start exchanging goods and services using Pebs. 
          Whether you're a skilled professional, hobbyist, or just someone willing to help 
          others, there's a place for you in our network.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            href="/signup" 
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Create Account
          </Link>
          <Link 
            href="/exchanges" 
            style={{
              backgroundColor: 'white',
              color: '#166534',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            View Exchanges
          </Link>
        </div>
      </div>

      <footer style={{ 
        borderTop: '1px solid #e5e7eb', 
        paddingTop: '2rem',
        textAlign: 'center',
        color: '#6b7280'
      }}>
        <p style={{ marginBottom: '1rem' }}>
          Ripple is a community initiative focused on fostering local connections 
          and mutual support through skill sharing and service exchange.
        </p>
        <p>
          Have questions? Contact us at{' '}
          <a 
            href="mailto:support@ripple.com" 
            style={{ color: '#166534', textDecoration: 'none' }}
          >
            support@ripple.com
          </a>
        </p>
      </footer>
    </div>
  );
} 