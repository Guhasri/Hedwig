// models/Email.js
const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, required: true },
  starred: { type: Boolean, default: false },
  bin: { type: Boolean, default: false },
  type: { type: String, default: 'inbox' },
});

module.exports = mongoose.model('Email', EmailSchema,'inbox');
