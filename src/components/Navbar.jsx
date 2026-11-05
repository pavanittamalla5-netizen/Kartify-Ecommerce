
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useStore } from "../store/useStore";
import logo from "../assets/kartify-logo.svg";

export default function Navbar({
  searchQuery = "",
  setSearchQuery = () => {},
}) {
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const navigate = useNavigate();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 8);
  });

  const count = useStore((s) =>
    s.cart.reduce((n, i) => n + i.qty, 0)
  );

  const wishCount = useStore((s) => s.wishlist.length);
  const coins = useStore((s) => s.coins);
  const location = useStore((s) => s.location);
  const currentUser = useStore((s) => s.currentUser);

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 flex flex-wrap md:flex-nowrap items-center gap-3 px-4 py-2 backdrop-blur-xl border-b border-white/10 transition-shadow ${
        scrolled
          ? "bg-[#0b0b1e]/80 shadow-lg shadow-purple-500/20"
          : "bg-[#0b0b1e]/50"
      }`}
    >
      {/* LOGO */}
      <Link to="/">
        <img src={logo} alt="Kartify" className="h-9" />
      </Link>

      {/* DELIVERY LOCATION */}
      <div className="hidden md:block text-xs text-white/60 leading-tight">
        Deliver to
        <br />
        <b className="text-white">{location}</b>
      </div>

      {/* SEARCH */}
      <div className="relative flex-1 min-w-[160px]">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for products, brands..."
          className="w-full rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm outline-none text-white placeholder:text-white/50 focus:border-purple-400 transition"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
          >
            ✕
          </button>
        )}
      </div>

      {/* COINS */}
      <span className="text-sm whitespace-nowrap">
        🪙 {coins}
      </span>

      {/* WISHLIST */}
      <Link to="/wishlist" className="relative text-lg">
        ♥
        {wishCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[11px] font-bold rounded-full px-1.5">
            {wishCount}
          </span>
        )}
      </Link>

      {/* CART */}
      <Link to="/cart" className="relative text-lg">
        🛒
        {count > 0 && (
          <span className="absolute -top-2 -right-3 bg-[#ff8906] text-black text-[11px] font-bold rounded-full px-1.5">
            {count}
          </span>
        )}
      </Link>

      {/* PROFILE */}
      <button
        onClick={() =>
          navigate(currentUser ? "/profile" : "/login")
        }
        title="My Profile"
        className="flex items-center justify-center gap-2 text-white hover:text-orange-400 transition"
      >
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 border border-purple-400 text-white text-sm font-bold">
          {currentUser?.name
            ? currentUser.name.charAt(0).toUpperCase()
            : "👤"}
        </span>

        <span className="hidden lg:inline text-sm">
          {currentUser ? currentUser.name.split(" ")[0] : "Profile"}
        </span>
      </button>
    </motion.header>
  );
}
