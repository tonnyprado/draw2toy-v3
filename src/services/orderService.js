// orderService.js
import {
  addDoc, collection, serverTimestamp, doc, updateDoc,
  getDoc, query, where, orderBy, limit, getDocs
} from "firebase/firestore";
import { db } from "../firebase";

/** Crea un pedido y agrega el primer evento en la subcolección history */
export async function createOrder({ userId, items, total, paymentMethod = "simulado" }) {
  // Limpia items: sin undefined/objetos raros
  const safeItems = (items || []).map(it => ({
    size: it?.size ?? null,
    price: Number(it?.price ?? 0),
    imageUrl: it?.imageUrl ?? null,
  }));

  // 1) Crea la orden (top-level con timestamps válidos)
  const docRef = await addDoc(collection(db, "orders"), {
    userId,
    items: safeItems,
    total: Number(total ?? 0),
    paymentMethod,
    status: "Pagado",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    // 👇 OJO: no guardamos history aquí (nada de arrays con serverTimestamp)
  });

  // 2) Agrega el primer evento a la subcolección
  await addDoc(collection(db, "orders", docRef.id, "history"), {
    status: "Pagado",
    at: serverTimestamp(),    // ✅ permitido (campo top-level del doc en subcolección)
    note: "Pago confirmado",
  });

  return docRef.id;
}

/** Añade un evento al timeline y actualiza el status actual */
export async function addOrderEvent(orderId, { status, note }) {
  const ref = doc(db, "orders", orderId);

  // 1) Agrega evento en subcolección (hora de servidor)
  await addDoc(collection(db, "orders", orderId, "history"), {
    status,
    at: serverTimestamp(),
    note: note ?? null,
  });

  // 2) Actualiza estado y updatedAt en la orden
  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });
}

/** Leer un pedido por id */
export async function getOrder(orderId) {
  const snap = await getDoc(doc(db, "orders", orderId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Último pedido del usuario (puede requerir índice compuesto) */
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
