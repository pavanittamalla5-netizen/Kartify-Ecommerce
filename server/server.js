
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

// ALLOWED FRONTEND URLS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS CONFIGURATION
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// RAZORPAY CONFIGURATION
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Kartify Backend is Running!",
  });
});

// CREATE RAZORPAY ORDER
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (
      !Number.isInteger(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "kartify_" + Date.now(),
    });

    return res.json({
      success: true,
      order: order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order",
    });
  }
});

// VERIFY RAZORPAY PAYMENT
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // CHECK REQUIRED DETAILS
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details",
      });
    }

    // GENERATE SIGNATURE
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    // VERIFY SIGNATURE
    const valid =
      generatedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature)
      );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // FETCH PAYMENT DETAILS
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    // CHECK ORDER MATCH
    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment order mismatch",
      });
    }

    // CHECK PAYMENT STATUS
    if (payment.status !== "captured") {
      return res.status(400).json({
        success: false,
        message: "Payment is not captured",
        paymentStatus: payment.status,
      });
    }

    // RETURN ACTUAL PAYMENT METHOD
    return res.json({
      success: true,
      message: "Payment verified successfully",
      paymentMethod: payment.method,
      paymentStatus: payment.status,
      paymentId: payment.id,
      orderId: payment.order_id,
    });

  } catch (error) {
    console.error("Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification error",
    });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Kartify Backend running on port ${PORT}`
  );
});
