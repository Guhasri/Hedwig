const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const authRoutes = require('./routes/auth');
const inboxRoutes = require('./routes/inbox');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(express.json());

// Enable CORS for requests coming from http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000', // Replace with the actual origin
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth routes
app.use('/api/auth', authRoutes);

// Inbox routes
app.use('/api/inbox', inboxRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
