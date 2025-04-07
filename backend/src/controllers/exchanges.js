const Exchange = require('../models/Exchange');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// @desc    Create a new exchange
// @route   POST /api/exchanges
// @access  Private
exports.createExchange = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      direction,
      participant,
      description,
      category,
      pebsAmount,
      notes,
      location,
      exchangeDate
    } = req.body;

    // Validate participant exists
    const participantUser = await User.findOne({ username: participant });
    if (!participantUser) {
      return res.status(404).json({
        success: false,
        message: 'Participant user not found'
      });
    }

    // Prevent self-exchanges
    if (req.user.id.toString() === participantUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot create an exchange with yourself'
      });
    }

    // Create exchange record
    const exchange = await Exchange.create({
      initiator: req.user.id,
      direction,
      participant: participantUser._id,
      description,
      category,
      pebsAmount,
      notes: notes || '',
      location: location || '',
      exchangeDate: exchangeDate || Date.now()
    });

    // Update user balances based on exchange direction
    if (direction === 'provided') {
      // Initiator is sending PEBS to participant
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { pebsBalance: -pebsAmount } }
      );
      
      await User.findByIdAndUpdate(
        participantUser._id,
        { $inc: { pebsBalance: pebsAmount } }
      );
    } else {
      // Initiator is receiving PEBS from participant
      await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { pebsBalance: pebsAmount } }
      );
      
      await User.findByIdAndUpdate(
        participantUser._id,
        { $inc: { pebsBalance: -pebsAmount } }
      );
    }

    // Create notification for the participant
    const notification = await Notification.create({
      recipient: participantUser._id,
      type: 'exchange-received',
      title: 'New Exchange Recorded',
      message: `${req.user.displayName} recorded an exchange with you.`,
      data: {
        exchangeId: exchange._id,
        userId: req.user.id
      }
    });

    // Send real-time notification if user is connected
    const io = req.app.get('io');
    const connectedUsers = req.app.get('connectedUsers');
    const recipientSocketId = connectedUsers.get(participantUser._id.toString());
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('notification', {
        type: 'exchange-received',
        title: 'PEBS Received!',
        message: `${req.user.displayName} sent you ${pebsAmount} PEBS.`,
        data: {
          exchangeId: exchange._id,
          userId: req.user.id,
          pebsAmount
        }
      });
    }

    res.status(201).json({
      success: true,
      data: exchange
    });
  } catch (err) {
    console.error('Error in createExchange:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while creating exchange'
    });
  }
};

// @desc    Get all exchanges (with filters and pagination)
// @route   GET /api/exchanges
// @access  Public
exports.getExchanges = async (req, res) => {
  try {
    // Build query based on filters
    const queryObj = { ...req.query };
    
    // Fields to exclude from filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // Create query
    let query = Exchange.find(queryObj)
      .populate('initiator', 'username displayName avatar')
      .populate('participant', 'username displayName avatar');
    
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
    const exchanges = await query;
    
    // Get total count for pagination
    const total = await Exchange.countDocuments(queryObj);
    
    res.status(200).json({
      success: true,
      count: exchanges.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: exchanges
    });
  } catch (err) {
    console.error('Error in getExchanges:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exchanges'
    });
  }
};

// @desc    Get single exchange
// @route   GET /api/exchanges/:id
// @access  Public
exports.getExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id)
      .populate('initiator', 'username displayName avatar')
      .populate('participant', 'username displayName avatar');
    
    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: exchange
    });
  } catch (err) {
    console.error('Error in getExchange:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exchange'
    });
  }
};

// @desc    Confirm an exchange (as the participant)
// @route   PUT /api/exchanges/:id/confirm
// @access  Private
exports.confirmExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    
    if (!exchange) {
      return res.status(404).json({
        success: false,
        message: 'Exchange not found'
      });
    }
    
    // Check if the user is the participant in the exchange
    if (exchange.participant.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only confirm exchanges where you are the participant'
      });
    }
    
    // Don't allow confirming already confirmed exchanges
    if (exchange.isConfirmed) {
      return res.status(400).json({
        success: false,
        message: 'This exchange is already confirmed'
      });
    }
    
    // Update the exchange
    exchange.isConfirmed = true;
    await exchange.save();
    
    // Create notification for the initiator
    await Notification.create({
      recipient: exchange.initiator,
      type: 'exchange-confirmed',
      title: 'Exchange Confirmed',
      message: `${req.user.displayName} confirmed your exchange.`,
      data: {
        exchangeId: exchange._id,
        userId: req.user.id
      }
    });
    
    res.status(200).json({
      success: true,
      data: exchange
    });
  } catch (err) {
    console.error('Error in confirmExchange:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming exchange'
    });
  }
};

// @desc    Get user's exchanges
// @route   GET /api/exchanges/user/:userId
// @access  Public
exports.getUserExchanges = async (req, res) => {
  try {
    // Validate the user exists
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get exchanges where user is either initiator or participant
    const exchanges = await Exchange.find({
      $or: [
        { initiator: req.params.userId },
        { participant: req.params.userId }
      ]
    })
      .populate('initiator', 'username displayName avatar')
      .populate('participant', 'username displayName avatar')
      .sort('-exchangeDate');
    
    res.status(200).json({
      success: true,
      count: exchanges.length,
      data: exchanges
    });
  } catch (err) {
    console.error('Error in getUserExchanges:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user exchanges'
    });
  }
};

// @desc    Get exchange statistics
// @route   GET /api/exchanges/stats
// @access  Public
exports.getExchangeStats = async (req, res) => {
  try {
    const stats = await Exchange.aggregate([
      {
        $group: {
          _id: null,
          totalExchanges: { $sum: 1 },
          totalPebs: { $sum: '$pebsAmount' },
          avgPebs: { $avg: '$pebsAmount' },
          categories: { 
            $push: '$category' 
          }
        }
      }
    ]);
    
    // Get category distribution
    const categoryStats = await Exchange.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalPebs: { $sum: '$pebsAmount' }
        }
      }
    ]);
    
    // Get recent activity trends
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
    
    const monthlyTrend = await Exchange.aggregate([
      {
        $match: {
          exchangeDate: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$exchangeDate' } 
          },
          count: { $sum: 1 },
          totalPebs: { $sum: '$pebsAmount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || { totalExchanges: 0, totalPebs: 0, avgPebs: 0 },
        categories: categoryStats,
        trend: monthlyTrend
      }
    });
  } catch (err) {
    console.error('Error in getExchangeStats:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exchange statistics'
    });
  }
};

// @desc    Get recent exchanges for the authenticated user
// @route   GET /api/exchanges/recent
// @access  Private
exports.getRecentExchanges = async (req, res) => {
  try {
    // Get exchanges where user is either initiator or participant
    const exchanges = await Exchange.find({
      $or: [
        { initiator: req.user.id },
        { participant: req.user.id }
      ]
    })
      .populate('initiator', 'username displayName avatar')
      .populate('participant', 'username displayName avatar')
      .sort('-createdAt')
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: exchanges
    });
  } catch (err) {
    console.error('Error in getRecentExchanges:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent exchanges'
    });
  }
}; 