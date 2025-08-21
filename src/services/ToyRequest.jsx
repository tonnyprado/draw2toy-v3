import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, storage } from "../firebase"; // Asegúrate de exportar `storage` (getStorage)
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * SolicitudJuguete
 * - Permite subir imágenes (diseño del peluche)
 * - Gestiona nombre, tamaño y precio por ítem
 * - Valida sesión (si no hay usuario => /login)
 * - Al proceder al pago: sube imágenes a Firebase Storage, obtiene downloadURL y
 *   navega a /checkout con { total, items }
 */
const SIZE_PRICES = {
  "Pequeño": 300,
  "Mediano": 500,
  "Grande": 700,
}; //AJUSTA PRECIOS

const MAX_FILES = 10; //AJUSTA LIMITE DE IMAGENES

const ToyRequest = () => {
  const navigate = useNavigate();
  const [peluches, setPeluches] = useState([]); // {id, file, preview, nombre, tamaño, precio}
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Requiere sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true, state: { from: "/toyrequest" } });
      }
    });
    return () => unsub();
  }, [navigate]);

  // Limpia object URLs al desmontar
  useEffect(() => {
    return () => {
      peluches.forEach((p) => {
        if (p.preview) URL.revokeObjectURL(p.preview);
      });
    };
  }, [peluches]);

  const handleFileChange = (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentCount = peluches.length;
    if (currentCount + files.length > MAX_FILES) {
      setError(`Máximo ${MAX_FILES} imágenes. Actualmente tienes ${currentCount}.`);
      return;
    }

    const toAdd = files.map((file) => {
      const sizeLabel = "Pequeño";
      return {
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        nombre: file.name.replace(/\.[^.]+$/, ""),
        tamaño: sizeLabel,
        precio: SIZE_PRICES[sizeLabel],
      };
    });
    setPeluches((prev) => [...prev, ...toAdd]);

    // limpia input para permitir re-selección del mismo archivo
    e.target.value = "";
  };

  const handleRemove = (id) => {
    setPeluches((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found?.preview) URL.revokeObjectURL(found.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleNombreChange = (id, nombre) => {
    setPeluches((prev) => prev.map((p) => (p.id === id ? { ...p, nombre } : p)));
  };

  const handleTamañoChange = (id, tamaño) => {
    const precio = SIZE_PRICES[tamaño] ?? SIZE_PRICES["Pequeño"];
    setPeluches((prev) => prev.map((p) => (p.id === id ? { ...p, tamaño, precio } : p)));
  };

  const total = useMemo(() => peluches.reduce((sum, p) => sum + (Number(p.precio) || 0), 0), [peluches]);

  const uploadAllAndProceed = async () => {
    setError("");
    if (peluches.length === 0) {
      setError("Agrega al menos un peluche.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/solicitud-juguete" } });
      return;
    }

    setLoading(true);
    try {
      // Sube todas las imágenes a Storage
      const uploaded = await Promise.all(
        peluches.map(async (p) => {
          if (!(p.file instanceof File)) return p; // por si ya tuviera url
          const ts = Date.now();
          const path = `uploads/${user.uid}/${ts}-${p.file.name}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, p.file);
          const url = await getDownloadURL(storageRef);
          return {
            nombre: p.nombre || p.file.name,
            tamaño: p.tamaño,
            precio: p.precio,
            imageUrl: url,
            storagePath: path,
            qty: 1,
          };
        })
      );

      navigate("/checkout", { state: { total, items: uploaded } });
    } catch (err) {
      console.error(err);
      setError("No se pudieron subir las imágenes. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Solicitud de Peluche</h1>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-600">{error}</div>
      )}

      {/* Subida de imágenes */}
      <div className="mb-6">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full max-w-md"
        />
        <p className="text-xs text-neutral-600 mt-2">Máximo {MAX_FILES} imágenes. Formatos comunes (JPG/PNG/WebP).</p>
      </div>

      {/* Tarjetas de peluches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {peluches.map((p) => (
          <div key={p.id} className="card bg-white shadow-md p-4">
            {p.preview && (
              <img src={p.preview} alt={p.nombre || "dibujo"} className="w-full h-48 object-contain mb-4" />
            )}

            <input
              type="text"
              placeholder="Nombre del peluche"
              value={p.nombre}
              onChange={(e) => handleNombreChange(p.id, e.target.value)}
              className="input input-bordered w-full mb-2"
            />

            <select
              value={p.tamaño}
              onChange={(e) => handleTamañoChange(p.id, e.target.value)}
              className="select select-bordered w-full mb-2"
            >
              <option>Pequeño</option>
              <option>Mediano</option>
              <option>Grande</option>
            </select>

            <div className="flex items-center justify-between">
              <p className="font-bold">Precio: ${p.precio}</p>
              <button className="btn btn-ghost" onClick={() => handleRemove(p.id)}>Quitar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Total y botón */}
      {peluches.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xl font-bold">Total: ${total}</p>
          <button className="btn btn-primary" disabled={loading} onClick={uploadAllAndProceed}>
            {loading ? "Subiendo imágenes…" : "Proceder al pago"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ToyRequest;