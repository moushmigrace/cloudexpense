import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Request interceptor to automatically add the auth token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error fetching auth token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to automatically redirect on a 401 error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — redirecting to login");
      // Hard redirect is fine for a global handler like this
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;