const express = require("express");

const {
  listAssessments,
  listAttempts,
  getAttemptTimeline,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/assessments", listAssessments);
router.get("/assessments/:id/attempts", listAttempts);
router.get("/attempts/:id/timeline", getAttemptTimeline);

module.exports = router;
