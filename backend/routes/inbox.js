const express = require('express');
const Email = require('../models/Email'); 

const router = express.Router();

router.get('/', async (req, res) => {
  const { email } = req.query; 

  try {
    const emails = await Email.find({ to: email, bin: false }); 
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for deleting emails
router.put('/:id/delete', async (req, res) => {
  const { id } = req.params;
  const { bin } = req.body;

  try {
    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { bin },
      { new: true }
    );
    if (!updatedEmail) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json(updatedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating email', error });
  }
});

// Route for starring emails
router.put('/:id/star', async (req, res) => {
  const { id } = req.params;
  const { starred } = req.body;

  try {
    const updatedEmail = await Email.findByIdAndUpdate(
      id,
      { starred },
      { new: true }
    );
    if (!updatedEmail) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json(updatedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating starred status', error });
  }
});

// New route for forwarding an email
router.post('/', async (req, res) => {
  const { from, to, subject, body, attachments, date } = req.body;

  const newEmail = new Email({
    from,
    to,
    subject,
    body,
    attachments,
    date,
    bin: false, // Ensure the forwarded email is not marked as deleted
  });

  try {
    const savedEmail = await newEmail.save();
    res.status(201).json(savedEmail);
  } catch (error) {
    console.error('Error forwarding email:', error);
    res.status(500).json({ message: 'Error creating forwarded email', error });
  }
});

module.exports = router;
