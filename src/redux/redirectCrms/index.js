import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import axios from "axios";

// Login API Call
export const registerUser = createAsyncThunk(
  "ngAuth/registerUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/register", credentials);
      const userData = response.data;
      return userData; // Backend should send user info
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);
// Login API Call
export const loginWithToken = createAsyncThunk(
  "ngAuth/loginWithToken",
  async (credentials, thunkAPI) => {
    try {
      // const response = await apiClient.post('/v1/login', credentials);
      // const response = await apiClient.post("/v1/deals", dealData);
      const response = await toast.promise(
        apiClient.post("v1/crms/public/login", credentials),
        {
          // loading: "Sighing in...",
          // success: (res) => res.data.message || "Deal added successfully!",
          error: (err) => {
            const apiMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Failed to sign in";
            return apiMessage;
          },
        }
      );
      console.log("Response : ", response);
      const userData = response.data.data;

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "permissions",
        userData?.permissions?.data
          ? Array.isArray(userData?.permissions?.data)
            ? JSON.stringify(userData?.permissions?.data)
            : userData?.permissions?.data
          : Array.isArray(userData?.data?.permissions)
            ? JSON.stringify(userData?.data?.permissions)
            : userData?.data?.permissions?.permissions
      );

      // localStorage.setItem("role_id", userData?.data?.role_id);
      localStorage.setItem("redirectLogin", true);
      localStorage.setItem("role", "admin");
      localStorage.setItem("BLApiUrl", userData?.BLApiUrl);
      localStorage.setItem("Domain", userData?.Domain);
      localStorage.setItem("api_url", userData?.api_url);
      localStorage.setItem("SubDomain", userData?.SubDomain);
      localStorage.setItem("DBName", userData?.DBName);
      // localStorage.setItem("role", userData?.data?.role);
      localStorage.setItem("authToken", userData?.token);
      localStorage.setItem("user", JSON.stringify(userData?.user)); // Persist user dat
      return userData; // Backend should send user info
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Logout API Call
export const logoutUserWithToken = createAsyncThunk(
  "ngAuth/logoutUserWithToken",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("authToken"); // Or sessionStorage, or a context
    const BLApiUrl = localStorage.getItem("BLApiUrl"); // Or sessionStorage, or a context
    const Domain = localStorage.getItem("Domain"); // Or sessionStorage, or a context
    const SubDomain = localStorage.getItem("SubDomain"); // Or sessionStorage, or a context
    console.log("Token : ", token);
    try {
      // await axios(BLApiUrl + "/api/Auth/Logout", {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   withCredentials: true,
      // });
      localStorage.removeItem("isAuthenticated"); // Clear auth state
      localStorage.removeItem("permissions"); // Clear auth state
      localStorage.removeItem("role");
      localStorage.removeItem("BLApiUrl");
      localStorage.removeItem("Domain");
      localStorage.removeItem("api_url");
      localStorage.removeItem("SubDomain");
      localStorage.removeItem("DBName");
      localStorage.removeItem("authToken"); // Clear auth state
      localStorage.removeItem("user"); // Clear auth state
      localStorage.removeItem("redirectLogin"); // Clear auth state
      return true; // Backend clears the cookie
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// Load User API Call
export const loadUser = createAsyncThunk(
  "ngAuth/loadUser",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/profile", {
        withCredentials: true,
      });
      const userData = response.data;

      localStorage.setItem("user", JSON.stringify(userData?.data)); // Persist user dat
      return userData; // Backend should return user info
    } catch (error) {
      localStorage.removeItem("isAuthenticated"); // Ensure sync with logout
      return thunkAPI.rejectWithValue(
        error.response?.data || "Not authenticated"
      );
    }
  }
);

const ngAuthSlice = createSlice({
  name: "ngAuth",
  initialState: {
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true", // Load initial state from localStorage
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginWithToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(loginWithToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUserWithToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUserWithToken.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUserWithToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default ngAuthSlice.reducer;
