// src/utils/axiosConfig.js
import axios from "axios";

// Configure Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "233", // Set your API base URL
  withCredentials: true,
});

// 🔐 Add a request interceptor to attach the token
apiClient.interceptors.request.use(
  (config) => {
    const isRedirectional = localStorage.getItem("redirectLogin");
    const token = localStorage.getItem("authToken"); // Or sessionStorage, or a context
    if (isRedirectional) {
      const BLApiUrl = localStorage.getItem("BLApiUrl"); // Or sessionStorage, or a context
      const Domain = localStorage.getItem("Domain"); // Or sessionStorage, or a context
      config.headers.BLApiUrl = BLApiUrl;
      config.headers.domain = Domain;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      // Handle unauthorized access (e.g., redirect to login)
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
