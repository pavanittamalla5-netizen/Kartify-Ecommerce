
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import AuroraBackground from "./components/AuroraBackground";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page Not Found</p>

      <a
        href="/"
        className="px-6 py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600"
      >
        Back to Home
      </a>
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080D1B]">
      <AuroraBackground />

      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="relative z-10">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={<Home searchQuery={searchQuery} />}
          />

          {/* Products */}
          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Authentication */}
          <Route path="/login" element={<Auth />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Payment Success */}
          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          {/* Invalid Routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
