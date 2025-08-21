// src/pages/Checkout.jsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const items = state?.items || state?.peluches || []; // compat con nombres anteriores
  const passedTotal = state?.total ?? 0;

  // Si quieres recalcular por seguridad (en lugar de confiar en lo que vino)
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0), 0),
    [items]
  );
  const total = passedTotal || subtotal;

  const handlePay = (method) => {
    // Aquí luego integrarás la API real (Stripe, MercadoPago, etc.)
    alert(`Pago simulado con ${method}. Redirigiendo a "Mi pedido"...`);
    // Puedes enviar info de la orden para que Pedido la muestre
    navigate("/pedido", {
      state: {
        orderMock: {
          status: "Pagado",
          total,
          items: items.map((it) => ({
            size: it.size,
            price: it.price,
            // Solo para demo; si tienes URL en storage úsala:
            preview: it.imageUrl || (it.file ? URL.createObjectURL(it.file) : null),
          })),
        },
      },
    });
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
                      alt="prev"
                      className="max-h-24 object-contain"
                      src={it.imageUrl || URL.createObjectURL(it.file)}
                    />
                  ) : (
                    <span className="text-xs opacity-60">Sin imagen</span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">Peluche {idx + 1}</p>
                  <p className="text-sm opacity-70">Tamaño: {it.size}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">${it.price}</p>
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

              {/* Si quisieras impuestos/envío, agrégalo aquí */}
              {/* <div className="flex justify-between text-sm">
                <span>Envío</span>
                <span>$0</span>
              </div> */}

              <div className="divider my-2"></div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total}</span>
              </div>

              <div className="mt-4 space-y-2">
                <button className="btn btn-primary w-full" onClick={() => handlePay("Tarjeta")}>
                  Pagar con Tarjeta
                </button>
                <button className="btn btn-secondary w-full" onClick={() => handlePay("MercadoPago")}>
                  Pagar con MercadoPago
                </button>
                <button className="btn btn-accent w-full" onClick={() => handlePay("Pago en tienda (QR)")}>
                  Pago en tienda (QR)
                </button>
              </div>

              <Link to="/toyreq1" className="btn btn-ghost w-full mt-2">
                Seguir editando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
