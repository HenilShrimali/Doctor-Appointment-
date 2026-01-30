import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const useClinicAppointmentStore = create((set, get) => ({
  appointments: [],
  stats: null,
  isLoading: false,

  getClinicAppointments: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.doctorId) params.append("doctorId", filters.doctorId);
      if (filters.date) params.append("date", filters.date);

      const res = await axiosInstance.get(`/clinic/appointments?${params}`);
      set({ appointments: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch appointments");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getAppointmentStats: async () => {
    try {
      const res = await axiosInstance.get("/clinic/appointments/stats");
      set({ stats: res.data.data });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  },

  getAppointmentById: async (appointmentId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/clinic/appointments/${appointmentId}`,
      );
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch appointment details");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
