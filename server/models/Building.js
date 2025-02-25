const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: false
  },
  street: {
    type: String,
    required: false
  },
  property_type: {
    type: String,
    required: false
  },
  owner_company: {
    type: String,
    required: false
  },
  leasing_company: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Building', buildingSchema);
