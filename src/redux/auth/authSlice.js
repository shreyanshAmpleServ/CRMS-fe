import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/axiosConfig';
import toast from 'react-hot-toast';

// Login API Call
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials, thunkAPI) => {
    try {
    
      const response = await apiClient.post('/v1/register', credentials);
      const userData = response.data;
      return userData; // Backend should send user info
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);
// Login API Call
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      // const response = await apiClient.post('/v1/login', credentials);
         // const response = await apiClient.post("/v1/deals", dealData);
      const response = await toast.promise(
        apiClient.post('/v1/login', credentials),
        {
          loading: "Sighing in...",
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
      console.log("Response : ", response)
      const userData = response.data;
     
      localStorage.setItem("isAuthenticated", "true"); 
      localStorage.setItem("permissions",userData?.data?.permissions?.permissions ? 
      Array.isArray(userData?.data?.permissions?.permissions) ? JSON.stringify(userData?.data?.permissions?.permissions) : userData?.data?.permissions?.permissions  : 
      Array.isArray(userData?.data?.permissions) ? JSON.stringify(userData?.data?.permissions) : userData?.data?.permissions?.permissions )

      localStorage.setItem("role_id", userData?.data?.role_id)
      localStorage.setItem("role", userData?.data?.role)
      localStorage.setItem("user", JSON.stringify(userData?.data)); // Persist user dat
      return userData; // Backend should send user info
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Logout API Call
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      await apiClient.post('/v1/logout');
      localStorage.removeItem("isAuthenticated"); // Clear auth state
      localStorage.removeItem("permissions"); // Clear auth state
      localStorage.removeItem("user"); // Clear auth state
      localStorage.removeItem("role_id"); // Clear auth state
      localStorage.removeItem("role"); // Clear auth state
      return true; // Backend clears the cookie
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// Load User API Call
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get('/v1/profile', { withCredentials: true });
      const userData = response.data;

      localStorage.setItem("user", JSON.stringify(userData?.data)); // Persist user dat
      return userData; // Backend should return user info
    } catch (error) {
      localStorage.removeItem("isAuthenticated"); // Ensure sync with logout
      return thunkAPI.rejectWithValue(error.response?.data || 'Not authenticated');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
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

export default authSlice.reducer;
