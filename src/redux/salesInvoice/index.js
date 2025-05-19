import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All sales invoice
export const fetchSalesInvoice = createAsyncThunk(
  "salesInvoices/fetchSalesInvoice",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/sales-invoice?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch sales invoice",
      );
    }
  },
);

// Add a order
export const addSalesInvoice = createAsyncThunk(
  "salesInvoices/addSalesInvoice",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/sales-invoice", orderData),
        {
            loading: "Sales invoice creating...",
            success: (res) => res.data.message || "Sales invoice created successfully!",
            error: "Failed to create sales invoice",
        }
    );
      // const response = await apiClient.post("/v1/sales-invoice", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create sales invoice");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create sales invoice",
      );
    }
  },
);

// Update a order
export const updateSalesInvoice = createAsyncThunk(
  "salesInvoices/updateSalesInvoice",
  async (orderData, thunkAPI) => {
    let id = orderData.get("id")
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/sales-invoice/${id}`, orderData),
        {
          loading: "Sales invoice updating...",
          success: (res) => res.data.message || "Sales invoice updated successfully!",
          error: "Failed to update sales invoice",
        }
      );
      // const response = await apiClient.put(`/v1/sales-invoice/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Sales invoice not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Sales invoice not found",
        });
      }
      toast.error(error.response?.data || "Failed to update sales invoice");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update sales invoice",
      );
    }
  },
);

// Delete a order
export const deleteSalesInvoice = createAsyncThunk(
  "salesInvoices/deleteSalesInvoice",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/sales-invoice/${id}`),
        {
          loading: " sales invoice deleting...",
          success: (res) => res.data.message || "Sales invoice deleted successfully!",
          error: "Failed to delete sales invoice",
        }
      );
      // const response = await apiClient.delete(`/v1/sales-invoice/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "Sales invoice deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete sales invoice");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete sales invoice",
      );
    }
  },
);

// Fetch a Single order by ID
export const fetchSalesInvoiceById = createAsyncThunk(
  "salesInvoices/fetchSalesInvoiceById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/sales-invoice/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch sales invoice",
      );
    }
  },
);
// Fetch a Sales Type
export const fetchSalesType = createAsyncThunk(
  "salesInvoices/fetchSalesType",
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
// Fetch a Generated sales invoice Code
export const fetchSalesInvoiceCode = createAsyncThunk(
  "salesInvoices/fetchSalesInvoiceCode",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/get-sales-invoice-code`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch order code",
      );
    }
  },
);

const salesInvoicesSlice = createSlice({
  name: "salesInvoices",
  initialState: {
    salesInvoices: {},
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
      .addCase(fetchSalesInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.salesInvoices = action.payload.data;
      })
      .addCase(fetchSalesInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addSalesInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSalesInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.salesInvoices = {...state.salesInvoices , data: [ action.payload.data ,...state.salesInvoices.data]};
        state.success = action.payload.message;
      })
      .addCase(addSalesInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateSalesInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSalesInvoice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.salesInvoices?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.salesInvoices.data[index] = action.payload.data;
        } else {
          state.salesInvoices ={...state.salesInvoices , data: [ action.payload.data ,...state.salesInvoices.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateSalesInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteSalesInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSalesInvoice.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.salesInvoices.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.salesInvoices = {...state.salesInvoices,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteSalesInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchSalesInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(fetchSalesInvoiceById.rejected, (state, action) => {
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
      .addCase(fetchSalesInvoiceCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesInvoiceCode.fulfilled, (state, action) => {
        state.loading = false;
        state.orderCode = action.payload.data;
      })
      .addCase(fetchSalesInvoiceCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = salesInvoicesSlice.actions;
export default salesInvoicesSlice.reducer;
