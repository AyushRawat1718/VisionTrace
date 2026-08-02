const jwt = require("jsonwebtoken");
const { COOKIE_NAME } = require("../controllers/authController");

function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { email: payload.email };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Session expired or invalid." });
  }
}

module.exports = { requireAdmin };
