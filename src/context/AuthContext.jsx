import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = cargando, null = sin sesión
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading: user === undefined, logout }}>
      {user === undefined ? <div className="p-6">Cargando…</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
