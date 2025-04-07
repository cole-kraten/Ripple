const CommunityActivity = require('../models/CommunityActivity');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// @desc    Create a community activity
// @route   POST /api/community/activities
// @access  Private
exports.createCommunityActivity = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      activityType,
      targetUser,
      title,
      description,
      startDate,
      endDate,
      location,
      tags
    } = req.body;

    // If there's a target user, validate they exist
    if (targetUser) {
      const userExists = await User.findById(targetUser);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'Target user not found'
        });
      }
    }

    // Create the community activity
    const activity = await CommunityActivity.create({
      activityType,
      initiator: req.user.id,
      targetUser: targetUser || null,
      title,
      description,
      startDate: startDate || null,
      endDate: endDate || null,
      location: location || '',
      tags: tags || []
    });

    // If there's a target user, send them a notification
    if (targetUser) {
      await Notification.create({
        recipient: targetUser,
        type: 'community-activity',
        title: 'New Community Activity',
        message: `${req.user.displayName} started a ${activityType} that involves you.`,
        data: {
          communityActivityId: activity._id,
          userId: req.user.id
        }
      });
    }

    // If it's a community check-in for support, notify relevant users
    if (activityType === 'community-check-in') {
      // Find users who might benefit from being notified about this
      // For example, users who have engaged with the target user recently
      // This is a simplified version - a real implementation would have more logic
      const relevantUsers = await User.find({
        _id: { $ne: req.user.id, $ne: targetUser }
      }).limit(5);

      // Notify each of them
      for (const user of relevantUsers) {
        await Notification.create({
          recipient: user._id,
          type: 'community-support',
          title: 'Community Support Activity',
          message: `${req.user.displayName} started a community check-in for a member who might need support.`,
          data: {
            communityActivityId: activity._id
          },
          priority: 'high'
        });
      }
    }

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (err) {
    console.error('Error in createCommunityActivity:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while creating community activity'
    });
  }
};

// @desc    Get all community activities
// @route   GET /api/community/activities
// @access  Public
exports.getCommunityActivities = async (req, res) => {
  try {
    // Build query based on filters
    const queryObj = { ...req.query };
    
    // Only include public activities by default, unless specifically requested
    if (!queryObj.isPublic) {
      queryObj.isPublic = true;
    }
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Create query
    let query = CommunityActivity.find(queryObj)
      .populate('initiator', 'username displayName avatar')
      .populate('targetUser', 'username displayName avatar');
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const activities = await query;
    
    // Get total count for pagination
    const total = await CommunityActivity.countDocuments(queryObj);
    
    res.status(200).json({
      success: true,
      count: activities.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: activities
    });
  } catch (err) {
    console.error('Error in getCommunityActivities:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching community activities'
    });
  }
};

// @desc    Get community activity by ID
// @route   GET /api/community/activities/:id
// @access  Public
exports.getCommunityActivity = async (req, res) => {
  try {
    const activity = await CommunityActivity.findById(req.params.id)
      .populate('initiator', 'username displayName avatar')
      .populate('targetUser', 'username displayName avatar')
      .populate('responses.user', 'username displayName avatar');
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Community activity not found'
      });
    }
    
    // Check if this is a private activity and the user is not the initiator or target
    if (
      !activity.isPublic && 
      (!req.user || 
        (req.user.id.toString() !== activity.initiator._id.toString() && 
         (!activity.targetUser || req.user.id.toString() !== activity.targetUser._id.toString())))
    ) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this activity'
      });
    }
    
    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    console.error('Error in getCommunityActivity:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching community activity'
    });
  }
};

// @desc    Respond to a community activity
// @route   POST /api/community/activities/:id/respond
// @access  Private
exports.respondToCommunityActivity = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { response, responseType } = req.body;

    // Find the activity
    const activity = await CommunityActivity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Community activity not found'
      });
    }
    
    // Check if the user has already responded
    const hasResponded = activity.responses.some(
      resp => resp.user.toString() === req.user.id.toString()
    );
    
    if (hasResponded) {
      // Update existing response
      activity.responses = activity.responses.map(resp => {
        if (resp.user.toString() === req.user.id.toString()) {
          return {
            ...resp,
            response,
            responseType,
            createdAt: Date.now()
          };
        }
        return resp;
      });
    } else {
      // Add new response
      activity.responses.push({
        user: req.user.id,
        response,
        responseType,
        createdAt: Date.now()
      });
    }
    
    await activity.save();
    
    // Notify the activity initiator
    await Notification.create({
      recipient: activity.initiator,
      type: 'community-activity',
      title: 'New Response to Your Activity',
      message: `${req.user.displayName} responded to your community activity.`,
      data: {
        communityActivityId: activity._id,
        userId: req.user.id
      }
    });
    
    // If this is related to a target user, notify them too
    if (activity.targetUser && activity.targetUser.toString() !== req.user.id.toString()) {
      await Notification.create({
        recipient: activity.targetUser,
        type: 'community-activity',
        title: 'New Response to Activity About You',
        message: `${req.user.displayName} responded to a community activity that involves you.`,
        data: {
          communityActivityId: activity._id,
          userId: req.user.id
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (err) {
    console.error('Error in respondToCommunityActivity:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while responding to community activity'
    });
  }
};

// @desc    Get users who might need community support
// @route   GET /api/community/support-needed
// @access  Public
exports.getUsersNeedingSupport = async (req, res) => {
  try {
    // Find users with significant negative balances
    const users = await User.find({
      pebsBalance: { $lt: -50 }, // Threshold for highlighting users
      isActive: true
    })
      .sort('pebsBalance') // Most negative first
      .select('username displayName avatar pebsBalance lastActive location biography skills needs');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error('Error in getUsersNeedingSupport:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users needing support'
    });
  }
}; 