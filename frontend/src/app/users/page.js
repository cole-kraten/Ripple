'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { apiGet } from '../../utils/api';
import '../../styles/components.css';

// Mock data as fallback
const MOCK_USERS = [
  { id: 'user1', username: 'Alex_Johnson', displayName: 'Alex Johnson', pebsBalance: 125 },
  { id: 'user2', username: 'SamTaylor', displayName: 'Sam Taylor', pebsBalance: 74 },
  { id: 'user3', username: 'JamieSmith', displayName: 'Jamie Smith', pebsBalance: 210 },
  { id: 'user4', username: 'MorganLee', displayName: 'Morgan Lee', pebsBalance: 56 },
  { id: 'user5', username: 'CaseyReed', displayName: 'Casey Reed', pebsBalance: 189 },
  { id: 'user6', username: 'JordanPatel', displayName: 'Jordan Patel', pebsBalance: 92 },
  { id: 'user7', username: 'RileyKim', displayName: 'Riley Kim', pebsBalance: 143 },
  { id: 'user8', username: 'QuinnNguyen', displayName: 'Quinn Nguyen', pebsBalance: 67 },
];

export default function UsersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to be determined
    if (authLoading) return;
    
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // If authenticated, try to get real data from API
        if (isAuthenticated()) {
          try {
            const response = await apiGet('/api/users');
            setUsers(response.data);
          } catch (err) {
            console.error('Failed to fetch users from API:', err);
            // Fall back to mock data on error
            setUsers(MOCK_USERS);
          }
        } else {
          // Use mock data for non-authenticated users
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
          setUsers(MOCK_USERS);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [authLoading, isAuthenticated]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const username = user.username?.toLowerCase() || '';
    const displayName = user.displayName?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    return username.includes(searchLower) || displayName.includes(searchLower);
  });

  // Sort users by balance (highest to lowest)
  const sortedUsers = [...filteredUsers].sort((a, b) => 
    (b.pebsBalance || 0) - (a.pebsBalance || 0)
  );

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
          Community Members
        </h1>
        <p style={{ 
          color: '#4b5563',
          fontSize: '1.125rem',
          lineHeight: '1.5'
        }}>
          Browse all members and their current PEBS balances.
        </p>
      </header>
      
      <div style={{ marginBottom: '2rem' }}>
        <label 
          htmlFor="search-users" 
          style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: '#1f2937',
            fontSize: '0.875rem'
          }}
        >
          Search Users:
        </label>
        <input
          id="search-users"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            backgroundColor: 'white',
            boxSizing: 'border-box'
          }}
          placeholder="Enter username or display name"
        />
      </div>
      
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
          <p>Loading users...</p>
        </div>
      ) : sortedUsers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No users found matching your search.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {sortedUsers.map(user => (
            <div key={user.id} className="card" style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600',
                  marginBottom: '0.25rem',
                  color: '#1f2937'
                }}>
                  <Link href={`/users/${user.id}`} style={{ color: '#166534', textDecoration: 'none' }}>
                    {user.displayName || user.username}
                  </Link>
                </h2>
                
                {user.displayName && user.username && user.displayName !== user.username && (
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    @{user.username}
                  </div>
                )}
              </div>
              
              <div style={{ 
                backgroundColor: user.pebsBalance > 0 ? '#22c55e' : user.pebsBalance < 0 ? '#ef4444' : '#6b7280',
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
                <span>{user.pebsBalance || 0}</span>
                <span style={{ fontSize: '0.875rem' }}>pebs</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
        <p>
          Users are ranked by their current PEBS balance.
        </p>
      </footer>
    </div>
  );
} 