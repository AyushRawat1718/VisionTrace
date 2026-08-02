import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "./landing/Logo";

export function TopBar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <div className="brand">
        <Logo size={24} />
        <span className="brand-name">VisionTrace</span>
        <span className="brand-tag">console</span>
      </div>

      {admin && (
        <div className="topbar-right">
          <span className="admin-chip">{admin.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
