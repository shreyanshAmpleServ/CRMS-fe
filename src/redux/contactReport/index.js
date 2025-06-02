import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All dashboard
export const fetchContactReport = createAsyncThunk(
  "contactReport/fetchContactReport",
  async (filterDays, thunkAPI) => {
    try {
      const params = {}
      // if (filterDays.startDate) params.startDate = moment(filterDays.startDate).toISOString()
      // if (filterDays.endDate) params.enDate = moment(filterDays.endDate).toISOString()
      if (filterDays) params.filterDays = filterDays
    
      console.log("params",params,filterDays )
      const response = await apiClient.get("/v1/contact-report",{params});
      return response.data; // Returns a list of contactReport
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch contactReport",
      );
    }
  },
);


const contactReportSlice = createSlice({
  name: "contactReport",
  initialState: {
    contactReport: [],
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
      .addCase(fetchContactReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactReport.fulfilled, (state, action) => {
        state.loading = false;
        state.contactReport = action.payload.data;
      })
      .addCase(fetchContactReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = contactReportSlice.actions;
export default contactReportSlice.reducer;
