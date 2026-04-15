const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  is_authorized: {
    type: Boolean,
    default: false,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  user_organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  applied_at: {
    type: Date,
    default: null,
  },
  is_firsttime: {
    type: Boolean,
    default: true,
  },
  time_created: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
