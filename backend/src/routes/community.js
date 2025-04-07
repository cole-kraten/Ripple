const express = require('express');
const { check } = require('express-validator');
const communityController = require('../controllers/community');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/community/activities
// @desc    Get all community activities with filtering
// @access  Public
router.get('/activities', communityController.getCommunityActivities);

// @route   GET /api/community/activities/:id
// @desc    Get a single community activity by ID
// @access  Public (with private check inside controller)
router.get('/activities/:id', communityController.getCommunityActivity);

// @route   POST /api/community/activities
// @desc    Create a new community activity
// @access  Private
router.post(
  '/activities',
  auth,
  [
    check('activityType', 'Please specify a valid activity type').isIn([
      'community-check-in',
      'support-offer',
      'community-event',
      'governance-proposal',
      'resource-sharing',
      'feedback'
    ]),
    check('title', 'Please provide a title for this activity').not().isEmpty(),
    check('description', 'Please provide a description for this activity').not().isEmpty()
  ],
  communityController.createCommunityActivity
);

// @route   POST /api/community/activities/:id/respond
// @desc    Respond to a community activity
// @access  Private
router.post(
  '/activities/:id/respond',
  auth,
  [
    check('response', 'Please provide your response').not().isEmpty(),
    check('responseType', 'Please specify a valid response type').isIn([
      'support',
      'participate',
      'acknowledge',
      'decline',
      'other'
    ])
  ],
  communityController.respondToCommunityActivity
);

// @route   GET /api/community/support-needed
// @desc    Get users who might need community support
// @access  Public
router.get('/support-needed', communityController.getUsersNeedingSupport);

module.exports = router; 