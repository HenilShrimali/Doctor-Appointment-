import { create } from "zustand";
import { axiosInstance } from "../api/api.js";
import toast from "react-hot-toast";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const useHealthRecordStore = create((set, get) => ({
  records: [],
  selectedRecord: null,
  isLoading: false,
  isUploading: false,
  isDeleting: false,

  uploadHealthRecord: async (title, files) => {
    set({ isUploading: true });
    try {
      const filesData = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            data: base64,
            name: file.name,
            type: file.type,
            size: file.size,
          };
        }),
      );

      const res = await axiosInstance.post("/healthRecords", {
        title,
        files: filesData,
      });

      set((state) => ({
        records: [res.data.data, ...state.records],
      }));

      toast.success("Health records uploaded successfully");
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
      throw error;
    } finally {
      set({ isUploading: false });
    }
  },

  getUserHealthRecords: async (search = "") => {
    set({ isLoading: true });
    try {
      const params = search ? `?search=${search}` : "";
      const res = await axiosInstance.get(`/healthRecords${params}`);
      set({ records: res.data.data });
    } catch (error) {
      toast.error("Failed to fetch health records");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getHealthRecordById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/healthRecords/${id}`);
      set({ selectedRecord: res.data.data });
      return res.data.data;
    } catch (error) {
      toast.error("Failed to fetch health record");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateHealthRecord: async (id, title) => {
    try {
      const res = await axiosInstance.put(`/healthRecords/${id}`, { title });

      set((state) => ({
        records: state.records.map((record) =>
          record._id === id ? res.data.data : record,
        ),
        selectedRecord:
          state.selectedRecord?._id === id
            ? res.data.data
            : state.selectedRecord,
      }));

      toast.success("Health record updated");
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      throw error;
    }
  },

  deleteHealthRecord: async (id) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/healthRecords/${id}`);

      set((state) => ({
        records: state.records.filter((record) => record._id !== id),
        selectedRecord:
          state.selectedRecord?._id === id ? null : state.selectedRecord,
      }));

      toast.success("Health record deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },

  deleteFileFromRecord: async (recordId, fileId) => {
    try {
      const res = await axiosInstance.delete(
        `/healthRecords/${recordId}/files/${fileId}`,
      );

      if (res.data.recordDeleted) {
        set((state) => ({
          records: state.records.filter((record) => record._id !== recordId),
          selectedRecord:
            state.selectedRecord?._id === recordId
              ? null
              : state.selectedRecord,
        }));
        toast.success("Last file deleted, record removed");
      } else {
        set((state) => ({
          records: state.records.map((record) =>
            record._id === recordId ? res.data.data : record,
          ),
          selectedRecord:
            state.selectedRecord?._id === recordId
              ? res.data.data
              : state.selectedRecord,
        }));
        toast.success("File deleted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      throw error;
    }
  },

  addFilesToRecord: async (recordId, files) => {
    set({ isUploading: true });
    try {
      const filesData = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            data: base64,
            name: file.name,
            type: file.type,
            size: file.size,
          };
        }),
      );

      const res = await axiosInstance.post(
        `/healthRecords/${recordId}/files`,
        {
          files: filesData,
        },
      );

      set((state) => ({
        records: state.records.map((record) =>
          record._id === recordId ? res.data.data : record,
        ),
        selectedRecord:
          state.selectedRecord?._id === recordId
            ? res.data.data
            : state.selectedRecord,
      }));

      toast.success("Files added successfully");
      return res.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
      throw error;
    } finally {
      set({ isUploading: false });
    }
  },

  clearSelectedRecord: () => {
    set({ selectedRecord: null });
  },

  
}));
