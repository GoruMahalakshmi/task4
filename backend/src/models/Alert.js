const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Alert",
  new mongoose.Schema({
    machineId: mongoose.Schema.Types.ObjectId,
    type: String,
    severity: String,
    resolved: { type: Boolean, default: false }
  }, { timestamps: true })
);
