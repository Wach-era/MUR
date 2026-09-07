const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { auth, admin } = require('../middleware/auth');

// 1. CLIENT: Submit Request
// POST /api/requests
router.post('/', auth, async (req, res) => {
  try {
    const { artist, title, albumOrItemTitle, format, notes, additionalDetails } = req.body;

    const newRequest = new Request({
      user: req.user.id,
      artist,
      title: title || albumOrItemTitle,
      format,
      notes: notes || additionalDetails
    });

    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    console.error('Error creating request:', err);
    res.status(500).json({ message: err.message || 'Server error creating request.' });
  }
});

// 2. CLIENT: View My Requests
// GET /api/requests/my-requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const userRequests = await Request.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: userRequests
    });
  } catch (err) {
    console.error('Error fetching user requests:', err);
    res.status(500).json({ message: 'Server error retrieving your requests.' });
  }
});

// 3. ADMIN: View All Requests
// GET /api/requests/admin/all
router.get('/admin/all', auth, admin, async (req, res) => {
  try {
    const allRequests = await Request.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: allRequests
    });
  } catch (err) {
    console.error('Error fetching all requests:', err);
    res.status(500).json({ message: 'Server error retrieving requests.' });
  }
});

// 4. ADMIN: Update Request Status
// PATCH /api/requests/:id
router.patch('/:id', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status field is required.' });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    res.status(200).json({
      success: true,
      data: updatedRequest
    });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ message: err.message || 'Failed to update status.' });
  }
});

module.exports = router;