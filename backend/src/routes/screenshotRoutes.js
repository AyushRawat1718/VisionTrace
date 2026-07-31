const express = require("express");

const { createScreenshot } = require("../controllers/screenshotController");

const router = express.Router();

router.post("/", createScreenshot);

module.exports = router;
