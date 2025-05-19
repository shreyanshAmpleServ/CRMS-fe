import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All dashboard
export const fetchTaskReport = createAsyncThunk(
  "taskReport/fetchTaskReport",
  async (filterDays, thunkAPI) => {
    try {
      const params = {}
      // if (filterDays.startDate) params.startDate = moment(filterDays.startDate).toISOString()
      // if (filterDays.endDate) params.enDate = moment(filterDays.endDate).toISOString()
      if (filterDays) params.filterDays = filterDays
    
      const response = await apiClient.get("/v1/task-report",{params});
      return response.data; // Returns a list of taskReport
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch taskReport",
      );
    }
  },
);


const taskReportSlice = createSlice({
  name: "taskReport",
  initialState: {
    taskReport: [],
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
      .addCase(fetchTaskReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskReport.fulfilled, (state, action) => {
        state.loading = false;
        state.taskReport = action.payload.data;
      })
      .addCase(fetchTaskReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = taskReportSlice.actions;
export default taskReportSlice.reducer;
