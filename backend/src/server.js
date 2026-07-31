const express = require("express");
const cors = require("cors");

const assessmentRoutes = require("./routes/assessmentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/assessments", assessmentRoutes);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
