const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const COOKIE_NAME = "vt_token";
const TOKEN_TTL = "8h";

// A single demo admin, defined entirely by env vars — no user table, no
// signup flow. The password is hashed once at startup so a plaintext value
// never sits in memory as-is beyond process start, even though it does
// still live in plaintext in .env (fine for a demo; swap for a real user
// table + per-admin hashed passwords before any real deployment).
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD
  ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
  : null;

function login(req, res) {
  const { email, password } = req.body;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    return res.status(500).json({
      success: false,
      message: "Admin credentials are not configured on the server.",
    });
  }

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const emailMatches = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const passwordMatches = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign({ email: ADMIN_EMAIL, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });

  // Frontend and backend are deployed on different origins, which makes
  // every request cross-site. SameSite=Lax cookies are NOT sent on
  // cross-origin fetch/XHR calls — only on top-level navigations — so with
  // "lax" here, login would appear to succeed but every request after it
  // (auth/me, dashboard/*) would silently arrive with no cookie at all.
  // SameSite=None is required for cross-site fetch, and the spec requires
  // Secure to be set whenever SameSite=None is used.
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 8 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    admin: { email: ADMIN_EMAIL },
  });
}

function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: "none", secure: true });
  return res.status(200).json({ success: true });
}

function me(req, res) {
  // req.admin is set by the requireAdmin middleware after verifying the cookie
  return res.status(200).json({ success: true, admin: req.admin });
}

module.exports = { login, logout, me, COOKIE_NAME };
