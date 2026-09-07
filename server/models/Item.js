const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Artist/Band name is required'],
      trim: true,
    },
    format: {
      type: String,
      required: [true, 'Format is required'],
      enum: ['Vinyl', 'CD', 'Cassette', 'Merchandise', 'Photocard', 'Poster'], 
    },
    genre: [
      {
        type: String,
        trim: true,
      },
    ],
    releaseYear: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 1,
    },
    isPreOwned: {
      type: Boolean,
      default: false,
    },
    condition: {
      mediaGrade: {
        type: String,
        enum: ['Mint', 'Near Mint', 'Very Good+', 'Very Good', 'Good', 'Poor', 'N/A'],
        default: 'N/A',
      },
      sleeveGrade: {
        type: String,
        enum: ['Mint', 'Near Mint', 'Very Good+', 'Very Good', 'Good', 'Poor', 'N/A'],
        default: 'N/A',
      },
      description: {
        type: String,
      },
    },
    details: {
      label: { type: String },
      pressingInfo: { type: String },
      tracklist: [{ type: String }],
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/300',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from compiling an old cached model
module.exports = mongoose.models.Item || mongoose.model('Item', itemSchema);