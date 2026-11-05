import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store/useStore";

export default function Wishlist() {
  const wishlist = useStore((s) => s.wishlist);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const addToCart = useStore((s) => s.addToCart);

  if (wishlist.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="text-lg">Your wishlist is empty</p>
        <Link
          to="/"
          className="inline-block mt-4 rounded-lg bg-[#7f5af0] px-5 py-2 font-bold"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">My Wishlist</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <AnimatePresence>
          {wishlist.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md p-3"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-full h-36 object-contain"
              />
              <h3 className="mt-2 text-sm truncate">{p.title}</h3>
              <p className="font-bold">₹{p.price.toLocaleString("en-IN")}</p>
              <button
                onClick={() => {
                  addToCart(p);
                  toggleWishlist(p);
                }}
                className="mt-2 w-full rounded-lg py-2 text-sm font-bold text-black bg-[#ff8906]"
              >
                Move to Cart
              </button>
              <button
                onClick={() => toggleWishlist(p)}
                className="mt-1 w-full text-xs text-white/60"
              >
                Remove
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}