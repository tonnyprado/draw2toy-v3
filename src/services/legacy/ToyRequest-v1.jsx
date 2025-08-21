// src/pages/SolicitudJuguete.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ToyRequest1() {
  const PRICE = { S: 300, M: 500, L: 700 };
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = Math.max(0, 10 - items.length);
    const slice = files.slice(0, remaining).map((file) => ({
      id: crypto.randomUUID(),
      file,
      size: "S",
      price: PRICE.S,
    }));

    if (files.length > remaining) {
      alert("Máximo 10 imágenes en total.");
    }
    setItems((prev) => [...prev, ...slice]);
    e.target.value = null; // limpia input
  };

  const setSize = (id, size) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, size, price: PRICE[size] } : it))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (it.price || 0), 0),
    [items]
  );

  const proceedCheckout = () => {
    // Navega al checkout y lleva los datos
    navigate("/checkout", { state: { items, total } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">De dibujo a peluche</h1>
          <p className="text-sm opacity-70">
            Sube hasta <b>10</b> imágenes. Elige tamaño por pieza y revisa el total.
          </p>
        </div>

        {/* Uploader */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            disabled={items.length >= 10}
            className="file-input file-input-bordered"
          />
          <span className="badge badge-neutral">
            {items.length}/10
          </span>
        </div>
      </div>

      {/* Grid de cards */}
      {items.length === 0 ? (
        <div className="alert">
          <span>Sube tus dibujos para comenzar.</span>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.id} className="card bg-base-100 shadow-sm border">
              <figure className="bg-base-200">
                <img
                  src={URL.createObjectURL(it.file)}
                  alt="Dibujo"
                  className="max-h-56 object-contain p-3"
                />
              </figure>

              <div className="card-body gap-3">
                {/* Selector de tamaño */}
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">Tamaño</span>
                  <div className="join">
                    <button
                      className={`btn btn-sm join-item ${it.size === "S" ? "btn-active" : ""}`}
                      onClick={() => setSize(it.id, "S")}
                    >
                      S
                    </button>
                    <button
                      className={`btn btn-sm join-item ${it.size === "M" ? "btn-active" : ""}`}
                      onClick={() => setSize(it.id, "M")}
                    >
                      M
                    </button>
                    <button
                      className={`btn btn-sm join-item ${it.size === "L" ? "btn-active" : ""}`}
                      onClick={() => setSize(it.id, "L")}
                    >
                      L
                    </button>
                  </div>
                </div>

                {/* Precio */}
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">Precio</span>
                  <span className="text-lg font-bold">${it.price}</span>
                </div>

                {/* Acciones */}
                <div className="card-actions justify-end">
                  <button
                    onClick={() => removeItem(it.id)}
                    className="btn btn-ghost btn-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer de total / checkout */}
      {items.length > 0 && (
        <div className="mt-8 rounded-box bg-base-100 shadow-sm border p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xl">
            Total: <span className="font-bold">${total}</span>
          </div>
          <button onClick={proceedCheckout} className="btn btn-primary">
            Proceder al checkout
          </button>
        </div>
      )}
    </div>
  );
}
