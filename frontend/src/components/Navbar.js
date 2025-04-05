'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="/ripple_logo.svg" 
            alt="" 
            style={{
              width: '24px',
              height: 'auto',
              marginRight: '8px'
            }}
          />
          Ripple
        </Link>

        <div className="navbar-links">
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/exchanges" className="navbar-link">
              Exchanges
            </Link>
            
            <Link href="/users" className="navbar-link">
              Users
            </Link>
            
            <Link href="/about" className="navbar-link">
              About
            </Link>
          </div>

          {isAuthenticated() ? (
            <div>
              <button onClick={toggleMenu} className="user-menu-button">
                <div className="user-avatar">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
                </div>
                <span style={{ color: '#1f2937' }}>
                  {user.displayName || 'Account'}
                </span>
              </button>

              {isMenuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>{user.displayName}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                  </div>
                  
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                    <li>
                      <Link 
                        href="/dashboard" 
                        onClick={() => setIsMenuOpen(false)}
                        className="dropdown-item"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/profile" 
                        onClick={() => setIsMenuOpen(false)}
                        className="dropdown-item"
                      >
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/exchanges/my" 
                        onClick={() => setIsMenuOpen(false)}
                        className="dropdown-item"
                      >
                        My Exchanges
                      </Link>
                    </li>
                    <li className="dropdown-divider">
                      <button 
                        onClick={handleLogout}
                        className="dropdown-item"
                        style={{ color: '#dc2626', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="button">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 