const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// We'll create a simple users controller here since we don't have it yet
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/users/by-username/:username
// @desc    Get user by username
// @access  Public
router.get('/by-username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error in getUserByUsername:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (with filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Build query based on filters
    const queryObj = { ...req.query };
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Create base query
    let query = User.find(queryObj);
    
    // Add search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.find({
        $or: [
          { username: searchRegex },
          { displayName: searchRegex },
          { biography: searchRegex }
        ]
      });
    }
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // Never return password
      query = query.select('-password');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const users = await query;
    
    // Get total count for pagination
    const total = await User.countDocuments(queryObj);
    
    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (err) {
    console.error('Error in getUsers:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error in getUser:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put(
  '/me',
  auth,
  [
    check('displayName', 'Display name must not be empty if provided').optional().not().isEmpty(),
    check('biography', 'Biography cannot exceed 500 characters').optional().isLength({ max: 500 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const {
        displayName,
        biography,
        skills,
        needs,
        location
      } = req.body;

      // Build user object
      const userFields = {};
      if (displayName) userFields.displayName = displayName;
      if (biography !== undefined) userFields.biography = biography;
      if (skills) userFields.skills = skills;
      if (needs) userFields.needs = needs;
      if (location !== undefined) userFields.location = location;

      // Update user
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: userFields },
        { new: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (err) {
      console.error('Error in updateUser:', err);
      res.status(500).json({
        success: false,
        message: 'Server error while updating user'
      });
    }
  }
);

module.exports = router; 