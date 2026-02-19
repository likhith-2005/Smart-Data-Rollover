const mongoose = require("mongoose");

const usageHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  usage: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UsageHistory", usageHistorySchema);
