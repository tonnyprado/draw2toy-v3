// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import AppLayout from "./layout/AppLayout";
import Content from "./components/PresentationContent";

import Login from "./authentication/components/LoginUI";
import SignUp from "./authentication/components/SignUpUI";

import ToyRequest from "./services/ToyRequest";
import ToyRequest1 from "./services/legacy/ToyRequest-v1";
import Checkout from "./services/legacy/Checkout-v1";
import Pedido from "./services/legacy/Pedidos";
import PageFade from "./components/PageFade";

// Auth
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

// Páginas opcionales
import PedidosUsuario from "./pages/PedidosUsuario";
import About from "./pages/About";
import AdminShell from "./pages/admin/AdminShell";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminReports from "./pages/admin/AdminReports";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminFAQ from "./pages/admin/AdminFAQ";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Gracias from "./pages/Gracias";
import GuestOrderStart from "./pages/GuestOrderStart";
import PayPage from "./pages/Pay";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* RUTA PADRE CON LAYOUT GLOBAL */}
        <Route element={<AppLayout />}>
          {/* Públicas */}
          <Route path="/" element={<PageFade><Content /></PageFade>} />
          <Route path="/login" element={<PageFade><Login /></PageFade>} />
          <Route path="/register" element={<PageFade><SignUp /></PageFade>} />
          <Route path="/acerca" element={<PageFade><About /></PageFade>} />
          <Route path="/faq" element={<PageFade><FAQ /></PageFade>} />
          <Route path="/contact" element={<PageFade><Contact /></PageFade>} />

          <Route path="/pedido-rapido" element={<GuestOrderStart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/gracias" element={<Gracias />} />

          <Route
            path="/pagar/:orderId"
            element={<PrivateRoute><PageFade><PayPage /></PageFade></PrivateRoute>}
          />

          {/* Privadas */}
          <Route
            path="/toyrequest"
            element={<PrivateRoute><PageFade><ToyRequest /></PageFade></PrivateRoute>}
          />
          <Route
            path="/toyreq1"
            element={<PrivateRoute><PageFade><ToyRequest1 /></PageFade></PrivateRoute>}
          />

          {/* Detalle / lista de pedidos */}
          <Route
            path="/pedido"
            element={<PrivateRoute><PageFade><Pedido /></PageFade></PrivateRoute>}
          />
          <Route
            path="/pedido/:orderId"
            element={<PrivateRoute><PageFade><Pedido /></PageFade></PrivateRoute>}
          />
          <Route
            path="/pedidos"
            element={<PrivateRoute><PageFade><PedidosUsuario /></PageFade></PrivateRoute>}
          />

          {/* Admin (si quieres, puede usar otro layout, pero aquí funciona bien) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <PageFade>
                  <AdminShell>
                    <AdminDashboard />
                  </AdminShell>
                </PageFade>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/about"
            element={<AdminRoute><PageFade><AdminAbout /></PageFade></AdminRoute>}
          />
          <Route
            path="/admin/reports"
            element={<AdminRoute><PageFade><AdminReports /></PageFade></AdminRoute>}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute><PageFade><AdminUsers /></PageFade></AdminRoute>}
          />
          <Route
            path="/admin/faq"
            element={<AdminRoute><PageFade><AdminFAQ /></PageFade></AdminRoute>}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      {/* HashRouter lo sigues teniendo en main.jsx → perfecto */}
      <AnimatedRoutes />
    </AuthProvider>
  );
}
