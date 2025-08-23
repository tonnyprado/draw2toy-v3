// src/pages/Gracias.jsx
import { useLocation, Link } from "react-router-dom";

export default function Gracias() {
  const { state } = useLocation() || {};
  const email = state?.email;
  const total = state?.total;
  const orderId = state?.orderId;

  return (
    <div className="container mx-auto p-6 text-center space-y-4">
      <h1 className="text-3xl font-bold">¡Gracias por tu pedido! 🎉</h1>

      {orderId && <p className="opacity-80">ID de pedido: <b>{orderId}</b></p>}
      {typeof total === "number" && <p>Total: <b>${total}</b></p>}
      {email && <p className="opacity-80">Te enviaremos la confirmación a <b>{email}</b>.</p>}

      <div className="mt-4 flex items-center justify-center gap-3">
        <Link to="/pedido" className="btn btn-primary">Ver mis pedidos</Link>
        <Link to="/" className="btn btn-ghost">Volver al inicio</Link>
      </div>
    </div>
  );
}
