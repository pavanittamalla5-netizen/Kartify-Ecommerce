
import axios from "axios";

const API_URL = "http://localhost:5000";

// CREATE RAZORPAY ORDER
export const createRazorpayOrder = async (amount) => {
  const response = await axios.post(
    `${API_URL}/create-order`,
    { amount: Math.round(amount * 100) }
  );

  return response.data;
};

// VERIFY PAYMENT
export const verifyRazorpayPayment = async (paymentData) => {
  const response = await axios.post(
    `${API_URL}/verify-payment`,
    paymentData
  );

  return response.data;
};
