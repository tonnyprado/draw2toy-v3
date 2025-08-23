// src/pages/admin/AdminAbout.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchAbout, saveAbout } from "../../services/cmsService";
import AdminShell from "./AdminShell";

export default function AdminAbout() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    body: "",
    heroImageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAbout();
        if (mounted && data) {
          setForm({
            title: data.title ?? "",
            subtitle: data.subtitle ?? "",
            body: data.body ?? "",
            heroImageUrl: data.heroImageUrl ?? "",
          });
        }
      } catch (e) {
        console.error("[AdminAbout] fetch error:", e);
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setSaved(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      setSaving(true);
      await saveAbout(form, user);
      setSaved(true);
    } catch (e) {
      console.error("[AdminAbout] save error:", e);
      setErr(e);
      alert("No se pudo guardar. Revisa consola.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <AdminShell>
        <div className="alert alert-warning">Debes iniciar sesión.</div>
      </AdminShell>
    );
  }
  if (!isAdmin) {
    return (
      <AdminShell>
        <div className="alert alert-error">No autorizado. Solo administradores.</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="loading loading-spinner loading-md" />
          <span>Cargando contenido actual…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <form className="card bg-base-100 border" onSubmit={onSubmit}>
            <div className="card-body space-y-3">
              <h2 className="card-title">Editar “Acerca de”</h2>

              {err && (
                <div className="alert alert-error">
                  <span>Error: {String(err.message || err)}</span>
                </div>
              )}

              {saved && !saving && (
                <div className="alert alert-success py-2">
                  <span>¡Guardado!</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Título</span>
                </label>
                <input
                  name="title"
                  className="input input-bordered"
                  placeholder="Quiénes somos"
                  value={form.title}
                  onChange={onChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Subtítulo</span>
                </label>
                <input
                  name="subtitle"
                  className="input input-bordered"
                  placeholder="Nuestra misión, visión…"
                  value={form.subtitle}
                  onChange={onChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Imagen (URL)</span>
                </label>
                <input
                  name="heroImageUrl"
                  className="input input-bordered"
                  placeholder="https://…"
                  value={form.heroImageUrl}
                  onChange={onChange}
                />
                <label className="label">
                  <span className="label-text-alt opacity-70">
                    Más adelante integramos subida a Storage 🙂
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cuerpo (texto/markdown)</span>
                </label>
                <textarea
                  name="body"
                  className="textarea textarea-bordered min-h-[180px]"
                  placeholder="Escribe aquí la historia, valores, etc."
                  value={form.body}
                  onChange={onChange}
                />
                <label className="label">
                  <span className="label-text-alt opacity-70">
                    Admite saltos de línea. Si quieres, luego soportamos Markdown.
                  </span>
                </label>
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? "Guardando…" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>

          {/* Vista previa */}
          <div className="card bg-base-100 border">
            <div className="card-body space-y-3">
              <h2 className="card-title">Vista previa</h2>

              {form.heroImageUrl ? (
                <div className="w-full aspect-[16/9] bg-base-200 rounded-box overflow-hidden">
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img
                    src={form.heroImageUrl}
                    alt="Hero image preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[16/9] bg-base-200 rounded-box flex items-center justify-center opacity-60">
                  Sin imagen
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold">{form.title || "—"}</h3>
                <p className="opacity-70">{form.subtitle || "—"}</p>
              </div>

              <div className="prose max-w-none whitespace-pre-wrap">
                {form.body || "—"}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
