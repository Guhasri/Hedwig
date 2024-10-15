// /backend/models/Drafts.js
const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema({
    to: String,
    from: String,
    cc: String,
    bcc: String,
    subject: String,
    body: String,
    date: { type: Date, default: Date.now },
    type: { type: String, default: 'drafts' },
    attachments: [String], // Array of attachment names
});

module.exports = mongoose.model('Draft', draftSchema, 'drafts');
