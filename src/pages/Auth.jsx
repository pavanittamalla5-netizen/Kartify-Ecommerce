
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = useStore((s) => s.login);
  const register = useStore((s) => s.register);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!isLogin && name.trim().length < 2) {
      setMessage("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    const result = isLogin
      ? login(email, password)
      : register(name, email, password);

    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setMessage(result.message);
    }
  }

  const inputStyle =
    "w-full bg-[#242435] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:border-purple-500 transition-all";

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-[#1c1c2d]/95 border border-white/10 rounded-2xl p-7 md:p-9 shadow-2xl backdrop-blur-xl"
      >

        {/* Kartify Logo */}
        <Link to="/" className="block text-center mb-7">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-white">Kart</span>
            <span className="text-orange-500">ify</span>
          </h1>

          <p className="text-gray-400 text-xs mt-2 tracking-widest">
            SHOP SMART. LIVE BETTER.
          </p>
        </Link>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white text-center">
          {isLogin ? "Welcome Back!" : "Create Your Account"}
        </h2>

        <p className="text-gray-400 text-sm text-center mt-2">
          {isLogin
            ? "Login to continue your shopping journey."
            : "Join Kartify and discover amazing deals."}
        </p>

        {/* Login / Signup Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-7 p-1 bg-[#111120] rounded-xl">

          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setMessage("");
            }}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
              isLogin
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setMessage("");
            }}
            className={`py-2.5 rounded-lg text-sm font-bold transition-all ${
              !isLogin
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">

          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className={inputStyle}
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
              className={inputStyle}
            />
          </div>

          {/* Error Message */}
          {message && (
            <p className="text-sm text-red-400">
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#ff8906] hover:bg-[#ff9d2e] text-black font-bold transition-all active:scale-[0.98] shadow-lg shadow-orange-500/10"
          >
            {isLogin ? "LOGIN TO KARTIFY" : "CREATE ACCOUNT"}
          </button>

        </form>

        {/* Footer */}
        <div className="mt-7 text-center">
          <p className="text-gray-500 text-xs">
            Your shopping journey starts here.
          </p>

          <Link
            to="/"
            className="inline-block mt-4 text-sm text-purple-400 hover:text-orange-400 transition-colors"
          >
            ← Back to Shopping
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
