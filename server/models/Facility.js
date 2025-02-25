const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'conference-room',
      'meeting-room',
      'event-space',
      'cafeteria',
      'gym',
      'parking',
      'lounge',
      'recreation',
      'storage',
      'other'
    ]
  },
  description: String,
  capacity: {
    type: Number,
    required: true
  },
  bookingRequired: {
    type: Boolean,
    default: true
  },
  availability: {
    schedule: {
      type: String,
      enum: ['24/7', 'business-hours', 'custom'],
      default: 'business-hours'
    },
    customHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    }
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'membership'],
      default: 'free'
    },
    rate: {
      amount: Number,
      period: {
        type: String,
        enum: ['hour', 'day', 'month']
      }
    }
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  media: {
    images: [String],
    floorPlan: String
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'closed'],
    default: 'active'
  },
  metadata: {
    floor: Number,
    size: {
      value: Number,
      unit: {
        type: String,
        enum: ['sq.ft', 'sq.m'],
        default: 'sq.ft'
      }
    },
    maxDuration: Number // in hours
  }
}, {
  timestamps: true
});

// Add indexes for common queries
facilitySchema.index({ type: 1 });
facilitySchema.index({ status: 1 });
facilitySchema.index({ bookingRequired: 1 });
facilitySchema.index({ 'pricing.type': 1 });

module.exports = mongoose.model('Facility', facilitySchema);
