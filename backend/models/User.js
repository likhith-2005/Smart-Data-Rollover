const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },

  // ❌ Not required – user gets plan only after recharge
  planType: {
    type: String,
    default: "none"
  },

  dailyLimit: {
    type: Number,
    default: 0
  },

  validity: {
    type: Number,
    default: 0
  },

  todayUsage: {
    type: Number,
    default: 0
  },

  dataBank: {
    type: Number,
    default: 0
  },

  rechargeStartDate: {
    type: Date,
    default: null
  },

  lastResetDate: {
    type: Date,
    default: Date.now
  },

  // History
  history: [
    {
      date: { type: Date, default: Date.now },
      usage: { type: Number, default: 0 },
      message: { type: String }
    }
  ]
});

module.exports = mongoose.model("User", userSchema);