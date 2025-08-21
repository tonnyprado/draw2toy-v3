// src/pages/Pedido.jsx
import { useLocation, Link } from "react-router-dom";

export default function Pedido() {
  const { state } = useLocation();
  const order = state?.orderMock;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Mi pedido</h1>

      {!order ? (
        <>
          <div className="alert">
            <span>No hay información de pedido. Realiza un checkout primero.</span>
          </div>
          <Link className="btn btn-primary mt-4" to="/toyreq1">
            Ir a Solicitud
          </Link>
        </>
      ) : (
        <div className="card bg-base-100 shadow-sm border">
          <div className="card-body">
            <p><b>Estado:</b> {order.status}</p>
            <p><b>Total:</b> ${order.total}</p>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {order.items.map((it, i) => (
                <div key={i} className="border rounded-box p-2 bg-base-200">
                  {it.preview ? (
                    <img src={it.preview} alt="" className="h-24 object-contain mx-auto" />
                  ) : (
                    <div className="h-24 flex items-center justify-center text-xs opacity-60">
                      Sin imagen
                    </div>
                  )}
                  <div className="text-xs mt-2">
                    <div>Tamaño: <b>{it.size}</b></div>
                    <div>Precio: <b>${it.price}</b></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <div className="w-full bg-base-200 h-3 rounded">
                {/* barra de progreso simple */}
                <div className="h-3 bg-primary rounded" style={{ width: "25%" }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
