import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All Leads
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search:datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate : datas?.endDate?.toISOString() || "",
        status : datas?.status || "",
        // priority : datas?.priority || ""
      }
      const response = await apiClient.get(`/v1/leads`,{params});
      // const response = await apiClient.get(`/v1/leads?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of leads
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch leads",
      );
    }
  },
);

// Fetch a Lead by ID
export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/leads/${id}`);
      return response.data; // Returns the lead details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch lead",
      );
    }
  },
);

// Create a Lead
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData, thunkAPI) => {
    try {
      // const response = await apiClient.post("/v1/leads", leadData);
      const response = await toast.promise(
        apiClient.post("/v1/leads", leadData),
        {
          loading: " Lead adding...",
          success: (res) => res.data.message || "Lead added successfully!",
          error: "Failed to add lead",
        }
      );
      return response.data; // Returns the newly created lead
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create lead",
      );
    }
  },
);

// Update a Lead
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, leadData }, thunkAPI) => {
    try {
      // const response = await apiClient.put(`/v1/leads/${id}`, leadData);
      const response = await toast.promise(
        apiClient.put(`/v1/leads/${id}`, leadData),
        {
          loading: " Lead updating...",
          success: (res) => res.data.message || "Lead updated successfully!",
          error: "Failed to update lead",
        }
      );
      return response.data; // Returns the updated lead
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Lead not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update lead",
      );
    }
  },
);

// Delete a Lead
export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/leads/${id}`);
      return {
        data: { id },
        message: response.data.message || "Lead deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete lead",
      );
    }
  },
);

// Fetch All Leads statuses
export const fetchLeadStatuses = createAsyncThunk(
  "leads/fetchLeadStatuses",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/lead-statuses");
      return response.data; // Returns a list of leads
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch lead statuses",
      );
    }
  },
);
const leadSlice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    leadStatuses: [],
    leadDetail: null,
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.leadStatuses = action.payload.data;
      })
      .addCase(fetchLeadStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.data;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.leadDetail = action.payload.data;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads ={...state.leads, data: [action.payload.data, ...state.leads.data]};
        state.success = action.payload.message;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.leads.data?.findIndex(
          (lead) => lead.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.leads.data[index] = action.payload.data;
        } else {
          state.leads ={...state.leads , data: [action.payload.data, ...state.leads.data]};

        }
        state.success = action.payload.message;
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        const filteredData = state.leads.data?.filter(
          (lead) => lead.id !== action.payload.data.id,
        );
        state.leads = {...state.leads,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = leadSlice.actions;
export default leadSlice.reducer;
