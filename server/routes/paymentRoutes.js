const express = require('express');
const router = express.Router();
const axios = require('axios');
const Item = require('../models/Item'); 

// Helper: Generate Daraja Access Token
const getMpesaToken = async (req, res, next) => {
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const key = process.env.MPESA_CONSUMER_KEY;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });
    req.mpesaToken = response.data.access_token;
    next();
  } catch (error) {
    console.error('M-Pesa Token Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to authenticate with M-Pesa' });
  }
};

// Route: Initiate STK Push
router.post('/stkpush', getMpesaToken, async (req, res) => {
  const { phone, amount, itemId, items } = req.body;

  try {
    // -------------------------------------------------------------
    // 1. BACKEND STOCK VALIDATION
    // -------------------------------------------------------------

    // Case A: Single Item Purchase
    if (itemId) {
      const dbItem = await Item.findById(itemId);
      if (!dbItem) {
        return res.status(404).json({ success: false, message: 'Item not found in database.' });
      }
      if (dbItem.stockQuantity <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Sorry, "${dbItem.title}" is out of stock!` 
        });
      }
    }

    // Case B: Cart Checkout (Array of Items)
    if (Array.isArray(items) && items.length > 0) {
      for (const cartItem of items) {
        const dbItem = await Item.findById(cartItem._id);
        if (!dbItem) {
          return res.status(404).json({ success: false, message: 'An item in your cart no longer exists.' });
        }
        const requestedQty = cartItem.quantity || 1;
        if (dbItem.stockQuantity < requestedQty) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for "${dbItem.title}". Only ${dbItem.stockQuantity} remaining.`
          });
        }
      }
    }

    // -------------------------------------------------------------
    // 2. FORMAT PHONE & TIMESTAMPS
    // -------------------------------------------------------------
    let formattedPhone = phone.trim().replace(/\+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = `254${formattedPhone.substring(1)}`;
    }

    const date = new Date();
    const timestamp = date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

    // Build callback URL query params
    let callbackParams = '';
    if (itemId) {
      callbackParams = `?itemId=${itemId}`;
    } else if (Array.isArray(items) && items.length > 0) {
      // Serialize items list so callback can parse & decrement stock
      const itemsPayload = items.map(i => `${i._id}:${i.quantity || 1}`).join(',');
      callbackParams = `?cartItems=${encodeURIComponent(itemsPayload)}`;
    }

    // -------------------------------------------------------------
    // 3. TRIGGER STK PUSH
    // -------------------------------------------------------------
    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.CALLBACK_URL}${callbackParams}`,
        AccountReference: 'MusicStore',
        TransactionDesc: 'Purchase Collectable'
      },
      {
        headers: { Authorization: `Bearer ${req.mpesaToken}` }
      }
    );

    return res.status(200).json({ success: true, message: 'STK push sent to phone', data: stkResponse.data });
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Failed to initiate M-Pesa STK push' });
  }
});

// Callback Route: Safaricom posts status here after user enters PIN
router.post('/stk-callback', async (req, res) => {
  try {
    const { itemId, cartItems } = req.query;
    const callbackData = req.body?.Body?.stkCallback;

    if (!callbackData) {
      console.log('Received empty or malformed callback data');
      return res.status(400).send('Invalid Callback');
    }

    const resultCode = callbackData.ResultCode;
    const resultDesc = callbackData.ResultDesc;

    console.log(`[M-PESA CALLBACK] Result Code: ${resultCode} - ${resultDesc}`);

    if (resultCode === 0) {
      // Single item stock decrement
      if (itemId) {
        await Item.findByIdAndUpdate(itemId, { $inc: { stockQuantity: -1 } });
        console.log(`✅ Success! Decremented stock for item: ${itemId}`);
      }

      // Multi-item cart stock decrement
      if (cartItems) {
        const itemPairs = decodeURIComponent(cartItems).split(',');
        for (const pair of itemPairs) {
          const [id, qty] = pair.split(':');
          if (id) {
            const decrementBy = parseInt(qty, 10) || 1;
            await Item.findByIdAndUpdate(id, { $inc: { stockQuantity: -decrementBy } });
            console.log(`✅ Success! Decremented ${decrementBy} copy/copies for item: ${id}`);
          }
        }
      }
    } else {
      console.log(`❌ Payment failed or cancelled: ${resultDesc}`);
    }

    // Safaricom requires a 200 OK response
    return res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (err) {
    console.error('Error handling STK Callback:', err);
    return res.status(500).send('Internal Server Error');
  }
});

module.exports = router;