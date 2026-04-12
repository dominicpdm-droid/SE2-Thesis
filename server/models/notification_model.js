const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  organization_name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['join', 'leave', 'removal', 'other'],
    default: 'other',
  },
  user_first_name: {
    type: String,
    required: true,
  },
  user_last_name: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
