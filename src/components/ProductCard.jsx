
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const addToCart = useStore((s) => s.addToCart);
  const changeQty = useStore((s) => s.changeQty);
  const toggleWishlist = useStore((s) => s.toggleWishlist);

  const qty = useStore(
    (s) => s.cart.find((i) => i.id === product.id)?.qty || 0
  );

  const liked = useStore((s) =>
    s.wishlist.some((i) => i.id === product.id)
  );

  const price = Math.round(product.price * 85);

  const mrp = Math.round(
    price / (1 - product.discountPercentage / 100)
  );

  const item = {
    id: product.id,
    title: product.title,
    thumbnail: product.thumbnail,
    price,
  };

  // BUY NOW FUNCTION
  const handleBuyNow = () => {
    if (qty === 0) {
      addToCart(item);
    }

    navigate("/checkout");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="relative rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md p-3 hover:border-purple-400/70 hover:shadow-xl hover:shadow-purple-500/30 transition-colors"
    >
      {/* WISHLIST BUTTON */}
      <motion.button
        key={liked ? "on" : "off"}
        initial={{ scale: 1.5 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.8 }}
        onClick={() => toggleWishlist(item)}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 text-lg ${
          liked ? "text-red-500" : "text-white/60"
        }`}
      >
        ♥
      </motion.button>

      {/* PRODUCT IMAGE AND TITLE */}
      <Link
        to={`/product/${product.id}`}
        className="block cursor-pointer"
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-36 object-contain hover:scale-105 transition-transform"
        />

        <h3 className="mt-2 text-sm truncate hover:text-purple-400">
          {product.title}
        </h3>
      </Link>

      {/* PRODUCT RATING */}
      <span className="inline-block mt-1 bg-[#2cb67d] text-white text-[11px] font-bold px-1.5 rounded">
        {product.rating.toFixed(1)} ★
      </span>

      {/* PRODUCT PRICE */}
      <div className="mt-1 text-sm font-bold">
        ₹{price.toLocaleString("en-IN")}

        <s className="text-white/50 font-normal text-xs mx-1">
          ₹{mrp.toLocaleString("en-IN")}
        </s>

        <span className="text-[#2cb67d] text-xs">
          {Math.round(product.discountPercentage)}% off
        </span>
      </div>

      {/* ADD TO CART */}
      {qty === 0 ? (
        <motion.button
          key="add"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => addToCart(item)}
          className="mt-3 w-full rounded-lg py-2 text-sm font-bold text-black bg-[#ff8906] hover:bg-orange-400 transition"
        >
          Add to Cart
        </motion.button>
      ) : (
        <motion.div
          key="qty"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mt-3 flex items-center justify-between rounded-lg bg-[#ff8906] text-black font-bold"
        >
          <button
            onClick={() => changeQty(product.id, -1)}
            className="px-4 py-2"
          >
            −
          </button>

          <span>{qty}</span>

          <button
            onClick={() => changeQty(product.id, 1)}
            className="px-4 py-2"
          >
            +
          </button>
        </motion.div>
      )}

      {/* BUY NOW */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleBuyNow}
        className="mt-2 w-full rounded-lg py-2 text-sm font-bold text-white bg-[#252545] border border-purple-400/50 hover:bg-purple-600 hover:border-purple-400 transition"
      >
        Buy Now
      </motion.button>

    </motion.div>
  );
}
