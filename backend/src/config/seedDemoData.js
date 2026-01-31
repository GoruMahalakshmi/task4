const Machine = require("../models/Machine");
const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

const seedDemoData = async () => {
  const machineCount = await Machine.countDocuments();

  if (machineCount > 0) {
    console.log("ℹ️ Demo machines already exist");
    return;
  }

  console.log("🌱 Seeding demo machines");

  const now = new Date();

  const machines = await Machine.insertMany([
    {
      name: "Robot Arm R1",
      type: "Robot",
      status: "Active",
      efficiency: 96,
      cycleTime: 22,
      assignedJob: "Order #1024 pick-and-place",
      operatingMode: "Auto",
      latestTemperature: 42,
      lastMaintenance: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Conveyor Line A",
      type: "Conveyor",
      status: "Idle",
      efficiency: 88,
      cycleTime: 18,
      assignedJob: "",
      operatingMode: "Auto",
      latestTemperature: 35,
      lastMaintenance: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Packing Motor M3",
      type: "Motor",
      status: "Active",
      efficiency: 92,
      cycleTime: 28,
      assignedJob: "Packing shift B",
      operatingMode: "Manual",
      latestTemperature: 48,
      lastMaintenance: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Sensor Hub East",
      type: "Sensor unit",
      status: "Idle",
      efficiency: 100,
      cycleTime: 0,
      assignedJob: "",
      operatingMode: "Auto",
      latestTemperature: 30,
      lastMaintenance: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000)
    }
  ]);

  const admin = await User.findOne({ email: "admin@factory.com" }).lean();

  if (admin) {
    const logs = machines.map(m => ({
      userId: admin._id,
      action: `Seed: Registered machine ${m.name}`,
      machineId: m._id
    }));

    await ActivityLog.insertMany(logs);
    console.log("🌱 Seed activity logs created");
  }

  console.log("✅ Demo machines seeded");
};

module.exports = seedDemoData;

