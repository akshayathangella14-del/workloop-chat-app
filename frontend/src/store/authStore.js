import { create } from "zustand";
import { api, getErrorMessage } from "../services/api";

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

      const res = await api.post("/auth/login", userCred);

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

      const res = await api.get("/auth/logout");

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

      const res = await api.get("/auth/check-auth");

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
