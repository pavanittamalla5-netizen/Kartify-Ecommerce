
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {
  res.send("Kartify Backend is Running!");
});

// CREATE RAZORPAY ORDER
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "kartify_" + Date.now(),
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create payment order",
    });
  }
});

// VERIFY PAYMENT AND GET ACTUAL PAYMENT METHOD
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

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

    // VERIFY PAYMENT SIGNATURE
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

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

    // FETCH ACTUAL PAYMENT DETAILS FROM RAZORPAY
    const payment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    // CHECK PAYMENT BELONGS TO THIS ORDER
    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment order mismatch",
      });
    }

    if (!["authorized", "captured"].includes(payment.status)) {
      return res.status(400).json({
        success: false,
        message: "Payment is not successful",
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      paymentMethod: payment.method,
      paymentStatus: payment.status,
      paymentId: payment.id,
      orderId: payment.order_id,
    });

  } catch (error) {
    console.error("Verification Error:", error);

    res.status(500).json({
      success: false,
      message: "Payment verification error",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Kartify Backend running on port ${PORT}`);
});
