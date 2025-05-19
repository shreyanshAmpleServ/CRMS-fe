import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All purchase invoice
export const fetchPurchaseInvoice = createAsyncThunk(
  "purchaseInvoices/fetchPurchaseInvoice",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/purchase-invoice?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch purchase invoice",
      );
    }
  },
);

// Add a purchase invoice
export const addPurchaseInvoice = createAsyncThunk(
  "purchaseInvoices/addPurchaseInvoice",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/purchase-invoice", orderData),
        {
            loading: "Purchase invoice creating...",
            success: (res) => res.data.message || "Purchase invoice created successfully!",
            error: "Failed to create purchase invoice",
        }
    );
      // const response = await apiClient.post("/v1/purchase-invoice", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create purchase invoice");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create purchase invoice",
      );
    }
  },
);

// Update a purchase invoice
export const updatePurchaseInvoice = createAsyncThunk(
  "purchaseInvoices/updatePurchaseInvoice",
  async (orderData, thunkAPI) => {
    let id = orderData.get("id")
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/purchase-invoice/${id}`, orderData),
        {
          loading: "Purchase invoice updating...",
          success: (res) => res.data.message || "Purchase invoice updated successfully!",
          error: "Failed to update purchase invoice",
        }
      );
      // const response = await apiClient.put(`/v1/purchase-invoice/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Purchase invoice not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Purchase invoice not found",
        });
      }
      toast.error(error.response?.data || "Failed to update purchase invoice");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update purchase invoice",
      );
    }
  },
);

// Delete a purchase invoice
export const deletePurchaseInvoice = createAsyncThunk(
  "purchaseInvoices/deletePurchaseInvoice",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/purchase-invoice/${id}`),
        {
          loading: " purchase invoice deleting...",
          success: (res) => res.data.message || "Purchase invoice deleted successfully!",
          error: "Failed to delete purchase invoice",
        }
      );
      // const response = await apiClient.delete(`/v1/purchase-invoice/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "Purchase invoice deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete purchase invoice");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete purchase invoice",
      );
    }
  },
);

// Fetch a Single purchase invoice by ID
export const fetchPurchaseInvoiceById = createAsyncThunk(
  "purchaseInvoices/fetchPurchaseInvoiceById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/purchase-invoice/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch purchase invoice",
      );
    }
  },
);
// Fetch a Sales Type
export const fetchSalesType = createAsyncThunk(
  "purchaseInvoices/fetchSalesType",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/sales-types`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch sales type",
      );
    }
  },
);
// Fetch a Generated purchase invoice Code
export const fetchPurchaseInvoiceCode = createAsyncThunk(
  "purchaseInvoices/fetchPurchaseInvoiceCode",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/get-purchase-invoice-code`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch order code",
      );
    }
  },
);

const purchaseInvoicesSlice = createSlice({
  name: "purchaseInvoices",
  initialState: {
    purchaseInvoices: {},
    orderDetail: null,
    salesTypes:[],
    orderCode:null,
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
      .addCase(fetchPurchaseInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseInvoices = action.payload.data;
      })
      .addCase(fetchPurchaseInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addPurchaseInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchaseInvoice.fulfilled, (state, action) => {
        state.loading = false;
        // state.orders = [action.payload.data, ...state.orders];
        state.purchaseInvoices = {...state.purchaseInvoices , data: [ action.payload.data ,...state.purchaseInvoices.data]};
        state.success = action.payload.message;
      })
      .addCase(addPurchaseInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatePurchaseInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.purchaseInvoices?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.purchaseInvoices.data[index] = action.payload.data;
        } else {
          state.purchaseInvoices ={...state.purchaseInvoices , data: [ action.payload.data ,...state.purchaseInvoices.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updatePurchaseInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletePurchaseInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchaseInvoice.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.purchaseInvoices.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.purchaseInvoices = {...state.purchaseInvoices,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deletePurchaseInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchPurchaseInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(fetchPurchaseInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchSalesType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesType.fulfilled, (state, action) => {
        state.loading = false;
        state.salesTypes = action.payload.data;
      })
      .addCase(fetchSalesType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchPurchaseInvoiceCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseInvoiceCode.fulfilled, (state, action) => {
        state.loading = false;
        state.orderCode = action.payload.data;
      })
      .addCase(fetchPurchaseInvoiceCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = purchaseInvoicesSlice.actions;
export default purchaseInvoicesSlice.reducer;
