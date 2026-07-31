require("dotenv").config();

const express = require("express");
const cors = require("cors");

const assessmentRoutes = require("./routes/assessmentRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/assessments", assessmentRoutes);
app.use("/api/events", eventRoutes);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
