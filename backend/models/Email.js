const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  cc: { type: String },   // Added cc field
  bcc: { type: String },  // Added bcc field
  subject: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, required: true },
  starred: { type: Boolean, default: false },
  bin: { type: Boolean, default: false },
  type: { type: String, default: 'inbox' },
  attachments: { type: [String], default: [] }
});

module.exports = mongoose.model('Email', EmailSchema, 'inbox');
