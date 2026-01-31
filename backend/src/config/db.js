const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async () => {
  const uri = process.env.MONGO_URI;
  try {
    if (!uri) throw new Error("MONGO_URI not provided");
    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.warn("⚠️ MongoDB connect failed, falling back to in-memory DB:", err.message);
    const mem = await MongoMemoryServer.create();
    const memUri = mem.getUri();
    await mongoose.connect(memUri);
    console.log("✅ In-memory MongoDB Connected");
  }
};
