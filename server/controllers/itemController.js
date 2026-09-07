const Item = require('../models/Item');
const Request = require('../models/Request');

// ============================
// ITEM CONTROLLERS
// ============================

// @desc    Get all items (with optional filters)
// @route   GET /api/items
exports.getAllItems = async (req, res) => {
  try {
    const { type, isPreOwned } = req.query;
    let query = {};

    if (type) query.type = type;
    if (isPreOwned !== undefined) query.isPreOwned = isPreOwned === 'true';

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new collectible item
// @route   POST /api/items
exports.createItem = async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update item (Admin)
// @route   PUT /api/items/:id
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete item (Admin)
// @route   DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.status(200).json({ success: true, message: 'Item removed from inventory' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Quick decrement stock quantity (Admin / In-Store Sale)
// @route   PATCH /api/items/:id/decrement
exports.decrementItemStock = async (req, res) => {
  try {
    const { quantity = 1 } = req.body;

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.stockQuantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot reduce stock below 0. Item is out of stock!' 
      });
    }

    item.stockQuantity -= quantity;
    await item.save();

    res.status(200).json({ 
      success: true, 
      message: `Stock decremented by ${quantity}`, 
      data: item 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================
// REQUEST CONTROLLERS
// ============================

// @desc    Create a customer request
// @route   POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const newRequest = await Request.create(req.body);
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all requests
// @route   GET /api/requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    
    res.status(200).json({ success: true, data: updatedRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};