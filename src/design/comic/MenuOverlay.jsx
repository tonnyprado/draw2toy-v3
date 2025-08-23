import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const overlayVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.06 } },
  exit: { opacity: 0 },
};
const itemVars = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 160, damping: 16 } },
  exit: { opacity: 0, y: -12 },
};

export default function MenuOverlay({ open, onClose, user, userLabel = "Cuenta", isAdmin, onLogout }) {
  const firstLinkRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { if (open && firstLinkRef.current) firstLinkRef.current.focus(); }, [open]);
  if (!open) return null;

  const NavItem = ({ to, children, onClick, disabled, first }) => (
    <motion.li variants={itemVars}>
      {disabled ? (
        <span className="menu-link is-disabled">{children}</span>
      ) : (
        <Link ref={first ? firstLinkRef : null} to={to} onClick={() => { onClose(); onClick?.(); }} className="menu-link">
          {children}
        </Link>
      )}
    </motion.li>
  );

  return (
    <motion.div className="fixed inset-0 z-50 bg-[#1B1A1F] text-white" initial="hidden" animate="show" exit="exit" variants={overlayVars} role="dialog" aria-modal="true" onClick={onClose}>
      <button aria-label="Cerrar menú" className="absolute top-4 right-4 comic-btn px-4 py-2 bg-white text-[#1B1A1F]" onClick={onClose}>Cerrar ✕</button>

      <div className="h-full w-full grid place-items-center px-6" onClick={(e) => e.stopPropagation()}>
        <motion.ul className="w-full max-w-4xl text-center space-y-6">
          <NavItem to="/" first>Inicio</NavItem>
          <NavItem to="/toyreq1">Ordena tu creación</NavItem>
          <NavItem to="/pedido" disabled={!user}>Estado de pedidos {user ? "" : "(ingresa)"}</NavItem>
          <NavItem to="/about">Acerca de</NavItem>
          <NavItem to="/contact">Contacto</NavItem>
          <NavItem to="/checkout" disabled={!user}>Información de pago {user ? "" : "(ingresa)"}</NavItem>
          {user && isAdmin && <NavItem to="/admin"><span className="text-accent">Panel Admin</span></NavItem>}
          <motion.li variants={itemVars}>
            <Link to="/pedido-rapido" onClick={onClose} className="inline-block text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1B1A1F] bg-[#FFEC48] border-4 border-white px-6 py-3 shadow-[6px_6px_0_#FFFFFF33]">Pedir ahora</Link>
          </motion.li>
        </motion.ul>
      </div>

      <motion.div className="absolute bottom-6 left-0 right-0 text-center text-sm opacity-80" variants={itemVars}>
        © {new Date().getFullYear()} Draw2Toy · Hecho con amor y tijeras sin punta ✄
      </motion.div>

      <style>{`
        .menu-link{ display:block; padding:.6rem 1rem; border:3px solid #FFFFFF; background:transparent; font-weight:900; text-transform:uppercase; letter-spacing:.02em; font-size:clamp(1.5rem, 2.6vw, 2.75rem); box-shadow:6px 6px 0 rgba(255,255,255,.12); }
        .menu-link:hover{ transform: translate(-2px,-2px); box-shadow:8px 8px 0 rgba(255,255,255,.20); }
        .menu-link.is-disabled{ opacity:.45; pointer-events:none; border-style:dashed; }
      `}</style>
    </motion.div>
  );
}
