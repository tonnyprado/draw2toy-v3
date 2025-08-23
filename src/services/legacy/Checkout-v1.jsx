// src/pages/Checkout.jsx (o tu ruta actual)
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createOrder, createPendingOrder } from "../orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation();

  // ----- Datos de invitado/usuario
  const initialGuestEmail = state?.guestEmail || localStorage.getItem("guestEmail") || "";
  const isGuest = !user;

  // ----- Items y totales (compat con state.items o state.peluches)
  const items = state?.items || state?.peluches || [];
  const passedTotal = state?.total ?? 0;

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.price || 0), 0),
    [items]
  );
  const total = passedTotal || subtotal;

  // ----- UI state (modal + loading)
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  // ----- Correo mostrable (si hay user, usa su email; si no, invitado)
  const [email, setEmail] = useState(() => (user?.email ? user.email : initialGuestEmail));

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
      // revoca sólo blobs creados aquí (no URLs remotas)
      previews.forEach((url) => {
        if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  // Mini-resumen por tallas
  const countBySize = useMemo(() => {
    const acc = { S: 0, M: 0, L: 0 };
    items.forEach((it) => acc[it.size || "S"]++);
    return acc;
  }, [items]);

  const handlePay = async (uiMethod) => {
    // ✅ Requiere sesión para Stripe (Callable Functions)
    if (!user) {
        alert("Inicia sesión para completar el pago.");
        navigate("/login");
        return;
    }

    // Normaliza el método a lo que usará el backend (Stripe)
    // - "Tarjeta"  -> "card"
    // - "Pago en tienda (QR)" -> "oxxo"  (renombra el botón a "Pagar en OXXO" idealmente)
    // - "MercadoPago" -> por ahora lo tratamos como tarjeta o lo deshabilitamos
    const method =
        uiMethod === "Pago en tienda (QR)" ? "oxxo"
        : uiMethod === "Tarjeta" ? "card"
        : "card"; // fallback mientras no integramos MP

    // Modal de proceso
    setModalMsg(`Creando pedido…`);
    setModalOpen(true);
    setLoading(true);

    try {
        // No subas File/Blob al doc
        const cleanItems = items.map((it) => ({
            size: it?.size ?? null,
            price: Number(it?.price ?? 0),
            imageUrl: it?.imageUrl ?? null,
        }));

        // 🧠 Ahora la orden se crea como "Pendiente de pago" (o "Voucher generado" si oxxo)
        const orderId = await createPendingOrder({
            userId: user.uid,
            items: cleanItems,
            total,
            email: user.email,
            method, // "card" | "oxxo"
        });

        setModalMsg("Pedido creado. Redirigiendo al pago…");
        setModalOpen(false);

        // 🚀 Ir a la página de Stripe Elements
        navigate(`/pagar/${orderId}`);
    } catch (err) {
        console.error("[Checkout] createPendingOrder failed:", err);
        setModalMsg("No pudimos crear el pedido. Intenta de nuevo.");
        // El modal queda abierto para que el usuario cierre
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
        {/* Columna izquierda: mini-lista del pedido */}
        <div className="lg:col-span-2 card bg-base-100 shadow-sm border">
          <div className="card-body">
            <h2 className="card-title">Tu pedido</h2>
            <ul className="divide-y divide-base-300/60">
              {items.map((it, idx) => (
                <li key={it.id || idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-lg bg-base-200 overflow-hidden">
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
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">Peluche #{idx + 1}</div>
                      <div className="text-sm opacity-70">Tamaño: {it.size ?? "—"}</div>
                    </div>
                  </div>
                  <div className="font-semibold shrink-0">${Number(it.price || 0)}</div>
                </li>
              ))}
            </ul>

            {/* Mini-resumen por tallas */}
            <div className="mt-4 flex flex-wrap gap-2 opacity-80 text-sm">
              <span className="badge">S: {countBySize.S}</span>
              <span className="badge">M: {countBySize.M}</span>
              <span className="badge">L: {countBySize.L}</span>
            </div>
          </div>
        </div>

        {/* Columna derecha: Resumen + correo + métodos */}
        <div className="lg:col-span-1">
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

              {/* Correo (sólo si invitado) */}
              {isGuest ? (
                <div className="form-control mt-3">
                  <label className="label"><span className="label-text">Correo para tu pedido</span></label>
                  <input
                    type="email"
                    className="input input-bordered"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt opacity-70">
                      Usaremos este correo para avances y confirmaciones.
                    </span>
                  </label>
                </div>
              ) : (
                <div className="alert mt-3">
                  <span>Se confirmará con: <b>{email}</b></span>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <button
                    className="btn btn-primary w-full"
                    onClick={() => handlePay("Tarjeta")}
                    disabled={loading}
                >
                    {loading ? "Procesando…" : "Pagar con Tarjeta"}
                </button>

                {/* Deshabilitado por ahora o mapea a tarjeta */}
                <button
                    className="btn w-full"
                    onClick={() => alert("Mercado Pago estará disponible pronto.")}
                    disabled={loading}
                >
                    Mercado Pago (próximamente)
                </button>

                <button
                    className="btn btn-accent w-full"
                    onClick={() => handlePay("Pago en tienda (QR)")} // se normaliza a "oxxo"
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
