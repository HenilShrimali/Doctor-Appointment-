import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const useAppointmentStore = create((set, get) => ({
  appointments: [],
  doctors: [],
  availableSlots: [],
  selectedDoctor: null,
  isLoading: false,
  isBooking: false,

  getAvailableDoctors: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.specialization)
        params.append("specialization", filters.specialization);
      if (filters.city) params.append("city", filters.city);
      if (filters.date) params.append("date", filters.date);

      const res = await axiosInstance.get(`/appointment/doctors?${params}`);
      set({ doctors: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch doctors");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getDoctorAvailableSlots: async (doctorId, date) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/appointment/doctors/${doctorId}/slots?date=${date}`,
      );
      set({ availableSlots: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch available slots");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createAppointment: async (appointmentData) => {
    set({ isBooking: true });
    try {
      const res = await axiosInstance.post("/appointment", appointmentData);
      toast.success("Appointment booked successfully");
      get().getUserAppointments();
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
      throw error;
    } finally {
      set({ isBooking: false });
    }
  },

  uploadReports: async (files) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const base64 = await convertToBase64(file);
        const response = await axiosInstance.post("/upload", {
          file: base64,
          folder: "appointments/reports",
        });
        return {
          fileName: file.name,
          fileUrl: response.data.url,
          fileType: file.type,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      return uploadedFiles;
    } catch (error) {
      toast.error("Failed to upload reports");
      throw error;
    }
  },

  getUserAppointments: async (status) => {
    set({ isLoading: true });
    try {
      const params = status ? `?status=${status}` : "";
      const res = await axiosInstance.get(`/appointment${params}`);
      set({ appointments: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch appointments");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getAppointmentById: async (appointmentId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/appointment/${appointmentId}`);
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch appointment details");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelAppointment: async (appointmentId, reason) => {
    try {
      const res = await axiosInstance.put(
        `/appointment/${appointmentId}/cancel`,
        { reason },
      );
      toast.success("Appointment cancelled");
      get().getUserAppointments();
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
      throw error;
    }
  },

  setSelectedDoctor: (doctor) => {
    set({ selectedDoctor: doctor });
  },

  clearAvailableSlots: () => {
    set({ availableSlots: [] });
  },
}));

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
