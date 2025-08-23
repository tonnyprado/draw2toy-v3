import { NavLink } from "react-router-dom";

export default function AdminShell({ children }) {
  const base = "tab tab-bordered";
  const active = ({ isActive }) => (isActive ? `${base} tab-active` : base);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="opacity-70">Gestiona pedidos y contenido del sitio</p>
        </div>
      </header>

      <div role="tablist" className="tabs tabs-lifted">
        <NavLink to="/admin" end className={active}>Pedidos</NavLink>
        <NavLink to="/admin/about" className={active}>Acerca de</NavLink>
        <NavLink to="/admin/faq" className={active}>FAQ</NavLink>
        <NavLink to="/admin/reports" className={active}>Reportes</NavLink>
        <NavLink to="/admin/users" className={active}>Usuarios</NavLink>
      </div>

      <section className="mt-2">{children}</section>
    </div>
  );
}
