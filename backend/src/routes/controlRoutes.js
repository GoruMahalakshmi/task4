const router = require("express").Router();
const Machine = require("../models/Machine");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const audit = require("../middleware/auditMiddleware");

router.post(
  "/:id/start",
  auth,
  role("engineer"),
  audit("Start machine"),
  async (req, res) => {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { status: "Active" },
      { new: true }
    );
    const io = req.app.get("io");
    if (io && machine) {
      io.emit("machineControl", {
        machineId: machine._id,
        status: machine.status
      });
    }
    res.json({ message: "Machine started" });
  }
);

router.post(
  "/:id/stop",
  auth,
  role("engineer"),
  audit("Stop machine"),
  async (req, res) => {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { status: "Idle" },
      { new: true }
    );
    const io = req.app.get("io");
    if (io && machine) {
      io.emit("machineControl", {
        machineId: machine._id,
        status: machine.status
      });
    }
    res.json({ message: "Machine stopped" });
  }
);

router.post(
  "/:id/reset",
  auth,
  role("engineer"),
  audit("Reset machine"),
  async (req, res) => {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      {
        status: "Idle",
        efficiency: 100,
        cycleTime: 0,
        assignedJob: ""
      },
      { new: true }
    );
    const io = req.app.get("io");
    if (io && machine) {
      io.emit("machineControl", {
        machineId: machine._id,
        status: machine.status
      });
    }
    res.json({ message: "Machine reset" });
  }
);

router.post(
  "/:id/mode",
  auth,
  role("engineer"),
  audit("Change operating mode"),
  async (req, res) => {
    const mode = req.body.mode;
    if (mode !== "Auto" && mode !== "Manual") {
      return res.status(400).json({ message: "Invalid mode" });
    }
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { operatingMode: mode },
      { new: true }
    );
    const io = req.app.get("io");
    if (io && machine) {
      io.emit("machineControl", {
        machineId: machine._id,
        operatingMode: machine.operatingMode
      });
    }
    res.json({ message: "Mode updated" });
  }
);

router.post(
  "/:id/job",
  auth,
  role("engineer"),
  audit("Assign job"),
  async (req, res) => {
    const job = req.body.job || "";
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { assignedJob: job },
      { new: true }
    );
    const io = req.app.get("io");
    if (io && machine) {
      io.emit("machineControl", {
        machineId: machine._id,
        assignedJob: machine.assignedJob
      });
    }
    res.json({ message: "Job assigned" });
  }
);

router.post(
  "/:id/emergency",
  auth,
  role("admin"),
  audit("Emergency shutdown"),
  async (req, res) => {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { status: "Error" },
      { new: true }
    );
    const io = req.app.get("io");
    if (io && machine) {
      io.emit("machineControl", {
        machineId: machine._id,
        status: machine.status
      });
    }
    res.json({ message: "Emergency shutdown" });
  }
);

module.exports = router;
