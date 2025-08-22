import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, resetPassword } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // estados para reset
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetErr, setResetErr] = useState("");
  const resetDialogRef = useRef(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !pw) {
      setError("Por favor completa email y password.");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, pw);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const openResetModal = () => {
    setResetMsg("");
    setResetErr("");
    setResetEmail(email || ""); // prellenar con el email del form si existe
    resetDialogRef.current?.showModal();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setResetErr("");

    if (!resetEmail) {
      setResetErr("Ingresa tu correo para enviarte el enlace de recuperación.");
      return;
    }

    try {
      await resetPassword(resetEmail);
      setResetMsg("Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo.");
    } catch (err) {
      console.error(err);
      // Mensajes amigables comunes:
      if (String(err?.code).includes("auth/invalid-email")) {
        setResetErr("Correo inválido.");
      } else if (String(err?.code).includes("auth/user-not-found")) {
        setResetErr("No existe una cuenta con ese correo.");
      } else {
        setResetErr("No pudimos enviar el correo. Intenta de nuevo más tarde.");
      }
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Accede a tu cuenta para ver tus pedidos o solicitar un peluche nuevo.
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleLogin}>
            <fieldset className="fieldset">
              {error && (
                <div className="alert alert-error mb-2">
                  <span>{error}</span>
                </div>
              )}

              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />

              <div>
                <button
                  type="button"
                  className="link link-hover"
                  onClick={openResetModal}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn btn-neutral mt-4" disabled={loading}>
                {loading ? "Ingresando..." : "Login"}
              </button>

              <div className="mt-2">
                ¿No tienes cuenta?{" "}
                <Link to="/register" className="link link-error">
                  ¡Regístrate ahora!
                </Link>
              </div>
            </fieldset>
          </form>
        </div>
      </div>

      {/* Modal de reset de contraseña (DaisyUI) */}
      <dialog className="modal" ref={resetDialogRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Recuperar contraseña</h3>
          <p className="py-2 text-sm opacity-70">
            Escribe tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {resetErr && (
            <div className="alert alert-error my-2">
              <span>{resetErr}</span>
            </div>
          )}
          {resetMsg && (
            <div className="alert alert-success my-2">
              <span>{resetMsg}</span>
            </div>
          )}

          <form onSubmit={handleReset} className="mt-2">
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="email@ejemplo.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => resetDialogRef.current?.close()}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Enviar enlace
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
