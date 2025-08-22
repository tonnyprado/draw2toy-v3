// src/routes/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="p-6">Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return isAdmin ? children : <Navigate to="/" replace />;
}
