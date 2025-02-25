const mongoose = require('mongoose');
const bcrypt = require('mongoose-bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true
  },
  role: {
    type: String,
    enum: ['admin', 'agent', 'client'],
    default: 'client'
  },
  profile: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phone: String,
    company: String,
    position: String,
    avatar: String
  },
  preferences: {
    propertyTypes: [{
      type: String
    }],
    priceRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    preferredLocations: [{
      city: String,
      district: String
    }],
    desiredSize: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['sq.ft', 'sq.m'],
        default: 'sq.ft'
      }
    },
    desiredAmenities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Amenity'
    }]
  },
  savedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    propertyAlerts: {
      type: Boolean,
      default: true
    },
    bookingUpdates: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: Date,
  verificationStatus: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    },
    documents: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Add mongoose-bcrypt plugin
userSchema.plugin(bcrypt);

// Add indexes for common queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });

// Method to safely return user data without sensitive information
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationStatus;
  return user;
};

module.exports = mongoose.model('User', userSchema);
