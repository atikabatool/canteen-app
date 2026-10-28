import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import ItemPage from "./pages/ItemPage.jsx";
import CartPage from "./pages/CartPage.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Header />
      <main className="main" id="content">
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
