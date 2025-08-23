import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MenuOverlay from "./MenuOverlay";

const pop = {
  hidden: { opacity: 0, scale: 0.85, rotate: -6 },
  show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 180, damping: 12 } },
};

export default function ComicNavbar({
  brand = "Draw2Toy",
  logoUrl,
  user,
  userLabel = "Cuenta",
  isAdmin = false,
  onLogout = () => {},
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // Bloquea scroll cuando el overlay está abierto
  useEffect(() => {
    if (open) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => (document.documentElement.style.overflow = "");
  }, [open]);

  // Cierra con Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <nav className="comic-nav">
        {/* Izquierda: Brand */}
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight text-lg md:text-xl">
          {logoUrl ? (
            <img src={logoUrl} alt={brand} className="h-7 w-auto" />
          ) : (
            <span className="inline-block px-2 py-1 bg-[#FFEC48] border-2 border-[#1B1A1F]">{brand}</span>
          )}
        </Link>

        {/* Derecha: acciones */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="comic-btn px-3 py-2 text-sm hidden sm:inline-flex">Login</Link>
              <motion.button
                variants={pop}
                initial="hidden"
                animate="show"
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -1 }}
                className="comic-btn px-3 py-2 inline-flex items-center gap-2"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={open}
              >
                <BurgerIcon /> Menú
              </motion.button>
            </>
          ) : (
            <>
              <Link to="/profile" className="rounded-full inline-grid place-items-center mr-1" aria-label="Perfil">
                <img
                  className="h-8 w-8 rounded-full border-2 border-[#1B1A1F]"
                  alt="avatar"
                  src={
                    user.photoURL ||
                    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userLabel)}&radius=50`
                  }
                />
              </Link>
              <motion.button
                variants={pop}
                initial="hidden"
                animate="show"
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -1 }}
                className="comic-btn px-3 py-2 inline-flex items-center gap-2"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={open}
              >
                <BurgerIcon /> Menú
              </motion.button>
            </>
          )}
        </div>
      </nav>

      {/* Overlay con mismas animaciones del landing */}
      <AnimatePresence>
        {open && (
          <MenuOverlay open={open} onClose={close} user={user} userLabel={userLabel} isAdmin={isAdmin} onLogout={onLogout} />
        )}
      </AnimatePresence>

      <style>{`
        .comic-nav { display:flex; align-items:center; justify-content:space-between; height:64px; padding:0 1rem; background: rgba(255,247,236,0.80); backdrop-filter: saturate(160%) blur(6px); border-bottom: 2px solid rgba(27,26,31,0.06); }
        @media (min-width: 768px){ .comic-nav{ padding: 0 1.5rem; height:72px; } }
      `}</style>
    </header>
  );
}

function BurgerIcon(){
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="#1B1A1F" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}