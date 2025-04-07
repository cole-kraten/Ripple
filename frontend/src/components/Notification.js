'use client';

import { useSocket } from '../context/SocketContext';

export default function Notification() {
  const { notification } = useSocket();

  if (!notification) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        backgroundColor: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: '0.5rem',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
        maxWidth: '20rem',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <h3 style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: '#166534',
        marginBottom: '0.5rem'
      }}>
        {notification.title}
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: '#166534'
      }}>
        {notification.message}
      </p>
    </div>
  );
} 