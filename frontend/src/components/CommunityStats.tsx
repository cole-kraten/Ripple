import React from 'react';
import Link from 'next/link';

interface ExchangeStat {
  _id: string;
  count: number;
  totalPebs: number;
}

interface UserSummary {
  _id: string;
  username: string;
  displayName: string;
  pebsBalance: number;
}

interface CommunityStatsProps {
  totalExchanges: number;
  totalPebs: number;
  avgPebs: number;
  topCategories: ExchangeStat[];
  usersNeedingSupport: UserSummary[];
  isLoading: boolean;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({
  totalExchanges,
  totalPebs,
  avgPebs,
  topCategories,
  usersNeedingSupport,
  isLoading
}) => {
  // Helper function to format category names
  const formatCategory = (category: string) => {
    switch (category) {
      case 'food-necessities':
        return 'Food & Necessities';
      case 'repairs-maintenance':
        return 'Repairs & Maintenance';
      case 'creative-works':
        return 'Creative Works';
      case 'care-work':
        return 'Care Work';
      case 'knowledge-teaching':
        return 'Knowledge Sharing';
      case 'physical-goods':
        return 'Physical Goods';
      case 'services-skills':
        return 'Services & Skills';
      default:
        return 'Other';
    }
  };
  
  if (isLoading) {
    return (
      <div className="peb-card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="peb-card text-center">
          <h3 className="text-xl font-semibold text-amber-800 mb-1">Total Exchanges</h3>
          <p className="text-3xl font-bold">{totalExchanges}</p>
        </div>
        
        <div className="peb-card text-center">
          <h3 className="text-xl font-semibold text-amber-800 mb-1">Total Pebs Exchanged</h3>
          <p className="text-3xl font-bold">{totalPebs}</p>
        </div>
        
        <div className="peb-card text-center">
          <h3 className="text-xl font-semibold text-amber-800 mb-1">Average Exchange</h3>
          <p className="text-3xl font-bold">{avgPebs.toFixed(1)} pebs</p>
        </div>
      </div>
      
      {/* Top Categories */}
      <div className="peb-card">
        <h3 className="text-xl font-semibold text-amber-800 mb-4">Popular Exchange Categories</h3>
        
        <div className="space-y-3">
          {topCategories.slice(0, 5).map(category => (
            <div key={category._id} className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">{formatCategory(category._id)}</span>
              <div className="text-gray-600">
                <span className="font-semibold">{category.count}</span> exchanges |
                <span className="font-semibold ml-1">{category.totalPebs}</span> pebs
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Community Support */}
      <div className="peb-card">
        <h3 className="text-xl font-semibold text-amber-800 mb-4">Community Support Needed</h3>
        
        {usersNeedingSupport.length > 0 ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              These community members might benefit from your support:
            </p>
            <div className="space-y-3">
              {usersNeedingSupport.map(user => (
                <div key={user._id} className="flex justify-between items-center border-b pb-2">
                  <Link href={`/users/${user._id}`} className="font-medium text-amber-700 hover:underline">
                    {user.displayName}
                  </Link>
                  <span className="peb-balance-negative">{user.pebsBalance} pebs</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/community/support" className="peb-button inline-block">
                View All Support Opportunities
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No community members currently need support!</p>
        )}
      </div>
    </div>
  );
};

export default CommunityStats; 