// src/pages/SolicitudJuguete.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ToyRequest1() {
  // Precios base (por pieza)
  const PRICE = { S: 300, M: 500, L: 700 };
  // Extras (por pieza)
  const EXTRA_COST = { rush: 200, embroidery: 120, accessory: 150 };

  const MAX_IMAGES = 10;

  const { user } = useAuth();
  const navigate = useNavigate();

  // guestEmail desde localStorage (solo lectura aquí)
  const [guestEmail, setGuestEmail] = useState(() => localStorage.getItem("guestEmail") || "");
  // Paso del asistente: 1..4
  const [step, setStep] = useState(1);

  // Guard: exige sesión o guestEmail antes de continuar
  useEffect(() => {
    if (!user && !guestEmail) {
      navigate("/pedido-rapido", { replace: true });
    }
  }, [user, guestEmail, navigate]);

  // Items del pedido
  const [items, setItems] = useState([]);

  // Notas generales del pedido
  const [orderNotes, setOrderNotes] = useState("");

  // --- Helpers ---
  const computeItemPrice = (it) => {
    const base = PRICE[it.size] || 0;
    const rush = it.rush ? EXTRA_COST.rush : 0;
    const emb = it.embroidery?.trim() ? EXTRA_COST.embroidery : 0;
    const accessory = (Number(it.accessories) || 0) * EXTRA_COST.accessory;
    const qty = Math.max(1, Number(it.qty) || 1);
    return (base + rush + emb + accessory) * qty;
  };

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + computeItemPrice(it), 0),
    [items]
  );

  // --- Paso 1: subir/ordenar ---
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = Math.max(0, MAX_IMAGES - items.length);
    const slice = files.slice(0, remaining).map((file) => ({
      id: crypto.randomUUID(),
      file,
      size: "M",
      qty: 1,
      rush: false,
      embroidery: "", // texto del bordado opcional
      accessories: 0, // cantidad de accesorios
    }));

    if (files.length > remaining) {
      alert(`Máximo ${MAX_IMAGES} imágenes en total.`);
    }
    setItems((prev) => [...prev, ...slice]);
    e.target.value = null; // limpia input
  };

  const moveItem = (id, dir) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swapWith = idx + dir;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // --- Paso 2: personalización por ítem ---
  const setSize = (id, size) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, size } : it)));
  };
  const setQty = (id, qty) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, Number(qty) || 1) } : it))
    );
  };
  const toggleRush = (id) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, rush: !it.rush } : it)));
  };
  const setEmbroidery = (id, val) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, embroidery: val } : it)));
  };
  const setAccessories = (id, count) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, accessories: Math.max(0, Number(count) || 0) } : it))
    );
  };

  // --- Paso 3: guest email helper ---
  const changeGuestEmail = () => {
    localStorage.removeItem("guestEmail");
    setGuestEmail("");
    navigate("/pedido-rapido");
  };

  // --- Navegación entre pasos ---
  const canNext = () => {
    if (step === 1) return items.length > 0;
    if (step === 2) return items.length > 0; // ya con defaults
    if (step === 3) return true; // notas opcionales
    return true;
  };
  const next = () => { if (canNext()) setStep((s) => Math.min(4, s + 1)); };
  const back = () => setStep((s) => Math.max(1, s - 1));

  // --- Ir a checkout ---
  const proceedCheckout = () => {
    if (!items.length) return;
    // Normaliza items para checkout
    const itemsForCheckout = items.map((it) => ({
      id: it.id,
      size: it.size,
      qty: it.qty,
      rush: !!it.rush,
      embroidery: it.embroidery?.trim() || "",
      accessories: Number(it.accessories) || 0,
      price: computeItemPrice(it), // precio TOTAL de este renglón (incluye qty y extras)
      imageUrl: it.imageUrl || null, // (si luego subes a storage)
      file: it.file || null,        // para vista previa en checkout
    }));

    navigate("/checkout", {
      state: {
        items: itemsForCheckout,
        total: subtotal,
        guestEmail: user ? null : guestEmail,
        notes: orderNotes || "",
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner de invitado */}
      {!user && guestEmail && (
        <div className="alert alert-info mb-6 justify-between">
          <div>
            Compras como invitado: <b>{guestEmail}</b>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={changeGuestEmail}>
            Cambiar correo
          </button>
        </div>
      )}

      {/* Progreso (steps) */}
      <div className="mb-6">
        <ul className="steps w-full">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Dibujos</li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Personaliza</li>
          <li className={`step ${step >= 3 ? "step-primary" : ""}`}>Detalles</li>
          <li className={`step ${step >= 4 ? "step-primary" : ""}`}>Revisión</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <StepUpload
              items={items}
              onFiles={handleFiles}
              onMove={moveItem}
              onRemove={removeItem}
              max={MAX_IMAGES}
            />
          )}

          {step === 2 && (
            <StepCustomize
              items={items}
              setSize={setSize}
              setQty={setQty}
              toggleRush={toggleRush}
              setEmbroidery={setEmbroidery}
              setAccessories={setAccessories}
              computeItemPrice={computeItemPrice}
            />
          )}

          {step === 3 && (
            <StepDetails
              orderNotes={orderNotes}
              setOrderNotes={setOrderNotes}
              isGuest={!user}
              guestEmail={guestEmail}
            />
          )}

          {step === 4 && (
            <StepReview
              items={items}
              computeItemPrice={computeItemPrice}
              subtotal={subtotal}
              onEditSection={(sectionStep) => setStep(sectionStep)}
            />
          )}

          {/* Navegación de pasos */}
          <div className="flex items-center justify-between">
            <button className="btn btn-ghost" disabled={step === 1} onClick={back}>
              ← Atrás
            </button>
            {step < 4 ? (
              <button className="btn btn-primary" onClick={next} disabled={!canNext()}>
                Siguiente →
              </button>
            ) : (
              <button className="btn btn-accent" onClick={proceedCheckout}>
                Ir a Checkout
              </button>
            )}
          </div>
        </div>

        {/* Columna lateral: Resumen vivo */}
        <aside className="lg:col-span-1">
          <OrderSummary
            items={items}
            computeItemPrice={computeItemPrice}
            subtotal={subtotal}
          />
        </aside>
      </div>
    </div>
  );
}

