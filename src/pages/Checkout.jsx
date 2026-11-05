
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../data/razorpay";

export default function Checkout() {
  const navigate = useNavigate();

  const currentUser = useStore((s) => s.currentUser);
  const cart = useStore((s) => s.cart);
  const placeOrder = useStore((s) => s.placeOrder);
  const saveAddress = useStore((s) => s.saveAddress);

  const savedAddress = currentUser?.address;

  const [address, setAddress] = useState({
    name: savedAddress?.name || currentUser?.name || "",
    phone: savedAddress?.phone || "",
    house: savedAddress?.house || "",
    city: savedAddress?.city || "",
    state: savedAddress?.state || "",
    pincode: savedAddress?.pincode || "",
  });

  const [payment, setPayment] = useState("cod");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", {
        replace: true,
        state: { from: "/checkout" },
      });
    }
  }, [currentUser, navigate]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const delivery = subtotal >= 500 ? 0 : 40;
  const total = subtotal + delivery;

  if (!currentUser) return null;

  if (cart.length === 0) {
    return (
      <div className="text-center text-white py-20">
        <h2 className="text-2xl font-bold">
          Your cart is empty
        </h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-[#ff8906] text-black font-bold px-6 py-3 rounded-xl"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // COMPLETE AND SAVE ORDER
  function completeOrder(paymentMethod, paymentDetails = {}) {
    saveAddress(address);

    const order = {
      id: "KRT" + Date.now(),
      userId: currentUser.id,
      customer: address.name,
      email: currentUser.email,
      address: { ...address },
      items: [...cart],
      subtotal,
      delivery,
      total,
      payment: paymentMethod,
      paymentDetails,
      status: "Order Placed",
      date: new Date().toLocaleString("en-IN"),
    };

    placeOrder(order);

    navigate("/order-success", {
      replace: true,
      state: { order },
    });
  }

  // HANDLE CHECKOUT
  async function handleOrder(e) {
    e.preventDefault();
    setError("");

    // VALIDATE MOBILE NUMBER
    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    // VALIDATE ADDRESS
    if (
      !address.name.trim() ||
      !address.house.trim() ||
      !address.city.trim() ||
      !address.state.trim()
    ) {
      setError("Please enter your complete delivery address.");
      return;
    }

    // VALIDATE PINCODE
    if (!/^\d{6}$/.test(address.pincode)) {
      setError("Enter a valid 6-digit PIN code.");
      return;
    }

    // CASH ON DELIVERY
    if (payment === "cod") {
      completeOrder("Cash on Delivery", {
        paymentStatus: "Pending",
      });
      return;
    }

    // CHECK RAZORPAY SCRIPT
    if (!window.Razorpay) {
      setError(
        "Razorpay checkout could not load. Please refresh the page."
      );
      return;
    }

    try {
      setLoading(true);

      // CREATE RAZORPAY ORDER
      const data = await createRazorpayOrder(total);

      if (!data.success || !data.order || !data.key) {
        throw new Error("Unable to create Razorpay order.");
      }

      // RAZORPAY CHECKOUT OPTIONS
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Kartify",
        description: "Kartify Shopping Payment",
        order_id: data.order.id,

        prefill: {
          name: address.name,
          email: currentUser.email,
          contact: address.phone,
        },

        theme: {
          color: "#ff8906",
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        // VERIFY PAYMENT
        handler: async function (response) {
          try {
            const verification = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verification.success) {
              throw new Error("Payment verification failed.");
            }

            // GET ACTUAL PAYMENT METHOD
            const actualMethod = (
              verification.paymentMethod || ""
            ).toLowerCase();

            const methodLabels = {
              wallet: "Wallet",
              upi: "UPI",
              card: "Card",
              netbanking: "Netbanking",
              emi: "EMI",
              paylater: "Pay Later",
            };

            const displayMethod =
              methodLabels[actualMethod] || "Razorpay";

            // SAVE VERIFIED ORDER
            completeOrder(displayMethod, {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              paymentMethod: actualMethod,
              paymentStatus: verification.paymentStatus,
            });

          } catch (err) {
            console.error("Payment verification error:", err);

            setError(
              "Payment verification failed. Please contact support before trying again."
            );

            setLoading(false);
          }
        },
      };

      // OPEN RAZORPAY CHECKOUT
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setError(
          response.error?.description ||
          "Payment failed. Please try again."
        );

        setLoading(false);
      });

      razorpay.open();

    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to start payment. Please try again."
      );

      setLoading(false);
    }
  }

  const inputStyle =
    "w-full bg-[#242435] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:border-purple-500";

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 text-white">

      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      <form
        onSubmit={handleOrder}
        className="grid lg:grid-cols-3 gap-6"
      >

        {/* DELIVERY ADDRESS */}
        <div className="lg:col-span-2 space-y-5">

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1c1c2d] border border-white/10 rounded-2xl p-5 md:p-6"
          >
            <div className="flex items-center justify-between mb-5">

              <h2 className="text-lg font-bold">
                1. Delivery Address
              </h2>

              {savedAddress && (
                <span className="text-xs text-green-400">
                  ✓ Saved Address
                </span>
              )}

            </div>

            <div className="grid sm:grid-cols-2 gap-4">

              <input
                value={address.name}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    name: e.target.value,
                  })
                }
                placeholder="Full Name"
                required
                className={inputStyle}
              />

              <input
                value={address.phone}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    phone: e.target.value,
                  })
                }
                placeholder="10-digit Mobile Number"
                maxLength={10}
                inputMode="numeric"
                required
                className={inputStyle}
              />

              <input
                value={address.house}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    house: e.target.value,
                  })
                }
                placeholder="House No. / Street / Area"
                required
                className={`${inputStyle} sm:col-span-2`}
              />

              <input
                value={address.city}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    city: e.target.value,
                  })
                }
                placeholder="City"
                required
                className={inputStyle}
              />

              <input
                value={address.state}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    state: e.target.value,
                  })
                }
                placeholder="State"
                required
                className={inputStyle}
              />

              <input
                value={address.pincode}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    pincode: e.target.value,
                  })
                }
                placeholder="6-digit PIN Code"
                maxLength={6}
                inputMode="numeric"
                required
                className={inputStyle}
              />

            </div>
          </motion.section>

          {/* PAYMENT METHODS */}
          <section className="bg-[#1c1c2d] border border-white/10 rounded-2xl p-5 md:p-6">

            <h2 className="text-lg font-bold mb-5">
              2. Payment Method
            </h2>

            {/* RAZORPAY */}
            <label className="flex items-center gap-3 p-4 rounded-xl bg-[#242435] border border-white/10 cursor-pointer mb-3">

              <input
                type="radio"
                value="razorpay"
                checked={payment === "razorpay"}
                onChange={(e) => setPayment(e.target.value)}
              />

              <div className="flex-1">
                <p className="font-bold">
                  Razorpay
                </p>

                <p className="text-xs text-white/50 mt-1">
                  UPI, Credit/Debit Cards, Net Banking and Wallets
                </p>
              </div>

              <span className="text-blue-400 font-bold">
                Razorpay
              </span>

            </label>

            {/* CASH ON DELIVERY */}
            <label className="flex items-center gap-3 p-4 rounded-xl bg-[#242435] border border-white/10 cursor-pointer">

              <input
                type="radio"
                value="cod"
                checked={payment === "cod"}
                onChange={(e) => setPayment(e.target.value)}
              />

              <div>
                <p className="font-bold">
                  Cash on Delivery
                </p>

                <p className="text-xs text-white/50 mt-1">
                  Pay when your order arrives
                </p>
              </div>

            </label>

            <p className="text-xs text-white/40 mt-3">
              Online payments are securely processed through Razorpay.
            </p>

          </section>

        </div>

        {/* ORDER SUMMARY */}
        <aside className="bg-[#1c1c2d] border border-white/10 rounded-2xl p-5 h-fit">

          <h2 className="text-lg font-bold mb-5">
            3. Order Summary
          </h2>

          <div className="space-y-4">

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3"
              >

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-14 h-14 object-contain bg-[#242435] rounded-lg"
                />

                <div className="flex-1 min-w-0">

                  <p className="text-sm truncate">
                    {item.title}
                  </p>

                  <p className="text-xs text-white/50">
                    Qty: {item.qty}
                  </p>

                </div>

                <span className="text-sm font-bold">
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </span>

              </div>
            ))}

          </div>

          {/* PRICE DETAILS */}
          <div className="border-t border-white/10 mt-5 pt-4 space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-white/60">
                Subtotal
              </span>

              <span>
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-white/60">
                Delivery
              </span>

              <span>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>

            <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-bold">

              <span>Total</span>

              <span className="text-orange-400">
                ₹{total.toLocaleString("en-IN")}
              </span>

            </div>

          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-400 text-sm mt-4">
              {error}
            </p>
          )}

          {/* PLACE ORDER BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl bg-[#ff8906] hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold transition"
          >
            {loading
              ? "Processing..."
              : payment === "razorpay"
                ? "Pay with Razorpay"
                : "Place Order"}
          </button>

        </aside>

      </form>
    </div>
  );
}
