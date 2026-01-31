const Log = require("../models/ActivityLog");

module.exports = action => async (req, res, next) => {
  await Log.create({
    userId: req.user.id,
    action,
    machineId: req.params.id
  });
  next();
};
