// src/components/Footer.jsx
export default function Footer({ full = false, variant = "comic" }) {
  if (variant === "classic") {
    // === Tu versión clásica preservada como opción ===
    return (
      <footer className={["w-full bg-[#0b1220] text-white", full ? "min-h-[92svh] flex items-center" : ""].join(" ")}>
        <div className="w-full">
          <div className={`mx-auto max-w-7xl px-6 md:px-10 ${full ? "py-16 lg:py-24" : "py-10 lg:py-12"}`}>
            <div className="grid gap-10 lg:grid-cols-12 items-start">
              <div className="lg:col-span-7">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.95]">
                  Convierte <span className="text-white/90">dibujos</span> en <span className="text-white">peluches</span> que se abrazan.
                </h2>
                <p className="mt-4 text-white/75 max-w-prose">
                  Hecho para mamás y papás: proceso claro, materiales suaves y acompañamiento en cada paso.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a href="/pedido-rapido" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 hover:border-white/60 text-white/95 hover:text-white transition">
                    Empezar <span className="underline underline-offset-4">aquí</span>
                  </a>
                  <a href="/contact" className="inline-flex px-5 py-3 rounded-full hover:bg-white/10 transition">
                    Contacto
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 grid sm:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <h6 className="text-sm uppercase tracking-wider text-white/60">Enlaces</h6>
                  <a className="block text-white/85 hover:text-white" href="/toyreq1">Ordenar</a>
                  <a className="block text-white/85 hover:text-white" href="/about">Acerca de</a>
                  <a className="block text-white/85 hover:text-white" href="/faq">FAQ</a>
                </div>
                <div className="space-y-3">
                  <h6 className="text-sm uppercase tracking-wider text-white/60">Recursos</h6>
                  <a className="block text-white/85 hover:text-white" href="/politicas">Políticas</a>
                  <a className="block text-white/85 hover:text-white" href="/terminos">Términos</a>
                  <a className="block text-white/85 hover:text-white" href="/contact">Soporte</a>
                </div>
                <div className="space-y-3">
                  <h6 className="text-sm uppercase tracking-wider text-white/60">Social</h6>
                  <div className="flex items-center gap-4">
                    <a aria-label="Twitter" href="#" className="opacity-80 hover:opacity-100 transition">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775..."></path>
                      </svg>
                    </a>
                    <a aria-label="YouTube" href="#" className="opacity-80 hover:opacity-100 transition">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0..."></path>
                      </svg>
                    </a>
                    <a aria-label="Facebook" href="#" className="opacity-80 hover:opacity-100 transition">
                      <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667..."></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 border-t border-white/10 pt-6 text-center text-sm text-white/50">
              © {new Date().getFullYear()} Draw2Toy — Todos los derechos reservados
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // === Footer CÓMIC (DEFAULT) ===
  return (
    <footer className={["w-full bg-[#121215] text-white", full ? "pt-16 pb-20" : "py-10"].join(" ")}>
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <h3 className="text-4xl sm:text-5xl font-black uppercase leading-tight">
              ¿Listo para convertir su arte en{" "}
              <span className="inline-block -rotate-1 bg-[#FFEC48] text-[#1B1A1F] px-2">abrazo?</span>
            </h3>
            <p className="mt-3 text-white/80 max-w-2xl">
              Sube el dibujo y nosotros nos encargamos del resto. Materiales suaves y seguros, comunicación clara.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href="/pedido-rapido" className="comic-btn px-6 py-3 text-base bg-[#FFEC48] text-[#1B1A1F]">
                Pedir ahora
              </a>
              <a href="/faq" className="underline">Ver preguntas frecuentes</a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white text-[#1B1A1F] border-2 border-[#1B1A1F] rounded-xl p-4 shadow-[8px_8px_0_#1B1A1F10]">
              <div className="text-sm font-bold uppercase">Contacto</div>
              <div className="mt-2 text-sm">hola@draw2toy.com</div>
              <div className="mt-2 text-sm">CDMX · Envíos a todo México</div>
              <div className="mt-4 text-xs text-[#1B1A1F]/70">Horario de atención: L–V 10:00–18:00</div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h6 className="text-sm uppercase tracking-wider text-white/60">Enlaces</h6>
            <a className="block text-white/85 hover:text-white" href="/toyreq1">Ordenar</a>
            <a className="block text-white/85 hover:text-white" href="/about">Acerca de</a>
            <a className="block text-white/85 hover:text-white" href="/faq">FAQ</a>
          </div>
          <div className="space-y-3">
            <h6 className="text-sm uppercase tracking-wider text-white/60">Recursos</h6>
            <a className="block text-white/85 hover:text-white" href="/politicas">Políticas</a>
            <a className="block text-white/85 hover:text-white" href="/terminos">Términos</a>
            <a className="block text-white/85 hover:text-white" href="/contact">Soporte</a>
          </div>
          <div className="space-y-3">
            <h6 className="text-sm uppercase tracking-wider text-white/60">Social</h6>
            <div className="flex items-center gap-4">
              <a aria-label="Twitter" href="#" className="opacity-80 hover:opacity-100 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775..."></path>
                </svg>
              </a>
              <a aria-label="YouTube" href="#" className="opacity-80 hover:opacity-100 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0..."></path>
                </svg>
              </a>
              <a aria-label="Facebook" href="#" className="opacity-80 hover:opacity-100 transition">
                <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667..."></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/70">
          © {new Date().getFullYear()} Draw2Toy · Hecho con amor y tijeras sin punta ✄
        </div>
      </div>

      {/* Botón estilo cómic local (por si la página no lo define global) */}
      <style>{`
        .comic-btn {
          background: #FFEC48;
          border: 2.5px solid #1B1A1F;
          box-shadow: 4px 4px 0 #1B1A1F;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          transition: transform 120ms ease, box-shadow 120ms ease;
        }
        .comic-btn:hover { transform: translate(-1px, -1px); box-shadow: 6px 6px 0 #1B1A1F; }
        .comic-btn:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0 #1B1A1F; }
      `}</style>
    </footer>
  );
}
