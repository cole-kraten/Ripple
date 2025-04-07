import React from 'react';
import PebsBalance from './PebsBalance';
import { format } from 'date-fns';

interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string;
  biography: string;
  skills: string[];
  needs: string[];
  pebsBalance: number;
  location: string;
  lastActive: string;
  createdAt: string;
}

interface UserProfileProps {
  user: User;
  isCurrentUser?: boolean;
  onCheckIn?: () => void;
  onEditProfile?: () => void;
  isLoading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isCurrentUser = false,
  onCheckIn,
  onEditProfile,
  isLoading = false
}) => {
  const needsSupport = user.pebsBalance < -50;
  
  return (
    <div className="peb-card">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Image & Username */}
        <div className="md:w-1/4 flex flex-col items-center">
          <div className="w-32 h-32 bg-amber-200 rounded-full overflow-hidden mb-3">
            {user.avatar ? (
              <img 
                src={user.avatar}
                alt={`${user.displayName}'s avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-amber-700">
                {user.displayName.charAt(0)}
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold text-center">{user.displayName}</h2>
          <p className="text-gray-500 text-sm mb-3">@{user.username}</p>
          
          <div className="my-2">
            <PebsBalance balance={user.pebsBalance} size="large" />
          </div>
          
          {isCurrentUser ? (
            <button
              onClick={onEditProfile}
              disabled={isLoading}
              className="peb-button w-full mt-4"
            >
              {isLoading ? 'Loading...' : 'Edit Profile'}
            </button>
          ) : (
            <div className="flex flex-col gap-2 w-full mt-4">
              <button 
                className="peb-button w-full"
                onClick={() => alert('Record Exchange feature coming soon!')}
              >
                Record Exchange
              </button>
              
              {needsSupport && (
                <button
                  onClick={onCheckIn}
                  disabled={isLoading}
                  className="bg-white border border-amber-600 text-amber-600 px-4 py-2 rounded-md hover:bg-amber-50 transition-colors duration-300 w-full"
                >
                  {isLoading ? 'Checking in...' : 'Check-in & Offer Support'}
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Profile Details */}
        <div className="md:w-3/4">
          {user.biography && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-amber-800 mb-2">About</h3>
              <p className="text-gray-700 whitespace-pre-line">{user.biography}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div>
              <h3 className="text-lg font-medium text-amber-800 mb-2">Skills & Offerings</h3>
              {user.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No skills or offerings listed yet</p>
              )}
            </div>
            
            {/* Needs */}
            <div>
              <h3 className="text-lg font-medium text-amber-800 mb-2">Needs & Requests</h3>
              {user.needs && user.needs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.needs.map((need, index) => (
                    <span 
                      key={index} 
                      className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No needs or requests listed yet</p>
              )}
            </div>
          </div>
          
          {/* Location and activity indicators */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 text-sm">
            {user.location && (
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>{user.location}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <span className="mr-2">⏱️</span>
              <span>Last active: {format(new Date(user.lastActive), 'MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <span>Member since: {format(new Date(user.createdAt), 'MMMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 