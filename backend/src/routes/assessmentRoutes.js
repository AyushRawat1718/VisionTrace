const express = require("express");

const {
  createAssessment,
  joinAssessment,
} = require("../controllers/assessmentController");

const router = express.Router();

router.post("/create", createAssessment);
router.post("/join", joinAssessment);

module.exports = router;
