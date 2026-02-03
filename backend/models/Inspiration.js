// backend/models/Inspiration.js
const mongoose = require('mongoose');

const inspirationSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  skinTone: [String],
  bodyType: [String],
  occasion: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Inspiration = mongoose.model('Inspiration', inspirationSchema);
module.exports = Inspiration;