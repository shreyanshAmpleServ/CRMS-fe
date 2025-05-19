import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All dashboard
export const fetchProjectReport = createAsyncThunk(
  "projectReport/fetchProjectReport",
  async (filterDays, thunkAPI) => {
    try {
      const params = {}
      // if (filterDays.startDate) params.startDate = moment(filterDays.startDate).toISOString()
      // if (filterDays.endDate) params.enDate = moment(filterDays.endDate).toISOString()
      if (filterDays) params.filterDays = filterDays
    
      console.log("params",params,filterDays )
      const response = await apiClient.get("/v1/project-report",{params});
      return response.data; // Returns a list of projectReport
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch projectReport",
      );
    }
  },
);


const projectReportSlice = createSlice({
  name: "projectReport",
  initialState: {
    projectReport: [],
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
      .addCase(fetchProjectReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectReport.fulfilled, (state, action) => {
        state.loading = false;
        state.projectReport = action.payload.data;
      })
      .addCase(fetchProjectReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = projectReportSlice.actions;
export default projectReportSlice.reducer;
