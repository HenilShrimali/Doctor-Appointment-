import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

export const useClinicDoctorStore = create((set) => ({
  doctors: [],
  selectedDoctor: null,
  isLoading: false,
  isAddingDoctor: false,
  isUpdatingDoctor: false,

  getDoctors: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/clinic/doctors/getDoctors");
      set({ doctors: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      set({ isLoading: false });
    }
  },

  getDoctor: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/clinic/doctors/${id}`);
      set({ selectedDoctor: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch doctor");
    } finally {
      set({ isLoading: false });
    }
  },

  addDoctor: async (doctorData) => {
    set({ isAddingDoctor: true });
    try {
      const res = await axiosInstance.post("/clinic/doctors/add", doctorData);
      set((state) => ({
        doctors: [res.data.data, ...state.doctors],
      }));
      toast.success("Doctor added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Add doctor failed");
    } finally {
      set({ isAddingDoctor: false });
    }
  },

  updateDoctor: async (id, doctorData) => {
    set({ isUpdatingDoctor: true });
    try {
      const res = await axiosInstance.put(`/clinic/doctors/${id}`, doctorData);
      set((state) => ({
        doctors: state.doctors.map((doc) =>
          doc._id === id ? res.data.data : doc,
        ),
      }));
      toast.success("Doctor updated");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      set({ isUpdatingDoctor: false });
    }
  },

  toggleDoctorStatus: async (id) => {
    try {
      const res = await axiosInstance.patch(
        `/clinic/doctors/${id}/toggleStatus`,
      );
      set((state) => ({
        doctors: state.doctors.map((doc) =>
          doc._id === id ? res.data.data : doc,
        ),
      }));
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  },
}));
