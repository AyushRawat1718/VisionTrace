const express = require("express");
const { DEMO_ASSESSMENT_CODE } = require("../lib/seedDemo");

const router = express.Router();

// Public on purpose — these are meant to be shown on the landing page so
// visitors can try the dashboard without a real account. Nothing sensitive
// lives behind this demo login; treat it as a read-only showcase.
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    demo: {
      assessmentCode: DEMO_ASSESSMENT_CODE,
      adminEmail: process.env.ADMIN_EMAIL,
      adminPassword: process.env.ADMIN_PASSWORD,
    },
  });
});

module.exports = router;
