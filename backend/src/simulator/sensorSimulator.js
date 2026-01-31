const Sensor = require("../models/SensorReading");
const Alert = require("../models/Alert");
const Machine = require("../models/Machine");
const RobotMovement = require("../models/RobotMovement");

module.exports = io => {
  setInterval(async () => {
    const machines = await Machine.find();

    for (let m of machines) {
      const temp = Math.random() * 100;
      const vibration = Math.random() * 10;
      const load = Math.random() * 100;
      const pressure = Math.random() * 50;

      await Sensor.create({
        machineId: m._id,
        temperature: temp,
        vibration,
        load,
        pressure
      });

      const status = temp > 90 || vibration > 8 ? "Error" : "Active";
      const efficiencyBase = 100 - Math.max(0, temp - 40) * 0.6;
      const efficiency = Math.max(40, Math.min(100, efficiencyBase));
      const cycleTime = 20 + Math.random() * 15;

      const machine = await Machine.findByIdAndUpdate(
        m._id,
        {
          status,
          efficiency,
          cycleTime,
          latestTemperature: temp
        },
        { new: true }
      );

      let alertDoc = null;
      if (temp > 95 && vibration > 9) {
        alertDoc = await Alert.create({
          machineId: m._id,
          type: "Imminent failure",
          severity: "Critical"
        });
      } else if (temp > 85) {
        alertDoc = await Alert.create({
          machineId: m._id,
          type: "Overheating",
          severity: "High"
        });
      } else if (vibration > 8) {
        alertDoc = await Alert.create({
          machineId: m._id,
          type: "Vibration anomaly",
          severity: "Medium"
        });
      } else if (load > 90) {
        alertDoc = await Alert.create({
          machineId: m._id,
          type: "Overload",
          severity: "High"
        });
      } else if (efficiency < 60) {
        alertDoc = await Alert.create({
          machineId: m._id,
          type: "Low efficiency",
          severity: "Low"
        });
      }

      io.emit("sensorUpdate", {
        machineId: m._id,
        temperature: temp,
        vibration,
        load,
        pressure,
        status: machine ? machine.status : status,
        efficiency
      });

      if (m.type === "Robot") {
        const j1 = Math.round((Math.random() - 0.5) * 180);
        const j2 = Math.round((Math.random() - 0.5) * 180);
        const j3 = Math.round((Math.random() - 0.5) * 180);
        const j4 = Math.round((Math.random() - 0.5) * 180);
        const j5 = Math.round((Math.random() - 0.5) * 180);
        const j6 = Math.round((Math.random() - 0.5) * 180);
        const move = await RobotMovement.create({
          machineId: m._id,
          j1,
          j2,
          j3,
          j4,
          j5,
          j6
        });
        io.emit("robotMovement", {
          machineId: m._id,
          j1,
          j2,
          j3,
          j4,
          j5,
          j6,
          createdAt: move.createdAt
        });
      }

      if (alertDoc) {
        io.emit("alert", {
          _id: alertDoc._id,
          machineId: alertDoc.machineId,
          type: alertDoc.type,
          severity: alertDoc.severity,
          createdAt: alertDoc.createdAt
        });
      }
    }
  }, 5000);
};
