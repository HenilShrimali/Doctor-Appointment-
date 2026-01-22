import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import { toast } from "react-hot-toast";

export const useAdminStore = create((set) => ({
  pendingClinics: [],
  clinics: [],
  users: [],
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
}));
