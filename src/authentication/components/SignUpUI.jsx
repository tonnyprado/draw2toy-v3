// src/authentication/components/SignUp.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !pw || !pw2) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (pw !== pw2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Aquí integrarás Firebase Auth (createUserWithEmailAndPassword + updateProfile)
    // Por ahora, solo demo:
    console.log("SignUp:", { name, email });
    alert("Cuenta creada (demo).");
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">¡Crea tu cuenta!</h1>
          <p className="py-6">
            Sube los dibujos de tus peques y conviértelos en peluches. 
            Regístrate para iniciar tu primera solicitud.
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              {error && (
                <div className="alert alert-error mb-2">
                  <span>{error}</span>
                </div>
              )}

              <label className="label">Nombre</label>
              <input
                type="text"
                className="input"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="email@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />

              <label className="label">Confirmar Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
              />

              <button type="submit" className="btn btn-neutral mt-4">
                Crear cuenta
              </button>

              <div className="mt-2">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="link link-primary">
                  Inicia sesión
                </Link>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
