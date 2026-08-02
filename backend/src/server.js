require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const eventRoutes = require("./routes/eventRoutes");
const screenshotRoutes = require("./routes/screenshotRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const demoRoutes = require("./routes/demoRoutes");
const { requireAdmin } = require("./middleware/requireAdmin");
const { ensureDemoAssessment } = require("./lib/seedDemo");

const app = express();

// Render (and most PaaS hosts) terminate TLS at a proxy in front of the app,
// so without this Express sees every request as plain HTTP internally —
// which breaks secure-cookie and req.secure checks.
app.set("trust proxy", 1);

if (!process.env.FRONTEND_URL) {
  console.warn(
    "WARNING: FRONTEND_URL is not set. CORS will reject every request from " +
      "the dashboard frontend until this is set to its exact origin " +
      "(e.g. http://localhost:5173 or your deployed frontend URL).",
  );
}

// credentials: true is required so the browser will send/receive the
// httpOnly admin session cookie from the frontend's origin.
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
// Screenshots arrive as base64 data URLs, considerably larger than the raw
// image, so the default JSON body limit needs raising.
app.use(express.json({ limit: "15mb" }));

// Public — used by the extension and the landing page, no admin session.
app.use("/api/auth", authRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/screenshots", screenshotRoutes);
app.use("/api/demo", demoRoutes);

// Admin-only — the dashboard frontend.
app.use("/api/dashboard", requireAdmin, dashboardRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await ensureDemoAssessment();
  } catch (error) {
    console.error("Failed to seed demo assessment:", error);
  }
});
