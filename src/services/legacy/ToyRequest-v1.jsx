import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ComicPage, Panel, ComicButton, GhostButton, ComicSteps, Onoma } from "../../design/comic";

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

  const subtotal = useMemo(() => items.reduce((sum, it) => sum + computeItemPrice(it), 0), [items]);

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
      embroidery: "",
      accessories: 0,
    }));

    if (files.length > remaining) {
      alert(`Máximo ${MAX_IMAGES} imágenes en total.`);
    }
    setItems((prev) => [...prev, ...slice]);
    e.target.value = null;
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
  const setSize = (id, size) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, size } : it)));
  const setQty = (id, qty) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, Number(qty) || 1) } : it)));
  const toggleRush = (id) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, rush: !it.rush } : it)));
  const setEmbroidery = (id, val) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, embroidery: val } : it)));
  const setAccessories = (id, count) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, accessories: Math.max(0, Number(count) || 0) } : it)));

  // --- Paso 3: guest email helper ---
  const changeGuestEmail = () => {
    localStorage.removeItem("guestEmail");
    setGuestEmail("");
    navigate("/pedido-rapido");
  };

  // --- Navegación entre pasos ---
  const canNext = () => {
    if (step === 1) return items.length > 0;
    if (step === 2) return items.length > 0;
    if (step === 3) return true;
    return true;
  };
  const next = () => { if (canNext()) setStep((s) => Math.min(4, s + 1)); };
  const back = () => setStep((s) => Math.max(1, s - 1));

  // --- Ir a checkout ---
  const proceedCheckout = () => {
    if (!items.length) return;
    const itemsForCheckout = items.map((it) => ({
      id: it.id,
      size: it.size,
      qty: it.qty,
      rush: !!it.rush,
      embroidery: it.embroidery?.trim() || "",
      accessories: Number(it.accessories) || 0,
      price: computeItemPrice(it),
      imageUrl: it.imageUrl || null,
      file: it.file || null,
    }));

    navigate("/checkout", {
      state: { items: itemsForCheckout, total: subtotal, guestEmail: user ? null : guestEmail, notes: orderNotes || "" },
    });
  };

  return (
    <ComicPage snap>
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Banner de invitado */}
        {!user && guestEmail && (
          <Panel className="p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" data-snap-item>
            <div>Compras como invitado: <b>{guestEmail}</b></div>
            <ComicButton onClick={changeGuestEmail}>Cambiar correo</ComicButton>
          </Panel>
        )}

        {/* Encabezado */}
        <section className="flex items-end justify-between gap-3 mb-6" data-snap-item>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Solicitud de peluche</h1>
            <p className="text-sm md:text-base opacity-70 max-w-2xl">Sube los dibujos de tu peque, personaliza cada pieza y revisa el total antes de pagar.</p>
          </div>
          <Onoma text={`$${subtotal}`} small />
        </section>

        {/* Progreso */}
        <ComicSteps step={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <StepUpload items={items} onFiles={handleFiles} onMove={moveItem} onRemove={removeItem} max={MAX_IMAGES} />
            )}

            {step === 2 && (
              <StepCustomize items={items} setSize={setSize} setQty={setQty} toggleRush={toggleRush} setEmbroidery={setEmbroidery} setAccessories={setAccessories} computeItemPrice={computeItemPrice} />
            )}

            {step === 3 && (
              <StepDetails orderNotes={orderNotes} setOrderNotes={setOrderNotes} isGuest={!user} guestEmail={guestEmail} />
            )}

            {step === 4 && (
              <StepReview items={items} computeItemPrice={computeItemPrice} subtotal={subtotal} onEditSection={(sectionStep) => setStep(sectionStep)} />
            )}

            {/* Navegación de pasos */}
            <div className="flex items-center justify-between" data-snap-item>
              <GhostButton disabled={step === 1} onClick={back}>← Atrás</GhostButton>
              {step < 4 ? (
                <ComicButton onClick={next} disabled={!canNext()}>Siguiente →</ComicButton>
              ) : (
                <ComicButton className="bg-[#6EE7F9]" onClick={proceedCheckout}>Ir a Checkout</ComicButton>
              )}
            </div>
          </div>

          {/* Columna lateral: Resumen vivo */}
          <aside className="lg:col-span-1" data-snap-item>
            <OrderSummary items={items} computeItemPrice={computeItemPrice} subtotal={subtotal} />
          </aside>
        </div>
      </div>
    </ComicPage>
  );
}

