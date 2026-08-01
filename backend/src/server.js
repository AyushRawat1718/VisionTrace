require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const assessmentRoutes = require("./routes/assessmentRoutes");
const eventRoutes = require("./routes/eventRoutes");
const screenshotRoutes = require("./routes/screenshotRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.use("/api/assessments", assessmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/screenshots", screenshotRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/dashboard", express.static(path.join(__dirname, "../public/dashboard")));

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
