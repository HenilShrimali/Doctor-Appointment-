import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const useDoctorAuthStore = create((set) => ({
  doctor: null,
  isDoctorAuthenticated: false,
  isDoctorLoggingIn: false,
  isDoctorAuthLoading: false,
  isUpdatingProfile: false,

  doctorLogin: async (loginData) => {
    set({ isDoctorLoggingIn: true });
    try {
      const res = await axiosInstance.post("/doctor/login", loginData);
      set({
        doctor: res.data.data,
        isDoctorAuthenticated: true,
      });
      toast.success("Doctor login successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isDoctorLoggingIn: false });
    }
  },

  doctorLogout: async () => {
    try {
      await axiosInstance.post("/doctor/logout");
      set({
        doctor: null,
        isDoctorAuthenticated: false,
      });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  checkDoctorAuth: async () => {
    set({ isDoctorAuthLoading: true });
    try {
      const res = await axiosInstance.get("/doctor/check-auth");
      set({
        doctor: res.data.data,
        isDoctorAuthenticated: true,
      });
    } catch (error) {
      set({
        doctor: null,
        isDoctorAuthenticated: false,
      });
    } finally {
      set({ isDoctorAuthLoading: false });
    }
  },

  updateDoctorProfile: async (profileData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put(
        "/doctor/update-profile",
        profileData
      );
      set({ doctor: res.data.data });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

}));