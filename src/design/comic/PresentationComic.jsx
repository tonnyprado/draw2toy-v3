// src/design/comic/pages/PresentationComic.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Animations
const fadeIn = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } } };
const pop = { hidden: { opacity: 0, scale: 0.85, rotate: -6 }, show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 180, damping: 12 } } };
const galleryVars = { hiddenLeft: { opacity: 0, x: -80, rotate: -2 }, hiddenRight: { opacity: 0, x: 80, rotate: 2 }, show: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 18 } } };

export default function PresentationComic() {
  return (
    <div className="relative min-h-screen bg-[#FFF7EC] text-[#1B1A1F] overflow-x-hidden">
      {/* Halftone background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-25"
        style={{
          backgroundImage: "radial-gradient(#1B1A1F 1px, transparent 1px)",
          backgroundSize: "12px 12px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.4) 40%, rgba(0,0,0,.12) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.4) 40%, rgba(0,0,0,.12) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* ===== HERO ===== */}
      <section className="relative scroll-mt-24" id="inicio">
        <SpeedLines position="top" />
        <div className="container mx-auto px-6 pt-10 pb-20 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div variants={fadeIn} initial="hidden" animate="show" className="lg:col-span-6">
            <h1 className="leading-[0.95] font-black uppercase tracking-tight text-5xl sm:text-6xl">
              Del garabato<br /><span className="comic-outline inline-block">al peluche</span>
            </h1>
            <p className="mt-5 text-lg text-[#1B1A1F]/80 max-w-xl">
              Para mamás y papás que quieren dar vida a la imaginación de sus peques. Sube un dibujo y lo convertimos en un peluche único.
            </p>
            <div className="mt-7 flex items-center gap-4">
              <Link to="/pedido-rapido" className="comic-btn px-6 py-3 text-base">¡Empieza aquí!</Link>
              <a href="#como" className="underline">Ver pasos</a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-3 text-xs">
              <li className="tag-chip">Hecho a mano</li>
              <li className="tag-chip">Materiales seguros</li>
              <li className="tag-chip">Acompañamiento por correo</li>
            </ul>
          </motion.div>

          <div className="lg:col-span-6">
            <div className="relative">
              <motion.div variants={pop} initial="hidden" animate="show" className="absolute -top-6 -left-3 sm:-left-8">
                <Onoma text="¡WOW!" />
              </motion.div>
              <motion.div variants={pop} initial="hidden" animate="show" transition={{ delay: 0.15 }} className="absolute -bottom-6 -right-4">
                <Onoma text="¡ZAP!" variant="accent" />
              </motion.div>
              <SpeechBubble className="w-full">
                <MiniScene />
              </SpeechBubble>
            </div>
          </div>
        </div>
        <SpeedLines position="bottom" />
      </section>

      {/* ===== CÓMO FUNCIONA ===== */}
      <section id="como" className="relative py-16 lg:py-24 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-black uppercase">¿Cómo funciona?</h2>
            <p className="mt-2 text-[#1B1A1F]/70">Tres viñetas. Un héroe: tu peque.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComicPanel title="1. Sube el dibujo" caption="Foto o archivo, lo que tengas."><PanelArt type="upload" /></ComicPanel>
            <ComicPanel title="2. Elige tamaño" caption="Pequeño, mediano o grande."><PanelArt type="sizes" /></ComicPanel>
            <ComicPanel title="3. ¡Listo para abrazar!" caption="Fabricamos y enviamos a casa."><PanelArt type="ship" /></ComicPanel>
          </div>
        </div>
      </section>

      {/* ===== GALERÍA FULL-SCREEN ===== */}
      <section id="galeria" className="relative">
        {GALLERY.map((card, i) => (<GalleryItem key={i} index={i} {...card} />))}
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="relative py-16 scroll-mt-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-black uppercase">Preguntas rápidas</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-6">
            <FaqItem q="¿Cuánto tarda?" a="De 10 a 15 días hábiles + envío. Te vamos avisando por correo en cada paso." />
            <FaqItem q="¿Puedo cambiar materiales?" a="Sí. Te sugerimos opciones suaves y seguras; confirmamos antes de coser." />
            <FaqItem q="¿Qué tamaños hay?" a="Pequeño (20–25cm), mediano (30–35cm) y grande (40–45cm)." />
            <FaqItem q="¿Aceptan varios dibujos?" a="Claro; agrupamos elementos o hacemos varios peluches." />
          </div>
        </div>
      </section>

      {/* Estilos locales estrictamente necesarios */}
      <style>{`
        html { scroll-behavior: smooth; }
        .comic-btn { background: #FFEC48; border: 2.5px solid #1B1A1F; box-shadow: 4px 4px 0 #1B1A1F; font-weight: 800; text-transform: uppercase; letter-spacing: .02em; transition: transform 120ms ease, box-shadow 120ms ease; }
        .comic-btn:hover { transform: translate(-1px,-1px); box-shadow: 6px 6px 0 #1B1A1F; }
        .comic-btn:active { transform: translate(1px,1px); box-shadow: 2px 2px 0 #1B1A1F; }
        .comic-outline { -webkit-text-stroke: 2px #1B1A1F; color: #fff; }
        .speech { filter: drop-shadow(6px 6px 0 rgba(27,26,31,0.35)); }
        .panel { background: white; border: 3px solid #1B1A1F; box-shadow: 8px 8px 0 #1B1A1F10; border-radius: 14px; }
        @keyframes jiggle { 0% { transform: rotate(-.6deg) translateY(0) } 50% { transform: rotate(.6deg) translateY(-2px) } 100% { transform: rotate(-.6deg) translateY(0) } }
        .jiggle { animation: jiggle 2.4s ease-in-out infinite; transform-origin: 50% 60%; }
        .speed-lines { background: repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(27,26,31,0.08) 8px, rgba(27,26,31,0.08) 12px); }
        @media (prefers-reduced-motion: reduce) { .jiggle { animation: none !important; } }
      `}</style>
    </div>
  );
}

