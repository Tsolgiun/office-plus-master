const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  buildingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Building',
    required: true
  },
  rent_range: {
    type: String,
    required: false
  },
  area_range: {
    type: String,
    required: false
  },
  commission: {
    type: String,
    required: false
  },
  commission_basis: {
    type: String,
    enum: ['成交制', '报备制'],
    required: false
  },
  commission_verification: {
    type: String,
    required: false
  },
  communication: {
    date: {
      type: Date,
      required: false
    },
    method: {
      type: String,
      required: false
    },
    follow_up_result: {
      type: String,
      required: false
    }
  },
  notes_and_control: {
    type: String,
    required: false
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  location: {
    address: {
      type: String,
      required: false
    }
  },
  media: {
    images: [String]
  },
  specifications: {
    type: {
      type: String,
      required: false
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

propertySchema.index({ 'buildingId': 1 });
propertySchema.index({ 'commission_basis': 1 });
propertySchema.index({ 'status': 1 });
propertySchema.index({ 'rent_range': 1 });
propertySchema.index({ 'area_range': 1 });

module.exports = mongoose.model('Property', propertySchema);
