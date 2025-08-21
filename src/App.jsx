import Login from "./authentication/components/LoginUI";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Content from "./components/PresentationContent";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToyRequest from "./services/ToyRequest";
import ToyRequest1 from "./services/legacy/ToyRequest-v1";
import Checkout from "./services/legacy/Checkout-v1";
import Pedido from "./services/legacy/Pedidos";

export default function App() {
  return (
    /* NAVBAR */
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<Login />} />
        <Route path="/toyrequest" element={<ToyRequest />} />

        <Route path="/toyreq1" element={<ToyRequest1/>}/>
        <Route path="/checkout" element={<Checkout/>}/>
        <Route path="/pedido" element={<Pedido />}/>
      </Routes>
      <Footer />
    </Router>
  );
}