/* ===== subcomponentes mínimos (idénticos a tu versión) ===== */
function SpeedLines({ position = "top" }) {
  return (
    <div aria-hidden className={`speed-lines pointer-events-none absolute left-0 right-0 ${position === "top" ? "top-0 h-10" : "bottom-0 h-10"}`}
      style={{ maskImage: "linear-gradient(0deg, transparent, black)", WebkitMaskImage: "linear-gradient(0deg, transparent, black)" }} />
  );
}
function Onoma({ text = "¡WOW!", variant = "yellow" }) {
  const color = variant === "accent" ? "#6EE7F9" : "#FFEC48";
  return (
    <div className="wobble">
      <svg width="120" height="120" viewBox="0 0 120 120" className="overflow-visible">
        <g transform="translate(60,60)">
          <Starburst r={48} spikes={16} fill={color} stroke="#1B1A1F" />
          <text x="0" y="6" textAnchor="middle" fontSize="22" fontWeight="900" fill="#1B1A1F">{text}</text>
        </g>
      </svg>
    </div>
  );
}
function Starburst({ r = 40, spikes = 14, fill = "#FFEC48", stroke = "#1B1A1F" }) {
  const points = []; const inner = r * 0.6;
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes; const rad = i % 2 === 0 ? r : inner;
    points.push(`${Math.cos(angle) * rad},${Math.sin(angle) * rad}`);
  }
  return <polygon points={points.join(" ")} fill={fill} stroke={stroke} strokeWidth="3" transform="translate(60,60)" />;
}
function SpeechBubble({ children, className = "" }) {
  return (
    <div className={`speech ${className}`}>
      <svg viewBox="0 0 600 420" className="w-full h-auto">
        <path d="M40 60 h440 a40 40 0 0 1 40 40 v150 a40 40 0 0 1 -40 40 H170 l-90 50 18-50 H80 a40 40 0 0 1 -40 -40 V100 a40 40 0 0 1 40 -40 z"
          fill="#FFFFFF" stroke="#1B1A1F" strokeWidth="6" />
        <foreignObject x="60" y="80" width="440" height="200">
          <div className="w-full h-full flex items-center justify-center p-3">{children}</div>
        </foreignObject>
      </svg>
    </div>
  );
}
function MiniScene() {
  return (
    <svg viewBox="0 0 440 200" className="w-full h-auto">
      <rect x="0" y="0" width="440" height="200" fill="#F7F1FF" />
      <rect x="0" y="150" width="440" height="50" fill="#D2F5E3" />
      <circle cx="360" cy="40" r="18" fill="#FFEC48" stroke="#1B1A1F" strokeWidth="3" />
      <g transform="translate(150,40)" fill="#FFFFFF" stroke="#1B1A1F" strokeWidth="4">
        <circle cx="70" cy="40" r="22" />
        <ellipse cx="70" cy="100" rx="38" ry="48" />
        <circle cx="52" cy="26" r="8" />
        <circle cx="88" cy="26" r="8" />
        <ellipse cx="32" cy="96" rx="12" ry="24" />
        <ellipse cx="108" cy="96" rx="12" ry="24" />
      </g>
      <g fill="#6EE7F9" stroke="#1B1A1F" strokeWidth="2">
        <StarSmall x={48} y={36} />
        <StarSmall x={92} y={68} />
        <StarSmall x={300} y={120} />
      </g>
    </svg>
  );
}
function StarSmall({ x, y }) {
  const pts = []; const r = 7; const inner = r * 0.6;
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5; const rad = i % 2 === 0 ? r : inner;
    pts.push(`${x + Math.cos(angle) * rad},${y + Math.sin(angle) * rad}`);
  }
  return <polygon points={pts.join(" ")} />;
}
function ComicPanel({ title, caption, children }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black uppercase text-lg tracking-wide">{title}</h3>
        <span className="text-xs px-2 py-1 bg-[#FFEC48] border-2 border-[#1B1A1F] font-extrabold">Paso</span>
      </div>
      <div className="mt-3 aspect-[16/10] bg-[#FDFDFD] border-2 border-dashed border-[#1B1A1F33] grid place-items-center overflow-hidden">{children}</div>
      <p className="mt-3 text-sm text-[#1B1A1F]/70">{caption}</p>
    </div>
  );
}
const GALLERY = [
  { title: "Monstruo sonriente", desc: "Conservamos los dientes chuequitos y la mancha azul tal cual.", tone: "#F7F1FF" },
  { title: "Robot bailarín", desc: "Brazos articulados y luz en el pecho bordada.", tone: "#E6FBFF" },
  { title: "Gatita estelar", desc: "Orejas con glitter suave y cola esponjosa.", tone: "#D2F5E3" },
];
function GalleryItem({ index, title, desc, tone }) {
  const side = index % 2 === 0 ? "left" : "right";
  const imgInitial = side === "left" ? "hiddenLeft" : "hiddenRight";
  const textInitial = side === "left" ? "hiddenRight" : "hiddenLeft";
  return (
    <section className="min-h-[100svh] flex items-center scroll-mt-24">
      <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-10 items-center">
        <motion.div className={`lg:col-span-6 ${side === "right" ? "lg:order-2" : "lg:order-1"}`} variants={galleryVars} initial={imgInitial} whileInView="show" viewport={{ amount: 0.6, once: false }}>
          <div className="relative panel overflow-hidden">
            <div className="aspect-[4/3] grid place-items-center" style={{ background: tone }}>
              <div className="jiggle w-[82%]"><GalleryMock /></div>
            </div>
          </div>
        </motion.div>
        <motion.div className={`lg:col-span-6 ${side === "right" ? "lg:order-1 text-left lg:text-right" : "lg:order-2"}`} variants={galleryVars} initial={textInitial} whileInView="show" viewport={{ amount: 0.6, once: false }}>
          <h3 className="text-4xl font-black uppercase leading-tight">{title}</h3>
          <p className="mt-3 text-lg text-[#1B1A1F]/75 max-w-prose">{desc}</p>
          <div className={`mt-6 ${side === "right" ? "lg:justify-end" : ""} flex gap-3`}>
            <Link to="/pedido-rapido" className="comic-btn px-5 py-2 text-sm">Quiero el mío</Link>
            <a href="#faq" className="underline text-sm">Detalles</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
function GalleryMock() {
  return (
    <svg viewBox="0 0 420 300" className="w-full h-auto">
      <rect x="0" y="0" width="420" height="300" fill="#FFF" rx="18" />
      <g transform="translate(100,50)" fill="#FFFFFF" stroke="#1B1A1F" strokeWidth="5">
        <circle cx="110" cy="50" r="28" />
        <ellipse cx="110" cy="140" rx="70" ry="90" />
        <circle cx="85" cy="35" r="10" />
        <circle cx="135" cy="35" r="10" />
        <ellipse cx="60" cy="140" rx="20" ry="40" />
        <ellipse cx="160" cy="140" rx="20" ry="40" />
      </g>
    </svg>
  );
}
