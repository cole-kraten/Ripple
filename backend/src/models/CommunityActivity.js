const mongoose = require('mongoose');

const CommunityActivitySchema = new mongoose.Schema({
  // Type of community activity
  activityType: {
    type: String,
    enum: [
      'community-check-in',    // When someone checks in on a user with negative balance
      'support-offer',         // When someone offers specific help to another user
      'community-event',       // Community gathering or event
      'governance-proposal',   // Proposal for community governance
      'resource-sharing',      // Offering a resource to the community
      'feedback'               // General community feedback
    ],
    required: true
  },
  // User who initiated the activity
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Target user (if applicable)
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Title of the activity
  title: {
    type: String,
    required: [true, 'Please provide a title for this activity'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  // Description of the activity
  description: {
    type: String,
    required: [true, 'Please provide a description for this activity'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  // Status of the activity
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  // Users who have responded to this activity
  responses: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    response: {
      type: String,
      maxlength: [1000, 'Response cannot be more than 1000 characters']
    },
    responseType: {
      type: String,
      enum: ['support', 'participate', 'acknowledge', 'decline', 'other']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Start date (for events)
  startDate: {
    type: Date
  },
  // End date (for events)
  endDate: {
    type: Date
  },
  // Location (for events or in-person activities)
  location: {
    type: String,
    trim: true
  },
  // Tags for categorization
  tags: [{
    type: String,
    trim: true
  }],
  // When the activity was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Whether the activity is visible to all community members
  isPublic: {
    type: Boolean,
    default: true
  }
});

// Create indexes for efficient queries
CommunityActivitySchema.index({ activityType: 1, status: 1 });
CommunityActivitySchema.index({ targetUser: 1 });
CommunityActivitySchema.index({ startDate: 1 });
CommunityActivitySchema.index({ tags: 1 });

module.exports = mongoose.model('CommunityActivity', CommunityActivitySchema); 