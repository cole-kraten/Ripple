'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { format } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { recentExchanges } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading || !user) {
    return (
      <div style={{ 
        padding: '2rem', 
        maxWidth: '64rem', 
        margin: '0 auto',
        textAlign: 'center' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Function to format exchange description
  const formatExchange = (exchange) => {
    const isReceived = exchange.participant._id === user._id;
    const otherUser = isReceived ? exchange.initiator.displayName : exchange.participant.displayName;
    const amount = exchange.pebsAmount;
    return {
      action: isReceived ? 'Received' : 'Sent',
      description: `${isReceived ? 'from' : 'to'} ${otherUser}`,
      amount: isReceived ? `+${amount}` : `-${amount}`,
      color: isReceived ? '#059669' : '#DC2626'
    };
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '64rem', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '2rem' 
          }}>
            Welcome, {user.displayName}!
          </h1>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            color: '#166534',
            border: '1px solid #22c55e',
            borderRadius: '0.375rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </header>
      
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
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            Quick Actions
          </h2>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <Link 
              href="/send-pebs" 
              style={{
                padding: '0.75rem',
                backgroundColor: '#22c55e',
                color: 'white',
                textAlign: 'center',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Send PEBS
            </Link>
            
            <Link 
              href="/exchanges" 
              style={{
                padding: '0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                textAlign: 'center',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              View Public Ledger
            </Link>
            
            <Link 
              href="/profile/edit" 
              style={{
                padding: '0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                textAlign: 'center',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Edit Profile
            </Link>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#1f2937'
          }}>
            Your Pebs
          </h2>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100% - 2rem)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: user.pebsBalance === 0 ? '#1f2937' : user.pebsBalance > 0 ? '#059669' : '#DC2626',
              marginBottom: '0.5rem'
            }}>
              {user.pebsBalance || 0}
            </div>
            <div style={{ color: '#4b5563' }}>Available Balance</div>
            
            <div style={{ 
              marginTop: '1.5rem',
              backgroundColor: '#f9fafb', 
              padding: '0.75rem',
              borderRadius: '0.25rem',
              width: '100%',
              fontSize: '0.875rem',
              color: '#4b5563'
            }}>
              <p>
                Remember, pebs represent the value of goods and services 
                exchanged in our community.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Recent Exchanges
          </h2>
          
          <Link 
            href="/exchanges" 
            style={{
              fontSize: '0.875rem',
              color: '#92400e',
              textDecoration: 'none'
            }}
          >
            View All
          </Link>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {recentExchanges.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              No recent exchanges to display
            </div>
          ) : (
            <div>
              {recentExchanges.map((exchange, index) => {
                const { action, description, amount, color } = formatExchange(exchange);
                return (
                  <div
                    key={exchange._id}
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: index < recentExchanges.length - 1 ? '1px solid #e5e7eb' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '500', color: '#1f2937' }}>
                        {action} PEBS {description}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {exchange.description || 'No description provided'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {format(new Date(exchange.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    <div style={{ 
                      fontWeight: '600',
                      color: color
                    }}>
                      {amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <footer style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
        <p>
          PEBS Online - A community-based exchange system.
        </p>
      </footer>
    </div>
  );
} 