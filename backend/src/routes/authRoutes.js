const express = require("express");
const { login, logout, me } = require("../controllers/authController");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAdmin, me);

module.exports = router;
