const router = require("express").Router();
const Sensor = require("../models/SensorReading");
const Machine = require("../models/Machine");
const RobotMovement = require("../models/RobotMovement");
const auth = require("../middleware/authMiddleware");

router.get("/temperature", auth, async (_, res) => {
  const readings = await Sensor.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(readings.reverse());
});

router.get("/vibration", auth, async (_, res) => {
  const readings = await Sensor.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(
    readings
      .map(r => ({
        _id: r._id,
        machineId: r.machineId,
        vibration: r.vibration,
        createdAt: r.createdAt
      }))
      .reverse()
  );
});

router.get("/conveyor-load", auth, async (_, res) => {
  const conveyors = await Machine.find({ type: "Conveyor" }).lean();
  const conveyorIds = conveyors.map(c => c._id);
  if (!conveyorIds.length) {
    return res.json([]);
  }
  const readings = await Sensor.find({ machineId: { $in: conveyorIds } })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(readings.reverse());
});

router.get("/production", auth, async (_, res) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const aggregated = await Sensor.aggregate([
    { $match: { createdAt: { $gte: oneHourAgo } } },
    {
      $group: {
        _id: "$machineId",
        count: { $sum: 1 }
      }
    }
  ]);
  const machineIds = aggregated.map(a => a._id);
  const machines = await Machine.find({ _id: { $in: machineIds } })
    .select("name")
    .lean();
  const namesById = {};
  machines.forEach(m => {
    namesById[m._id.toString()] = m.name;
  });
  const result = aggregated.map(a => ({
    machineId: a._id,
    machineName: namesById[a._id.toString()] || "Machine",
    unitsPerHour: a.count
  }));
  res.json(result);
});

router.get("/robot-movement", auth, async (_, res) => {
  const robots = await Machine.find({ type: "Robot" }).lean();
  const robotIds = robots.map(r => r._id);
  if (!robotIds.length) {
    return res.json([]);
  }
  const moves = await RobotMovement.find({ machineId: { $in: robotIds } })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(moves.reverse());
});

module.exports = router;