/* =================== Subcomponentes (funcionalidad) =================== */
function StepUpload({ items, onFiles, onMove, onRemove, max }) {
  return (
    <section className="space-y-4" data-snap-item>
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase">De dibujo a peluche</h2>
          <p className="text-sm opacity-70">Sube hasta <b>{max}</b> imágenes. Puedes reordenarlas y eliminarlas.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="comic-btn px-4 py-2 cursor-pointer">
            Subir dibujos
            <input type="file" accept="image/*" multiple onChange={onFiles} disabled={items.length >= max} className="hidden" />
          </label>
          <span className="px-3 py-2 border-2" style={{ borderColor: "#1B1A1F" }}>{items.length}/{max}</span>
        </div>
      </header>

      {items.length === 0 ? (
        <Panel className="p-4 text-sm">Sube tus dibujos para comenzar.</Panel>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {items.map((it, idx) => (
            <Panel key={it.id}>
              <figure className="bg-[#FDFDFD] border-b-2" style={{ borderColor: "#1B1A1F" }}>
                <div className="p-3 grid place-items-center">
                  <img src={URL.createObjectURL(it.file)} alt={`Dibujo ${idx + 1}`} className="max-h-56 object-contain jiggle" />
                </div>
              </figure>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm opacity-70">Imagen {idx + 1}</span>
                <div className="flex items-center gap-2">
                  <GhostButton onClick={() => onMove(it.id, -1)}>↑</GhostButton>
                  <GhostButton onClick={() => onMove(it.id, +1)}>↓</GhostButton>
                  <ComicButton onClick={() => onRemove(it.id)}>Eliminar</ComicButton>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </section>
  );
}

function StepCustomize({ items, setSize, setQty, toggleRush, setEmbroidery, setAccessories, computeItemPrice }) {
  if (items.length === 0) return <Panel className="p-4">No hay imágenes. Vuelve al paso anterior.</Panel>;
  return (
    <section className="space-y-4" data-snap-item>
      <h2 className="text-2xl md:text-3xl font-black uppercase">Personaliza tus peluches</h2>
      <p className="text-sm opacity-70">Tamaño, cantidad y extras por pieza.</p>

      <div className="grid gap-6 grid-cols-1">
        {items.map((it, idx) => (
          <Panel key={it.id} className="p-4">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="md:w-1/3 bg-white rounded-[10px] overflow-hidden grid place-items-center p-3 border-2" style={{ borderColor: "#1B1A1F" }}>
                <img src={URL.createObjectURL(it.file)} alt={`Peluche ${idx + 1}`} className="max-h-56 object-contain jiggle" />
              </div>

              <div className="md:flex-1 space-y-4">
                {/* Tamaño */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm opacity-70">Tamaño</span>
                  <div className="flex border-2" style={{ borderColor: "#1B1A1F" }}>
                    {["S", "M", "L"].map((s) => (
                      <button key={s} type="button" className={`px-4 py-2 font-bold ${it.size === s ? "bg-[#FFEC48]" : "bg-white"}`} style={{ borderRight: "2px solid #1B1A1F" }} onClick={() => setSize(it.id, s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cantidad */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm opacity-70">Cantidad</span>
                  <div className="flex items-stretch border-2" style={{ borderColor: "#1B1A1F" }}>
                    <button type="button" className="px-3 font-bold" onClick={() => setQty(it.id, Math.max(1, (Number(it.qty) || 1) - 1))}>−</button>
                    <input type="number" min={1} className="w-16 text-center border-l-2 border-r-2" style={{ borderColor: "#1B1A1F" }} value={it.qty} onChange={(e) => setQty(it.id, e.target.value)} />
                    <button type="button" className="px-3 font-bold" onClick={() => setQty(it.id, (Number(it.qty) || 1) + 1)}>+</button>
                  </div>
                </div>

                {/* Extras */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Panel className="p-3">
                    <label className="flex items-center justify-between gap-3">
                      <span className="font-semibold">Producción Rápida (Rush)</span>
                      <input type="checkbox" className="w-5 h-5" checked={!!it.rush} onChange={() => toggleRush(it.id)} />
                    </label>
                    <span className="text-xs opacity-60">+${200} (por pieza)</span>
                  </Panel>

                  <Panel className="p-3">
                    <label className="font-semibold">Bordado (nombre)</label>
                    <input type="text" className="mt-2 px-3 py-2 border-2 w-full" style={{ borderColor: "#1B1A1F" }} placeholder="Ej. Sofi" value={it.embroidery} onChange={(e) => setEmbroidery(it.id, e.target.value)} />
                    <span className="text-xs opacity-60 mt-1 block">+${120} si escribes algo</span>
                  </Panel>

                  <Panel className="p-3 sm:col-span-2">
                    <label className="font-semibold">Accesorios</label>
                    <div className="mt-2 flex items-stretch border-2 w-fit" style={{ borderColor: "#1B1A1F" }}>
                      <button type="button" className="px-3 font-bold" onClick={() => setAccessories(it.id, Math.max(0, (Number(it.accessories) || 0) - 1))}>−</button>
                      <input type="number" min={0} className="w-16 text-center border-l-2 border-r-2" style={{ borderColor: "#1B1A1F" }} value={it.accessories} onChange={(e) => setAccessories(it.id, e.target.value)} />
                      <button type="button" className="px-3 font-bold" onClick={() => setAccessories(it.id, (Number(it.accessories) || 0) + 1)}>+</button>
                    </div>
                    <span className="text-xs opacity-60 mt-1 block">+${150} c/u</span>
                  </Panel>
                </div>
              </div>
            </div>

            {/* Precio del ítem */}
            <div className="mt-4 flex items-center justify-end">
              <div className="text-right">
                <div className="text-sm opacity-70">Total pieza {idx + 1}</div>
                <div className="text-2xl font-black">${computeItemPrice(it)}</div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </section>
  );
}

function StepDetails({ orderNotes, setOrderNotes, isGuest, guestEmail }) {
  return (
    <section className="space-y-4" data-snap-item>
      <h2 className="text-2xl md:text-3xl font-black uppercase">Detalles del pedido</h2>
      {isGuest && (<Panel className="p-3">Te contactaremos a <b>{guestEmail}</b> para validar colores y avances.</Panel>)}
      <Panel className="p-4">
        <label className="font-semibold">Notas (opcional)</label>
        <textarea className="mt-2 w-full min-h-[120px] p-3 border-2" style={{ borderColor: "#1B1A1F" }} placeholder="Cuéntanos si hay colores clave, acabados, restricciones, etc." value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} />
      </Panel>
      <div className="text-sm opacity-70">* Los tiempos pueden variar según complejidad. Rush acelera producción.</div>
    </section>
  );
}

function StepReview({ items, computeItemPrice, subtotal, onEditSection }) {
  if (!items.length) return <Panel className="p-4">No hay artículos para revisar.</Panel>;
  return (
    <section className="space-y-4" data-snap-item>
      <h2 className="text-2xl md:text-3xl font-black uppercase">Revisión</h2>
      <p className="text-sm opacity-70">Verifica tamaños, cantidades y extras antes de pagar.</p>

      <div className="grid gap-6 grid-cols-1">
        {items.map((it, idx) => (
          <Panel key={it.id} className="p-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-40 bg-white rounded overflow-hidden flex items-center justify-center border-2" style={{ borderColor: "#1B1A1F" }}>
                {it.file ? (
                  <img alt={`Peluche ${idx + 1}`} className="max-h-32 object-contain jiggle" src={URL.createObjectURL(it.file)} />
                ) : (
                  <span className="text-xs opacity-60 p-3">Sin imagen</span>
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold">Peluche {idx + 1}</div>
                <div className="text-sm opacity-80">
                  Tamaño: {it.size} · Cant: {it.qty} · Rush: {it.rush ? "Sí" : "No"} · {`Bordado: ${it.embroidery?.trim() ? it.embroidery : "—"}`} · Accesorios: {it.accessories || 0}
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">${computeItemPrice(it)}</div>
                <GhostButton className="mt-1" onClick={() => onEditSection(2)}>Editar</GhostButton>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="p-4 flex items-center justify-between">
        <div className="text-xl">Total</div>
        <div className="text-2xl font-extrabold">${subtotal}</div>
      </Panel>
    </section>
  );
}

function OrderSummary({ items, computeItemPrice, subtotal }) {
  return (
    <Panel className="sticky top-4" data-snap-item>
      <div className="p-4">
        <h2 className="text-xl font-black uppercase">Resumen</h2>
        {items.length === 0 ? (
          <div className="text-sm opacity-70 mt-2">Aún no has agregado dibujos.</div>
        ) : (
          <ul className="space-y-3 max-h-[50vh] overflow-auto pr-1 mt-3">
            {items.map((it, idx) => (
              <li key={it.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded overflow-hidden grid place-items-center border-2" style={{ borderColor: "#1B1A1F" }}>
                  {it.file ? <img src={URL.createObjectURL(it.file)} alt={`Mini ${idx + 1}`} className="object-contain max-h-12" /> : null}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Peluche {idx + 1}</div>
                  <div className="text-xs opacity-70">{it.size} · x{it.qty} {it.rush ? "· Rush" : ""} {it.embroidery?.trim() ? "· Bordado" : ""} {Number(it.accessories) > 0 ? `· Acc:${it.accessories}` : ""}</div>
                </div>
                <div className="text-sm font-bold">${computeItemPrice(it)}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 border-t-2 pt-3 flex justify-between text-lg font-bold" style={{ borderColor: "#1B1A1F" }}>
          <span>Total</span>
          <span>${subtotal}</span>
        </div>
      </div>
    </Panel>
  );
}
