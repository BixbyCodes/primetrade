import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data.data.token, res.data.data.user);
      navigate(res.data.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="card" style={{ width: "100%", maxWidth: 420 }}>
        <h1 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 4 }}>Welcome back</h1>
        <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: 24 }}>Sign in to your account</p>

        {error && (
          <div style={{ background: "#450a0a", color: "#fca5a5", padding: "10px 14px", borderRadius: "var(--radius)", marginBottom: 16, fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password" required />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", marginTop: 8 }} disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.88rem", color: "var(--text2)" }}>
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
