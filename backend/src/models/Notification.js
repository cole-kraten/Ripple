const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  // User receiving the notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Type of notification
  type: {
    type: String,
    enum: [
      'exchange-received',       // Someone recorded an exchange with you
      'exchange-confirmed',      // Your exchange was confirmed
      'balance-update',          // Significant balance change
      'community-support',       // Someone might need community support
      'community-activity',      // New community activity
      'direct-message',          // Direct message from another user
      'system-message'           // System notification
    ],
    required: true
  },
  // Title of the notification
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Message content
  message: {
    type: String,
    required: true,
    trim: true
  },
  // Related data
  data: {
    exchangeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exchange'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    communityActivityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CommunityActivity'
    },
    // For balance updates
    balanceChange: {
      previous: Number,
      current: Number
    },
    // Any additional data as needed
    additionalData: mongoose.Schema.Types.Mixed
  },
  // Has the user read this notification?
  isRead: {
    type: Boolean,
    default: false
  },
  // When the notification was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Priority of the notification
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
});

// Create indexes for efficient queries
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, type: 1 });

// Set notification as read
NotificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  await this.save();
};

// Static method to create a new notification
NotificationSchema.statics.createNotification = async function(notificationData) {
  return await this.create(notificationData);
};

// Static method to get unread notifications for a user
NotificationSchema.statics.getUnreadByUser = async function(userId) {
  return await this.find({
    recipient: userId,
    isRead: false
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Notification', NotificationSchema); 