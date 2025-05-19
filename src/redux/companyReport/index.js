import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All dashboard
export const fetchCompanyReport = createAsyncThunk(
  "companyReport/fetchCompanyReport",
  async (filterDays, thunkAPI) => {
    try {
      const params = {}
      // if (filterDays.startDate) params.startDate = moment(filterDays.startDate).toISOString()
      // if (filterDays.endDate) params.enDate = moment(filterDays.endDate).toISOString()
      if (filterDays) params.filterDays = filterDays
    
      console.log("params",params,filterDays )
      const response = await apiClient.get("/v1/company-report",{params});
      return response.data; // Returns a list of companyReport
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch companyReport",
      );
    }
  },
);


const companyReportSlice = createSlice({
  name: "companyReport",
  initialState: {
    companyReport: [],
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
      .addCase(fetchCompanyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.companyReport = action.payload.data;
      })
      .addCase(fetchCompanyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = companyReportSlice.actions;
export default companyReportSlice.reducer;