/* =================== Subcomponentes =================== */

// Paso 1: Subir y ordenar
function StepUpload({ items, onFiles, onMove, onRemove, max }) {
  return (
    <div className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">De dibujo a peluche</h1>
          <p className="text-sm opacity-70">
            Sube hasta <b>{max}</b> imágenes. Puedes reordenarlas y eliminarlas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onFiles}
            disabled={items.length >= max}
            className="file-input file-input-bordered"
          />
          <span className="badge badge-neutral">{items.length}/{max}</span>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="alert">
          <span>Sube tus dibujos para comenzar.</span>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {items.map((it, idx) => (
            <div key={it.id} className="card bg-base-100 shadow-sm border">
              <figure className="bg-base-200/60">
                <img
                  src={URL.createObjectURL(it.file)}
                  alt={`Dibujo ${idx + 1}`}
                  className="max-h-56 object-contain p-3"
                />
              </figure>
              <div className="card-body gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-70">Imagen {idx + 1}</span>
                  <div className="join">
                    <button type="button" className="btn btn-sm join-item" onClick={() => onMove(it.id, -1)}>↑</button>
                    <button type="button" className="btn btn-sm join-item" onClick={() => onMove(it.id, +1)}>↓</button>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <button type="button" onClick={() => onRemove(it.id)} className="btn btn-ghost btn-sm">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Paso 2: Personalización por ítem
function StepCustomize({
  items,
  setSize,
  setQty,
  toggleRush,
  setEmbroidery,
  setAccessories,
  computeItemPrice,
}) {
  if (items.length === 0) {
    return <div className="alert">No hay imágenes. Vuelve al paso anterior.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Personaliza tus peluches</h2>
      <p className="text-sm opacity-70">Tamaño, cantidad y extras por pieza.</p>

      <div className="grid gap-6 grid-cols-1">
        {items.map((it, idx) => (
          <div key={it.id} className="card bg-base-100 shadow-sm border">
            <div className="card-body gap-5">
              <div className="flex flex-col md:flex-row gap-5">
                <div className="md:w-1/3 bg-base-200/60 rounded-box overflow-hidden grid place-items-center p-3">
                  <img
                    src={URL.createObjectURL(it.file)}
                    alt={`Peluche ${idx + 1}`}
                    className="max-h-56 object-contain"
                  />
                </div>

                <div className="md:flex-1 space-y-4">
                  {/* Tamaño */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-70">Tamaño</span>
                    <div className="join">
                      {["S", "M", "L"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          className={`btn btn-sm join-item ${it.size === s ? "btn-active" : ""}`}
                          onClick={() => setSize(it.id, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cantidad */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-70">Cantidad</span>
                    <div className="join">
                      <button
                        type="button"
                        className="btn btn-sm join-item"
                        onClick={() => setQty(it.id, Math.max(1, (Number(it.qty) || 1) - 1))}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        className="input input-sm input-bordered w-16 text-center join-item"
                        value={it.qty}
                        onChange={(e) => setQty(it.id, e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm join-item"
                        onClick={() => setQty(it.id, (Number(it.qty) || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Extras */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label cursor-pointer justify-between">
                        <span className="label-text">Producción Rápida (Rush)</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-accent"
                          checked={!!it.rush}
                          onChange={() => toggleRush(it.id)}
                        />
                      </label>
                      <span className="text-xs opacity-60">+${200} (por pieza)</span>
                    </div>

                    <div className="form-control">
                      <label className="label"><span className="label-text">Bordado (nombre)</span></label>
                      <input
                        type="text"
                        className="input input-bordered input-sm"
                        placeholder="Ej. Sofi"
                        value={it.embroidery}
                        onChange={(e) => setEmbroidery(it.id, e.target.value)}
                      />
                      <span className="text-xs opacity-60 mt-1">+${120} si escribes algo</span>
                    </div>

                    <div className="form-control">
                      <label className="label"><span className="label-text">Accesorios</span></label>
                      <div className="join">
                        <button
                          type="button"
                          className="btn btn-sm join-item"
                          onClick={() => setAccessories(it.id, Math.max(0, (Number(it.accessories) || 0) - 1))}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={0}
                          className="input input-sm input-bordered w-16 text-center join-item"
                          value={it.accessories}
                          onChange={(e) => setAccessories(it.id, e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-sm join-item"
                          onClick={() => setAccessories(it.id, (Number(it.accessories) || 0) + 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs opacity-60 mt-1">+${150} c/u</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Precio del ítem */}
              <div className="flex items-center justify-end">
                <div className="text-right">
                  <div className="text-sm opacity-70">Total pieza {idx + 1}</div>
                  <div className="text-xl font-bold">${computeItemPrice(it)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Paso 3: Detalles generales
function StepDetails({ orderNotes, setOrderNotes, isGuest, guestEmail }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Detalles del pedido</h2>
      {isGuest && (
        <div className="alert">
          <span>Te contactaremos a <b>{guestEmail}</b> para validar colores y avances.</span>
        </div>
      )}
      <div className="form-control">
        <label className="label"><span className="label-text">Notas (opcional)</span></label>
        <textarea
          className="textarea textarea-bordered min-h-[120px]"
          placeholder="Cuéntanos si hay colores clave, acabados, restricciones, etc."
          value={orderNotes}
          onChange={(e) => setOrderNotes(e.target.value)}
        />
      </div>
      <div className="text-sm opacity-70">
        * Los tiempos pueden variar según complejidad. Rush acelera producción.
      </div>
    </div>
  );
}

// Paso 4: Revisión final
function StepReview({ items, computeItemPrice, subtotal, onEditSection }) {
  if (!items.length) {
    return <div className="alert">No hay artículos para revisar.</div>;
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Revisión</h2>
      <p className="text-sm opacity-70">Verifica tamaños, cantidades y extras antes de pagar.</p>

      <div className="grid gap-6 grid-cols-1">
        {items.map((it, idx) => (
          <div key={it.id} className="card bg-base-100 shadow-sm border">
            <div className="card-body flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-40 bg-base-200/60 rounded-box overflow-hidden flex items-center justify-center">
                {it.file ? (
                  <img
                    alt={`Peluche ${idx + 1}`}
                    className="max-h-32 object-contain"
                    src={URL.createObjectURL(it.file)}
                  />
                ) : (
                  <span className="text-xs opacity-60">Sin imagen</span>
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold">Peluche {idx + 1}</div>
                <div className="text-sm opacity-80">
                  Tamaño: {it.size} · Cant: {it.qty} · Rush: {it.rush ? "Sí" : "No"} ·
                  {` Bordado: ${it.embroidery?.trim() ? it.embroidery : "—"}`} · Accesorios: {it.accessories || 0}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">${computeItemPrice(it)}</div>
                <button className="btn btn-link btn-xs" onClick={() => onEditSection(2)}>Editar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-box bg-base-100 shadow-sm border p-4 flex items-center justify-between">
        <div className="text-xl">Total</div>
        <div className="text-2xl font-extrabold">${subtotal}</div>
      </div>
    </div>
  );
}

// Resumen lateral vivo
function OrderSummary({ items, computeItemPrice, subtotal }) {
  return (
    <div className="card bg-base-100 shadow-sm border sticky top-4">
      <div className="card-body">
        <h2 className="card-title">Resumen</h2>

        {items.length === 0 ? (
          <div className="text-sm opacity-70">Aún no has agregado dibujos.</div>
        ) : (
          <ul className="space-y-3 max-h-[50vh] overflow-auto pr-1">
            {items.map((it, idx) => (
              <li key={it.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-base-200 rounded overflow-hidden grid place-items-center">
                  {it.file ? (
                    <img
                      src={URL.createObjectURL(it.file)}
                      alt={`Mini ${idx + 1}`}
                      className="object-contain max-h-12"
                    />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Peluche {idx + 1}</div>
                  <div className="text-xs opacity-70">
                    {it.size} · x{it.qty} {it.rush ? "· Rush" : ""} {it.embroidery?.trim() ? "· Bordado" : ""} {Number(it.accessories) > 0 ? `· Acc:${it.accessories}` : ""}
                  </div>
                </div>
                <div className="text-sm font-bold">${computeItemPrice(it)}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="divider my-2" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${subtotal}</span>
        </div>
      </div>
    </div>
  );
}
