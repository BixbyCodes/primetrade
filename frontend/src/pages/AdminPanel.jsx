import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { getStats, getUsers, toggleUser, getAllTasks } from "../api/admin";

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tab, setTab] = useState("stats");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    getStats().then((r) => setStats(r.data.data));
    getUsers().then((r) => setUsers(r.data.data.users));
    getAllTasks().then((r) => setTasks(r.data.data.tasks));
  }, []);

  const handleToggle = async (id) => {
    try {
      const res = await toggleUser(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: res.data.data.user.isActive } : u));
      showToast("User status updated!");
    } catch (err) {
      showToast(err.response?.data?.message || "Error", "error");
    }
  };

  const tabs = ["stats", "users", "tasks"];

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontWeight: 700, fontSize: "1.5rem", marginBottom: 24 }}>Admin Panel</h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "var(--bg2)", padding: 4, borderRadius: "var(--radius)", width: "fit-content" }}>
          {tabs.map((t) => (
            <button key={t} className={`btn btn-sm ${tab === t ? "btn-primary" : "btn-ghost"}`}
              style={{ border: "none" }} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        {tab === "stats" && stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className="card">
              <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>Total Users</p>
              <p style={{ fontWeight: 700, fontSize: "2rem", color: "var(--primary)" }}>{stats.totalUsers}</p>
            </div>
            <div className="card">
              <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>Total Tasks</p>
              <p style={{ fontWeight: 700, fontSize: "2rem", color: "var(--primary)" }}>{stats.totalTasks}</p>
            </div>
            {stats.tasksByStatus?.map((s) => (
              <div key={s._id} className="card">
                <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>{s._id}</p>
                <p style={{ fontWeight: 700, fontSize: "2rem", color: "var(--primary)" }}>{s.count}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {users.map((u) => (
              <div key={u._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 600 }}>{u.name}</p>
                  <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>{u.email} · {u.role}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "0.8rem", color: u.isActive ? "var(--success)" : "var(--danger)" }}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                  {u.role !== "admin" && (
                    <button className={`btn btn-sm ${u.isActive ? "btn-danger" : "btn-primary"}`}
                      onClick={() => handleToggle(u._id)}>
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All Tasks */}
        {tab === "tasks" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks.map((t) => (
              <div key={t._id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{t.title}</p>
                    <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 2 }}>
                      Owner: {t.owner?.name} ({t.owner?.email})
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span className={`badge badge-${t.status}`}>{t.status}</span>
                    <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
