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

  history: [
    {
      date: { type: Date, default: Date.now },
      usage: Number,
      message: String
    }
  ]
});

module.exports = mongoose.model("User", userSchema);