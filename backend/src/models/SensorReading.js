const mongoose = require("mongoose");

module.exports = mongoose.model(
  "SensorReading",
  new mongoose.Schema({
    machineId: mongoose.Schema.Types.ObjectId,
    temperature: Number,
    vibration: Number,
    load: Number,
    pressure: Number
  }, { timestamps: true })
);
