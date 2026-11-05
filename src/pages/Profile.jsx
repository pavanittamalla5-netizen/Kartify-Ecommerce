
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

export default function Profile() {
  const currentUser = useStore((s) => s.currentUser);
  const logout = useStore((s) => s.logout);

  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-2xl font-bold">
          Please Login First
        </h2>

        <Link
          to="/login"
          className="inline-block mt-5 bg-[#ff8906] text-black font-bold px-6 py-3 rounded-xl"
        >
          Login to Kartify
        </Link>
      </div>
    );
  }

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="max-w-3xl mx-auto py-10">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1c1c2d] border border-white/10 rounded-2xl p-6 md:p-8 text-white"
      >

        {/* PROFILE HEADER */}
        <div className="flex items-center gap-5 border-b border-white/10 pb-6">

          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {currentUser.name}
            </h1>

            <p className="text-white/50 text-sm mt-1">
              Welcome to Kartify!
            </p>
          </div>

        </div>

        {/* PERSONAL DETAILS */}
        <h2 className="text-lg font-bold mt-7 mb-4">
          Personal Information
        </h2>

        <div className="space-y-4">

          <div className="bg-[#111120] rounded-xl p-4">
            <p className="text-white/50 text-xs mb-1">
              Full Name
            </p>
            <p>{currentUser.name}</p>
          </div>

          <div className="bg-[#111120] rounded-xl p-4">
            <p className="text-white/50 text-xs mb-1">
              Email Address
            </p>
            <p className="break-all">{currentUser.email}</p>
          </div>

        </div>

        {/* ACCOUNT LINKS */}
        <h2 className="text-lg font-bold mt-7 mb-4">
          My Account
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <Link
            to="/cart"
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500 transition"
          >
            🛒 My Cart
          </Link>

          <Link
            to="/wishlist"
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500 transition"
          >
            ❤️ My Wishlist
          </Link>

        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full mt-7 py-3 rounded-xl bg-[#ff8906] text-black font-bold hover:bg-orange-400 transition"
        >
          Logout
        </button>

      </motion.div>

    </div>
  );
}
