import React from 'react';

interface PebsBalanceProps {
  balance: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  className?: string;
}

export default function PebsBalance({ 
  balance, 
  size = 'medium', 
  showLabel = true,
  className
}: PebsBalanceProps) {
  // Determine the appropriate CSS class based on the balance
  const getBalanceClass = () => {
    if (balance > 0) return 'peb-balance-positive';
    if (balance < 0) return 'peb-balance-negative';
    return 'peb-balance-zero';
  };
  
  // Determine the size of the balance display
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const getBalanceColor = (balance: number) => {
    if (balance === 0) return 'text-gray-900';
    return balance > 0 ? 'text-emerald-600' : 'text-red-600';
  };

  const formatBalance = (balance: number) => {
    if (balance > 0) return `+${balance}`;
    return balance;
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={`font-semibold ${getBalanceColor(balance)}`}>
        {formatBalance(balance)}
      </span>
      {showLabel && <span className="ml-1 text-gray-600">pebs</span>}
    </div>
  );
} 