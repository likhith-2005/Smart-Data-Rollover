const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  planType: {
    type: String,
    required: true
  },
  dailyLimit: {
    type: Number,
    required: true
  },
  validity: {
    type: Number,
    required: true
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
    default: Date.now
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
