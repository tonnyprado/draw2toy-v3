import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../orderService";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation();

  const items = state?.items || state?.peluches || [];
  const passedTotal = state?.total ?? 0;

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.price || 0), 0),
    [items]
  );
  const total = passedTotal || subtotal;

  // UI state (modal + loading)
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const handlePay = async (method) => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Preparar modal de proceso
    setModalMsg(`Creando pedido con ${method}…`);
    setModalOpen(true);
    setLoading(true);

    try {
      // Limpiar items para Firestore (nada de undefined / objetos raros)
      const cleanItems = items.map((it) => ({
        size: it?.size ?? null,
        price: Number(it?.price ?? 0),
        imageUrl: it?.imageUrl ?? null, // NO subir File/Blob al doc
      }));

      console.log("[Checkout] creando pedido…");
      const orderId = await createOrder({
        userId: user.uid,
        items: cleanItems,
        total,
        paymentMethod: method,
      });
      console.log("[Checkout] pedido creado:", orderId);

      // Feedback corto y navegación
      setModalMsg("Pedido creado. Redirigiendo…");
      // Cierra el modal antes de navegar para evitar que tape la nueva ruta
      setModalOpen(false);
      navigate("/pedido", { state: { orderId } });
    } catch (err) {
      console.error("[Checkout] createOrder failed:", err);
      setModalMsg("No pudimos crear el pedido. Intenta de nuevo.");
      // Mantén el modal abierto; habilita el botón Close para que el usuario lo cierre
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
        <Link className="btn btn-primary mt-4" to="/solicitud">
          Volver a Solicitud
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                disabled={loading} // no cerrar a mitad del proceso
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Lista de items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((it, idx) => (
            <div key={it.id || idx} className="card bg-base-100 shadow-sm border">
              <div className="card-body flex flex-row gap-4 items-center">
                <div className="w-24 h-24 bg-base-200 rounded-box overflow-hidden flex items-center justify-center">
                  {it.imageUrl || it.file ? (
                    <img
                      alt={`Peluche ${idx + 1}`}
                      className="max-h-24 object-contain"
                      src={it.imageUrl || URL.createObjectURL(it.file)}
                    />
                  ) : (
                    <span className="text-xs opacity-60">Sin imagen</span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">Peluche {idx + 1}</p>
                  <p className="text-sm opacity-70">Tamaño: {it.size ?? "—"}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">${Number(it.price || 0)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Columna derecha: Resumen */}
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

              <div className="mt-4 space-y-2">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => handlePay("Tarjeta")}
                  disabled={loading}
                >
                  {loading ? "Procesando…" : "Pagar con Tarjeta"}
                </button>
                <button
                  className="btn btn-secondary w-full"
                  onClick={() => handlePay("MercadoPago")}
                  disabled={loading}
                >
                  {loading ? "Procesando…" : "Pagar con MercadoPago"}
                </button>
                <button
                  className="btn btn-accent w-full"
                  onClick={() => handlePay("Pago en tienda (QR)")}
                  disabled={loading}
                >
                  {loading ? "Procesando…" : "Pago en tienda (QR)"}
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
