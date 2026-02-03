// backend/routes/wardrobeRoutes.js
const express = require('express');
const router = express.Router();
const {
  uploadToWardrobe,
  getWardrobe,
} = require('../controllers/wardrobeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

// Apply authentication middleware to all wardrobe routes
router.use(protect);

// GET /api/v1/wardrobe - Get all wardrobe items
router.get('/', getWardrobe);

// POST /api/v1/wardrobe - Upload new wardrobe item
router.post('/', upload.single('image'), uploadToWardrobe);

module.exports = router;