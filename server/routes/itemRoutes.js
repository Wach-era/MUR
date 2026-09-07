const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/auth');
const {
  // Item controllers
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  decrementItemStock, // 1. Added controller import
  // Request controllers
  createRequest,
  getAllRequests,
  updateRequestStatus
} = require('../controllers/itemController');

// ============================
// ITEM ROUTES
// ============================

// GET all items & POST new item
router.route('/')
  .get(getAllItems)
  .post(createItem);

// GET single item, PUT update, DELETE item
router.route('/:id')
  .get(getItemById)
  .put(updateItem)
  .delete(deleteItem);

// PATCH /api/items/:id/decrement (In-store quick stock reduction)
router.patch('/:id/decrement', decrementItemStock);

// ============================
// REQUEST ROUTES
// ============================

// GET all requests & POST new request
router.route('/requests')
  .get(getAllRequests)
  .post(createRequest);

// PATCH update request status
router.route('/requests/:id')
  .patch(updateRequestStatus);

module.exports = router;