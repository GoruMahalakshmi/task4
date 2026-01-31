const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Machine",
  new mongoose.Schema(
    {
      name: String,
      type: String,
      status: {
        type: String,
        enum: ["Active", "Idle", "Error"],
        default: "Idle"
      },
      efficiency: {
        type: Number,
        default: 100
      },
      cycleTime: {
        type: Number,
        default: 0
      },
      assignedJob: {
        type: String,
        default: ""
      },
      operatingMode: {
        type: String,
        enum: ["Auto", "Manual"],
        default: "Auto"
      },
      latestTemperature: {
        type: Number,
        default: 0
      },
      lastMaintenance: Date
    },
    { timestamps: true }
  )
);
