// routes/inbox.js
const express = require('express');
const Email = require('../models/Email');

const router = express.Router();

// Get emails for a specific user
router.get('/', async (req, res) => {
  const { email } = req.query; // Get email from query params

  try {
    const emails = await Email.find({ to: email });
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
