import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface User {
  _id: string;
  displayName: string;
  username: string;
  avatar: string;
}

interface CommunityActivityResponse {
  user: User;
  response: string;
  responseType: string;
  createdAt: string;
}

interface CommunityActivity {
  _id: string;
  activityType: 'community-check-in' | 'support-offer' | 'community-event' | 'governance-proposal' | 'resource-sharing' | 'feedback';
  initiator: User;
  targetUser?: User;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'cancelled';
  responses: CommunityActivityResponse[];
  startDate?: string;
  endDate?: string;
  location?: string;
  tags: string[];
  createdAt: string;
  isPublic: boolean;
}

interface CommunityActivityCardProps {
  activity: CommunityActivity;
  isDetailed?: boolean;
}

const CommunityActivityCard: React.FC<CommunityActivityCardProps> = ({
  activity,
  isDetailed = false
}) => {
  // Helper function to get activity type display name
  const getActivityTypeDisplay = (type: string) => {
    switch (type) {
      case 'community-check-in':
        return 'Community Check-in';
      case 'support-offer':
        return 'Support Offer';
      case 'community-event':
        return 'Community Event';
      case 'governance-proposal':
        return 'Governance Proposal';
      case 'resource-sharing':
        return 'Resource Sharing';
      case 'feedback':
        return 'Feedback';
      default:
        return type;
    }
  };
  
  // Helper function to get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'community-check-in':
        return '👋';
      case 'support-offer':
        return '🤲';
      case 'community-event':
        return '🎉';
      case 'governance-proposal':
        return '📜';
      case 'resource-sharing':
        return '🔄';
      case 'feedback':
        return '💬';
      default:
        return '📌';
    }
  };
  
  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };
  
  return (
    <div className="peb-card hover:shadow-lg">
      <div className="flex items-start">
        <div className="text-3xl mr-3">
          {getActivityIcon(activity.activityType)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-amber-800">
              {isDetailed ? (
                activity.title
              ) : (
                <Link href={`/community/activities/${activity._id}`} className="hover:underline">
                  {activity.title}
                </Link>
              )}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(activity.status)}`}>
              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {getActivityTypeDisplay(activity.activityType)} by{' '}
            <Link href={`/users/${activity.initiator._id}`} className="font-medium hover:underline">
              {activity.initiator.displayName}
            </Link>
            {activity.targetUser && (
              <>
                {' '}for{' '}
                <Link href={`/users/${activity.targetUser._id}`} className="font-medium hover:underline">
                  {activity.targetUser.displayName}
                </Link>
              </>
            )}
            {' · '}
            {format(new Date(activity.createdAt), 'MMM d, yyyy')}
          </p>
          
          <div className="mt-3">
            {isDetailed ? (
              <div className="prose prose-amber prose-sm max-w-none">
                {activity.description}
              </div>
            ) : (
              <p className="text-gray-700 line-clamp-2">{activity.description}</p>
            )}
          </div>
          
          {isDetailed && activity.startDate && (
            <div className="mt-4 flex flex-col space-y-2">
              <div className="flex items-center text-sm">
                <span className="mr-2">🗓️</span>
                <span>
                  <strong>When:</strong> {format(new Date(activity.startDate), 'MMM d, yyyy h:mm a')}
                  {activity.endDate && (
                    <> to {format(new Date(activity.endDate), 'MMM d, yyyy h:mm a')}</>
                  )}
                </span>
              </div>
              
              {activity.location && (
                <div className="flex items-center text-sm">
                  <span className="mr-2">📍</span>
                  <span>
                    <strong>Where:</strong> {activity.location}
                  </span>
                </div>
              )}
            </div>
          )}
          
          {activity.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1">
              {activity.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {isDetailed && activity.responses.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Responses ({activity.responses.length})</h4>
              <div className="space-y-3">
                {activity.responses.map((resp, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        <Link href={`/users/${resp.user._id}`} className="hover:underline">
                          {resp.user.displayName}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(resp.createdAt), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    <p className="mt-1 text-sm">{resp.response}</p>
                    <div className="mt-1">
                      <span className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5">
                        {resp.responseType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!isDetailed && (
            <div className="mt-4">
              <Link 
                href={`/community/activities/${activity._id}`}
                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
              >
                View details {activity.responses.length > 0 && `(${activity.responses.length} responses)`}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityActivityCard; 