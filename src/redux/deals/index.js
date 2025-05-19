import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All Deals
export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search:datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate : datas?.endDate?.toISOString() || "",
        status:datas?.status || "",
        priority:datas?.priority || ""
      }
      const response = await apiClient.get("/v1/deals",{params});
      return response.data; // Returns a list of deals
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch deals",
      );
    }
  },
);

// Add a Deal
export const addDeal = createAsyncThunk(
  "deals/addDeal",
  async (dealData, thunkAPI) => {
    try {
      // const response = await apiClient.post("/v1/deals", dealData);
      const response = await toast.promise(
        apiClient.post("/v1/deals", dealData),
        {
          loading: " Deal adding...",
          success: (res) => res.data.message || "Deal added successfully!",
          error: "Failed to add deal",
        }
      );
      return response.data; // Returns the newly added deal
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add deal",
      );
    }
  },
);

// Update a Deal
export const updateDeal = createAsyncThunk(
  "deals/updateDeal",
  async ({ id, dealData }, thunkAPI) => {
    try {
      // const response = await apiClient.put(`/v1/deals/${id}`, dealData);
      const response = await toast.promise(
        apiClient.put(`/v1/deals/${id}`, dealData),
        {
          loading: " Deal updating...",
          success: (res) => res.data.message || "Deal updated successfully!",
          error: "Failed to update deal",
        }
      );
      return response.data; // Returns the updated deal
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update deal",
      );
    }
  },
);

// Delete a Deal
export const deleteDeal = createAsyncThunk(
  "deals/deleteDeal",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/deals/${id}`);
      return {
        data: { id },
        message: response.data.message || "Deal deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete deal",
      );
    }
  },
);

// Fetch a Single Deal by ID
export const fetchDealById = createAsyncThunk(
  "deals/fetchDealById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/deals/${id}`);
      return response.data; // Returns the deal details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch deal",
      );
    }
  },
);
// Update pipline stage
export const updateDealStage = createAsyncThunk(
  "deals/updateDealStage",
  async (dealData, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/pipelines/update-stage/${dealData.id}`, dealData?.deal);
      return response.data; // Returns the newly added deal
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add deal",
      );
    }
  },
);

const dealsSlice = createSlice({
  name: "deals",
  initialState: {
    deals: [],
    dealDetail: null,
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
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload.data;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals ={...state.deals,data: [...state.deals,action.payload.data]};
        state.success = action.payload.message;
      })
      .addCase(addDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deals.data?.findIndex(
          (deal) => deal.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.deals.data[index] = action.payload.data;
        } else {
          state.deals ={...state.deals , data: [...state.deals,action.payload.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.deals.data.filter(
          (deal) => deal.id !== action.payload.data.id,
        );
        state.deals = {...state.deals,data:filterData}
        state.success = action.payload.message;
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchDealById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealById.fulfilled, (state, action) => {
        state.loading = false;
        state.dealDetail = action.payload.data;
      })
      .addCase(fetchDealById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = dealsSlice.actions;
export default dealsSlice.reducer;
