const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    }
  },
  location: {
    address: {
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
  specifications: {
    size: {
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        enum: ['m²', 'sq.m'],
        default: 'm²'
      }
    },
    capacity: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    floor: Number,
    totalFloors: Number
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  media: {
    mainImage: {
      type: String,
      required: true
    },
    images: [String],
    virtualTour: String,
    floorPlan: String
  },
  availability: {
    status: {
      type: String,
      enum: ['immediate', 'from-date'],
      required: true
    },
    availableFrom: Date,
    minimumLeaseTerm: {
      type: Number,
      default: 1
    }
  },
  features: [String],
  buildingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building'
  },
  status: {
    type: String,
    enum: ['active', 'leased', 'maintenance'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for common queries
propertySchema.index({ 'location.city': 1, 'location.district': 1 });
propertySchema.index({ 'specifications.type': 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ 'price.amount': 1 });

module.exports = mongoose.model('Property', propertySchema);
