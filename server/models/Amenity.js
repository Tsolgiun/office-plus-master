const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'technology',
      'comfort',
      'security',
      'wellness',
      'facility',
      'parking',
      'connectivity',
      'service',
      'other'
    ]
  },
  icon: {
    type: String,
    required: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    additionalCost: {
      amount: Number,
      period: {
        type: String,
        enum: ['monthly', 'yearly', 'one-time'],
      }
    },
    availability: {
      type: String,
      enum: ['24/7', 'business-hours', 'on-demand'],
      default: '24/7'
    }
  }
}, {
  timestamps: true
});

// Add indexes for common queries
amenitySchema.index({ category: 1 });
amenitySchema.index({ isActive: 1 });

// Add compound index for name and category
amenitySchema.index({ name: 1, category: 1 });

module.exports = mongoose.model('Amenity', amenitySchema);
