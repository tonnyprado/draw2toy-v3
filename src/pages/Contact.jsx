import { useState } from "react";

const FN_URL = "https://us-central1-<TU_PROJECT_ID>.cloudfunctions.net/contactEmail"; // ← reemplaza

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", hp: "" }); // hp = honeypot
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
    <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulario */}
      <form className="card bg-base-100 border lg:col-span-2" onSubmit={onSubmit}>
        <div className="card-body space-y-3">
          <h1 className="text-3xl font-bold">Contacto</h1>
          <p className="opacity-70">¿Tienes dudas? Escríbenos y te respondemos.</p>

          {ok === true && (
            <div className="alert alert-success">¡Gracias! Tu mensaje fue enviado.</div>
          )}
          {ok === false && (
            <div className="alert alert-error">{err}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label"><span className="label-text">Nombre</span></label>
              <input
                name="name"
                className="input input-bordered"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input
                type="email"
                name="email"
                className="input input-bordered"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Asunto</span></label>
            <input
              name="subject"
              className="input input-bordered"
              value={form.subject}
              onChange={onChange}
              placeholder="Quiero un peluche personalizado…"
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Mensaje</span></label>
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

          <div className="card-actions justify-end">
            <button className="btn btn-primary" disabled={sending}>
              {sending ? "Enviando…" : "Enviar"}
            </button>
          </div>
        </div>
      </form>

      {/* Lateral: datos y redes (placeholders) */}
      <aside className="space-y-4">
        <div className="card bg-base-100 border">
          <div className="card-body">
            <h2 className="card-title">También puedes contactarnos</h2>
            <ul className="space-y-2">
              <li><a className="link" href="mailto:kath@tudominio.com">kath@tudominio.com</a></li>
              <li><a className="link" href="#" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a className="link" href="#" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a className="link" href="#" target="_blank" rel="noreferrer">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="card bg-base-100 border">
          <div className="card-body">
            <h2 className="card-title">Horario</h2>
            <p className="opacity-70">Lunes a Viernes, 9am–6pm (CDMX)</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
