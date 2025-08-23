// src/pages/Checkout.jsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createPendingOrder } from "../orderService";

import ShippingForm from "../../components/ShippingForm";
import { emptyShipping, validateShipping } from "../shippingService";

// 💵 mismas tarifas
const PRICE = { S: 300, M: 500, L: 700 };
const EXTRA_COST = { rush: 200, embroidery: 120, accessory: 150 };

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation();

  // ----- Datos de invitado/usuario
  const initialGuestEmail = state?.guestEmail || localStorage.getItem("guestEmail") || "";
  const isGuest = !user;

  // ----- Items y totales
  const items = state?.items || state?.peluches || [];
  const notes = state?.notes || "";
  const passedTotal = state?.total ?? 0;

  const computePerUnit = (it) => {
    const base = PRICE[it.size] || 0;
    const rush = it.rush ? EXTRA_COST.rush : 0;
    const emb = it.embroidery?.trim() ? EXTRA_COST.embroidery : 0;
    const acc = (Number(it.accessories) || 0) * EXTRA_COST.accessory;
    return base + rush + emb + acc;
  };
  const computeLineTotal = (it) =>
    Number(it.price ?? (computePerUnit(it) * Math.max(1, Number(it.qty) || 1)));

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + computeLineTotal(it), 0),
    [items]
  );
  const total = passedTotal || subtotal;

  // ----- UI state (modal + loading)
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  // ----- Envío (prefill con user/guest)
  const [shipping, setShipping] = useState(() => emptyShipping(user, initialGuestEmail));
  const [shipErrors, setShipErrors] = useState({});

  // Guard: si no hay items (recarga), vuelve a la solicitud
  useEffect(() => {
    if (!items.length) navigate("/toyreq1", { replace: true });
  }, [items, navigate]);

  // Previews seguros (revoke al desmontar)
  const previews = useMemo(() => {
    return items.map((it) => {
      try {
        if (it.imageUrl) return it.imageUrl;
        if (it.file) return URL.createObjectURL(it.file);
        return null;
      } catch {
        return null;
      }
    });
  }, [items]);
  useEffect(() => {
    return () => {
      previews.forEach((url) => url?.startsWith("blob:") && URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Resúmenes
  const countBySize = useMemo(() => {
    const acc = { S: 0, M: 0, L: 0 };
    items.forEach((it) => {
      const q = Math.max(1, Number(it.qty) || 1);
      acc[it.size || "S"] += q;
    });
    return acc;
  }, [items]);
  const extrasSummary = useMemo(() => {
    let rush = 0, emb = 0, acc = 0;
    items.forEach((it) => {
      const q = Math.max(1, Number(it.qty) || 1);
      if (it.rush) rush += q;
      if (it.embroidery?.trim()) emb += q;
      acc += (Number(it.accessories) || 0) * q;
    });
    return { rush, emb, acc };
  }, [items]);

  const handlePay = async (uiMethod) => {
    // ✅ Por ahora exige sesión (como acordamos). TODO: permitir pago invitado más adelante.
    if (!user) {
      alert("Inicia sesión para completar el pago.");
      navigate("/login");
      return;
    }

    // Valida envío ANTES de abrir modal
    const { ok, errors, data } = validateShipping(shipping);
    if (!ok) {
      setShipErrors(errors);
      // enfoque suave al formulario
      document.getElementById("shipping-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setShipErrors({});

    const method =
      uiMethod === "Pago en tienda (QR)" ? "oxxo"
      : uiMethod === "Tarjeta" ? "card"
      : "card";

    setModalMsg(`Creando pedido…`);
    setModalOpen(true);
    setLoading(true);

    try {
      const normalizedItems = items.map((it) => {
        const qty = Math.max(1, Number(it.qty) || 1);
        const unitPrice = computePerUnit(it);
        const lineTotal = computeLineTotal(it);
        return {
          size: it.size ?? null,
          qty,
          rush: !!it.rush,
          embroidery: it.embroidery?.trim() || "",
          accessories: Number(it.accessories) || 0,
          unitPrice,
          lineTotal,
          imageUrl: it.imageUrl ?? null,
        };
      });

      const orderId = await createPendingOrder({
        userId: user.uid,
        items: normalizedItems,
        total,
        email: user.email, // invitado vendrá después (TODO)
        method,            // "card" | "oxxo"
        shipping: data,    // 👈 dirección validada
        notes,
      });

      setModalMsg("Pedido creado. Redirigiendo al pago…");
      setModalOpen(false);
      navigate(`/pagar/${orderId}`);
    } catch (err) {
      console.error("[Checkout] createPendingOrder failed:", err);
      setModalMsg("No pudimos crear el pedido. Intenta de nuevo.");
      // el modal se queda para que cierre la persona
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-warning">
          <span>No hay artículos en tu carrito.</span>
        </div>
        <Link className="btn btn-primary mt-4" to="/toyreq1">
          Volver a Solicitud
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Modal controlado */}
      {modalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Procesando</h3>
            <p className="py-4">{modalMsg}</p>
            {loading && <span className="loading loading-spinner loading-md" />}
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setModalOpen(false)}
                disabled={loading}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <Link to="/toyreq1" className="btn btn-ghost">Volver</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: items */}
        <div className="lg:col-span-2 card bg-base-100 shadow-sm border">
          <div className="card-body">
            <h2 className="card-title">Tu pedido</h2>
            <ul className="divide-y divide-base-300/60">
              {items.map((it, idx) => {
                const qty = Math.max(1, Number(it.qty) || 1);
                const unitPrice = computePerUnit(it);
                const lineTotal = computeLineTotal(it);
                const base = PRICE[it.size] || 0;
                const rush = it.rush ? EXTRA_COST.rush : 0;
                const emb = it.embroidery?.trim() ? EXTRA_COST.embroidery : 0;
                const acc = (Number(it.accessories) || 0) * EXTRA_COST.accessory;

                return (
                  <li key={it.id || idx} className="py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-lg bg-base-200 overflow-hidden">
                          {previews[idx] ? (
                            <img alt={`Peluche ${idx + 1}`} className="object-cover w-full h-full" src={previews[idx]} />
                          ) : (
                            <div className="skeleton w-full h-full" />
                          )}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">Peluche #{idx + 1}</div>
                        <div className="text-sm opacity-80">Tamaño: {it.size} · Cantidad: {qty}</div>

                        <div className="mt-1 text-xs opacity-70 space-y-0.5">
                          <div>Base ({it.size}): ${base}</div>
                          {it.rush && <div>Rush: +${EXTRA_COST.rush}</div>}
                          {!!(it.embroidery?.trim()) && <div>Bordado: +${EXTRA_COST.embroidery}</div>}
                          {!!(Number(it.accessories) || 0) && <div>Accesorios ({it.accessories}): +${acc}</div>}
                          <div className="mt-1">Precio por unidad: <b>${unitPrice}</b></div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs opacity-70">Total renglón</div>
                      <div className="text-lg font-semibold">${lineTotal}</div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex flex-wrap gap-2 items-center text-sm">
              <span className="badge">S: {countBySize.S}</span>
              <span className="badge">M: {countBySize.M}</span>
              <span className="badge">L: {countBySize.L}</span>
              <span className="badge badge-ghost">Rush x {extrasSummary.rush}</span>
              <span className="badge badge-ghost">Bordado x {extrasSummary.emb}</span>
              <span className="badge badge-ghost">Accesorios x {extrasSummary.acc}</span>
            </div>

            {notes && (
              <div className="alert mt-4">
                <span><b>Notas:</b> {notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha: Envío + Resumen + Pago */}
        <div className="lg:col-span-1 space-y-6">
          <div id="shipping-card" className="card bg-base-100 shadow-sm border">
            <div className="card-body">
              <h2 className="card-title">Dirección de envío</h2>
              <ShippingForm value={shipping} onChange={setShipping} errors={shipErrors} />
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border">
            <div className="card-body">
              <h2 className="card-title">Resumen</h2>

              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>

              <div className="divider my-2"></div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total}</span>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => handlePay("Tarjeta")}
                  disabled={loading}
                >
                  {loading ? "Procesando…" : "Pagar con Tarjeta"}
                </button>

                <button
                  className="btn w-full"
                  onClick={() => alert("Mercado Pago estará disponible pronto.")}
                  disabled={loading}
                >
                  Mercado Pago (próximamente)
                </button>

                <button
                  className="btn btn-accent w-full"
                  onClick={() => handlePay("Pago en tienda (QR)")}
                  disabled={loading}
                >
                  {loading ? "Procesando…" : "Pagar en OXXO"}
                </button>
              </div>

              <Link to="/toyreq1" className="btn btn-ghost w-full mt-2" aria-disabled={loading}>
                Seguir editando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
