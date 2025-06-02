import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All dashboard
export const fetchLeadReport = createAsyncThunk(
  "leadReport/fetchLeadReport",
  async (filterDays, thunkAPI) => {
    try {
      const params = {}
      // if (filterDays.startDate) params.startDate = moment(filterDays.startDate).toISOString()
      // if (filterDays.endDate) params.enDate = moment(filterDays.endDate).toISOString()
      if (filterDays) params.filterDays = filterDays
    
      console.log("params",params,filterDays )
      const response = await apiClient.get("/v1/lead-report",{params});
      return response.data; // Returns a list of leadReport
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leadReport",
      );
    }
  },
);


const leadReportSlice = createSlice({
  name: "leadReport",
  initialState: {
    leadReport: [],
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
      .addCase(fetchLeadReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadReport.fulfilled, (state, action) => {
        state.loading = false;
        state.leadReport = action.payload.data;
      })
      .addCase(fetchLeadReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = leadReportSlice.actions;
export default leadReportSlice.reducer;
