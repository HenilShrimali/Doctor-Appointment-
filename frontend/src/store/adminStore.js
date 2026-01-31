import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import { toast } from "react-hot-toast";

export const useAdminStore = create((set) => ({
  pendingClinics: [],
  clinics: [],
  users: [],
  doctors: [],
  appointments: [],
  stats:null,
  isLoading: false,

  fetchPendingClinics: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/clinic/pending");
      set({ pendingClinics: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch pending clinics");
    } finally {
      set({ isLoading: false });
    }
  },

  approveClinic: async (clinicId) => {
    try {
      await axiosInstance.put(`/admin/clinic/approve/${clinicId}`);
      toast.success("Clinic approved");
      set((state) => ({
        pendingClinics: state.pendingClinics.filter((c) => c._id !== clinicId),
      }));
    } catch (error) {
      toast.error("Failed to approve clinic");
    }
  },

  rejectClinic: async (clinicId) => {
    try {
      await axiosInstance.put(`/admin/clinic/reject/${clinicId}`);
      toast.success("Clinic rejected");
      set((state) => ({
        pendingClinics: state.pendingClinics.filter((c) => c._id !== clinicId),
      }));
    } catch (error) {
      toast.error("Failed to reject clinic");
    }
  },

  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/users");
      set({ users: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllClinics: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/clinic");
      set({ clinics: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch clinics");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAllDoctors: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/admin/doctors");
      set({ doctors: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      set({ isLoading: false });
    }
  },

  getAppointments: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.clinicId) params.append("clinicId", filters.clinicId);
      if (filters.doctorId) params.append("doctorId", filters.doctorId);
      if (filters.date) params.append("date", filters.date);

      const res = await axiosInstance.get(`/admin/appointments?${params}`);
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
      const res = await axiosInstance.get("/admin/appointments/stats");
      set({ stats: res.data.data });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  },

  getAppointmentById: async (appointmentId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/admin/appointments/${appointmentId}`,
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
