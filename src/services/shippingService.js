// src/services/shippingService.js

// Crea un objeto "vacío" con valores por defecto (prefill si hay user/email)
export function emptyShipping(user, presetEmail = "") {
  return {
    fullName: user?.displayName || "",
    email: user?.email || presetEmail || "",
    phone: "",
    country: "MX",
    state: "",
    city: "",
    neighborhood: "",
    street: "",
    extNumber: "",
    intNumber: "",
    postalCode: "",
    references: "",
  };
}

// Recorta espacios y deja datos en forma consistente
export function normalizeShipping(s) {
  const t = (x) => (x ?? "").toString().trim();
  return {
    fullName: t(s.fullName),
    email: t(s.email).toLowerCase(),
    phone: t(s.phone),
    country: t(s.country).toUpperCase(),
    state: t(s.state),
    city: t(s.city),
    neighborhood: t(s.neighborhood),
    street: t(s.street),
    extNumber: t(s.extNumber),
    intNumber: t(s.intNumber),
    postalCode: t(s.postalCode).replace(/\s+/g, ""),
    references: t(s.references),
  };
}

// Validación ligera sin librerías externas
export function validateShipping(s) {
  const data = normalizeShipping(s);
  const errors = {};

  const isEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!data.fullName) errors.fullName = "Nombre completo requerido.";
  if (!data.email || !isEmail.test(data.email)) errors.email = "Correo válido requerido.";
  if (!data.street) errors.street = "Calle requerida.";
  if (!data.extNumber) errors.extNumber = "Número requerido.";
  if (!data.city) errors.city = "Ciudad requerida.";
  if (!data.state) errors.state = "Estado/Provincia requerido.";
  if (!data.postalCode) {
    errors.postalCode = "Código postal requerido.";
  } else if (!/^\d{4,10}$/.test(data.postalCode)) {
    errors.postalCode = "Código postal inválido.";
  }
  if (!data.country) errors.country = "País requerido.";

  return { ok: Object.keys(errors).length === 0, errors, data };
}
