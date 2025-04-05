'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../utils/api';
import '../../styles/components.css';

// Mock data as fallback
const MOCK_EXCHANGES = [
  {
    id: '1',
    date: '2025-03-09T15:30:00Z',
    provider: { id: 'user1', name: 'Alex Johnson' },
    receiver: { id: 'user2', name: 'Sam Taylor' },
    description: 'Home-cooked meals for 3 days',
    category: 'food-necessities',
    pebsAmount: 15,
    confirmed: true
  },
  {
    id: '2',
    date: '2025-03-10T09:45:00Z',
    provider: { id: 'user3', name: 'Jamie Smith' },
    receiver: { id: 'user1', name: 'Alex Johnson' },
    description: 'Bike repair and maintenance',
    category: 'repairs-maintenance',
    pebsAmount: 25,
    confirmed: true
  },
  {
    id: '3',
    date: '2025-03-11T14:00:00Z',
    provider: { id: 'user2', name: 'Sam Taylor' },
    receiver: { id: 'user4', name: 'Morgan Lee' },
    description: 'Piano lessons (2 hours)',
    category: 'creative-works',
    pebsAmount: 20,
    confirmed: true
  },
  {
    id: '4',
    date: '2025-03-12T11:15:00Z',
    provider: { id: 'user4', name: 'Morgan Lee' },
    receiver: { id: 'user3', name: 'Jamie Smith' },
    description: 'Childcare services',
    category: 'care-work',
    pebsAmount: 30,
    confirmed: true
  },
  {
    id: '5',
    date: '2025-03-12T16:20:00Z',
    provider: { id: 'user5', name: 'Casey Reed' },
    receiver: { id: 'user2', name: 'Sam Taylor' },
    description: 'Programming tutorial session',
    category: 'knowledge-teaching',
    pebsAmount: 18,
    confirmed: false
  }
];

export default function ExchangesPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to be determined
    if (authLoading) return;
    
    const fetchExchanges = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // If authenticated, try to get real data from API
        if (isAuthenticated()) {
          try {
            const response = await apiGet('/api/exchanges');
            // Process the exchange data to ensure it has the expected structure
            const processedExchanges = response.data.map(exchange => {
              // Create a new object instead of mutating the original
              const processedExchange = {...exchange};
              
              // Extract initiator and participant from the exchange data
              // For the public ledger, we always show actual usernames regardless of who's logged in
              
              // If the exchange already has properly formatted provider/receiver, use those
              if (processedExchange.provider?.name && processedExchange.receiver?.name) {
                // Already has properly formatted data, leave as is
                return processedExchange;
              }
              
              // Otherwise, format the exchange data using available fields
              // If initiator/provider info is available directly
              const initiatorName = processedExchange.initiator?.username || 
                                   processedExchange.initiator || 
                                   processedExchange.provider?.name ||
                                   'Unknown User';
                                   
              // If participant/receiver info is available directly
              const participantName = processedExchange.participant?.username || 
                                     processedExchange.participant || 
                                     processedExchange.receiver?.name ||
                                     'Unknown User';
                
              // Set provider and receiver fields consistently for all exchanges
              processedExchange.provider = { 
                id: processedExchange.initiatorId || processedExchange.provider?.id || 'unknown',
                name: initiatorName
              };
              
              processedExchange.receiver = { 
                id: processedExchange.participantId || processedExchange.receiver?.id || 'unknown',
                name: participantName
              };
              
              return processedExchange;
            });
            setExchanges(processedExchanges);
          } catch (err) {
            console.error('Failed to fetch exchanges from API:', err);
            // Fall back to mock data on error
            setExchanges(MOCK_EXCHANGES);
          }
        } else {
          // Use mock data for non-authenticated users
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
          setExchanges(MOCK_EXCHANGES);
        }
      } catch (err) {
        console.error('Error fetching exchanges:', err);
        setError('Failed to load exchanges. Please try again later.');
        setExchanges([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExchanges();
  }, [authLoading, isAuthenticated, user]);

  // Get category display name
  const getCategoryDisplay = (category) => {
    const categories = {
      'food-necessities': 'Food & Necessities',
      'repairs-maintenance': 'Repairs & Maintenance',
      'creative-works': 'Creative Works',
      'care-work': 'Care Work',
      'knowledge-teaching': 'Knowledge & Teaching',
      'physical-goods': 'Physical Goods',
      'services-skills': 'Services & Skills',
      'other': 'Other'
    };
    
    return categories[category] || category;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Filter exchanges
  const filteredExchanges = exchanges;

  return (
    <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto' }}>
      <Link href="/" className="backLink">
        &larr; Back to Home
      </Link>
      
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#1f2937'
        }}>
          Public Exchange Ledger
        </h1>
        <p style={{ 
          color: '#4b5563',
          fontSize: '1.125rem',
          lineHeight: '1.5'
        }}>
          A transparent record of all exchanges within our community.
        </p>
      </header>
      
      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '0.25rem',
          backgroundColor: '#fee2e2',
          color: '#b91c1c'
        }}>
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>Loading exchanges...</p>
        </div>
      ) : filteredExchanges.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No exchanges found in this category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredExchanges.map(exchange => (
            <div key={exchange.id} className="card" style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}>
                  {exchange.description}
                </h2>
                
                <div style={{ fontSize: '0.9rem' }}>
                  <Link href={`/users/${typeof exchange.provider === 'object' ? (exchange.provider?.id || 'unknown') : 'unknown'}`} style={{ color: '#166534', textDecoration: 'none', fontWeight: '500' }}>
                    {typeof exchange.provider === 'object' 
                      ? (exchange.provider?.name || 'Unknown User') 
                      : (typeof exchange.provider === 'string' ? exchange.provider : 'Unknown User')}
                  </Link>
                  <span style={{ margin: '0 0.25rem' }}>→</span>
                  <Link href={`/users/${typeof exchange.receiver === 'object' ? (exchange.receiver?.id || 'unknown') : 'unknown'}`} style={{ color: '#166534', textDecoration: 'none', fontWeight: '500' }}>
                    {typeof exchange.receiver === 'object' 
                      ? (exchange.receiver?.name || 'Unknown User') 
                      : (typeof exchange.receiver === 'string' ? exchange.receiver : 'Unknown User')}
                  </Link>
                </div>
              </div>
              
              <div style={{ 
                backgroundColor: '#22c55e', 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '0.25rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginLeft: '1rem',
                flexShrink: 0
              }}>
                <span>{exchange.pebsAmount}</span>
                <span style={{ fontSize: '0.875rem' }}>pebs</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
        <p>
          All exchanges are public to maintain transparency and community trust.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <Link href="/exchanges/new" className="button">
            Record New Exchange
          </Link>
        </div>
      </footer>
    </div>
  );
} 