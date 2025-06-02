import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All campaign
export const fetchCampaign = createAsyncThunk(
  "campaigns/fetchCampaign",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search:datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate : datas?.endDate?.toISOString() || "",
      }
      const response = await apiClient.get("/v1/campaign",{params});
      return response.data; // Returns a list of campaign
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch campaign",
      );
    }
  },
);

// Add a campaign
export const createCampaign = createAsyncThunk(
  "campaigns/createCampaign",
  async (campaignData, thunkAPI) => {
    try {
      // const response = await apiClient.post("/v1/campaign", campaignData);
      const response = await toast.promise(
        apiClient.post("/v1/campaign", campaignData),
        {
          loading: "Campaign adding...",
          success: (res) => res.data.message || "Campaign added successfully!",
          error: "Failed to add campaign",
        }
      );
      return response.data; // Returns the newly added campaign
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add campaign",
      );
    }
  },
);

// Update a campaign
export const updateCampaign = createAsyncThunk(
  "campaigns/updateCampaign",
  async ({ id, campaignData }, thunkAPI) => {
    try {
      // const response = await apiClient.put(`/v1/campaign/${id}`, campaignData);
      const response = await toast.promise(
        apiClient.put(`/v1/campaign/${id}`, campaignData),
        {
          loading: "Campaign updating...",
          success: (res) => res.data.message || "Campaign updated successfully!",
          error: "Failed to update campaign",
        }
      );
      return response.data; // Returns the updated campaign
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update campaign",
      );
    }
  },
);

// Delete a campaign
export const deleteCampaign = createAsyncThunk(
  "campaigns/deleteCampaign",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/campaign/${id}`);
      return {
        data: { id },
        message: response.data.message || "Campaign deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete campaign",
      );
    }
  },
);

// Fetch a Single campaign by ID
export const fetchCampaignById = createAsyncThunk(
  "campaigns/fetchCampaignById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/campaign/${id}`);
      return response.data; // Returns the campaign details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch campaign",
      );
    }
  },
);


const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: {
    campaigns: {},
    campaignDetail: null,
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
      .addCase(fetchCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload.data;
      })
      .addCase(fetchCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns ={...state.campaigns,data: [...state.campaigns,action.payload.data]};
        state.success = action.payload.message;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.campaigns.data?.findIndex(
          (campaign) => campaign.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.campaigns.data[index] = action.payload.data;
        } else {
          state.campaigns ={...state.campaigns , data: [...state.campaigns,action.payload.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.campaigns.data.filter(
          (campaign) => campaign.id !== action.payload.data.id,
        );
        state.campaigns = {...state.campaigns,data:filterData}
        state.success = action.payload.message;
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCampaignById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignDetail = action.payload.data;
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = campaignsSlice.actions;
export default campaignsSlice.reducer;
