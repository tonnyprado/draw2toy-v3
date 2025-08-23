// src/pages/Contact.jsx
import { useState } from "react";
import ComicPage from "../design/comic/layouts/ComicPage";
import { Panel, ComicButton } from "../design/comic/system";

const FN_URL =
  "https://us-central1-<TU_PROJECT_ID>.cloudfunctions.net/contactEmail"; // ← reemplaza

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    hp: "", // honeypot
  });
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.hp) return; // bot atrapado
    setSending(true);
    setOk(null);
    setErr("");

    try {
      const r = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (r.ok && data.ok) {
        setOk(true);
        setForm({ name: "", email: "", subject: "", message: "", hp: "" });
      } else {
        setOk(false);
        setErr(data?.error || "No se pudo enviar tu mensaje. Intenta de nuevo.");
      }
    } catch (e) {
      console.error(e);
      setOk(false);
      setErr("Error de red. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <ComicPage
      title="Contacto"
      subtitle="¿Tienes dudas? Escríbenos y te respondemos."
      halftone
      actions={
        <ComicButton as="a" href="/faq" className="text-sm">
          Ver FAQ
        </ComicButton>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Formulario ===== */}
        <Panel className="lg:col-span-2 p-0 overflow-hidden">
          <form onSubmit={onSubmit} noValidate>
            <fieldset disabled={sending} aria-busy={sending}>
              <div className="p-5 sm:p-6 space-y-4">
                <header className="flex items-center justify-between">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase leading-tight">
                    Envíanos un mensaje
                  </h1>
                  {sending ? (
                    <span className="text-xs font-bold opacity-70">Enviando…</span>
                  ) : null}
                </header>

                {/* Estado (éxito / error) */}
                <div aria-live="polite" className="space-y-3">
                  {ok === true && (
                    <div className="panel p-3 bg-[#D1FADF] border-[#1B1A1F]">
                      <div className="font-bold">¡Gracias! Tu mensaje fue enviado.</div>
                    </div>
                  )}
                  {ok === false && (
                    <div className="panel p-3 bg-[#FDE2E4] border-[#1B1A1F]">
                      <div className="font-bold">Ups, algo salió mal</div>
                      <div className="text-sm opacity-80">{err}</div>
                    </div>
                  )}
                </div>

                {/* Campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Nombre</span>
                    </label>
                    <input
                      name="name"
                      className="input input-bordered"
                      value={form.name}
                      onChange={onChange}
                      required
                      autoComplete="name"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="input input-bordered"
                      value={form.email}
                      onChange={onChange}
                      required
                      autoComplete="email"
                      inputMode="email"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Asunto</span>
                  </label>
                  <input
                    name="subject"
                    className="input input-bordered"
                    value={form.subject}
                    onChange={onChange}
                    placeholder="Quiero un peluche personalizado…"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Mensaje</span>
                  </label>
                  <textarea
                    name="message"
                    className="textarea textarea-bordered min-h-[140px]"
                    value={form.message}
                    onChange={onChange}
                    required
                  />
                </div>

                {/* Honeypot (oculto para humanos) */}
                <input
                  type="text"
                  name="hp"
                  value={form.hp}
                  onChange={onChange}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="pt-2 flex items-center justify-end">
                  <ComicButton className="px-6 py-3">
                    {sending ? "Enviando…" : "Enviar"}
                  </ComicButton>
                </div>
              </div>
            </fieldset>
          </form>
        </Panel>

        {/* ===== Lateral ===== */}
        <div className="space-y-6">
          <Panel className="p-5">
            <h2 className="text-xl font-black uppercase">También puedes contactarnos</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="link" href="mailto:kath@tudominio.com">
                  kath@tudominio.com
                </a>
              </li>
              <li>
                <a className="link" href="#" target="_blank" rel="noreferrer noopener">
                  Instagram
                </a>
              </li>
              <li>
                <a className="link" href="#" target="_blank" rel="noreferrer noopener">
                  Facebook
                </a>
              </li>
              <li>
                <a className="link" href="#" target="_blank" rel="noreferrer noopener">
                  WhatsApp
                </a>
              </li>
            </ul>
          </Panel>

          <Panel className="p-5">
            <h2 className="text-xl font-black uppercase">Horario</h2>
            <p className="opacity-70 text-sm">Lunes a Viernes, 9:00–18:00 (CDMX)</p>
            <div className="mt-3 text-xs text-[#1B1A1F]/70">
              Tiempo de respuesta habitual: 24–48h hábiles.
            </div>
          </Panel>
        </div>
      </div>
    </ComicPage>
  );
}
