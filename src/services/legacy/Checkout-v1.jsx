// src/pages/Checkout.jsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import { createPendingOrder } from "../../services/orderService";

import ShippingForm from "../../components/ShippingForm";
import { emptyShipping, validateShipping } from "../../services/shippingService";

import ComicPage from "../../design/comic/layouts/ComicPage";
import { Panel, ComicButton } from "../../design/comic/system";

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
    Number(it.price ?? computePerUnit(it) * Math.max(1, Number(it.qty) || 1));

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
    // ✅ Por ahora exige sesión
    if (!user) {
      alert("Inicia sesión para completar el pago.");
      navigate("/login");
      return;
    }

    // Valida envío ANTES de abrir modal
    const { ok, errors, data } = validateShipping(shipping);
    if (!ok) {
      setShipErrors(errors);
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
        shipping: data,    // dirección validada
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
      <ComicPage title="Checkout" subtitle="No hay artículos en tu carrito." halftone>
        <Panel className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm opacity-80">
              Sube dibujos y vuelve para completar tu pedido.
            </div>
            <ComicButton as={Link} to="/toyreq1">Volver a Solicitud</ComicButton>
          </div>
        </Panel>
      </ComicPage>
    );
  }

  return (
    <ComicPage
      title="Checkout"
      subtitle={isGuest ? "Completa los datos para continuar." : "Revisa tu pedido y completa el envío."}
      halftone
      actions={<ComicButton as={Link} to="/toyreq1" className="text-sm">Volver</ComicButton>}
    >
      {/* ===== Modal estilo cómic ===== */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#1B1A1F]/70 grid place-items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="panel bg-white text-[#1B1A1F] w-full max-w-md p-5"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 180, damping: 16 } }}
              exit={{ scale: 0.96, opacity: 0 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-black uppercase">Procesando</div>
                  <div className="mt-1 text-sm opacity-80">{modalMsg}</div>
                </div>
                <div aria-hidden className="ml-2">
                  {loading ? <span className="loading loading-spinner loading-md" /> : null}
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <ComicButton onClick={() => setModalOpen(false)} disabled={loading}>
                  Cerrar
                </ComicButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Columna izquierda: items ===== */}
        <Panel className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-5 sm:p-6">
            <h2 className="text-2xl font-black uppercase">Tu pedido</h2>

            <ul className="mt-4 divide-y divide-[#1B1A1F]/10">
              {items.map((it, idx) => {
                const qty = Math.max(1, Number(it.qty) || 1);
                const unitPrice = computePerUnit(it);
                const lineTotal = computeLineTotal(it);
                const base = PRICE[it.size] || 0;
                const acc = (Number(it.accessories) || 0) * EXTRA_COST.accessory;

                return (
                  <li key={it.id || idx} className="py-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-lg bg-[#F7F1FF] overflow-hidden grid place-items-center border-2 border-[#1B1A1F]">
                        {previews[idx] ? (
                          <img
                            alt={`Peluche ${idx + 1}`}
                            className="object-cover w-full h-full"
                            src={previews[idx]}
                          />
                        ) : (
                          <div className="skeleton w-full h-full" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold truncate uppercase">Peluche #{idx + 1}</div>
                        <div className="text-xs opacity-80">Tamaño: {it.size} · Cantidad: {qty}</div>

                        <div className="mt-2 text-xs opacity-80 space-y-0.5">
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
                      <div className="text-lg font-extrabold">${lineTotal}</div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex flex-wrap gap-2 items-center text-xs">
              <span className="badge">S: {countBySize.S}</span>
              <span className="badge">M: {countBySize.M}</span>
              <span className="badge">L: {countBySize.L}</span>
              <span className="badge badge-ghost">Rush x {extrasSummary.rush}</span>
              <span className="badge badge-ghost">Bordado x {extrasSummary.emb}</span>
              <span className="badge badge-ghost">Accesorios x {extrasSummary.acc}</span>
            </div>

            {notes && (
              <div className="panel mt-4 p-3 bg-[#FFF7EC] border-[#1B1A1F]">
                <span className="text-sm">
                  <b>Notas:</b> {notes}
                </span>
              </div>
            )}
          </div>
        </Panel>

        {/* ===== Columna derecha: Envío + Resumen + Pago ===== */}
        <div className="space-y-6">
          <Panel id="shipping-card" className="p-5">
            <h2 className="text-xl font-black uppercase">Dirección de envío</h2>
            <div className="mt-3">
              <ShippingForm value={shipping} onChange={setShipping} errors={shipErrors} />
            </div>
          </Panel>

          <Panel className="p-5">
            <h2 className="text-xl font-black uppercase">Resumen</h2>

            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="border-t border-[#1B1A1F]/10 my-2" />
              <div className="flex justify-between text-lg font-black">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <ComicButton
                className="w-full justify-center"
                onClick={() => handlePay("Tarjeta")}
                disabled={loading}
              >
                {loading ? "Procesando…" : "Pagar con Tarjeta"}
              </ComicButton>

              <ComicButton
                variant="ghost"
                className="w-full justify-center"
                onClick={() => alert("Mercado Pago estará disponible pronto.")}
                disabled={loading}
              >
                Mercado Pago (próximamente)
              </ComicButton>

              <ComicButton
                className="w-full justify-center"
                onClick={() => handlePay("Pago en tienda (QR)")}
                disabled={loading}
              >
                {loading ? "Procesando…" : "Pagar en OXXO"}
              </ComicButton>
            </div>

            <Link to="/toyreq1" className="underline block text-center mt-3 text-sm">
              Seguir editando
            </Link>
          </Panel>
        </div>
      </div>
    </ComicPage>
  );
}
