'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { apiPut } from '../../../utils/api';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    biography: '',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        displayName: user.displayName || '',
        username: user.username || '',
        biography: user.biography || '',
        avatar: user.avatar || ''
      });
    }
  }, [isAuthenticated, user, router]);

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
      // Update profile info
      await apiPut('/api/auth/profile', {
        displayName: formData.displayName,
        username: formData.username,
        biography: formData.biography
      });

      // Update avatar if changed
      if (formData.avatar !== user.avatar) {
        await apiPut('/api/auth/avatar', {
          avatar: formData.avatar
        });
      }

      // Refresh user data
      await refreshUser();
      
      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '32rem', margin: '0 auto' }}>
      <Link 
        href="/dashboard" 
        style={{ 
          color: '#166534', 
          textDecoration: 'none',
          fontWeight: '500',
          display: 'block',
          marginBottom: '2rem',
          transition: 'color 0.2s ease',
          ':hover': {
            color: '#15803d'
          }
        }}
      >
        &larr; Back to Dashboard
      </Link>

      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '700', 
        color: '#166534', 
        marginBottom: '1.5rem',
        letterSpacing: '-0.025em'
      }}>
        Edit Profile
      </h1>

      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        padding: '1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(134, 239, 172, 0.3)'
      }}>
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
              Profile updated successfully!
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
                marginBottom: '1rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="displayName" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  letterSpacing: '0.025em'
                }}
              >
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                value={formData.displayName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #86efac',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  ':focus': {
                    borderColor: '#22c55e',
                    boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.1)'
                  }
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="username" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  letterSpacing: '0.025em'
                }}
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
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

            <div style={{ marginBottom: '1rem' }}>
              <label 
                htmlFor="avatar" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  letterSpacing: '0.025em'
                }}
              >
                Avatar URL
              </label>
              <input
                id="avatar"
                name="avatar"
                type="url"
                value={formData.avatar}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #d1d5db',
                  outline: 'none'
                }}
                placeholder="https://example.com/avatar.jpg"
              />
              {formData.avatar && (
                <div style={{ 
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <img 
                    src={formData.avatar} 
                    alt="Avatar preview" 
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Preview</span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label 
                htmlFor="biography" 
                style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#4b5563',
                  fontSize: '0.875rem',
                  letterSpacing: '0.025em'
                }}
              >
                Bio
              </label>
              <textarea
                id="biography"
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  border: '1px solid #d1d5db',
                  outline: 'none',
                  resize: 'vertical'
                }}
                placeholder="Tell us about yourself..."
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
                border: 'none',
                borderRadius: '0.75rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(34, 197, 94, 0.2)',
                ':hover': {
                  backgroundColor: '#16a34a',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 8px rgba(34, 197, 94, 0.3)'
                }
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'rgba(134, 239, 172, 0.2)',
        borderRadius: '0.75rem',
        color: '#166534',
        fontSize: '0.875rem',
        border: '1px solid rgba(134, 239, 172, 0.3)'
      }}>
        <p style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Note:</p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>Your username is unique and will be used for sending/receiving PEBS</li>
          <li style={{ marginBottom: '0.25rem' }}>Display name can be anything you like</li>
          <li>For avatar URL, use a direct link to an image (ends in .jpg, .png, etc.)</li>
        </ul>
      </div>
    </div>
  );
} 