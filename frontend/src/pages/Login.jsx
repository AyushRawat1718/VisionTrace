import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import { Logo } from "../components/landing/Logo";

export function Login() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [demo, setDemo] = useState(null);

  useEffect(() => {
    api
      .demoInfo()
      .then((data) => setDemo(data.demo))
      .catch(() => setDemo(null));
  }, []);

  if (!loading && admin) {
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  async function doLogin(loginEmail, loginPassword) {
    setError("");
    setSubmitting(true);

    try {
      await login(loginEmail, loginPassword);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    doLogin(email, password);
  }

  function handleUseDemo() {
    if (!demo) return;
    setEmail(demo.adminEmail);
    setPassword(demo.adminPassword);
    doLogin(demo.adminEmail, demo.adminPassword);
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <Logo size={28} />
          <span className="brand-name">VisionTrace</span>
        </div>
        <p className="login-sub">Sign in to view assessment activity.</p>

        {error && <div className="login-error">{error}</div>}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-btn" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        {demo && (
          <>
            <div className="login-divider">
              <span>or</span>
            </div>
            <button
              type="button"
              className="login-btn demo"
              onClick={handleUseDemo}
              disabled={submitting}
            >
              Continue with demo account
            </button>
            <p className="login-hint">
              Testing this out? Use the demo account — email{" "}
              <code>{demo.adminEmail}</code>, password <code>{demo.adminPassword}</code>. It
              signs you in as the same single admin account this whole app currently has.
            </p>
          </>
        )}
      </form>
    </div>
  );
}
