'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { apiPost } from '../../utils/api';

export default function SendPebsPage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    recipientUsername: '',
    amount: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate amount
      const amount = parseInt(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount greater than 0');
      }

      // Send the exchange to the API
      const response = await apiPost('/api/exchanges', {
        direction: 'provided',
        participant: formData.recipientUsername,
        description: formData.description,
        category: 'other',
        pebsAmount: amount
      });

      // Refresh user data to get updated balance
      if (refreshUser) {
        await refreshUser();
      }

      setSuccess(true);
      setFormData({
        recipientUsername: '',
        amount: '',
        description: ''
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to send PEBS. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ 
      maxWidth: '32rem', 
      margin: '0 auto',
      width: '90%'
    }}>
      <div style={{ margin: '2rem 0' }}>
        <Link href="/dashboard" style={{ 
          color: '#1f2937', 
          textDecoration: 'none',
          fontWeight: '500',
          display: 'block'
        }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: '#1f2937', 
        marginBottom: '1.5rem' 
      }}>
        Send Pebs
      </h1>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2rem' }}>
          {success ? (
            <div style={{
              backgroundColor: '#d1fae5',
              color: '#065f46',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>
                Pebs sent successfully!
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem'
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>
                  Recipient Username
                </label>
                <input
                  type="text"
                  name="recipientUsername"
                  value={formData.recipientUsername}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter username"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter amount"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>
                  Note
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    minHeight: '6rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Add a note about this exchange"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  opacity: isLoading ? '0.7' : '1'
                }}
              >
                {isLoading ? 'Sending...' : 'Send PEBS'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div style={{
        margin: '1.5rem 0',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2rem' }}>
          <p style={{ marginBottom: '0.75rem', fontWeight: '500' }}>Note:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Transactions cannot be reversed once confirmed</li>
            <li style={{ marginBottom: '0.5rem' }}>Make sure to verify the recipient's username</li>
            <li>Include a clear description to help track your exchanges</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 