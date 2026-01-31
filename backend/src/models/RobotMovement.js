const mongoose = require("mongoose");

module.exports = mongoose.model(
  "RobotMovement",
  new mongoose.Schema(
    {
      machineId: mongoose.Schema.Types.ObjectId,
      j1: Number,
      j2: Number,
      j3: Number,
      j4: Number,
      j5: Number,
      j6: Number
    },
    { timestamps: true }
  )
);
