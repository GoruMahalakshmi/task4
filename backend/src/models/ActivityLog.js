const mongoose = require("mongoose");

module.exports = mongoose.model(
  "ActivityLog",
  new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    action: String,
    machineId: mongoose.Schema.Types.ObjectId
  }, { timestamps: true })
);
