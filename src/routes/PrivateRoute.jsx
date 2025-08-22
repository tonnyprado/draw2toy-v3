import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Cargando…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
