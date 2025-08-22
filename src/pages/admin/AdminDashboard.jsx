// src/adminPages/AdminDashboard.jsx
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Bienvenido administrador</h1>
      <p className="mt-2">
        Hola <b>{profile?.name || user?.displayName || user?.email}</b>, esta es tu consola.
      </p>
      <div className="alert alert-info mt-4">
        <span>Pronto: listado de pedidos, cambios de estado, etc.</span>
      </div>
    </div>
  );
}
