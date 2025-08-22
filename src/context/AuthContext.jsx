import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getUserProfile } from "../authentication/services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = cargando, null = sin sesión
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const p = await getUserProfile(u.uid);
          setProfile(p);
        } catch {
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => unsub();
  }, []);

  const logout = () => signOut(auth);
  const loading = user === undefined;
  const isAdmin = !!profile && profile.role === "admin";


  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loading, logout }}>
      {loading ? <div className="p-6">Cargando…</div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
