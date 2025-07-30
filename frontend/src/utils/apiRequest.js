// frontend/utils/apiRequest.js
import axios from "axios";
import { toast } from "react-toastify";

const ApiRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,  // e.g. http://localhost:8000/api/v1
  withCredentials: true,
});

// Response interceptor to catch auth failures and auto‑refresh
ApiRequest.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Network‐level errors
    if (!error.response) {
      toast.error("Network error—please check your connection.");
      return Promise.reject(error);
    }

    const { status } = error.response;

    // If 401/403 and we haven't already retried
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh‑token endpoint; cookies carry the refresh token
        await ApiRequest.post("/user/refresh-token");

        // Retry the original request
        return ApiRequest(originalRequest);
      } catch (refreshError) {
        // Refresh failed—optionally redirect to login here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default ApiRequest;
