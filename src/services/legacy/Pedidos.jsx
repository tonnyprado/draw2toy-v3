// Pedidos.jsx
import { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs
} from "firebase/firestore";
import { db } from "../../firebase";

export default function Pedido() {
  const { state } = useLocation();
  const orderIdFromState = state?.orderId || null;
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [timeline, setTimeline] = useState([]); // ← ahora viene de la subcolección
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Orden lógico de estados para pintar steps
  const STATUS_ORDER = ["Pagado", "En proceso", "Enviado", "Entregado"];
  const currentStepIndex = useMemo(() => {
    if (!order?.status) return 0;
    const idx = STATUS_ORDER.indexOf(order.status);
    return idx >= 0 ? idx : 0;
  }, [order]);

  useEffect(() => {
    // Limpia estados
    setOrder(null);
    setTimeline([]);
    setErr(null);

    if (!user) {
      setLoading(false);
      return;
    }

    let unsubOrder = null;
    let unsubHistory = null;

    async function attachOrderById(id) {
      // 1) Escucha el pedido
      const ref = doc(db, "orders", id);
      unsubOrder = onSnapshot(
        ref,
        (snap) => {
          if (snap.exists()) {
            setOrder({ id: snap.id, ...snap.data() });
          } else {
            setOrder(null);
          }
          setLoading(false);
        },
        (e) => {
          console.error("[Pedido] onSnapshot(order) error:", e);
          setErr(e);
          setLoading(false);
        }
      );

      // 2) Escucha el timeline en subcolección history ordenado por fecha
      const hq = query(
        collection(db, "orders", id, "history"),
        orderBy("at", "asc")
      );
      unsubHistory = onSnapshot(
        hq,
        (snap) => {
          const list = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
          setTimeline(list);
        },
        (e) => {
          console.error("[Pedido] onSnapshot(history) error:", e);
          // No bloqueamos la pantalla por error en history; solo mostramos vacío
        }
      );
    }

    async function findLastOrderForUser(uid) {
      // Reimplementación local (equivale a getLastOrderForUser)
      // Requiere índice compuesto: userId (asc) + createdAt (desc)
      try {
        setLoading(true);
        const q = query(
          collection(db, "orders"),
          where("userId", "==", uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setOrder(null);
          setTimeline([]);
          setLoading(false);
          return;
        }
        const d = snap.docs[0];
        await attachOrderById(d.id); // ahora conectamos listeners en vivo
      } catch (e) {
        console.error("[Pedido] findLastOrderForUser error:", e);
        setErr(e);
        setLoading(false);
      }
    }

    setLoading(true);
    if (orderIdFromState) {
      // Caso 1: tenemos el id recién creado
      attachOrderById(orderIdFromState);
    } else {
      // Caso 2: no hay id → trae el más reciente del usuario
      findLastOrderForUser(user.uid);
    }

    return () => {
      if (unsubOrder) unsubOrder();
      if (unsubHistory) unsubHistory();
    };
  }, [orderIdFromState, user]);

  // --- Render ---

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert">
          <span>Inicia sesión para ver tus pedidos.</span>
        </div>
        <Link to="/login" className="btn btn-primary mt-4">Ir a iniciar sesión</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto p-6">Cargando…</div>;
  }

  if (err) {
    // Si ves "The query requires an index", crea el índice compuesto:
    // Colección: orders | Campos: userId (asc), createdAt (desc) | Scope: Collection
    const str = String(err);
    const needsIndex = str.includes("requires an index");
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <span>Ocurrió un error al cargar el pedido.</span>
        </div>
        <pre className="mt-3 text-sm opacity-70 whitespace-pre-wrap">{str}</pre>
        {needsIndex && (
          <div className="mt-3 text-sm">
            Crea el índice compuesto para:
            <ul className="list-disc ml-5">
              <li><code>userId</code> — Ascending</li>
              <li><code>createdAt</code> — Descending</li>
            </ul>
            Luego recarga esta página.
          </div>
        )}
        <Link to="/toyreq1" className="btn btn-primary mt-4">Ir a Solicitud</Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert">
          <span>No encontramos pedidos. Crea uno desde la sección de Solicitud.</span>
        </div>
        <Link to="/toyreq1" className="btn btn-primary mt-4">Ir a Solicitud</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Mi pedido</h1>
      <div className="mt-2">
        <div className="badge badge-outline">ID: {order.id}</div>
      </div>

      {/* Steps visual */}
      <div className="mt-6">
        <ul className="steps">
          {STATUS_ORDER.map((s, i) => (
            <li
              key={s}
              className={`step ${i <= currentStepIndex ? "step-primary" : ""}`}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Detalle de eventos (de la subcolección) */}
      <div className="mt-6 card bg-base-100 shadow-sm border">
        <div className="card-body">
          <h2 className="card-title">Timeline</h2>
          {timeline.length === 0 ? (
            <div className="text-sm opacity-70">Sin eventos registrados.</div>
          ) : (
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              {timeline.map((ev, idx) => {
                const dateStr =
                  ev.at?.toDate ? ev.at.toDate().toLocaleString() : "—";
                return (
                  <li key={ev.id || idx}>
                    <div className="timeline-middle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9V5a1 1 0 112 0v4a1 1 0 01-2 0zm1 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                      </svg>
                    </div>
                    <div className={`timeline-${idx % 2 === 0 ? "start" : "end"} mb-10`}>
                      <time className="font-mono italic">{dateStr}</time>
                      <div className="text-lg font-bold">{ev.status}</div>
                      {ev.note && (
                        <div className="opacity-70 text-sm">{ev.note}</div>
                      )}
                    </div>
                    <hr />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-base-100 border">
          <div className="card-body">
            <div className="text-sm opacity-70">Estado actual</div>
            <div className="text-xl font-bold">{order.status || "—"}</div>
          </div>
        </div>
        <div className="card bg-base-100 border">
          <div className="card-body">
            <div className="text-sm opacity-70">Total</div>
            <div className="text-xl font-bold">${Number(order.total || 0)}</div>
          </div>
        </div>
        <div className="card bg-base-100 border">
          <div className="card-body">
            <div className="text-sm opacity-70">Piezas</div>
            <div className="text-xl font-bold">{order.items?.length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
