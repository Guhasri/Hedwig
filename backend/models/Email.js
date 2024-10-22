const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, required: true },
  starred: { type: Boolean, default: false },
  bin: { type: Boolean, default: false },
  binSend: { type: Boolean, default: false },
  type: { type: String, default: 'inbox' },
  attachments: [String],
  cc: { type: String, default: '' }, // New field for CC
  bcc: { type: String, default: '' }  // New field for BCC
});

module.exports = mongoose.model('Email', EmailSchema, 'inbox');
