const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['property-viewing', 'facility-reservation'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility'
  },
  dateTime: {
    start: {
      type: Date,
      required: true
    },
    end: Date
  },
  duration: {
    type: Number, // in minutes
    required: function() {
      return this.type === 'facility-reservation';
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  visitType: {
    type: String,
    enum: ['virtual', 'in-person'],
    required: function() {
      return this.type === 'property-viewing';
    }
  },
  attendees: [{
    name: String,
    email: String,
    phone: String
  }],
  notes: {
    client: String,
    agent: String,
    internal: String
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    specialRequirements: [String]
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date
  },
  reminder: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  },
  metadata: {
    source: String,
    utm: {
      source: String,
      medium: String,
      campaign: String
    }
  }
}, {
  timestamps: true
});

// Validation
bookingSchema.pre('validate', function(next) {
  if (this.type === 'property-viewing' && !this.property) {
    next(new Error('Property is required for property viewings'));
  }
  if (this.type === 'facility-reservation' && !this.facility) {
    next(new Error('Facility is required for facility reservations'));
  }
  next();
});

// Indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ property: 1 });
bookingSchema.index({ facility: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'dateTime.start': 1 });
bookingSchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
