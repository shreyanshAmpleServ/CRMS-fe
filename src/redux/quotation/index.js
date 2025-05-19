import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All quotations
export const fetchquotations = createAsyncThunk(
  "quotations/fetchquotations",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/quotation?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch quotation",
      );
    }
  },
);

// Add a quotation
export const addQuotation = createAsyncThunk(
  "quotations/addQuotation",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/quotation", orderData),
        {
            loading: "Quotation creating...",
            success: (res) => res.data.message || "Quotation created successfully!",
            error: "Failed to create quotation",
        }
    );
      // const response = await apiClient.post("/v1/quotation", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create quotation");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create quotation",
      );
    }
  },
);

// Update a quotation
export const updateQuotation = createAsyncThunk(
  "quotations/updateQuotation",
  async (orderData, thunkAPI) => {
    let id = orderData.get("id")
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/quotation/${id}`, orderData),
        {
          loading: "Quotation updating...",
          success: (res) => res.data.message || "Quotation updated successfully!",
          error: "Failed to update quotation",
        }
      );
      // const response = await apiClient.put(`/v1/quotation/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("order not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "quotation not found",
        });
      }
      toast.error(error.response?.data || "Failed to update quotation");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update quotation",
      );
    }
  },
);

// Delete a quotation
export const deleteQuotation = createAsyncThunk(
  "quotations/deleteQuotation",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/quotation/${id}`),
        {
          loading: "Quotation deleting...",
          success: (res) => res.data.message || "Quotation deleted successfully!",
          error: "Failed to delete quotation",
        }
      );
      // const response = await apiClient.delete(`/v1/quotation/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "quotation deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete quotations");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete quotations",
      );
    }
  },
);

// Fetch a Single order by ID
export const fetchOrderById = createAsyncThunk(
  "quotations/fetchOrderById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/quotation/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch quotation",
      );
    }
  },
);
// Fetch a Sales Type
export const fetchSalesType = createAsyncThunk(
  "quotations/fetchSalesType",
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
// Fetch a Generated quotation Code
export const fetchQuotationCode = createAsyncThunk(
  "quotations/fetchQuotationCode",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/get-quotation-code`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch quotation code",
      );
    }
  },
);

const quotationSlice = createSlice({
  name: "quotations",
  initialState: {
    quotations: {},
    orderDetail: null,
    salesTypes:[],
    quotationCode:null,
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
      .addCase(fetchquotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchquotations.fulfilled, (state, action) => {
        state.loading = false;
        state.quotations = action.payload.data;
      })
      .addCase(fetchquotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuotation.fulfilled, (state, action) => {
        state.loading = false;
        // state.quotations = [action.payload.data, ...state.quotations];
        state.quotations = {...state.quotations , data: [ action.payload.data ,...state.quotations.data]};
        state.success = action.payload.message;
      })
      .addCase(addQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.quotations?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.quotations.data[index] = action.payload.data;
        } else {
          state.quotations ={...state.quotations , data: [ action.payload.data ,...state.quotations.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.quotations.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.quotations = {...state.quotations,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
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
      .addCase(fetchQuotationCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotationCode.fulfilled, (state, action) => {
        state.loading = false;
        state.quotationCode = action.payload.data;
      })
      .addCase(fetchQuotationCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = quotationSlice.actions;
export default quotationSlice.reducer;
