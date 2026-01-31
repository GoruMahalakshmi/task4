const Machine = require("../models/Machine");

/**
 * GET all machines
 */
exports.getMachines = async (req, res) => {
  const machines = await Machine.find();
  res.json(machines);
};

/**
 * GET machine by ID
 */
exports.getMachineById = async (req, res) => {
  const machine = await Machine.findById(req.params.id);
  if (!machine) {
    return res.status(404).json({ message: "Machine not found" });
  }
  res.json(machine);
};

/**
 * CREATE new machine (Admin only later)
 */
exports.createMachine = async (req, res) => {
  const machine = new Machine(req.body);
  await machine.save();
  res.status(201).json(machine);
};

/**
 * UPDATE machine details
 */
exports.updateMachine = async (req, res) => {
  const machine = await Machine.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(machine);
};
