import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All dashboard
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (filterDays, thunkAPI) => {
    try {
      const params = {}
      // if (filterDays.startDate) params.startDate = moment(filterDays.startDate).toISOString()
      // if (filterDays.endDate) params.enDate = moment(filterDays.endDate).toISOString()
      if (filterDays) params.filterDays = filterDays
    
      console.log("params",params,filterDays )
      const response = await apiClient.get("/v1/dashboard",{params});
      return response.data; // Returns a list of dashboard
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch dashboard",
      );
    }
  },
);
// Fetch All dashboard
export const fetchLeadDashboard = createAsyncThunk(
  "dashboard/fetchLeadDashboard",
  async (filterDays, thunkAPI) => {
    try {
      const params = {}
      // if (filterDays.startDate) params.startDate = moment(filterDays.startDate).toISOString()
      // if (filterDays.endDate) params.enDate = moment(filterDays.endDate).toISOString()
      if (filterDays) params.filterDays = filterDays
    
      console.log("params",params,filterDays )
      const response = await apiClient.get("/v1/lead-dashboard",{params});
      return response.data; // Returns a list of dashboard
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch lead dashboard",
      );
    }
  },
);


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboard: [],
    leadDashboard:[],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })  
      .addCase(fetchLeadDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leadDashboard = action.payload.data;
      })
      .addCase(fetchLeadDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = dashboardSlice.actions;
export default dashboardSlice.reducer;
