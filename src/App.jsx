import Login from "./authentication/components/LoginUI";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Content from "./components/PresentationContent";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ToyRequest from "./services/ToyRequest";
import ToyRequest1 from "./services/legacy/ToyRequest-v1";
import Checkout from "./services/legacy/Checkout-v1";
import Pedido from "./services/legacy/Pedidos";
import SignUp from "./authentication/components/SignUpUI";

import { AnimatePresence } from "framer-motion";
import PageFade from "./components/PageFade";

function AnimatedRoutes(){
  const location = useLocation();
  return(
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageFade><Content /></PageFade>} />
        <Route path="/login" element={<PageFade><Login /></PageFade>} />
        <Route path="/toyrequest" element={<PageFade><ToyRequest /></PageFade>} />
        <Route path="/toyreq1" element={<PageFade><ToyRequest1 /></PageFade>} />
        <Route path="/checkout" element={<PageFade><Checkout /></PageFade>} />
        <Route path="/pedido" element={<PageFade><Pedido /></PageFade>} />
        <Route path="/register" element={<PageFade><SignUp /></PageFade>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    /* NAVBAR */
    <Router>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}
