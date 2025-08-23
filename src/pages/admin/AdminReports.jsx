import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import AdminShell from "./AdminShell";

const PAGE = 200; // últimos 200 pedidos (suficiente para KPIs rápidos)

export default function AdminReports() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!isAdmin) { setRows([]); setLoading(false); return; }
    setLoading(true); setErr(null);
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(PAGE));
    const unsub = onSnapshot(q, (snap) => {
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (e) => { setErr(e); setLoading(false); });
    return () => unsub();
  }, [isAdmin]);

  const kpi = useMemo(() => {
    const total = rows.length;
    const revenue = rows.reduce((s, r) => s + Number(r.total || 0), 0);
    const byStatus = rows.reduce((m, r) => (m[r.status || "—"] = (m[r.status || "—"] || 0) + 1, m), {});
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const last24 = rows.filter(r => r.createdAt?.toDate?.() && r.createdAt.toDate().getTime() >= cutoff);
    const rev24 = last24.reduce((s, r) => s + Number(r.total || 0), 0);
    const avgTicket = total ? revenue / total : 0;
    return { total, revenue, byStatus, last24: last24.length, rev24, avgTicket };
  }, [rows]);

  if (!user) return <AdminShell><div className="alert alert-warning">Debes iniciar sesión.</div></AdminShell>;
  if (!isAdmin) return <AdminShell><div className="alert alert-error">No autorizado.</div></AdminShell>;

  return (
    <AdminShell>
      {loading ? (
        <div className="flex items-center gap-2"><span className="loading loading-spinner loading-md" /><span>Cargando KPIs…</span></div>
      ) : err ? (
        <div className="alert alert-error">Error: {String(err)}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard title="Pedidos (últimos 200)" value={kpi.total} />
            <KpiCard title="Ingresos estimados" value={`$${kpi.revenue.toFixed(2)}`} />
            <KpiCard title="Ticket promedio" value={`$${kpi.avgTicket.toFixed(2)}`} />
            <KpiCard title="Pedidos 24h" value={kpi.last24} />
            <KpiCard title="Ingresos 24h" value={`$${kpi.rev24.toFixed(2)}`} />
            <KpiCard title="Entregados" value={kpi.byStatus["Entregado"] || 0} />
          </div>

          <div className="mt-6 card bg-base-100 border">
            <div className="card-body">
              <h2 className="card-title">Pedidos recientes</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead><tr><th>Creado</th><th>Pedido</th><th>Usuario</th><th>Total</th><th>Estado</th></tr></thead>
                  <tbody>
                    {rows.slice(0, 20).map(o => {
                      const created = o.createdAt?.toDate?.() ? o.createdAt.toDate().toLocaleString() : "—";
                      return (
                        <tr key={o.id}>
                          <td className="whitespace-nowrap">{created}</td>
                          <td>#{o.id.slice(-6).toUpperCase()}</td>
                          <td className="font-mono text-xs opacity-80">{o.userId}</td>
                          <td>${Number(o.total || 0)}</td>
                          <td>{o.status || "—"}</td>
                        </tr>
                      );
                    })}
                    {rows.length === 0 && <tr><td colSpan={5} className="opacity-70">Sin pedidos.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function KpiCard({ title, value }) {
  return (
    <div className="card bg-base-100 border">
      <div className="card-body">
        <div className="text-sm opacity-70">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
