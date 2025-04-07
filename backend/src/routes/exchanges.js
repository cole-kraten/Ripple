const express = require('express');
const { check } = require('express-validator');
const exchangesController = require('../controllers/exchanges');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/exchanges
// @desc    Get all exchanges with filtering
// @access  Public
router.get('/', exchangesController.getExchanges);

// @route   GET /api/exchanges/stats
// @desc    Get exchange statistics
// @access  Public
router.get('/stats', exchangesController.getExchangeStats);

// @route   GET /api/exchanges/user/:userId
// @desc    Get exchanges for a specific user
// @access  Public
router.get('/user/:userId', exchangesController.getUserExchanges);

// @route   GET /api/exchanges/recent
// @desc    Get recent exchanges for the authenticated user
// @access  Private
router.get('/recent', auth, exchangesController.getRecentExchanges);

// @route   GET /api/exchanges/:id
// @desc    Get a single exchange by ID
// @access  Public
router.get('/:id', exchangesController.getExchange);

// @route   POST /api/exchanges
// @desc    Create a new exchange
// @access  Private
router.post(
  '/',
  auth,
  [
    check('direction', 'Please specify if you provided or received the goods/services').isIn(['provided', 'received']),
    check('participant', 'Please specify the other user in this exchange').not().isEmpty(),
    check('description', 'Please provide a description of the exchange').not().isEmpty(),
    check('category', 'Please select a valid category').isIn([
      'food-necessities',
      'repairs-maintenance',
      'creative-works',
      'care-work',
      'knowledge-teaching',
      'physical-goods',
      'services-skills',
      'other'
    ]),
    check('pebsAmount', 'Please specify a positive number of pebs').isFloat({ min: 0.1 })
  ],
  exchangesController.createExchange
);

// @route   PUT /api/exchanges/:id/confirm
// @desc    Confirm an exchange as the participant
// @access  Private
router.put('/:id/confirm', auth, exchangesController.confirmExchange);

module.exports = router; 