// src/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const inboxRoutes = require('./routes/inbox');
const draftRoutes = require('./routes/drafts');
const starredRoute = require('./routes/starred');
const binEmailsRoute = require('./routes/binEmails');
const sendRoute = require('./routes/send'); // Import send route
const sentMailsRoute = require('./routes/sentMails'); // Import sentMails route
const allMailsRoute = require('./routes/allMails');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/starred', starredRoute);
app.use('/api/binEmails', binEmailsRoute);
app.use('/api/send', sendRoute); // Added send route
app.use('/api/sent', sentMailsRoute); // Added sentMails route
app.use('/api/allMails', allMailsRoute);

const PORT = process.env.PORT || 1973;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
