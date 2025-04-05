const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('displayName', 'Display name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  authController.registerUser
);

// @route   POST /api/auth/login
// @desc    Login user & get token
// @access  Public
router.post('/login', authController.loginUser);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, authController.getMe);

// @route   GET /api/auth/logout
// @desc    Log out user and clear cookie
// @access  Private
router.get('/logout', auth, authController.logout);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  auth,
  [
    check('displayName', 'Display name must not be empty if provided').optional().not().isEmpty(),
    check('username', 'Username must not be empty if provided').optional().not().isEmpty(),
    check('biography', 'Biography cannot exceed 500 characters').optional().isLength({ max: 500 })
  ],
  authController.updateProfile
);

// @route   PUT /api/auth/avatar
// @desc    Update user avatar
// @access  Private
router.put(
  '/avatar',
  auth,
  [
    check('avatar', 'Avatar URL is required').not().isEmpty()
  ],
  authController.updateAvatar
);

module.exports = router; 