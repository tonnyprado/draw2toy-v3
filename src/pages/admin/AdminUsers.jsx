import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import AdminShell from "./AdminShell";

const PAGE = 100;

export default function AdminUsers() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState({}); // { uid: boolean }

  useEffect(() => {
    if (!isAdmin) { setRows([]); setLoading(false); return; }
    setLoading(true); setErr(null);
    // Si algunos docs no tienen createdAt, igual funciona; aparecerán al final.
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(PAGE));
    const unsub = onSnapshot(q, (snap) => {
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (e) => { setErr(e); setLoading(false); });
    return () => unsub();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q
      ? rows.filter(u =>
          (u.email || "").toLowerCase().includes(q) ||
          (u.name || "").toLowerCase().includes(q) ||
          (u.id || "").toLowerCase().includes(q)
        )
      : rows;
  }, [rows, search]);

  const setRole = async (uid, toAdmin) => {
    const confirmMsg = toAdmin ? "¿Hacer admin a este usuario?" : "¿Quitar admin a este usuario?";
    if (!window.confirm(confirmMsg)) return;
    try {
      setBusy(b => ({ ...b, [uid]: true }));
      await updateDoc(doc(db, "users", uid), { role: toAdmin ? "admin" : "user" });
    } catch (e) {
      console.error("[AdminUsers] setRole error:", e);
      alert("No se pudo actualizar el rol. Revisa consola.");
    } finally {
      setBusy(b => ({ ...b, [uid]: false }));
    }
  };

  if (!user) return <AdminShell><div className="alert alert-warning">Debes iniciar sesión.</div></AdminShell>;
  if (!isAdmin) return <AdminShell><div className="alert alert-error">No autorizado.</div></AdminShell>;

  return (
    <AdminShell>
      {loading ? (
        <div className="flex items-center gap-2"><span className="loading loading-spinner loading-md" /><span>Cargando usuarios…</span></div>
      ) : err ? (
        <div className="alert alert-error">Error: {String(err)}</div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="form-control md:col-span-2">
              <label className="label"><span className="label-text">Buscar</span></label>
              <input className="input input-bordered" placeholder="Nombre, email o UID…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>Nombre</th><th>Email</th><th>UID</th><th>Rol</th><th>Creado</th><th className="text-right">Acciones</th></tr></thead>
              <tbody>
                {filtered.map(u => {
                  const created = u.createdAt?.toDate?.() ? u.createdAt.toDate().toLocaleString() : "—";
                  const isUAdmin = u.role === "admin";
                  const isBusy = !!busy[u.id];
                  return (
                    <tr key={u.id}>
                      <td>{u.name || "—"}</td>
                      <td className="font-mono text-xs">{u.email || "—"}</td>
                      <td className="font-mono text-xs">{u.id}</td>
                      <td><span className={`badge ${isUAdmin ? "badge-primary" : ""}`}>{u.role || "user"}</span></td>
                      <td className="whitespace-nowrap">{created}</td>
                      <td>
                        <div className="flex gap-2 justify-end">
                          {isUAdmin ? (
                            <button className="btn btn-xs" disabled={isBusy} onClick={() => setRole(u.id, false)}>
                              {isBusy ? "…" : "Quitar admin"}
                            </button>
                          ) : (
                            <button className="btn btn-xs btn-primary" disabled={isBusy} onClick={() => setRole(u.id, true)}>
                              {isBusy ? "…" : "Hacer admin"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center opacity-70 py-6">Sin usuarios.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
