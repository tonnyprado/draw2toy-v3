import React from "react";
import { useAuth } from "../context/AuthContext";
import { ComicNavbar } from "../design/comic";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const userLabel = user?.displayName || user?.email || "Cuenta";
  return <ComicNavbar user={user} userLabel={userLabel} isAdmin={isAdmin} onLogout={logout} />;
}
