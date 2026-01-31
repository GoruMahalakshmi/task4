const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine
} = require("../controllers/machine.controller");

router.get("/", auth, getMachines);
router.get("/:id", auth, getMachineById);
router.post("/", auth, role("admin"), createMachine);
router.put("/:id", auth, role("admin"), updateMachine);

module.exports = router;
