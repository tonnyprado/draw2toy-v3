// src/services/cmsService.js
import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const ABOUT_DOC = doc(db, "pages", "about");

export async function fetchAbout() {
  const snap = await getDoc(ABOUT_DOC);
  return snap.exists() ? snap.data() : null;
}

export async function saveAbout({ title, subtitle, body, heroImageUrl }, user) {
  // Evita undefined en Firestore
  const payload = {
    title: title ?? "",
    subtitle: subtitle ?? "",
    body: body ?? "",
    heroImageUrl: heroImageUrl ?? "",
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid ?? null,
    published: true, // si lo quieres controlar luego, déjalo fijo por ahora
  };
  await setDoc(ABOUT_DOC, payload, { merge: true });
}
