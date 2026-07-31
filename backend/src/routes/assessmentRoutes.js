const express = require("express");

const { createAssessment } = require("../controllers/assessmentController");

const router = express.Router();

router.post("/create", createAssessment);

module.exports = router;
