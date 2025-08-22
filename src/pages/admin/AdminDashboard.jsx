// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { addOrderEvent } from "../../services/orderService";

const PAGE_LIMIT = 50; // trae los 50 más recientes en tiempo real

const STATUS_OPTIONS = ["Todos", "Pagado", "En proceso", "Enviado", "Entregado", "Cancelado"];

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const isAdmin = (profile?.role === "admin"); // Guard UI (las reglas ya protegen el backend)

  const [orders, setOrders] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [err, setErr] = useState(null);

  // UI state
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [search, setSearch] = useState(""); // busca por fragmento de id o userId
  const [processing, setProcessing] = useState({}); // { [orderId]: boolean }

  useEffect(() => {
    if (!isAdmin) { setOrders([]); setLoadingList(false); return; }

    setLoadingList(true);
    setErr(null);

    // No metemos where(status) para evitar pedir un índice nuevo.
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc"),
      limit(PAGE_LIMIT)
    );

    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(rows);
      setLoadingList(false);
    }, (e) => {
      console.error("[AdminDashboard] onSnapshot error:", e);
      setErr(e);
      setLoadingList(false);
    });

    return () => unsub();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    let rows = orders;

    if (statusFilter !== "Todos") {
      rows = rows.filter(o => o.status === statusFilter);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(o => {
        const idFrag = (o.id || "").toLowerCase();
        const uid = (o.userId || "").toLowerCase();
        return idFrag.includes(q) || uid.includes(q);
      });
    }

    return rows;
  }, [orders, statusFilter, search]);

  const setStatus = async (orderId, status) => {
    const note = window.prompt("Nota (opcional) para este cambio de estado:") || null;
    try {
      setProcessing(p => ({ ...p, [orderId]: true }));
      await addOrderEvent(orderId, { status, note });
    } catch (e) {
      console.error("[AdminDashboard] setStatus error:", e);
      window.alert("No se pudo actualizar el estado. Revisa la consola.");
    } finally {
      setProcessing(p => ({ ...p, [orderId]: false }));
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-warning">Debes iniciar sesión.</div>
        <Link to="/login" className="btn btn-primary mt-4">Ir a iniciar sesión</Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">No autorizado.</div>
        <p className="opacity-70 mt-2">Esta sección es solo para administradores.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      <p className="mt-1">
        Hola <b>{profile?.name || user?.displayName || user?.email}</b>.
      </p>

      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="form-control">
          <label className="label"><span className="label-text">Filtrar por estado</span></label>
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-control md:col-span-2">
          <label className="label"><span className="label-text">Buscar (ID o userId)</span></label>
          <input
            className="input input-bordered"
            placeholder="Ej. 3F9A12 o UID del usuario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="alert alert-info mt-2">
        <span>Mostrando los {PAGE_LIMIT} pedidos más recientes (tiempo real). Usa el filtro/búsqueda para acotar.</span>
      </div>

      {err && (
        <div className="alert alert-error mt-2">
          <span>Ocurrió un error al cargar pedidos.</span>
          <pre className="mt-2 text-xs opacity-70 whitespace-pre-wrap">{String(err)}</pre>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Creado</th>
              <th>Pedido</th>
              <th>Usuario</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr><td colSpan={7}>Cargando…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="opacity-70">Sin pedidos.</td></tr>
            ) : (
              filtered.map((o) => {
                const created = o.createdAt?.toDate?.() ? o.createdAt.toDate().toLocaleString() : "—";
                const busy = !!processing[o.id];
                return (
                  <tr key={o.id}>
                    <td className="whitespace-nowrap">{created}</td>
                    <td className="font-mono">{o.id.slice(0,8)}…</td>
                    <td className="font-mono text-xs opacity-80">{o.userId || "-"}</td>
                    <td>{o.items?.length || 0}</td>
                    <td>${Number(o.total || 0)}</td>
                    <td><span className="badge">{o.status || "—"}</span></td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button className="btn btn-xs" disabled={busy} onClick={() => setStatus(o.id, "En proceso")}>
                          {busy ? "…" : "En proceso"}
                        </button>
                        <button className="btn btn-xs btn-primary" disabled={busy} onClick={() => setStatus(o.id, "Enviado")}>
                          {busy ? "…" : "Enviado"}
                        </button>
                        <button className="btn btn-xs btn-success" disabled={busy} onClick={() => setStatus(o.id, "Entregado")}>
                          {busy ? "…" : "Entregado"}
                        </button>
                        <button className="btn btn-xs btn-error" disabled={busy} onClick={() => setStatus(o.id, "Cancelado")}>
                          {busy ? "…" : "Cancelar"}
                        </button>
                        <Link className="btn btn-outline btn-xs" to={`/pedido/${o.id}`}>Ver</Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Link to="/toyreq1" className="btn btn-ghost">Probar flujo de cliente</Link>
      </div>
    </div>
  );
}
