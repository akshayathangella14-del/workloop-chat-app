import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const requestConfig = { withCredentials: true };

const getErrorMessage = (err, fallback) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  fallback;

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  authChecked: false,
  error: null,

  login: async (userCred) => {
    try {
      set({
        loading: true,
        currentUser: null,
        isAuthenticated: false,
        error: null,
      });

      const res = await axios.post(`${BASE_URL}/auth/login`, userCred, requestConfig);

      if (res.status === 200) {
        set({
          currentUser: res.data?.payload,
          loading: false,
          isAuthenticated: true,
          authChecked: true,
          error: null,
        });
      }
    } catch (err) {
      console.log("err is ", err);
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        authChecked: true,
        error: getErrorMessage(err, "Login failed"),
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${BASE_URL}/auth/logout`, requestConfig);

      if (res.status === 200) {
        set({
          currentUser: null,
          isAuthenticated: false,
          error: null,
          loading: false,
          authChecked: true,
        });
      }
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        authChecked: true,
        error: getErrorMessage(err, "Logout failed"),
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${BASE_URL}/auth/check-auth`, requestConfig);

      set({
        currentUser: res.data?.payload,
        isAuthenticated: true,
        loading: false,
        authChecked: true,
        error: null,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
          authChecked: true,
          error: null,
        });
        return;
      }

      console.error("Auth check failed:", err);
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        authChecked: true,
        error: getErrorMessage(err, "Authentication check failed"),
      });
    }
  },

  clearError: () => set({ error: null }),
}));
