import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All dashboard
export const fetchDealReport = createAsyncThunk(
  "dealReport/fetchDealReport",
  async (filterDays, thunkAPI) => {
    try {
      const params = {}
      // if (filterDays.startDate) params.startDate = moment(filterDays.startDate).toISOString()
      // if (filterDays.endDate) params.enDate = moment(filterDays.endDate).toISOString()
      if (filterDays) params.filterDays = filterDays
    
      console.log("params",params,filterDays )
      const response = await apiClient.get("/v1/deal-report",{params});
      return response.data; // Returns a list of dealReport
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch dealReport",
      );
    }
  },
);


const dealReportSlice = createSlice({
  name: "dealReport",
  initialState: {
    dealReport: [],
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
      .addCase(fetchDealReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealReport.fulfilled, (state, action) => {
        state.loading = false;
        state.dealReport = action.payload.data;
      })
      .addCase(fetchDealReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = dealReportSlice.actions;
export default dealReportSlice.reducer;
