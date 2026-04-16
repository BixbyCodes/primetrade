import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh" }}>
      <p style={{ color:"var(--text2)" }}>Loading...</p>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
