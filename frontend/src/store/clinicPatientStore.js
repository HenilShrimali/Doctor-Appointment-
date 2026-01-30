import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const useClinicPatientStore = create((set, get) => ({
  patients: [],
  isLoading: false,

  getPatients: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/clinic/patients");
      set({ patients: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch patients");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getPatientHistory: async (patientId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/clinic/patients/${patientId}/history`,
      );
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch patient history");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  searchPatients: async (query) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/clinic/patients?search=${query}`);
      set({ patients: res.data.data });
    } catch (error) {
      toast.error("Search failed");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
