import { auth, db } from "../../firebase"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

//login con email y pass
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user; // devuelve el usuario autenticado
}

export async function resetPassword(email) {
  // opcional: agregar redirect URL después del reset (depende de tu flujo)
  const actionSettings = {
    // Al terminar el flujo, el usuario puede volver a tu app:
    url: `${window.location.origin}/login`,
    handleCodeInApp: false,
  };

  await sendPasswordResetEmail(auth, email, actionSettings);
  return true;
}

export async function signUpUser(name, email, password) {
  // 1. Crear usuario en Firebase Auth
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // 2. Actualizar perfil (nombre visible en Firebase Auth)
  await updateProfile(cred.user, { displayName: name });

  // 3. Guardar datos adicionales en Firestore
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email,
    role: "cliente",
    createdAt: serverTimestamp(),
  });

  return cred.user;
}
