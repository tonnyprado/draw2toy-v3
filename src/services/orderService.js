// src/services/orderService.js
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Crea una orden en estado "Pendiente de pago" (o "Voucher generado" si OXXO)
 * y agrega el primer evento al timeline (subcolección /history).
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {Array}  params.items
 * @param {number} params.total
 * @param {string} [params.email]
 * @param {"card"|"oxxo"|"auto"} [params.method="card"]
 * @returns {Promise<string>} orderId
 */
export async function createPendingOrder({ userId, items, total, email, method = "card" }) {
  const safeItems = (items || []).map((it) => ({
    size: it?.size ?? null,
    price: Number(it?.price ?? 0),
    imageUrl: it?.imageUrl ?? null,
  }));

  const initialStatus = method === "oxxo" ? "Voucher generado" : "Pendiente de pago";

  const ref = await addDoc(collection(db, "orders"), {
    userId,
    items: safeItems,
    total: Number(total ?? 0),
    email: email || null,
    status: initialStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    payment: {
      provider: "stripe",
      methodRequested: method || "auto",
      status: "requires_payment_method",
    },
  });

  // Primer evento en timeline
  await addOrderEvent(ref.id, {
    status: initialStatus,
    note: method === "oxxo" ? "Generando voucher OXXO…" : "Creando intento de pago en Stripe…",
  });

  return ref.id;
}

/**
 * Guarda/actualiza el PaymentIntent de Stripe en la orden.
 * No sobreescribe todo el objeto `payment`, solo los campos necesarios.
 *
 * @param {string} orderId
 * @param {{intentId:string, status?:string}} payload
 */
export async function setOrderPaymentIntent(orderId, { intentId, status }) {
  const ref = doc(db, "orders", orderId);
  await updateDoc(ref, {
    "payment.intentId": intentId,
    "payment.status": status || "requires_confirmation",
    updatedAt: serverTimestamp(),
  });
}

/**
 * Agrega un evento al timeline y actualiza el estado actual de la orden.
 * @param {string} orderId
 * @param {{status:string, note?:string}} param1
 */
export async function addOrderEvent(orderId, { status, note }) {
  // 1) Agrega evento en subcolección
  await addDoc(collection(db, "orders", orderId, "history"), {
    status,
    at: serverTimestamp(),
    note: note ?? null,
  });

  // 2) Actualiza estado en la orden
  await updateDoc(doc(db, "orders", orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Leer un pedido por id
 * @param {string} orderId
 */
export async function getOrder(orderId) {
  const snap = await getDoc(doc(db, "orders", orderId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Último pedido del usuario (requiere índice compuesto: userId asc + createdAt desc)
 * @param {string} userId
 */
export async function getLastOrderForUser(userId) {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() };
}

/* ============================================================================
 * Compat: alias DEPRECATED para no romper imports antiguos
 * (ahora crea la orden como pendiente y NO marca "Pagado" en cliente).
 * ==========================================================================*/
export async function createOrder({ userId, items, total, paymentMethod, guestEmail }) {
  const method =
    paymentMethod === "Pago en tienda (QR)" || paymentMethod === "OXXO" ? "oxxo" : "card";
  return createPendingOrder({
    userId,
    items,
    total,
    email: guestEmail || null,
    method,
  });
}
