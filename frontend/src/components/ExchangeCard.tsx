import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import PebsBalance from './PebsBalance';

interface User {
  _id: string;
  displayName: string;
  username: string;
  avatar: string;
}

interface Exchange {
  _id: string;
  initiator: User;
  direction: 'provided' | 'received';
  participant: User;
  description: string;
  category: string;
  pebsAmount: number;
  notes?: string;
  isConfirmed: boolean;
  exchangeDate: string;
  createdAt: string;
  location?: string;
}

interface ExchangeCardProps {
  exchange: Exchange;
  currentUserId?: string;
  onConfirm?: (exchangeId: string) => void;
  isConfirming?: boolean;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  exchange,
  currentUserId,
  onConfirm,
  isConfirming = false
}) => {
  const {
    _id,
    initiator,
    direction,
    participant,
    description,
    category,
    pebsAmount,
    notes,
    isConfirmed,
    exchangeDate,
    location
  } = exchange;
  
  // Determine if the current user is part of this exchange
  const isCurrentUserInvolved = currentUserId && 
    (initiator._id === currentUserId || participant._id === currentUserId);
  
  // Determine if the current user can confirm the exchange
  const canConfirm = currentUserId && 
    participant._id === currentUserId && 
    !isConfirmed;
  
  // Helper function to get category display name
  const getCategoryDisplay = (cat: string) => {
    switch (cat) {
      case 'food-necessities':
        return 'Food & Necessities';
      case 'repairs-maintenance':
        return 'Repairs & Maintenance';
      case 'creative-works':
        return 'Creative Works';
      case 'care-work':
        return 'Care Work & Emotional Labor';
      case 'knowledge-teaching':
        return 'Knowledge Sharing & Teaching';
      case 'physical-goods':
        return 'Physical Goods';
      case 'services-skills':
        return 'Services & Skills';
      default:
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  };
  
  // Calculate who gave and who received
  const giver = direction === 'received' ? initiator : participant;
  const receiver = direction === 'received' ? participant : initiator;
  
  return (
    <div className={`peb-card ${isCurrentUserInvolved ? 'border-l-4 border-emerald-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="mb-3">
            <div className="text-gray-500 text-sm mb-1">
              {format(new Date(exchangeDate), 'MMMM d, yyyy')}
              {!isConfirmed && <span className="ml-2 text-emerald-600">(Pending Confirmation)</span>}
            </div>
            
            <h3 className="font-semibold text-lg text-gray-800">{description}</h3>
            
            <div className="flex items-center mt-1 text-sm">
              <span className="bg-emerald-100 text-emerald-800 rounded-full px-2 py-0.5">
                {getCategoryDisplay(category)}
              </span>
              {location && (
                <span className="ml-2 text-gray-500">📍 {location}</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center">
              <Link href={`/users/${giver._id}`} className="font-medium text-emerald-700 hover:underline">
                {giver.displayName}
              </Link>
              <span className="mx-2 text-gray-400">→</span>
              <Link href={`/users/${receiver._id}`} className="font-medium text-emerald-700 hover:underline">
                {receiver.displayName}
              </Link>
            </div>
            
            <div className="sm:ml-auto flex items-center">
              <PebsBalance balance={pebsAmount} size="small" showLabel={false} />
              <span className="ml-1">pebs</span>
            </div>
          </div>
          
          {notes && (
            <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Notes:</strong> {notes}
            </div>
          )}
          
          {canConfirm && (
            <div className="mt-4">
              <button
                onClick={() => onConfirm && onConfirm(_id)}
                disabled={isConfirming}
                className="peb-button text-sm"
              >
                {isConfirming ? 'Confirming...' : 'Confirm Exchange'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeCard; 