// src/layouts/AppLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/** Hace scroll suave a #hash incluso cuando cambias de ruta */
function HashScroller() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const el =
        document.getElementById(id) || document.querySelector(`[name="${id}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  return null;
}

export default function AppLayout() {
  // Aplica el “tema cómic” a nivel global (afecta estilos del navbar)
  useEffect(() => {
    document.body.classList.add("navbar-comic");
    return () => document.body.classList.remove("navbar-comic");
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7EC] text-[#1B1A1F]">
      <HashScroller />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
