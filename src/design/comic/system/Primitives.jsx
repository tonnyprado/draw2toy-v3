// src/design/comic/system/Primitives.jsx
import { motion } from "framer-motion";

export function ComicButton({ as: As = "button", className = "", children, ...props }) {
  return (
    <As className={`comic-btn inline-flex items-center px-4 py-2 ${className}`} {...props}>
      {children}
    </As>
  );
}

export function Panel({ className = "", ...props }) {
  return <div className={`panel ${className}`} {...props} />;
}

export function TagChip({ children, className = "" }) {
  return <span className={`tag-chip ${className}`}>{children}</span>;
}

export function SpeedLines({ position = "top" }) {
  return (
    <div
      aria-hidden
      className={`speed-lines pointer-events-none absolute left-0 right-0 ${
        position === "top" ? "top-0 h-10" : "bottom-0 h-10"
      }`}
      style={{ maskImage: "linear-gradient(0deg, transparent, black)", WebkitMaskImage: "linear-gradient(0deg, transparent, black)" }}
    />
  );
}

export const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

export const galleryVars = {
  hiddenLeft: { opacity: 0, x: -80, rotate: -2 },
  hiddenRight: { opacity: 0, x: 80, rotate: 2 },
  show: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

export function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <h2 className="text-3xl sm:text-4xl font-black uppercase">{title}</h2>
      {subtitle ? <p className="mt-2 text-[#1B1A1F]/70">{subtitle}</p> : null}
    </div>
  );
}
