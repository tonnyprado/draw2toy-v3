import Login from "../authentication/components/LoginUI";
import { Link } from "react-router-dom";


export default function Navbar(){
    return(
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">Draw2Toy</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/login">Login</Link></li>
                    <li>
                        <div className="drawer drawer-end">
                            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                            <div className="drawer-content">
                                {/* Page content here */}
                                <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Open drawer</label>
                            </div>
                            <div className="drawer-side">
                                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                                    {/* Sidebar content here */}
                                    <li><Link to="/toyreq1">Ordena tu creación aqui</Link></li>
                                    <li><a>Estado de pedidos</a></li>
                                    <li><a>Acerca de</a></li>
                                    <li><a>Contacto</a></li>
                                    <li><a>FAQ's</a></li>
                                    <li><a>Información de pago</a></li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}