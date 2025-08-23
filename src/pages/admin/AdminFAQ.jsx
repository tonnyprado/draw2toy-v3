// src/pages/admin/AdminFAQ.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import AdminShell from "./AdminShell";
import { createFAQ, updateFAQ, deleteFAQ, swapFAQOrder } from "../../services/faqService";

const PAGE = 200; // carga hasta 200 FAQs (suficiente para hoy)

export default function AdminFAQ() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // New form
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");
  const [newPublished, setNewPublished] = useState(true);
  const [creating, setCreating] = useState(false);

  // Edición por fila
  const [editing, setEditing] = useState({}); // id -> {question, answer, published}
  const [busy, setBusy] = useState({});      // id -> boolean para bloquear botones

  useEffect(() => {
    if (!isAdmin) { setRows([]); setLoading(false); return; }
    setLoading(true); setErr(null);

    // Ordenamos por "order" asc para que sea estable (no requiere índice compuesto)
    const q = query(collection(db, "faqs"), orderBy("order", "asc"), limit(PAGE));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRows(list);
      setLoading(false);
    }, (e) => { setErr(e); setLoading(false); });

    return () => unsub();
  }, [isAdmin]);

  const canSubmitNew = useMemo(
    () => newQ.trim().length > 0 && newA.trim().length > 0,
    [newQ, newA]
  );

  const onCreate = async (e) => {
    e.preventDefault();
    if (!isAdmin || !canSubmitNew) return;
    try {
      setCreating(true);
      await createFAQ({ question: newQ.trim(), answer: newA.trim(), published: newPublished }, user);
      setNewQ(""); setNewA(""); setNewPublished(true);
    } catch (e) {
      console.error("[AdminFAQ] createFAQ error:", e);
      alert("No se pudo crear. Revisa consola.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (row) => {
    setEditing(ed => ({
      ...ed,
      [row.id]: {
        question: row.question ?? "",
        answer: row.answer ?? "",
        published: !!row.published,
      }
    }));
  };
  const cancelEdit = (id) => {
    setEditing(ed => {
      const { [id]: _, ...rest } = ed;
      return rest;
    });
  };
  const changeEditField = (id, field, value) => {
    setEditing(ed => ({ ...ed, [id]: { ...ed[id], [field]: value } }));
  };
  const saveEdit = async (id) => {
    try {
      setBusy(b => ({ ...b, [id]: true }));
      const data = editing[id];
      await updateFAQ(id, {
        question: data.question,
        answer: data.answer,
        published: data.published
      }, user);
      cancelEdit(id);
    } catch (e) {
      console.error("[AdminFAQ] updateFAQ error:", e);
      alert("No se pudo guardar. Revisa consola.");
    } finally {
      setBusy(b => ({ ...b, [id]: false }));
    }
  };
  const removeFAQ = async (id) => {
    if (!window.confirm("¿Eliminar esta pregunta?")) return;
    try {
      setBusy(b => ({ ...b, [id]: true }));
      await deleteFAQ(id);
    } catch (e) {
      console.error("[AdminFAQ] deleteFAQ error:", e);
      alert("No se pudo eliminar. Revisa consola.");
    } finally {
      setBusy(b => ({ ...b, [id]: false }));
    }
  };

  const moveUp = async (idx) => {
    if (idx <= 0) return;
    const a = rows[idx - 1];
    const b = rows[idx];
    try {
      setBusy(busy => ({ ...busy, [a.id]: true, [b.id]: true }));
      await swapFAQOrder(a, b);
    } catch (e) {
      console.error("[AdminFAQ] moveUp error:", e);
    } finally {
      setBusy(busy => ({ ...busy, [a.id]: false, [b.id]: false }));
    }
  };
  const moveDown = async (idx) => {
    if (idx >= rows.length - 1) return;
    const a = rows[idx];
    const b = rows[idx + 1];
    try {
      setBusy(busy => ({ ...busy, [a.id]: true, [b.id]: true }));
      await swapFAQOrder(a, b);
    } catch (e) {
      console.error("[AdminFAQ] moveDown error:", e);
    } finally {
      setBusy(busy => ({ ...busy, [a.id]: false, [b.id]: false }));
    }
  };

  if (!user) return <AdminShell><div className="alert alert-warning">Debes iniciar sesión.</div></AdminShell>;
  if (!isAdmin) return <AdminShell><div className="alert alert-error">No autorizado. Solo administradores.</div></AdminShell>;

  return (
    <AdminShell>
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="loading loading-spinner loading-md" />
          <span>Cargando FAQ…</span>
        </div>
      ) : err ? (
        <div className="alert alert-error">Error: {String(err)}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario: crear nueva */}
          <form className="card bg-base-100 border" onSubmit={onCreate}>
            <div className="card-body space-y-3">
              <h2 className="card-title">Nueva pregunta</h2>
              <div className="form-control">
                <label className="label"><span className="label-text">Pregunta</span></label>
                <input
                  className="input input-bordered"
                  value={newQ}
                  onChange={e => setNewQ(e.target.value)}
                  placeholder="¿Cómo funciona…?"
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Respuesta</span></label>
                <textarea
                  className="textarea textarea-bordered min-h-[120px]"
                  value={newA}
                  onChange={e => setNewA(e.target.value)}
                  placeholder="Escribe la respuesta aquí…"
                />
              </div>
              <div className="form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Publicado</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={newPublished}
                    onChange={e => setNewPublished(e.target.checked)}
                  />
                </label>
              </div>
              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={!canSubmitNew || creating}>
                  {creating ? "Creando…" : "Crear"}
                </button>
              </div>
            </div>
          </form>

          {/* Lista / edición */}
          <div className="card bg-base-100 border">
            <div className="card-body">
              <h2 className="card-title">Preguntas existentes</h2>
              {rows.length === 0 ? (
                <div className="opacity-70">Aún no hay preguntas.</div>
              ) : (
                <ul className="space-y-3">
                  {rows.map((row, idx) => {
                    const isEditing = !!editing[row.id];
                    const ed = editing[row.id];

                    return (
                      <li key={row.id} className="border rounded-box">
                        <div className="p-4 flex flex-col gap-3">
                          {/* Controles de orden y publicado */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button className="btn btn-xs" onClick={() => moveUp(idx)} disabled={idx === 0 || busy[row.id]}>↑</button>
                              <button className="btn btn-xs" onClick={() => moveDown(idx)} disabled={idx === rows.length - 1 || busy[row.id]}>↓</button>
                              <span className="badge">order: {row.order}</span>
                              <span className={`badge ${row.published ? "badge-primary" : ""}`}>
                                {row.published ? "Publicado" : "Oculto"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {!isEditing ? (
                                <button className="btn btn-xs" onClick={() => startEdit(row)}>Editar</button>
                              ) : (
                                <>
                                  <button className="btn btn-xs btn-primary" onClick={() => saveEdit(row.id)} disabled={busy[row.id]}>
                                    {busy[row.id] ? "…" : "Guardar"}
                                  </button>
                                  <button className="btn btn-xs btn-ghost" onClick={() => cancelEdit(row.id)}>Cancelar</button>
                                </>
                              )}
                              <button className="btn btn-xs btn-error" onClick={() => removeFAQ(row.id)} disabled={busy[row.id]}>Eliminar</button>
                            </div>
                          </div>

                          {/* Campos pregunta/respuesta */}
                          {!isEditing ? (
                            <>
                              <div className="font-semibold">{row.question || "—"}</div>
                              <div className="opacity-80 whitespace-pre-wrap">{row.answer || "—"}</div>
                            </>
                          ) : (
                            <>
                              <input
                                className="input input-bordered"
                                value={ed?.question || ""}
                                onChange={e => changeEditField(row.id, "question", e.target.value)}
                              />
                              <textarea
                                className="textarea textarea-bordered min-h-[100px]"
                                value={ed?.answer || ""}
                                onChange={e => changeEditField(row.id, "answer", e.target.value)}
                              />
                              <label className="label cursor-pointer justify-start gap-3">
                                <input
                                  type="checkbox"
                                  className="toggle toggle-primary"
                                  checked={!!ed?.published}
                                  onChange={e => changeEditField(row.id, "published", e.target.checked)}
                                />
                                <span className="label-text">Publicado</span>
                              </label>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
