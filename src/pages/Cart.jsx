
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store/useStore";

export default function Cart() {
  const cart = useStore((s) => s.cart);
  const changeQty = useStore((s) => s.changeQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const currentUser = useStore((s) => s.currentUser);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const delivery = total >= 500 ? 0 : 40;
  const grandTotal = total + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white text-center">
        <div className="text-6xl mb-4">🛒</div>

        <h2 className="text-2xl font-bold">
          Your Cart is Empty
        </h2>

        <p className="text-white/50 mt-2">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 rounded-xl bg-[#ff8906] text-black px-6 py-3 font-bold hover:bg-orange-400 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 text-white">

      <h1 className="text-2xl font-bold mb-6">
        My Cart ({cart.length} items)
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* CART PRODUCTS */}
        <div className="lg:col-span-2">

          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                className="flex items-center gap-4 rounded-2xl bg-[#1c1c2d] border border-white/10 p-4 mb-4"
              >

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-20 h-20 object-contain bg-[#242435] rounded-xl"
                />

                <div className="flex-1 min-w-0">

                  <h3 className="font-semibold truncate">
                    {item.title}
                  </h3>

                  <p className="text-orange-400 font-bold mt-1">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="w-8 h-8 rounded-lg border border-white/20 hover:bg-white/10"
                    >
                      −
                    </button>

                    <span className="font-semibold">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="w-8 h-8 rounded-lg border border-white/20 hover:bg-white/10"
                    >
                      +
                    </button>

                  </div>
                </div>

                {/* REMOVE PRODUCT */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Remove
                </button>

              </motion.div>
            ))}
          </AnimatePresence>

        </div>

        {/* PRICE SUMMARY */}
        <aside className="bg-[#1c1c2d] border border-white/10 rounded-2xl p-5 h-fit">

          <h2 className="text-xl font-bold mb-5">
            Price Details
          </h2>

          <div className="space-y-4 text-sm">

            <div className="flex justify-between">
              <span className="text-white/60">
                Price ({cart.length} items)
              </span>

              <span>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">
                Delivery Charges
              </span>

              <span className={delivery === 0 ? "text-green-400" : ""}>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-bold">
              <span>Total Amount</span>

              <span className="text-orange-400">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>

          </div>

          {/* CHECKOUT BUTTON */}
          <Link
            to={currentUser ? "/checkout" : "/login"}
            state={!currentUser ? { from: "/checkout" } : undefined}
            className="block w-full text-center mt-6 py-3 rounded-xl bg-[#ff8906] hover:bg-orange-400 text-black font-bold transition"
          >
            Proceed to Checkout
          </Link>

          <p className="text-xs text-white/40 text-center mt-3">
            Secure checkout experience
          </p>

          <Link
            to="/"
            className="block text-center text-sm text-white/60 hover:text-white mt-4"
          >
            Continue Shopping
          </Link>

        </aside>

      </div>
    </div>
  );
}
