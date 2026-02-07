import { create } from 'zustand';
import { axiosInstance } from '../api/api';
import toast from 'react-hot-toast';

export const useUserAuthStore = create((set) => ({
  user: null,
  isUserAuthenticated: false,
  isLoggedIn: false,

  setUser: (userData) => set({ user: userData }),
  setIsUserAuthenticated: (status) => set({ isUserAuthenticated: status }),
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  isLoggingIn: false,
  isSigningUp: false,
  isAuthLoading: false,

  userLogin: async (userData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", userData);
      set({ user: res.data.data, isLoggedIn: true });
      toast.success("Login successful!");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data.message || error.message,
      );
      toast.error(
        `Login failed: ${error.response?.data.message || error.message}`,
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  userSignup: async (userData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/user/signup", userData);

      set({ user: res.data.data, isLoggedIn: true });
      toast.success("Signup successful!");
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response?.data.message || error.message,
      );
      toast.error(
        `Signup failed: ${error.response?.data.message || error.message}`,
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  userLogout: async () => {
    try {
      await axiosInstance.post("/user/logout");
      set({ user: null, isLoggedIn: false, isUserAuthenticated: false });
      toast.success("Logout successful!");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data.message || error.message,
      );
      toast.error(
        `Logout failed: ${error.response?.data.message || error.message}`,
      );
    }
  },

  verifyUserOtp: async (userId, otp) => {
    try {
      const res = await axiosInstance.post("/user/verify", {
        userId,
        otp: otp.join(""),
      });
      set({ user: res.data.data, isUserAuthenticated: true });
      toast.success("OTP verified successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  },

  checkAuth: async () => {
    set({ isAuthLoading: true });
    try {
      const res = await axiosInstance.get("/user/check-auth");
      set({ user: res.data.data, isUserAuthenticated: true, isLoggedIn: true });
    } catch (error) {
      console.log("User not authenticated");
    } finally {
      set({ isAuthLoading: false });
    }
  },

  updateUserProfile: async (updatedData) => {
    try {
      const res = await axiosInstance.put("/user/updateProfile", updatedData);
      set({ user: res.data.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Profile update failed:",
        error.response?.data.message || error.message,
      );
      toast.error(
        `Profile update failed: ${error.response?.data.message || error.message}`,
      );
    }
  },

  updateUserProfilePicture: async (profilePicture) => {
    try {
      const res = await axiosInstance.put("/user/updateProfilePicture", {
        profilePicture,
      });
      set({ user: res.data.data });
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error(
        "Profile picture update failed:",
        error.response?.data.message || error.message,
      );
      toast.error(
        `Profile picture update failed: ${error.response?.data.message || error.message}`,
      );
    }
  },

  updateUserPassword: async (userData) => {
    try {
      const res = await axiosInstance.put("/user/updatePassword", userData);
      return res.data;
      
    } catch (error) {
      console.error("Update password error:", error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Something went wrong while updating password",
      };
    }
  },

}));