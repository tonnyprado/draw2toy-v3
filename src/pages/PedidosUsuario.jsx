import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

const CURRENT = new Set(["Pagado", "En proceso", "Enviado"]);
const PAST = new Set(["Entregado"]);

export default function PedidosUsuario() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!user) { setOrders([]); setLoading(false); return; }
    setLoading(true); setErr(null);

    // Requiere índice: userId asc + createdAt desc (ya lo creaste)
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setOrders(list); setLoading(false);
    }, (e) => { console.error("[PedidosUsuario]", e); setErr(e); setLoading(false); });

    return () => unsub();
  }, [user]);

  const { current, past } = useMemo(() => {
    const cur = [], pas = [];
    for (const o of orders) {
      if (CURRENT.has(o.status)) cur.push(o);
      else if (PAST.has(o.status)) pas.push(o);
      else cur.push(o);
    }
    return { current: cur, past: pas };
  }, [orders]);

  if (!user) return (
    <div className="container mx-auto p-6">
      <div className="alert">Inicia sesión para ver tus pedidos.</div>
      <Link to="/login" className="btn btn-primary mt-4">Ir a iniciar sesión</Link>
    </div>
  );

  if (loading) return (
    <div className="container mx-auto p-6">
      <span className="loading loading-spinner loading-lg" />
      <p className="mt-2">Cargando tus pedidos…</p>
    </div>
  );

  if (err) return (
    <div className="container mx-auto p-6">
      <div className="alert alert-error">Ocurrió un error al cargar tus pedidos.</div>
      <pre className="mt-3 text-sm opacity-70 whitespace-pre-wrap">{String(err)}</pre>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Estado de pedidos</h1>
        <p className="opacity-70 mt-1">Recientes primero</p>
      </header>

      <Section title="Actuales" empty="No tienes pedidos actuales.">
        {current.map(o => <OrderCard key={o.id} order={o} />)}
      </Section>

      <Section title="Pasados" empty="Aún no hay pedidos entregados.">
        {past.map(o => <OrderCard key={o.id} order={o} />)}
      </Section>
    </div>
  );
}

function Section({ title, empty, children }) {
  const has = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {has ? <div className="space-y-3">{children}</div> : <div className="text-sm opacity-70">{empty}</div>}
    </section>
  );
}

function OrderCard({ order }) {
  const created = order.createdAt?.toDate?.() ? order.createdAt.toDate().toLocaleString() : "—";
  const total = Number(order.total || 0);
  return (
    <div className="card bg-base-100 shadow-sm border">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Pedido #{order.id.slice(-6).toUpperCase()}</p>
            <p className="text-sm opacity-70">Estado: <span className="font-medium">{order.status || "—"}</span></p>
          </div>
          <div className="text-right">
            <p className="font-bold">${total}</p>
            <p className="text-xs opacity-60">{created}</p>
          </div>
        </div>
        <div className="mt-2">
          {(order.items || []).slice(0, 3).map((it, idx) => (
            <div key={idx} className="text-sm opacity-80">• {it.size ?? "—"} — ${Number(it.price || 0)}</div>
          ))}
          {(order.items || []).length > 3 && (
            <div className="text-xs opacity-50 mt-1">+{(order.items || []).length - 3} más…</div>
          )}
        </div>
        <div className="mt-3">
          <Link className="btn btn-outline btn-sm" to={`/pedido/${order.id}`}>Ver detalle</Link>
        </div>
      </div>
    </div>
  );
}
