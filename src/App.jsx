// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Content from "./components/PresentationContent";
import Login from "./authentication/components/LoginUI";
import SignUp from "./authentication/components/SignUpUI";
import ToyRequest from "./services/ToyRequest";
import ToyRequest1 from "./services/legacy/ToyRequest-v1";
import Checkout from "./services/legacy/Checkout-v1";
import Pedido from "./services/legacy/Pedidos";
import PageFade from "./components/PageFade";

// ⬇️ Importa el provider y la ruta privada
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PedidosUsuario from "./pages/PedidosUsuario";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Públicas */}
        <Route path="/" element={<PageFade><Content /></PageFade>} />
        <Route path="/login" element={<PageFade><Login /></PageFade>} />
        <Route path="/register" element={<PageFade><SignUp /></PageFade>} />

        {/* Privadas (requieren sesión) */}
        <Route
          path="/toyrequest"
          element={<PrivateRoute><PageFade><ToyRequest /></PageFade></PrivateRoute>}
        />
        <Route
          path="/toyreq1"
          element={<PrivateRoute><PageFade><ToyRequest1 /></PageFade></PrivateRoute>}
        />
        <Route
          path="/checkout"
          element={<PrivateRoute><PageFade><Checkout /></PageFade></PrivateRoute>}
        />
        <Route 
        path="/pedido"
        element={<PrivateRoute><PageFade><PedidosUsuario/></PageFade></PrivateRoute>}
        />
        <Route
          path="/pedido"
          element={<PrivateRoute><PageFade><Pedido /></PageFade></PrivateRoute>}
        />
        <Route path="/pedido/:orderId" element={<PrivateRoute><PageFade><Pedido /></PageFade></PrivateRoute>} />

        {/*SOLO ADMIN USER*/}
        <Route path="/admin" element={<AdminRoute><PageFade><AdminDashboard/></PageFade></AdminRoute>}/>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider> {/* Provee user/loading/logout a toda la app */}
      <Router>
        <Navbar />
        <AnimatedRoutes />
        <Footer />
      </Router>
    </AuthProvider>
  );
}
