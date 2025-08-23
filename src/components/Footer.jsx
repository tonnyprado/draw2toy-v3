// src/components/Footer.jsx
export default function Footer({ full = false }) {
  return (
    <footer
      className={[
        "w-full bg-[#0b1220] text-white",                // negro propio, ya no hereda del tema
        full ? "min-h-[92svh] flex items-center" : ""    // grande solo si lo pides
      ].join(" ")}
    >
      <div className="w-full">
        <div className={`mx-auto max-w-7xl px-6 md:px-10 ${full ? "py-16 lg:py-24" : "py-10 lg:py-12"}`}>
          {/* Cabecera */}
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-7">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.95]">
                Convierte <span className="text-white/90">dibujos</span> en{" "}
                <span className="text-white">peluches</span> que se abrazan.
              </h2>
              <p className="mt-4 text-white/75 max-w-prose">
                Hecho para mamás y papás: proceso claro, materiales suaves y acompañamiento en cada paso.
              </p>

              {/* CTAs (opcionales) */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="/pedido-rapido"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/30 hover:border-white/60 text-white/95 hover:text-white transition"
                >
                  Empezar <span className="underline underline-offset-4">aquí</span>
                </a>
                <a href="/contact" className="inline-flex px-5 py-3 rounded-full hover:bg-white/10 transition">
                  Contacto
                </a>
              </div>
            </div>

            {/* Columnas */}
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

          {/* Línea y copy final */}
          <div className="mt-14 border-t border-white/10 pt-6 text-center text-sm text-white/50">
            © {new Date().getFullYear()} Draw2Toy — Todos los derechos reservados
          </div>
        </div>
      </div>
    </footer>
  );
}
