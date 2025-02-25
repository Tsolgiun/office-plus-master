const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  facilities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility'
  }],
  buildingAmenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  yearBuilt: Number,
  totalFloors: {
    type: Number,
    required: true
  },
  parkingAvailable: {
    type: Boolean,
    default: false
  },
  security: {
    type: {
      type: String,
      enum: ['24/7', 'business-hours', 'none'],
      default: 'business-hours'
    },
    hours: String
  },
  images: [String],
  status: {
    type: String,
    enum: ['active', 'maintenance', 'closed'],
    default: 'active'
  },
  description: String,
  features: [String]
}, {
  timestamps: true
});

// Add indexes for common queries
buildingSchema.index({ 'address.city': 1, 'address.district': 1 });
buildingSchema.index({ status: 1 });
buildingSchema.index({ parkingAvailable: 1 });

module.exports = mongoose.model('Building', buildingSchema);
