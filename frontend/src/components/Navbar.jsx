import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav style={{
      background: "var(--bg2)", borderBottom: "1px solid var(--border)",
      padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }}>
          Primetrade
        </span>
        <Link to="/dashboard" style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Dashboard</Link>
        {user?.role === "admin" && (
          <Link to="/admin" style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Admin</Link>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text2)" }}>
          {user?.name} &nbsp;
          <span style={{
            background: user?.role === "admin" ? "#4f46e5" : "var(--bg3)",
            color: "#fff", padding: "2px 8px", borderRadius: 9999, fontSize: "0.72rem", fontWeight: 600,
          }}>
            {user?.role}
          </span>
        </span>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
