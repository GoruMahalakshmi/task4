const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createSuperAdmin = async () => {
  const existing = await User.findOne({ email: "admin@factory.com" });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      email: "admin@factory.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Super Admin created");
  } else {
    console.log("ℹ️ Admin already exists");
  }
};

module.exports = createSuperAdmin;
