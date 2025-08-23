// src/pages/GuestOrderStart.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function GuestOrderStart() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!ok) {
      setErr("Ingresa un correo válido.");
      return;
    }

    // Guarda el correo de invitado (para que /toyreq1 pueda leerlo)
    localStorage.setItem("guestEmail", email.trim());
    // Redirige al flujo de pedido
    navigate("/toyreq1?guest=1");
  };

  return (
    <div className="container mx-auto p-6 grid place-items-center min-h-[70svh]">
      <form onSubmit={onSubmit} className="card bg-base-100 border w-full max-w-md">
        <div className="card-body space-y-3">
          <h1 className="text-3xl font-bold text-center">Empezar pedido sin registrarte</h1>
          <p className="opacity-70 text-center">
            Sólo necesitamos tu correo para enviarte avances y confirmar el pedido.
          </p>

          <div className="form-control">
            <label className="label"><span className="label-text">Correo electrónico</span></label>
            <input
              type="email"
              className="input input-bordered"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          {err && <div className="alert alert-error">{err}</div>}

          <div className="card-actions mt-2">
            <button className="btn btn-primary btn-block">Continuar</button>
          </div>

          <div className="text-center text-sm opacity-70">
            ¿Ya tienes cuenta? <Link to="/login" className="link link-primary">Inicia sesión</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
