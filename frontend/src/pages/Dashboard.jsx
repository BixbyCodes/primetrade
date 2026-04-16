import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import TaskModal from "../components/TaskModal";
import Toast from "../components/Toast";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState({ status: "", priority: "", page: 1 });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | "create" | task object
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;
      params.page = filter.page;
      const res = await getTasks(params);
      setTasks(res.data.data.tasks);
      setPagination(res.data.data.pagination);
    } catch (e) {
      showToast("Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSave = async (data) => {
    try {
      if (modal && modal !== "create") {
        await updateTask(modal._id, data);
        showToast("Task updated!");
      } else {
        await createTask(data);
        showToast("Task created!");
      }
      setModal(null);
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || "Error saving task", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      showToast("Task deleted!");
      fetchTasks();
    } catch {
      showToast("Failed to delete task", "error");
    }
  };

  const statusClass = (s) => `badge badge-${s.replace(" ", "-")}`;
  const priorityClass = (p) => `badge badge-${p}`;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 16px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: "1.5rem" }}>My Tasks</h1>
            <p style={{ color: "var(--text2)", fontSize: "0.88rem", marginTop: 2 }}>
              {pagination.total ?? 0} total tasks
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal("create")}>+ New Task</button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })} style={{ maxWidth: 160 }}>
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value, page: 1 })} style={{ maxWidth: 160 }}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Task list */}
        {loading ? (
          <p style={{ color: "var(--text2)", textAlign: "center", padding: 40 }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text2)" }}>
            <p style={{ fontSize: "2rem", marginBottom: 12 }}>✅</p>
            <p>No tasks yet. Create your first one!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.map((task) => (
              <div key={task._id} className="card" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{task.title}</span>
                    <span className={statusClass(task.status)}>{task.status}</span>
                    <span className={priorityClass(task.priority)}>{task.priority}</span>
                  </div>
                  {task.description && <p style={{ color: "var(--text2)", fontSize: "0.88rem" }}>{task.description}</p>}
                  {task.dueDate && (
                    <p style={{ color: "var(--text2)", fontSize: "0.8rem", marginTop: 4 }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setModal(task)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`btn btn-sm ${p === filter.page ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setFilter({ ...filter, page: p })}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {modal !== null && (
        <TaskModal
          task={modal !== "create" ? modal : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
