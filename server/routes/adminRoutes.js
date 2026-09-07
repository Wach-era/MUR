const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { auth, admin } = require('../middleware/auth');

// GET all customer requests (Admin only)
router.get('/requests', [auth, admin], async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error('Error in /api/admin/requests:', err);
    res.status(500).json({ message: 'Error retrieving requests.' });
  }
});

module.exports = router;