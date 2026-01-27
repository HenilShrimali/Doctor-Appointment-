import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const usePaymentStore = create((set) => ({
  razorpayKey: null,
  isProcessing: false,

  getRazorpayKey: async () => {
    try {
      const res = await axiosInstance.get("/payment/key");
      set({ razorpayKey: res.data.key });
      return res.data.key;
    } catch (error) {
      console.error("Failed to fetch Razorpay key:", error);
      toast.error("Payment setup failed");
      throw error;
    }
  },

  createOrder: async (amount, doctorId, slotId) => {
    set({ isProcessing: true });
    try {
      const res = await axiosInstance.post("/payment/create-order", {
        amount,
        doctorId,
        slotId,
      });
      return res.data.data;
    } catch (error) {
      toast.error("Failed to create payment order");
      throw error;
    } finally {
      set({ isProcessing: false });
    }
  },

  verifyPayment: async (paymentData) => {
    set({ isProcessing: true });
    try {
      const res = await axiosInstance.post("/payment/verify", paymentData);
      return res.data;
    } catch (error) {
      toast.error("Payment verification failed");
      throw error;
    } finally {
      set({ isProcessing: false });
    }
  },

  initializeRazorpay: () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  processPayment: async (orderData, userDetails, onSuccess, onFailure) => {
    const { orderId, amount, currency, key } = orderData;

    const options = {
      key,
      amount,
      currency,
      name: "HealthCare Clinic",
      description: "Doctor Consultation Fee",
      order_id: orderId,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      theme: {
        color: "#10b981",
      },
      handler: async function (response) {
        try {
          const verifyResult = await usePaymentStore.getState().verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyResult.success) {
            onSuccess({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
            });
          } else {
            onFailure("Payment verification failed");
          }
        } catch (error) {
          onFailure(error.message);
        }
      },
      modal: {
        ondismiss: function () {
          onFailure("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  },
}));