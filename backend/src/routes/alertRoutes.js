const router = require("express").Router();
const Alert = require("../models/Alert");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/", auth, async (req, res) => {
  const alerts = await Alert.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(alerts);
});

router.get("/unresolved", auth, async (req, res) => {
  const alerts = await Alert.find({ resolved: false })
    .sort({ createdAt: -1 })
    .lean();
  res.json(alerts);
});

router.patch("/:id/resolve", auth, role("engineer"), async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id,
    { resolved: true },
    { new: true }
  );
  if (!alert) {
    return res.status(404).json({ message: "Alert not found" });
  }
  res.json(alert);
});

module.exports = router;
