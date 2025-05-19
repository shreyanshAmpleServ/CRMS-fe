import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All purchase orders
export const fetchPurchaseOrders = createAsyncThunk(
  "purchaseOrders/fetchPurchaseOrders",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/purchase-order?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch purchase order",
      );
    }
  },
);

// Add a order
export const addPurchaseOrder = createAsyncThunk(
  "purchaseOrders/addPurchaseOrder",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/purchase-order", orderData),
        {
            loading: "Purchase Order creating...",
            success: (res) => res.data.message || "Purchase Order created successfully!",
            error: "Failed to create purchase order",
        }
    );
      // const response = await apiClient.post("/v1/purchase-order", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create purchase order");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create purchase order",
      );
    }
  },
);

// Update a order
export const updatePurchaseOrder = createAsyncThunk(
  "purchaseOrders/updatePurchaseOrder",
  async (orderData, thunkAPI) => {
    let id = orderData.get("id")
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/purchase-order/${id}`, orderData),
        {
          loading: "Purchase order updating...",
          success: (res) => res.data.message || "Purchase order updated successfully!",
          error: "Failed to update purchase order",
        }
      );
      // const response = await apiClient.put(`/v1/purchase-order/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("purchase order not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Purchase order not found",
        });
      }
      toast.error(error.response?.data || "Failed to update purchase order");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update purchase order",
      );
    }
  },
);

// Delete a order
export const deletePurchaseOrder = createAsyncThunk(
  "purchaseOrders/deletePurchaseOrder",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/purchase-order/${id}`),
        {
          loading: " Purchase Order deleting...",
          success: (res) => res.data.message || "Purchase Order deleted successfully!",
          error: "Failed to delete purchase order",
        }
      );
      // const response = await apiClient.delete(`/v1/purchase-order/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "Purchase order deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete purchase order");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete purchase order",
      );
    }
  },
);

// Fetch a Single order by ID
export const fetchPurchaseOrderById = createAsyncThunk(
  "purchaseOrders/fetchPurchaseOrderById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/purchase-order/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch purchase order",
      );
    }
  },
);
// Fetch a Sales Type
export const fetchSalesType = createAsyncThunk(
  "purchaseOrders/fetchSalesType",
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
// Fetch a Generated Purchase Order Code
export const fetchPurchaseOrderCode = createAsyncThunk(
  "purchaseOrders/fetchPurchaseOrderCode",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/get-purchase-order-code`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch order code",
      );
    }
  },
);

const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState: {
    purchaseOrders: {},
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
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = action.payload.data;
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        // state.orders = [action.payload.data, ...state.orders];
        state.purchaseOrders = {...state.purchaseOrders , data: [ action.payload.data ,...state.purchaseOrders.data]};
        state.success = action.payload.message;
      })
      .addCase(addPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatePurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.purchaseOrders?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.purchaseOrders.data[index] = action.payload.data;
        } else {
          state.purchaseOrders ={...state.purchaseOrders , data: [ action.payload.data ,...state.purchaseOrders.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletePurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.purchaseOrders.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.purchaseOrders = {...state.purchaseOrders,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deletePurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchPurchaseOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(fetchPurchaseOrderById.rejected, (state, action) => {
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
      .addCase(fetchPurchaseOrderCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrderCode.fulfilled, (state, action) => {
        state.loading = false;
        state.orderCode = action.payload.data;
      })
      .addCase(fetchPurchaseOrderCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = purchaseOrdersSlice.actions;
export default purchaseOrdersSlice.reducer;
