// backend/routes/sentMails.js
const express = require('express');
const router = express.Router();
const Email = require('../models/Email'); // Adjust the path as needed

// Get sent emails for a specific user
router.get('/', async (req, res) => {
    const { email } = req.query; // Get the email from the query parameters

    try {
        const sentEmails = await Email.find({ from: email }); // Fetch emails where 'from' matches the logged-in user's email
        res.json(sentEmails);
    } catch (error) {
        console.error('Error fetching sent emails:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
