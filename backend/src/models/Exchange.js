const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
  // Who initiated the exchange record
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Direction of pebs flow (relative to initiator)
  direction: {
    type: String,
    enum: ['provided', 'received'],
    required: [true, 'Please specify if you provided or received the goods/services']
  },
  // The other user in the exchange
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Description of what was exchanged
  description: {
    type: String,
    required: [true, 'Please provide a description of the exchange'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  // Category of the exchange
  category: {
    type: String,
    enum: [
      'food-necessities',
      'repairs-maintenance',
      'creative-works',
      'care-work',
      'knowledge-teaching',
      'physical-goods',
      'services-skills',
      'other'
    ],
    required: [true, 'Please select a category for this exchange']
  },
  // Number of pebs exchanged (always positive)
  pebsAmount: {
    type: Number,
    required: [true, 'Please specify the number of pebs for this exchange'],
    min: [0, 'Pebs amount must be positive']
  },
  // Optional notes about the exchange
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  // Optional images of the exchange
  images: [{
    type: String
  }],
  // Has the participant confirmed this exchange?
  isConfirmed: {
    type: Boolean,
    default: false
  },
  // Date of the exchange
  exchangeDate: {
    type: Date,
    default: Date.now
  },
  // When the record was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Location of the exchange (optional)
  location: {
    type: String,
    trim: true
  },
  // If the exchange was edited after creation
  isEdited: {
    type: Boolean,
    default: false
  },
  // If there was a correction/dispute
  correctionNotes: {
    type: String
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for efficient queries
ExchangeSchema.index({ initiator: 1, participant: 1, exchangeDate: -1 });
ExchangeSchema.index({ category: 1 });

// Virtual function to calculate who gives/receives pebs
ExchangeSchema.virtual('flowDetails').get(function() {
  const giver = this.direction === 'received' ? this.initiator : this.participant;
  const receiver = this.direction === 'received' ? this.participant : this.initiator;
  
  return {
    giver,
    receiver,
    amount: this.pebsAmount
  };
});

// Define a post-save hook to update user balances
// This will be implemented in an external controller to maintain transaction safety

module.exports = mongoose.model('Exchange', ExchangeSchema); 