// src/services/faqService.js
import { db } from "../firebase";
import {
  addDoc, collection, deleteDoc, doc, getDocs, limit,
  orderBy, query, serverTimestamp, updateDoc, writeBatch
} from "firebase/firestore";

/** Crea un FAQ al final de la lista (order incremental) */
export async function createFAQ({ question = "", answer = "", published = true }, user) {
  // Buscar el último "order"
  const lastQ = query(collection(db, "faqs"), orderBy("order", "desc"), limit(1));
  const snap = await getDocs(lastQ);
  const lastOrder = snap.empty ? 0 : Number(snap.docs[0].data()?.order || 0);

  const docRef = await addDoc(collection(db, "faqs"), {
    question,
    answer,
    published: !!published,
    order: lastOrder + 1,
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid ?? null,
  });
  return docRef.id;
}

/** Actualiza un FAQ por id */
export async function updateFAQ(id, { question, answer, published }, user) {
  const payload = {
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid ?? null,
  };
  if (question !== undefined) payload.question = question;
  if (answer !== undefined) payload.answer = answer;
  if (published !== undefined) payload.published = !!published;

  await updateDoc(doc(db, "faqs", id), payload);
}

/** Elimina un FAQ */
export async function deleteFAQ(id) {
  await deleteDoc(doc(db, "faqs", id));
}

/** Intercambia el valor de "order" entre dos docs (swap atómico con batch) */
export async function swapFAQOrder(a, b) {
  if (!a?.id || !b?.id) return;
  const batch = writeBatch(db);
  const aRef = doc(db, "faqs", a.id);
  const bRef = doc(db, "faqs", b.id);
  batch.update(aRef, { order: Number(b.order || 0) });
  batch.update(bRef, { order: Number(a.order || 0) });
  await batch.commit();
}
