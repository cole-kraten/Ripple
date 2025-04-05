'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HealthPage() {
  const [health, setHealth] = useState({
    frontend: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    backend: {
      status: 'loading',
    },
  });

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/health`);
        const data = await response.json();
        
        setHealth(prev => ({
          ...prev,
          backend: {
            status: 'ok',
            message: data.message,
            timestamp: data.timestamp,
            environment: data.environment,
          },
        }));
      } catch (error) {
        console.error('Error connecting to backend:', error);
        setHealth(prev => ({
          ...prev,
          backend: {
            status: 'error',
            message: 'Failed to connect to backend',
          },
        }));
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-lg font-medium text-gray-900">System Health Status</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Check the health status of the PEBS Online system components.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Frontend</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${health.frontend.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>{health.frontend.status === 'ok' ? 'Operational' : 'Error'}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Last checked: {new Date(health.frontend.timestamp).toLocaleString()}
                </div>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Backend API</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <div className={`h-3 w-3 rounded-full mr-2 ${
                    health.backend.status === 'ok' ? 'bg-green-500' : 
                    health.backend.status === 'loading' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span>
                    {health.backend.status === 'ok' ? 'Operational' : 
                     health.backend.status === 'loading' ? 'Checking...' : 'Error'}
                  </span>
                </div>
                {health.backend.status !== 'loading' && (
                  <>
                    <div className="mt-1 text-xs text-gray-500">
                      {health.backend.message}
                    </div>
                    {health.backend.timestamp && (
                      <div className="mt-1 text-xs text-gray-500">
                        Last checked: {new Date(health.backend.timestamp).toLocaleString()}
                      </div>
                    )}
                    {health.backend.environment && (
                      <div className="mt-1 text-xs text-gray-500">
                        Environment: {health.backend.environment}
                      </div>
                    )}
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 