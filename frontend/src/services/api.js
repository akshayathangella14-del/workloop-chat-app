import axios from "axios";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const requestConfig = {
  withCredentials: true,
};

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

export const getErrorMessage = (err, fallback = "Something went wrong") =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  fallback;

export default api;
