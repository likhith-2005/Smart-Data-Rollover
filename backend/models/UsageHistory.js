const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  usage: { type: Number, required: true },
  message: { type: String, default: "" }
});

module.exports = mongoose.model("UsageHistory", historySchema);
