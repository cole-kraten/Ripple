const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    maxlength: [30, 'Username cannot be more than 30 characters']
  },
  displayName: {
    type: String,
    required: [true, 'Please provide a display name'],
    trim: true,
    maxlength: [50, 'Display name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  biography: {
    type: String,
    maxlength: [500, 'Biography cannot be more than 500 characters'],
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  needs: [{
    type: String,
    trim: true
  }],
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  pebsBalance: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual property for balance status (for community support features)
UserSchema.virtual('balanceStatus').get(function() {
  if (this.pebsBalance < -100) return 'needs-support';
  if (this.pebsBalance < -50) return 'attention';
  if (this.pebsBalance < 0) return 'negative';
  if (this.pebsBalance === 0) return 'balanced';
  return 'positive';
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Set method to update user's last active timestamp
UserSchema.methods.updateLastActive = async function() {
  this.lastActive = Date.now();
  await this.save();
};

module.exports = mongoose.model('User', UserSchema); 