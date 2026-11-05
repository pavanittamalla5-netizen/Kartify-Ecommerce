
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  const getPaymentMethod = () => {
    if (!order) return "Not Available";

    if (order.payment === "Cash on Delivery") {
      return "Cash on Delivery";
    }

    const method = (
      order.paymentDetails?.paymentMethod ||
      order.payment ||
      "Razorpay"
    ).toLowerCase();

    const paymentMethods = {
      wallet: "Wallet",
      upi: "UPI",
      card: "Card",
      netbanking: "Netbanking",
      emi: "EMI",
      paylater: "Pay Later",
      razorpay: "Razorpay",
    };

    return paymentMethods[method] || "Razorpay";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#1c1c2d] border border-white/10 rounded-3xl p-8 text-center text-white shadow-2xl"
      >

        <div className="text-6xl mb-5">
          🎉
        </div>

        <h1 className="text-3xl font-bold text-green-400">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-400 mt-3">
          Thank you for shopping with Kartify.
        </p>

        {order && (
          <div className="mt-7 bg-[#242435] rounded-2xl p-5 text-left space-y-3">

            <p>
              <span className="text-gray-400">
                Order ID:
              </span>{" "}
              {order.id}
            </p>

            <p>
              <span className="text-gray-400">
                Total Amount:
              </span>{" "}
              <span className="text-orange-400 font-bold">
                ₹{order.total?.toLocaleString("en-IN")}
              </span>
            </p>

            <p>
              <span className="text-gray-400">
                Payment:
              </span>{" "}
              <span className="text-blue-400 font-semibold">
                {getPaymentMethod()}
              </span>
            </p>

            <p>
              <span className="text-gray-400">
                Payment Status:
              </span>{" "}
              <span className="text-green-400">
                {order.paymentDetails?.paymentStatus === "captured"
                  ? "Paid"
                  : order.payment === "Cash on Delivery"
                    ? "Pay on Delivery"
                    : "Verified"}
              </span>
            </p>

            <p>
              <span className="text-gray-400">
                Status:
              </span>{" "}
              <span className="text-green-400">
                {order.status}
              </span>
            </p>

          </div>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-7 w-full bg-[#ff8906] text-black font-bold py-3 rounded-xl hover:bg-orange-400 transition"
        >
          Continue Shopping
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="mt-3 w-full border border-white/20 py-3 rounded-xl hover:bg-white/10 transition"
        >
          Go to Profile
        </button>

      </motion.div>
    </div>
  );
}
