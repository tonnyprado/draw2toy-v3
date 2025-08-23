// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// importa tu logo si quieres mostrarlo en la izquierda (ajusta el path):
// import logoUrl from "../assets/logo-temporal.png";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeDrawer = () => {
    const el = document.getElementById("site-drawer");
    if (el) el.checked = false;
  };

  const userLabel = user?.displayName || user?.email || "Cuenta";

  return (
    <div className="drawer drawer-end">
      <input id="site-drawer" type="checkbox" className="drawer-toggle" />
      {/* ======= NAVBAR (top) ======= */}
      <div className="drawer-content">
        <nav className="navbar bg-base-100/90 backdrop-blur supports-[backdrop-filter]:bg-base-100/70 sticky top-0 z-50 shadow-sm">
          <div className="flex-1 gap-2">
            <Link to="/" className="btn btn-ghost text-xl px-2" onClick={closeDrawer}>
              {/* {logoUrl ? <img src={logoUrl} alt="Draw2Toy" className="h-8 w-auto" /> : "Draw2Toy"} */}
              Draw2Toy
            </Link>
          </div>

          {/* Acciones lado derecho */}
          <div className="flex-none items-center gap-2">

            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline btn-primary btn-sm">
                  Login
                </Link>
                {/* Botón para abrir drawer */}
                <label htmlFor="site-drawer" className="btn btn-ghost btn-sm" aria-label="Abrir menú">
                  <Hamburger />
                </label>
              </>
            ) : (
              <>
                {/* Botón para abrir drawer */}
                <label htmlFor="site-drawer" className="btn btn-ghost btn-sm" aria-label="Abrir menú">
                  <Hamburger />
                </label>

                {/* Avatar + dropdown de cuenta */}
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                    <div className="w-9 rounded-full ring ring-primary/40 ring-offset-base-100 ring-offset-2">
                      <img
                        alt="avatar"
                        src={
                          user.photoURL ||
                          `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                            userLabel
                          )}&radius=50`
                        }
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                  >
                    <li className="menu-title">
                      <span className="truncate">{userLabel}</span>
                    </li>
                    <li>
                      <Link to="/pedido">Mis pedidos</Link>
                    </li>
                    <li>
                      <Link to="/profile">Mi perfil</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="text-error">Cerrar sesión</button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* ======= DRAWER (side) ======= */}
      <div className="drawer-side z-50">
        <label htmlFor="site-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200/80 backdrop-blur text-base-content gap-1">
          {/* Sección pública */}
          <li className="menu-title"><span>Menú</span></li>
          <li>
            <Link to="/toyreq1" onClick={closeDrawer} className="font-medium">
              Ordena tu creación
            </Link>
          </li>
          <li>
            {user ? (
              <Link to="/pedido" onClick={closeDrawer}> Estado de pedidos</Link>
            ) : (
              <span className="opacity-50 pointer-events-none"> Estado de pedidos (ingresa)</span>
            )}
          </li>
          <li><Link to="/about" onClick={closeDrawer}> Acerca de</Link></li>
          <li><Link to="/contact" onClick={closeDrawer}>Contacto</Link></li>
          <li>
            {user ? (
              <Link to="/checkout" onClick={closeDrawer}>Información de pago</Link>
            ) : (
              <span className="opacity-50 pointer-events-none"> Información de pago (ingresa)</span>
            )}
          </li>

          {/* Admin */}
          {user && isAdmin && (
            <>
              <li className="menu-title mt-2"><span>Administración</span></li>
              <li>
                <Link to="/admin" onClick={closeDrawer} className="text-accent font-semibold">
                   Panel Admin
                </Link>
              </li>
            </>
          )}

          {/* Cuenta */}
          <li className="menu-title mt-2"><span>Cuenta</span></li>
          {!user ? (
            <>
              <li>
                <Link to="/login" onClick={closeDrawer} className="btn btn-outline btn-primary">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeDrawer} className="btn btn-ghost">
                  Crear cuenta
                </Link>
              </li>
            </>
          ) : (
            <>
              <li><span className="opacity-70 truncate">{userLabel}</span></li>
              <li><button onClick={() => { closeDrawer(); handleLogout(); }} className="btn btn-ghost text-error">Cerrar sesión</button></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

/* Icono hamburguesa (sin dependencias) */
function Hamburger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-80" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
