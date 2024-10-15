// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const inboxRoutes = require('./routes/inbox');
const draftRoutes = require('./routes/drafts');
const starredRoute = require('./routes/starred');
const binEmailsRoute = require('./routes/binEmails'); // Import bin emails route
const allMailsRoute = require('./routes/allMails'); // Import all mails route

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
app.use('/api/binEmails', binEmailsRoute); // Use bin emails route
app.use('/api/allMails', allMailsRoute); // Use all mails route

const PORT = process.env.PORT || 1973;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
