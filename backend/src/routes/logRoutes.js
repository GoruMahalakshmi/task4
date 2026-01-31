const router = require("express").Router();
const Log = require("../models/ActivityLog");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (_, res) => {
  res.json(await Log.find().sort({ createdAt: -1 }));
});

module.exports = router;
