import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All Vendors
export const fetchVendors = createAsyncThunk(
  "vendor/fetchVendors",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/vendor`);
      return response.data; // Returns a list of vendor
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch vendor",
      );
    }
  },
);

// Add a vendor
export const addVendor = createAsyncThunk(
  "vendor/addVendor",
  async (vendorData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/vendor", vendorData),
        {
          loading: " Vendor adding...",
          success: (res) => res.data.message || "Vendor added successfully!",
          error: "Failed to add vendor",
        }
      );
      // const response = await apiClient.post("/v1/vendor", vendorData);
      // toast.success(response.data.message || "vendor created successfully");
      return response.data; // Returns the newly added vendor
    } catch (error) {
      toast.error(error.response?.data || "Failed to add vendor");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add vendor",
      );
    }
  },
);

// Update a vendor
export const updateVendor = createAsyncThunk(
  "vendor/updateVendor",
  async ({ id, vendorData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/vendor/${id}`, vendorData),
        {
          loading: " Vendor updating...",
          success: (res) => res.data.message || "Vendor updated successfully!",
          error: "Failed to update vendor",
        }
      );
      // const response = await apiClient.put(`/v1/vendor/${id}`, vendorData);
      // toast.success(response.data.message || "vendor updated successfully");
      return response.data; // Returns the updated vendor
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Vendor not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Vendor not found",
        });
      }
      toast.error(error.response?.data || "Failed to update vendor");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update vendor",
      );
    }
  },
);

// Delete a vendor
export const deleteVenor = createAsyncThunk(
  "vendor/deleteVenor",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/vendor/${id}`);
      toast.success(response.data.message || "vendor deleted successfully");
      return {
        data: { id },
        message: response.data.message || "vendor deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete vendor");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete vendor",
      );
    }
  },
);

// Fetch a Single vendor by ID
export const fetchVendorById = createAsyncThunk(
  "vendor/fetchVendorById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/vendor/${id}`);
      return response.data; // Returns the vendor details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch vendor",
      );
    }
  },
);

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    vendor: [],
    vendorDetail: null,
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
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload.data;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor ={...state.vendor,data: [action.payload.data, ...state.vendor.data]};
        state.success = action.payload.message;
      })
      .addCase(addVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vendor.data?.findIndex(
          (user) => user.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.vendor.data[index] = action.payload.data;
        } else {
          state.vendor ={...state.vendor , data: [action.payload.data, ...state.vendor.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteVenor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVenor.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.vendor.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.vendor = {...state.vendor,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteVenor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorDetail = action.payload.data;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = vendorSlice.actions;
export default vendorSlice.reducer;
