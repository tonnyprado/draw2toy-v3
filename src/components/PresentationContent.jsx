import React from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import logoUrl from "../assets/logo-temporal.png";

/**
 * Home — Collage “Sticker” con PARALLAX (inspirado en TTN, sin fondo arcoíris)
 * - Parallax frontal (6–8 stickers) controlado por el mouse
 * - Fondo claro con speedlines + halftone sutiles (sin conic/rainbow)
 * - Logo + CTA “aquí” → /pedido-rapido
 * - Cinta (marquee) liviana
 * - Galería pop 3D (scroll-in + hover)
 * - Descripción + tarjeta “Empieza en 1 minuto”
 * - CTA final (conservada)
 */

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 16 } } };

export default function PresentationContent() {
  // Motion values para parallax (normalizados -1..1 aprox)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  // Suavizado
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.6 });

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    mx.set(Math.max(-1, Math.min(1, nx)));
    my.set(Math.max(-1, Math.min(1, ny)));
  };

  return (
    <div className="scroll-smooth">
      {/* ===== HERO ===== */}
      <section
        id="home"
        className="relative min-h-[100svh] grid place-items-center overflow-hidden"
        onMouseMove={onMouseMove}
      >
        <HeroBackdropPlain />
        <HeroStickerCloudStatic /> {/* nube estática ligera */}
        <HeroStickerParallax mx={sx} my={sy} /> {/* capa frontal parallax */}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-30 container mx-auto px-6 text-center"
        >
          <motion.div variants={item} className="inline-block px-4 py-2 rounded-full bg-black/10 backdrop-blur-sm border border-white/25 mb-4">
            <span className="text-sm font-semibold tracking-wide text-white">Convierte tu dibujo en un plush real 💫</span>
          </motion.div>

          {/* Logo */}
          <motion.div variants={item}>
            <img
              src={logoUrl}
              alt="Draw2Toy"
              width="640"
              height="240"
              loading="eager"
              decoding="async"
              draggable="false"
              className="mx-auto w-[min(90vw,640px)] h-auto drop-shadow-[0_20px_44px_rgba(0,0,0,.28)] select-none"
            />
            <h1 className="sr-only">Draw2Toy — Convierte tus dibujos en peluches únicos</h1>
          </motion.div>

          <motion.p variants={item} className="mt-3 text-base md:text-lg text-white/95 max-w-2xl mx-auto">
            Súper fácil y <b>sin registro obligatorio</b>: sube tu idea y nosotros le damos vida. ✨
          </motion.p>

          {/* CTA principal */}
          <motion.div variants={item} className="mt-8 flex flex-col items-center gap-4">
            <p className="text-lg md:text-xl text-white">
              Crea tu juguete ya dando click{" "}
              <Link
                to="/pedido-rapido"
                className="btn btn-accent btn-lg align-baseline animate-[pressable_2.4s_ease-in-out_infinite]"
              >
                aquí
              </Link>
            </p>
            <a href="#gallery" className="btn btn-ghost btn-lg text-white">Ver galería</a>
          </motion.div>

          {/* Cinta de energía */}
          <motion.div variants={item} className="mt-10">
            <EnergyRibbon />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== GALERÍA ===== */}
      <section id="gallery" className="relative py-16 md:py-20 overflow-hidden">
        <SectionBackdrop density={10} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.22 }}
            className="mb-10 text-center"
          >
            <motion.h2 variants={item} className="text-3xl md:text-4xl font-extrabold">Galería (pronto real) 🎉</motion.h2>
            <motion.p variants={item} className="opacity-85 max-w-3xl mx-auto">
              Placeholders con efecto **pop 3D**. Luego reemplázalos con tus fotos de peluches.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.12 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            style={{ perspective: "1000px" }}
          >
            {[...Array(9)].map((_, i) => (
              <GalleryCard key={i} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== DESCRIPCIÓN ===== */}
      <section id="about" className="relative py-16 md:py-20 overflow-hidden">
        <SectionBackdrop density={8} strong />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
          >
            <motion.div variants={item} className="lg:col-span-3">
              <h3 className="text-3xl md:text-4xl font-extrabold mb-4">Anime vibes, plush real. 🌈</h3>
              <p className="opacity-90 text-base md:text-lg">
                Colores intensos, formas <b>explosivas</b> y movimiento <b>suave</b>. Tú pones la idea; nosotros la fabricamos con materiales de calidad.
              </p>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Varias tallas y combinaciones",
                  "Proceso guiado con feedback",
                  "Seguimiento por correo",
                  "Empaque lindo para regalo",
                ].map((txt, i) => (
                  <li key={i} className="rounded-box bg-base-100 border px-4 py-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: pickColor(i) }} />
                    <span className="font-medium">{txt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={item} className="lg:col-span-2">
              <div className="card bg-base-100/95 border shadow-xl overflow-hidden group" style={{ perspective: "1000px" }}>
                <div className="card-body">
                  <h4 className="card-title">Empieza en 1 minuto</h4>
                  <p className="opacity-85">
                    Sube tu dibujo, elige tamaño y listo. Puedes pedir como invitad@ y completar más tarde.
                  </p>
                </div>
                <div className="relative h-56 sm:h-64 bg-base-200/70">
                  <PopFigure kind={1} />
                </div>
                <div className="card-body pt-0">
                  <Link to="/pedido-rapido" className="btn btn-primary btn-block group-hover:translate-y-[-2px] transition-transform">
                    Empezar ahora
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA FINAL (conservada) ===== */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="card bg-base-200/60 backdrop-blur-sm">
            <div className="card-body items-center text-center gap-4">
              <h3 className="card-title text-2xl md:text-3xl">¿List@ para crear tu peluche perfecto?</h3>
              <p className="opacity-80 max-w-2xl">
                Podrás pedir sin registrarte forzosamente (muy pronto). Por ahora, crea tu cuenta en un minuto y guarda tus diseños.
              </p>
              <div className="card-actions">
                <Link to="/register" className="btn btn-primary btn-lg">Crear cuenta</Link>
                <a href="#home" className="btn btn-ghost btn-lg">Volver arriba</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ESTILOS LOCALES (SIN arcoíris) ===== */}
      <style>{`
        /* Fondo claro tipo “papel” con speedlines y halftone */
        .ttn-plain {
          background: linear-gradient(180deg, #fff7fb 0%, #fef6e4 100%);
        }
        .speedlines {
          background:
            repeating-linear-gradient(-18deg,
              rgba(255,255,255,0.18) 0px,
              rgba(255,255,255,0.18) 12px,
              rgba(255,255,255,0.0) 12px,
              rgba(255,255,255,0.0) 30px
            );
          animation: speedMove 16s linear infinite;
          mask-image: radial-gradient(ellipse at center, black 38%, transparent 80%);
        }
        @keyframes speedMove { 0% { background-position: 0 0 } 100% { background-position: 480px 0 } }
        .halftone {
          background:
            radial-gradient(circle at 0 0, rgba(255,255,255,.16) 0 2px, transparent 2px) 0 0/14px 14px,
            radial-gradient(circle at 7px 7px, rgba(255,255,255,.1) 0 2px, transparent 2px) 0 0/14px 14px;
          mix-blend-mode: overlay;
          animation: dotPulse 6s ease-in-out infinite;
        }
        @keyframes dotPulse { 0%,100% { transform: scale(1); opacity:.9 } 50% { transform: scale(1.02); opacity:1 } }

        /* Marquee (cinta) */
        .ribbon {
          background: linear-gradient(90deg, #111827, #1f2937, #111827);
          background-size: 200% 100%;
          animation: ribbonBg 12s linear infinite;
          border: 2px solid rgba(255,255,255,.7);
          box-shadow: 0 8px 24px rgba(0,0,0,.15);
        }
        @keyframes ribbonBg { 0% { background-position: 0% 50% } 100% { background-position: 200% 50% } }
        .marquee { animation: marquee 22s linear infinite; will-change: transform; color: #fff; }
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }

        /* Shimmer para placeholders de galería */
        .shimmer { position:absolute; inset:0; background-image: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.45), rgba(255,255,255,0)); background-size: 200% 100%; animation: shimmer 2.2s ease-in-out infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }

        /* Animaciones suaves */
        @keyframes floaty { 0% { transform: translateY(0) translateX(0) rotate(0deg) } 50% { transform: translateY(-12px) translateX(8px) rotate(4deg) } 100% { transform: translateY(0) translateX(0) rotate(0deg) } }
        @keyframes pressable { 0%,100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-2px) scale(1.03) } }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .speedlines, .halftone, .marquee, .shimmer { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* =======================
   HERO BACKDROP (plain)
   ======================= */
function HeroBackdropPlain() {
  return (
    <div className="absolute inset-0 -z-20">
      <div className="absolute inset-0 ttn-plain" />
      <div className="absolute inset-0 speedlines opacity-55" />
      <div className="absolute inset-0 halftone opacity-85" />
    </div>
  );
}

/* =======================
   NUBE DE STICKERS (estática, ligera)
   ======================= */
const palette = ["#ff3d75","#ffb800","#00d4ff","#b84cff","#24e079","#ff7ae5","#00ffa3","#ff6b6b","#8cff00","#7aa2ff"];

function HeroStickerCloudStatic() {
  const specs = [
    ["star","10%","12%",110,0, 10,14],
    ["heart","18%","26%",90,5,-8,13],
    ["bolt","16%","72%",100,1, 16,12],
    ["bubble","26%","58%",120,2,0,12],
    ["blob","34%","10%",130,3,-6,13],
    ["star","40%","84%",110,4, 8,12],
    ["heart","48%","20%",95,6,-6,14],
    ["bolt","54%","74%",100,7,12,13],
    ["bubble","62%","12%",95,8,0,12],
    ["blob","70%","88%",120,9,-8,13],
    ["star","78%","34%",110,2,6,12],
    ["heart","84%","58%",90,0,-10,13],
  ];
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {specs.map(([t, top, left, size, ci, rot, dur], i) => (
        <Sticker key={i} type={t} top={top} left={left} size={size} color={palette[ci%palette.length]} rotate={rot} duration={dur} z={i%2} />
      ))}
    </div>
  );
}

/* =======================
   STICKERS con parallax (frontal)
   ======================= */
function HeroStickerParallax({ mx, my }) {
  // 8 stickers frontales con fuerzas distintas (px)
  const front = [
    ["star",  "22%","18%", 120, 0,  8,  28],
    ["heart", "28%","78%", 110, 5, -8,  24],
    ["bolt",  "42%","12%", 100, 1, 16,  22],
    ["bubble","52%","50%", 130, 2,  0,  20],
    ["blob",  "62%","82%", 130, 3, -6,  26],
    ["star",  "74%","26%", 118, 4, 10,  18],
    ["heart", "82%","64%", 100, 6, -8,  22],
    ["bolt",  "14%","50%",  96, 7, 14,  24],
  ];
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {front.map(([t, top, left, size, ci, rot, force], i) => (
        <ParallaxSticker
          key={i}
          type={t}
          top={top}
          left={left}
          size={size}
          color={palette[ci%palette.length]}
          rotate={rot}
          force={force}
          mx={mx}
          my={my}
        />
      ))}
    </div>
  );
}

function ParallaxSticker({ type="star", top, left, size=120, color="#ff3d75", rotate=0, force=24, mx, my }) {
  const x = useTransform(mx, v => v * force);
  const y = useTransform(my, v => v * force);
  return (
    <motion.div
      style={{ x, y }}
      className="absolute"
    >
      <Sticker type={type} top={top} left={left} size={size} color={color} rotate={rotate} duration={12} z={3} />
    </motion.div>
  );
}

/* =======================
   STICKER base (SVG con borde blanco)
   ======================= */
function Sticker({ type="star", top, left, size=120, color="#ff3d75", rotate=0, duration=12, z=1 }) {
  const baseStyle = {
    position: "absolute",
    top, left,
    width: size, height: size,
    transform: `rotate(${rotate}deg)`,
    zIndex: z,
    filter: "drop-shadow(0 18px 30px rgba(0,0,0,.24))",
    animation: `floaty ${duration}s ease-in-out ${z*0.4}s infinite`,
    willChange: "transform, opacity",
    contain: "layout paint",
    pointerEvents: "none",
  };
  if (type === "heart") {
    return (
      <svg aria-hidden viewBox="0 0 100 100" style={baseStyle}>
        <path d="M50 88 C20 64 8 50 8 34 C8 22 18 12 30 12 C38 12 44 16 50 22 C56 16 62 12 70 12 C82 12 92 22 92 34 C92 50 80 64 50 88 Z"
              fill={color} stroke="white" strokeWidth="8" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (type === "bolt") {
    return (
      <svg aria-hidden viewBox="0 0 100 100" style={baseStyle}>
        <path d="M56 6 L12 62 H44 L36 94 L88 34 H56 Z"
              fill={color} stroke="white" strokeWidth="8" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (type === "bubble") {
    return (
      <svg aria-hidden viewBox="0 0 100 100" style={baseStyle}>
        <circle cx="50" cy="50" r="42" fill={color} stroke="white" strokeWidth="8"/>
        <circle cx="34" cy="34" r="10" fill="white" opacity=".65"/>
        <circle cx="42" cy="26" r="6" fill="white" opacity=".35"/>
      </svg>
    );
  }
  if (type === "blob") {
    return (
      <svg aria-hidden viewBox="0 0 100 100" style={baseStyle}>
        <path d="M20 44 C20 24 36 12 54 16 C70 20 84 32 84 50 C84 68 66 86 48 84 C30 82 20 64 20 44 Z"
              fill={color} stroke="white" strokeWidth="8" strokeLinejoin="round"/>
      </svg>
    );
  }
  // star
  return (
    <svg aria-hidden viewBox="0 0 100 100" style={baseStyle}>
      <path d="M50 6 L62 36 L94 40 L70 60 L78 92 L50 74 L22 92 L30 60 L6 40 L38 36 Z"
            fill={color} stroke="white" strokeWidth="8" strokeLinejoin="round"/>
    </svg>
  );
}

/* =======================
   ENERGY RIBBON (marquee)
   ======================= */
function EnergyRibbon() {
  const chips = ["Colores vibrantes","Anime vibes","Hecho con amor","Sin registro","Pop 3D","Personalización total","¡Magia plush!"];
  const track = [...chips, ...chips]; // loop
  return (
    <div className="ribbon rounded-box overflow-hidden">
      <div className="marquee flex gap-6 py-3 px-6 font-bold whitespace-nowrap">
        {track.map((txt, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-white">
            <span>★</span>{txt}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =======================
   GALERÍA
   ======================= */
function GalleryCard({ index }) {
  const tone = palette[index % palette.length];

  return (
    <motion.article
      variants={item}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="group card bg-base-100/95 border shadow-xl hover:shadow-2xl transition-shadow will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
      whileHover={{ y: -8, rotateZ: -0.6, transition: { type: "spring", stiffness: 240, damping: 18 } }}
    >
      <figure className="relative aspect-[4/3] overflow-visible">
        <div className="absolute inset-0 bg-base-200/70"><div className="shimmer" /></div>
        {/* POP 3D */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 190, height: 190, transform: "translateZ(54px)", filter: "drop-shadow(0 24px 40px rgba(0,0,0,.22))", color: tone }}
        >
          <PopFigure kind={index % 3} />
        </div>
      </figure>

      <div className="card-body">
        <h3 className="card-title text-base md:text-lg">Peluche #{index + 1}</h3>
        <p className="opacity-80 text-sm">Reemplaza esta figura por tu foto. Mantén el efecto pop 3D para que “salte”.</p>
        <div className="card-actions justify-end">
          <button className="btn btn-accent btn-sm">Ver detalle</button>
        </div>
      </div>
    </motion.article>
  );
}

function PopFigure({ kind = 0 }) {
  if (kind === 1) {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs><radialGradient id="g1" cx="50%" cy="35%" r="70%"><stop offset="0%" stopColor="#fff" stopOpacity=".9" /><stop offset="60%" stopColor="#fff" stopOpacity=".25" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient></defs>
        <circle cx="100" cy="100" r="80" fill="currentColor" opacity=".95" />
        <circle cx="100" cy="100" r="116" fill="none" stroke="currentColor" strokeWidth="16" opacity=".45" />
        <ellipse cx="82" cy="70" rx="50" ry="32" fill="url(#g1)" style={{ mixBlendMode: "soft-light" }} />
      </svg>
    );
  }
  if (kind === 2) {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect x="28" y="28" width="144" height="144" transform="rotate(45 100 100)" fill="currentColor" opacity=".95" rx="18" />
        <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" fill="#fff" opacity=".20" rx="14" />
        <rect x="68" y="68" width="64" height="64" transform="rotate(45 100 100)" fill="#fff" opacity=".12" rx="12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <path d="M100 10 L126 70 L192 78 L144 121 L158 188 L100 154 L42 188 L56 121 L8 78 L74 70 Z" fill="currentColor" opacity=".98" />
      <path d="M100 34 L118 73 L162 78 L128 109 L137 152 L100 130 L63 152 L72 109 L38 78 L82 73 Z" fill="#fff" opacity=".20" />
    </svg>
  );
}

/* =======================
   SECTION BACKDROPS
   ======================= */
function SectionBackdrop({ density = 12, strong = false }) {
  const arr = Array.from({ length: density }).map((_, i) => {
    const t = ["star", "circle", "square"][i % 3];
    const size = 90 + (i % 5) * 26;
    const top = `${(i * 29) % 100}%`;
    const left = `${(i * 53) % 100}%`;
    const color = palette[(i * 3) % palette.length] + (strong ? "" : "CC");
    const dur = 14 + (i % 6);
    return { t, size, top, left, color, dur };
  });
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {arr.map((s, i) => (<BackdropShape key={i} {...s} />))}
    </div>
  );
}
function BackdropShape({ t, size, top, left, color, dur }) {
  const style = {
    position: "absolute",
    top, left, width: size, height: size,
    filter: "drop-shadow(0 16px 28px rgba(0,0,0,.18))",
    animation: `floaty ${dur}s ease-in-out ${dur/10}s infinite`,
    opacity: .95,
    pointerEvents: "none",
  };
  if (t === "circle") return <div aria-hidden style={{ ...style, borderRadius: 9999, background: color }} />;
  if (t === "square") return <div aria-hidden style={{ ...style, borderRadius: 18, background: color, transform: "rotate(10deg)" }} />;
  return (
    <svg aria-hidden viewBox="0 0 100 100" style={style}>
      <path d="M50 6 L62 36 L94 40 L70 60 L78 92 L50 74 L22 92 L30 60 L6 40 L38 36 Z" fill={color} />
    </svg>
  );
}

/* =======================
   HELPERS
   ======================= */
function pickColor(i = 0) { return palette[i % palette.length]; }
