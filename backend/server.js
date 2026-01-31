require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");
const createSuperAdmin = require("./src/config/createSuperAdmin");
const seedDemoData = require("./src/config/seedDemoData");
const startSensorSimulation = require("./src/simulator/sensorSimulator");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set("io", io);

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/machines", require("./src/routes/machineRoutes"));
app.use("/api/control", require("./src/routes/controlRoutes"));
app.use("/api/alerts", require("./src/routes/alertRoutes"));
app.use("/api/analytics", require("./src/routes/analyticsRoutes"));
app.use("/api/logs", require("./src/routes/logRoutes"));

app.get("/", (req, res) => {
  res.send("Industrial Automation Backend Running 🚀");
});

connectDB().then(async () => {
  await createSuperAdmin();
  await seedDemoData();
  startSensorSimulation(io);
});

server.listen(process.env.PORT, () =>
  console.log(`✅ Server running on port ${process.env.PORT}`)
);
