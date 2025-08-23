// src/components/PresentationContent.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "./Footer";

/**
 * Landing minimal (cupcake + retro)
 * - Navbar transparente SOLO aquí (via <body class="navbar-transparent">)
 * - Cielo: estrellas con “twinkle” + pelotas pastel suaves en movimiento
 * - Hero tipográfico con CTA → /pedido-rapido
 * - Paneles alternos (full-bleed) con “ken-burns” en la imagen
 * - Footer full al final
 * - Scroll-snap y sin barra visible
 */

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.10 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } } };
const itemX = (dir = 1) => ({
  hidden: { opacity: 0, x: 24 * dir },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
});

// Paleta cupcake + retro
const PALETTE = [
  "#ef9fbc", // cupcake pink
  "#a4d8e1", // aqua
  "#ffd1dc", // blush
  "#e0d4f7", // lavender
  "#e4d8b4", // retro cream
  "#a3c293", // retro mint
  "#f9e2ae", // warm cream
  "#cde7d8", // soft mint
];

export default function PresentationContent() {
  // Navbar transparente SOLO aquí
  useEffect(() => {
    document.body.classList.add("navbar-transparent");
    return () => document.body.classList.remove("navbar-transparent");
  }, []);

  return (
    <div className="landing relative h-screen overflow-y-auto snap-y snap-mandatory overscroll-contain bg-base-100 text-base-content">
      {/* Cielo: estrellas + pelotas */}
      <BouncySky />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[100svh] snap-start grid place-items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* degradé translúcido para que se vea el fondo */}
          <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 via-base-100/40 to-base-200/70" />
          {/* vignette suave */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/5 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/5 to-transparent" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 container mx-auto px-6 py-16 grid gap-8 lg:grid-cols-12 items-center"
        >
          <motion.div variants={item} className="lg:col-span-7">
            <h1 className="text-[11vw] sm:text-[9vw] lg:text-[64px] leading-[0.95] font-extrabold tracking-tight">
              Convierte dibujos en <span className="underline decoration-wavy decoration-accent/60 underline-offset-8">peluches reales</span>
            </h1>
            <p className="mt-5 text-base-content/80 text-base md:text-lg max-w-2xl">
              Hecho para madres y padres: proceso claro y cariñoso. Sube el dibujo de tu peque y nosotros nos encargamos del resto.
            </p>
            <div className="mt-7">
              <Link
                to="/pedido-rapido"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-base-content/20 hover:border-base-content/40 text-base-content/90 hover:text-base-content transition"
              >
                Empezar <span className="underline underline-offset-4 text-accent">aquí</span>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-5 hidden lg:block">
            <HeroMarkSoft />
          </motion.div>
        </motion.div>

        <ScrollCue />
      </section>

      {/* ===== Showcase de paneles (full-bleed) ===== */}
      {PANELS.map((p, i) => (
        <ShowcasePanel key={i} {...p} flip={i % 2 === 1} />
      ))}

      {/* ===== Pasos minimal ===== */}
      <section className="relative min-h-[80svh] snap-start overflow-hidden">
        <div className="container mx-auto px-6 py-16 lg:py-24 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.h2 variants={item} className="text-4xl font-extrabold">¿Cómo funciona?</motion.h2>
            <motion.p variants={item} className="mt-3 text-base-content/70">
              Tres pasos claros. Sin complicaciones.
            </motion.p>

            <div className="mt-10 grid sm:grid-cols-3 gap-6">
              <Step n="1" title="Sube el dibujo">Una foto del cuaderno o archivo digital, lo que tengas.</Step>
              <Step n="2" title="Elige tamaño">Pequeño, mediano o grande. Te guiamos en materiales.</Step>
              <Step n="3" title="Listo para abrazar">Fabricamos y enviamos a tu casa con seguimiento.</Step>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER (full-bleed, alto completo) ===== */}
      <section id="footer" className="relative snap-start min-h-[100svh] overflow-hidden">
        {/* transición clara antes del footer negro */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-base-100/80 to-base-200/80" />
        <div className="relative z-10 flex min-h-[100svh] w-full items-center">
          <div className="w-screen">
            <Footer full />
          </div>
        </div>
      </section>

      {/* Estilos globales locales */}
      <style>{`
        /* Ocultar barra de scroll aquí */
        .landing { -ms-overflow-style: none; scrollbar-width: none; }
        .landing::-webkit-scrollbar { width: 0; height: 0; }

        /* Navbar transparente SOLO cuando el body lleva esta clase */
        body.navbar-transparent .navbar {
          background-color: transparent !important;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          backdrop-filter: saturate(180%) blur(10px);
        }
        body.navbar-transparent .navbar :where(a, button, summary, .link, .btn) {
          color: rgb(17 24 39 / 0.9);
        }
        [data-theme="retro"] body.navbar-transparent .navbar :where(a, button, summary, .link, .btn),
        [data-theme="cupcake"] body.navbar-transparent .navbar :where(a, button, summary, .link, .btn) {
          color: oklch(25% 0.03 262);
        }

        /* Animaciones suaves */
        @keyframes floaty { 0% { transform: translateY(0) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0) } }
        .floaty { animation: floaty 10s ease-in-out infinite; }

        /* Ken-burns para “imagen” placeholder */
        @keyframes kenburns {
          0% { transform: scale(1) translate3d(0,0,0); }
          50% { transform: scale(1.06) translate3d(2%, -1%, 0); }
          100% { transform: scale(1.12) translate3d(0, 1%, 0); }
        }
        .kenburns {
          will-change: transform;
          animation: kenburns 18s ease-in-out infinite alternate;
        }

        @media (prefers-reduced-motion: reduce) {
          .floaty, .kenburns { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ================= Cielo: Estrellas + Pelotas ================= */
function BouncySky() {
  return (
    <>
      <TwinkleStars />               {/* capa trasera */}
      <BouncyBalls zIndexClass="z-[1]" /> {/* pelotas por encima de estrellas */}
    </>
  );
}

/* ================= Fondo: Estrellas (twinkle + drift, sin intervalos) ================= */
function TwinkleStars() {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 640px)").matches;

  const count = isMobile ? 90 : 160;
  const STAR_COLORS = ["#FFFFFF", "#FFF7E6", "#F2ECFF", "#EAFBFF", "#F8F4FF"];

  // Genera las estrellas una sola vez (no re-render cíclico)
  const stars = React.useMemo(() => {
    const r = (min, max) => Math.random() * (max - min) + min;
    return Array.from({ length: count }).map((_, i) => {
      const size = r(1.6, 3.2);             // un poco más grandes para verse sobre fondos claros
      const top = r(-5, 100);
      const left = r(-3, 100);
      const dur = r(4.2, 8.8);
      const delay = r(0, 6);
      const dx = r(-10, 10);                // drift suave
      const dy = r(-8, 8);
      const color = STAR_COLORS[i % STAR_COLORS.length];
      const alpha = r(0.55, 0.95);
      const glow = Math.round(r(3, 8));
      return { key: `s-${i}-${Math.random().toString(36).slice(2)}`, size, top, left, dur, delay, dx, dy, color, alpha, glow };
    });
  }, [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {stars.map((s) => (
        <span
          key={s.key}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: 9999,
            backgroundColor: s.color,
            opacity: s.alpha,
            // glow visible en fondos claros
            boxShadow: `0 0 ${s.glow}px ${s.color}`,
            // variables por estrella
            ["--dx"]: `${s.dx}px`,
            ["--dy"]: `${s.dy}px`,
            ["--twDur"]: `${s.dur}s`,
            ["--twDelay"]: `${s.delay}s`,
            animation: `star-twinkle var(--twDur) ease-in-out var(--twDelay) infinite alternate,
                        star-drift calc(var(--twDur) * 4) ease-in-out var(--twDelay) infinite`,
            willChange: "transform, opacity",
            transform: "translateZ(0)",
          }}
        />
      ))}

      <style>{`
        @keyframes star-twinkle {
          0%   { opacity: .25; transform: scale(0.9); }
          50%  { opacity: 1;    transform: scale(1); }
          100% { opacity: .25; transform: scale(0.92); }
        }
        @keyframes star-drift {
          0%   { transform: translate3d(0,0,0); }
          100% { transform: translate3d(var(--dx, 0), var(--dy, 0), 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="star-twinkle"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ================= Fondo: Pelotas pastel (sin intervalos) ================= */
function BouncyBalls({ zIndexClass = "z-[1]" }) {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 640px)").matches;

  const count = isMobile ? 16 : 26;
  const PALETTE = ["#ef9fbc","#a4d8e1","#ffd1dc","#e0d4f7","#e4d8b4","#a3c293","#f9e2ae","#cde7d8"];

  // Genera las bolas una sola vez; solo CSS anima
  const balls = React.useMemo(() => {
    const r = (min, max) => Math.random() * (max - min) + min;
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.floor(r(40, 160));
      const top = r(-10, 95);
      const left = r(-8, 95);
      const dur = r(10, 20);
      const delay = r(0, 6);
      const color = PALETTE[i % PALETTE.length];
      const blur = Math.random() < 0.3 ? 8 : 2;
      const alpha = Math.random() < 0.5 ? 0.18 : 0.28;
      const dir = Math.random() < 0.5 ? "normal" : "reverse";  // variación de dirección
      return { key: `b-${i}-${Math.random().toString(36).slice(2)}`, size, top, left, dur, delay, color, blur, alpha, dir };
    });
  }, [count]);

  return (
    <div className={`pointer-events-none fixed inset-0 ${zIndexClass}`}>
      {balls.map((b) => (
        <span
          key={b.key}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: 9999,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,.55), rgba(255,255,255,0) 50%), ${b.color}`,
            filter: `blur(${b.blur}px) drop-shadow(0 10px 18px rgba(0,0,0,.08))`,
            ["--ball-alpha"]: b.alpha,
            ["--ballDur"]: `${b.dur}s`,
            ["--ballDelay"]: `${b.delay}s`,
            animation: `ball-move var(--ballDur) ease-in-out var(--ballDelay) infinite ${b.dir},
                        ball-fade calc(var(--ballDur) * 1.2) ease-in-out var(--ballDelay) infinite`,
            willChange: "transform, opacity",
            transform: "translateZ(0)",
            mixBlendMode: "multiply",
          }}
        />
      ))}

      <style>{`
        @keyframes ball-move {
          0%   { transform: translate3d(0,0,0) scale(1); }
          40%  { transform: translate3d(12px, -10px, 0) scale(1.04); }
          60%  { transform: translate3d(-8px, 6px, 0) scale(1.02); }
          100% { transform: translate3d(0,0,0) scale(1); }
        }
        @keyframes ball-fade {
          0%   { opacity: 0; }
          12%  { opacity: var(--ball-alpha, .28); }
          85%  { opacity: var(--ball-alpha, .28); }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="ball-move"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ================= HERO decor ================= */
function HeroMarkSoft() {
  return (
    <svg viewBox="0 0 300 240" className="w-full h-auto floaty opacity-90">
      <rect x="20" y="40" width="120" height="80" rx="18" fill="rgba(0,0,0,0.04)" />
      <circle cx="210" cy="90" r="44" fill="rgba(0,0,0,0.055)" />
      <rect x="60" y="140" width="200" height="60" rx="20" fill="rgba(0,0,0,0.035)" />
      <path d="M90 170 L120 190 L170 150" stroke="rgba(0,0,0,0.25)" strokeWidth="10" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function ScrollCue() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-base-content/60">
      <svg width="28" height="28" viewBox="0 0 24 24" className="animate-bounce">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  );
}

/* ================= Showcase Panels ================= */
const PANELS = [
  {
    title: "Del papel al plush",
    text: "Respetamos los trazos y colores tal como son, para que el peluche conserve la esencia del dibujo.",
    tone: "rgba(0,0,0,0.04)",
  },
  {
    title: "Seguro y duradero",
    text: "Materiales suaves y resistentes. Cada pieza es revisada con cariño antes de enviarse.",
    tone: "rgba(0,0,0,0.04)",
  },
  {
    title: "Acompañamiento real",
    text: "Confirmamos tamaño, tonos y acabados contigo. Comunicación clara por correo en cada paso.",
    tone: "rgba(0,0,0,0.04)",
  },
];

function ShowcasePanel({ title, text, tone, flip = false }) {
  return (
    <section className="relative min-h-[100svh] snap-start overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* Fondo translúcido para dejar ver el cielo */}
        <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 to-base-200/70" />
        <div className="absolute inset-0" style={{ background: tone }} />
      </div>

      <div className="container mx-auto px-6 py-16 lg:py-24 grid items-center gap-10 lg:gap-12 lg:grid-cols-12">
        {/* “Imagen” con ken-burns */}
        <motion.div
          variants={itemX(flip ? 1 : -1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className={`${flip ? "lg:order-2 lg:col-span-7" : "lg:order-1 lg:col-span-7"}`}
        >
          <PanelArt flip={flip} />
        </motion.div>

        {/* Texto */}
        <motion.div
          variants={itemX(flip ? -1 : 1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className={`${flip ? "lg:order-1 lg:col-span-5" : "lg:order-2 lg:col-span-5"}`}
        >
          <h3 className="text-4xl font-extrabold leading-tight">{title}</h3>
          <p className="mt-4 text-base-content/70 text-lg">{text}</p>
        </motion.div>
      </div>
    </section>
  );
}

/* Arte plano minimal que simula “foto” a reemplazar luego */
function PanelArt({ flip }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-base-content/10 shadow-[0_10px_40px_rgba(0,0,0,.12)]">
      <div className="aspect-[16/10] bg-base-200/60 kenburns">
        <svg viewBox="0 0 800 500" className="w-full h-full">
          <rect x="0" y="0" width="800" height="500" fill="rgba(0,0,0,0.02)" />
          {/* banda diagonal */}
          <rect
            x={flip ? 260 : -60}
            y="-60"
            width="400"
            height="620"
            transform={`rotate(${flip ? -18 : 18} 200 200)`}
            fill="rgba(0,0,0,0.05)"
          />
          {/* silueta “plush” */}
          <g opacity="0.35">
            <circle cx="420" cy="200" r="54" fill="rgba(0,0,0,0.10)" />
            <ellipse cx="420" cy="340" rx="90" ry="110" fill="rgba(0,0,0,0.10)" />
            <circle cx="380" cy="160" r="16" fill="rgba(0,0,0,0.10)" />
            <circle cx="460" cy="160" r="16" fill="rgba(0,0,0,0.10)" />
            <ellipse cx="340" cy="340" rx="26" ry="48" fill="rgba(0,0,0,0.10)" />
            <ellipse cx="500" cy="340" rx="26" ry="48" fill="rgba(0,0,0,0.10)" />
          </g>
          {/* luz suave */}
          <circle cx="200" cy="120" r="80" fill="rgba(255,255,255,0.25)" />
        </svg>
      </div>
      <div className="absolute inset-0 pointer-events-none ring-1 ring-base-content/10 rounded-2xl" />
      <div className="absolute bottom-3 left-3 text-xs uppercase tracking-wider text-base-content/60 bg-base-100/70 px-2 py-1 rounded">
        muestra
      </div>
    </div>
  );
}

/* Pasos */
function Step({ n, title, children }) {
  return (
    <div className="rounded-xl border border-base-content/10 bg-base-200/50 p-5 text-left">
      <div className="text-sm text-base-content/60">Paso {n}</div>
      <div className="text-xl font-bold">{title}</div>
      <p className="mt-2 text-base-content/80">{children}</p>
    </div>
  );
}
