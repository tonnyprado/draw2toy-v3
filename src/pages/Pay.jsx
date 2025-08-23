// src/pages/Pay.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { httpsCallable, getFunctions } from "firebase/functions";
import { setOrderPaymentIntent, addOrderEvent } from "../services/orderService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PayPage() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null);
  const [method, setMethod] = useState("card"); // "card" | "oxxo"
  const [email, setEmail] = useState(user?.email || "");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user || !orderId) { setLoading(false); return; }

    (async () => {
      try {
        setLoading(true);
        // Trae el total de la orden (centavos)
        const snap = await getDoc(doc(db, "orders", orderId));
        if (!snap.exists()) throw new Error("Orden no encontrada.");
        const data = snap.data();
        const cents = Math.round(Number(data.total || 0) * 100);
        if (!cents) throw new Error("Monto inválido.");

        setAmount(cents);
        if (data?.email) setEmail(data.email);

        // Llama la Callable Function para crear PaymentIntent
        const fn = httpsCallable(getFunctions(), "createPaymentIntent");
        const res = await fn({ orderId, amount: cents, email, method });
        setClientSecret(res.data.clientSecret);

        // guarda intentId en la orden
        await setOrderPaymentIntent(orderId, {
          intentId: res.data.paymentIntentId,
          status: res.data.status,
        });

        setLoading(false);
      } catch (e) {
        console.error("[PayPage] error:", e);
        setErr(String(e?.message || e));
        setLoading(false);
      }
    })();
  }, [user, orderId, method]); // si cambias method, crea otro PI (puedes bloquearlo si prefieres)

  const options = useMemo(() => clientSecret ? ({
    clientSecret,
    appearance: { theme: "stripe" },
  }) : null, [clientSecret]);

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-warning">Debes iniciar sesión.</div>
        <Link to="/login" className="btn btn-primary mt-4">Ir a iniciar sesión</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="container mx-auto p-6">Preparando pago…</div>;
  }

  if (err) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">Error: {err}</div>
        <Link to={`/pedido/${orderId}`} className="btn btn-ghost mt-4">Volver al estado del pedido</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Pagar pedido</h1>

      <div className="card bg-base-100 border">
        <div className="card-body space-y-3">
          <div className="flex items-center justify-between">
            <div className="opacity-70">Pedido</div>
            <div className="badge">#{orderId.slice(-6).toUpperCase()}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-2xl font-bold">${(amount / 100).toFixed(2)}</div>
          </div>

          {/* Si quisieras permitir cambiar método aquí:
          <div className="join">
            <button className={`btn join-item ${method==="card"?"btn-primary":""}`} onClick={()=>setMethod("card")}>Tarjeta</button>
            <button className={`btn join-item ${method==="oxxo"?"btn-primary":""}`} onClick={()=>setMethod("oxxo")}>OXXO</button>
          </div> */}

          {clientSecret && options && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm orderId={orderId} email={email} />
            </Elements>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link to={`/pedido/${orderId}`} className="btn btn-ghost">Ver estado del pedido</Link>
      </div>
    </div>
  );
}

function PaymentForm({ orderId, email }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setMsg("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirección final para métodos que lo requieran
        return_url: `${window.location.origin}/pedido/${orderId}`,
        receipt_email: email || undefined,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error(error);
      setMsg(error.message || "No se pudo procesar el pago.");
      setSubmitting(false);
      return;
    }

    // Si no requirió redirección:
    if (paymentIntent?.status === "succeeded") {
      // Opcional: reflejar “Pagado” en cliente (webhook hará lo mismo)
      await addOrderEvent(orderId, { status: "Pagado", note: "Pago confirmado (cliente)" });
      navigate(`/pedido/${orderId}`, { replace: true });
    } else if (paymentIntent?.status === "processing") {
      setMsg("Pago en proceso. Te avisaremos cuando se confirme.");
      navigate(`/pedido/${orderId}`, { replace: true });
    } else if (paymentIntent?.status === "requires_action") {
      // Stripe puede manejar 3DS automáticamente si redirect="if_required"
      setMsg("Se requiere autenticación adicional.");
    } else {
      // Para OXXO, el Payment Element muestra el voucher; redirige al estado.
      navigate(`/pedido/${orderId}`, { replace: true });
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <PaymentElement />
      <button className="btn btn-primary w-full" disabled={!stripe || submitting}>
        {submitting ? "Procesando…" : "Pagar ahora"}
      </button>
      {msg && <div className="alert mt-2">{msg}</div>}
    </form>
  );
}
