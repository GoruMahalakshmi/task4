const levels = { viewer: 1, engineer: 2, admin: 3 };

module.exports = role => (req, res, next) => {
  if (levels[req.user.role] < levels[role]) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
