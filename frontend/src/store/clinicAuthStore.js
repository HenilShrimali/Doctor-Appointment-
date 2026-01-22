import { create } from "zustand";
import {axiosInstance} from "../api/api.js";
import { toast } from "react-hot-toast";

export const useClinicAuthStore = create((set) => ({
  clinic: null,
  isClinicAuthenticated: false,
  isClinicLoggingIn: false,
  isClinicSigningUp: false,
  isUpdatingProfile: false,
  isClinicAuthLoading: true,

  clinicSignup: async (clinicData) => {
    set({ isClinicSigningUp: true });
    try {
      const res = await axiosInstance.post("/clinic/signup", clinicData);
      set({
        clinic: res.data.data,
        isClinicAuthenticated: false,
      });
      toast.success("Clinic request submitted for approval");
    } catch (error) {
      toast.error(error.response?.data?.message || "Clinic signup failed");
    } finally {
      set({ isClinicSigningUp: false });
    }
  },

  clinicLogin: async (loginData) => {
    set({ isClinicLoggingIn: true });
    try {
      const res = await axiosInstance.post("/clinic/login", loginData);
      set({
        clinic: res.data.data,
        isClinicAuthenticated: true,
      });
      toast.success("Clinic login successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Clinic login failed");
    } finally {
      set({ isClinicLoggingIn: false });
    }
  },

  clinicLogout: async () => {
    try {
      await axiosInstance.post("/clinic/logout");
      set({
        clinic: null,
        isClinicAuthenticated: false,
      });
      toast.success("Clinic logged out");
    } catch (error) {
      toast.error("Logout failed");
    }
  },

  checkClinicAuth: async () => {
    set({ isClinicAuthLoading: true });
    try {
      const res = await axiosInstance.get("/clinic/check-auth");
      set({
        clinic: res.data.data,
        isClinicAuthenticated: true,
      });
    } catch (error) {
      set({
        clinic: null,
        isClinicAuthenticated: false,
      });
    }finally{
        set({ isClinicAuthLoading: false });
    }
  },

  updateClinicProfile: async (profileData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/clinic/updateProfile", profileData);
      set({ clinic: res.data.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateClinicProfilePicture: async (base64Image) => {
    try {
      const res = await axiosInstance.put("/clinic/updateProfilePicture", {
        profilePicture: base64Image,
      });
      set({ clinic: res.data.data });
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Image upload failed");
    }
  },

}));