const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    artist: { type: String, required: true },
    title: { type: String, required: true },
    format: {
      type: String,
      // Added 'Photocard' to match client modal
      enum: ['Vinyl', 'CD', 'Cassette', 'Photocard', 'Merchandise'], 
      required: true,
    },
    notes: { type: String },
    status: {
      type: String,
      enum: [
        'Pending', 
        'Met / Sourced', 
        'Sourced/Shipped', 
        'In Stock', 
        'Fulfilled', 
        'Not Met / Unavailable'
      ],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);