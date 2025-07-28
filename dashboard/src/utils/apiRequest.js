// dashboard/src/utils/apiRequest.js
import axios from "axios";
import { toast } from "react-toastify";

const ApiRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,  // ← set this in .env.local
  withCredentials: true,                           // cookies for tokens
});

ApiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // network error?
    if (!error.response) {
      toast.error("Network error—please check your connection.");
      return Promise.reject(error);
    }
    const { status } = error.response;

    // If we get a 401/403 and we haven't already retried:
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // hit your refresh‐token endpoint (cookies carry the refresh token)
        await ApiRequest.post("/user/refresh-token");
        // and retry the original request
        return ApiRequest(originalRequest);
      } catch (refreshErr) {
        // refresh failed—your user is logged out
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default ApiRequest;
