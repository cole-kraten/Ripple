'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiGet } from '../utils/api';

const SocketContext = createContext(null);

// Get base URL without /api
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api$/, '').replace(/\/+$/, '');

export const SocketProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);
  const [recentExchanges, setRecentExchanges] = useState([]);

  useEffect(() => {
    let socketInstance = null;

    const initializeSocket = async () => {
      if (user) {
        // Dynamically import socket.io-client
        const { io } = await import('socket.io-client');
        
        // Connect to Socket.IO server using base URL
        socketInstance = io(BASE_URL);
        
        // Authenticate with user ID
        socketInstance.emit('authenticate', user._id);

        // Listen for notifications
        socketInstance.on('notification', async (data) => {
          setNotification(data);
          // Auto-hide notification after 5 seconds
          setTimeout(() => {
            setNotification(null);
          }, 5000);

          // If the notification includes a PEBS update, refresh user data and exchanges
          if (data.type === 'exchange-received') {
            await refreshUser();
            // Fetch latest exchanges
            try {
              const { data: exchanges } = await apiGet('/api/exchanges/recent');
              setRecentExchanges(exchanges || []);
            } catch (error) {
              console.error('Error fetching recent exchanges:', error);
            }
          }
        });

        // Initial fetch of recent exchanges
        try {
          const { data: exchanges } = await apiGet('/api/exchanges/recent');
          setRecentExchanges(exchanges || []);
        } catch (error) {
          console.error('Error fetching initial exchanges:', error);
        }

        setSocket(socketInstance);
      }
    };

    initializeSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user, refreshUser]);

  return (
    <SocketContext.Provider value={{ socket, notification, recentExchanges }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 