// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">Draw2Toy</Link>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {!user ? (
            // No loggeado: mostrar Login y el drawer con items públicos
            <>
              <li><Link to="/login">Login</Link></li>
              <li>
                <div className="drawer drawer-end">
                  <input id="main-drawer" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content">
                    <label htmlFor="main-drawer" className="drawer-button btn btn-primary">Open drawer</label>
                  </div>
                  <div className="drawer-side">
                    <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                      <li><Link to="/toyreq1">Ordena tu creación aquí</Link></li>
                      <li><span className="btn btn-disabled justify-start">Estado de pedidos</span></li>
                      <li><Link to="/about">Acerca de</Link></li>
                      <li><Link to="/contact">Contacto</Link></li>
                      <li><span className="btn btn-disabled justify-start">Información de pago</span></li>
                      <li><Link to="/register" className="text-primary">Crear cuenta</Link></li>
                    </ul>
                  </div>
                </div>
              </li>
            </>
          ) : (
            // Loggeado: mostrar opciones completas y Logout
            <>
              <li>
                <div className="drawer drawer-end">
                  <input id="main-drawer" type="checkbox" className="drawer-toggle" />
                  <div className="drawer-content">
                    <label htmlFor="main-drawer" className="drawer-button btn btn-primary">Open drawer</label>
                  </div>
                  <div className="drawer-side">
                    <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                      <li><Link to="/toyreq1">Ordena tu creación aquí</Link></li>
                      <li><Link to="/pedido">Estado de pedidos</Link></li>
                      <li><Link to="/checkout">Información de pago</Link></li>
                      <li><Link to="/about">Acerca de</Link></li>
                      <li><Link to="/contact">Contacto</Link></li>
                    </ul>
                  </div>
                </div>
              </li>
              <li>
                <details>
                  <summary>{user.displayName || user.email}</summary>
                  <ul className="p-2 bg-base-100">
                    <li><button onClick={handleLogout}>Logout</button></li>
                  </ul>
                </details>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
