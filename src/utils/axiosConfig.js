// src/utils/axiosConfig.js
import axios from "axios";

// Configure Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "233", // Set your API base URL
  withCredentials: true, 
});

// Add a response interceptor to handle unauthorized errors globally
apiClient.interceptors.response.use(
  (response) => (response),
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
