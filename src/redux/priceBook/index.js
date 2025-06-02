import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All price book
export const fetchPriceBook = createAsyncThunk(
  "priceBooks/fetchPriceBook",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/price-book?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch price book",
      );
    }
  },
);

// Add a price book
export const addPriceBook = createAsyncThunk(
  "priceBooks/addPriceBook",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/price-book", orderData),
        {
            loading: "Price book creating...",
            success: (res) => res.data.message || "Price book created successfully!",
            error: "Failed to create price book",
        }
    );
      // const response = await apiClient.post("/v1/price-book", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create price book");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create price book",
      );
    }
  },
);

// Update a price book
export const updatePriceBook = createAsyncThunk(
  "priceBooks/updatePriceBook",
  async (orderData, thunkAPI) => {
    let id = orderData.id
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/price-book/${id}`, orderData),
        {
          loading: "Price book updating...",
          success: (res) => res.data.message || "Price book updated successfully!",
          error: "Failed to update price book",
        }
      );
      // const response = await apiClient.put(`/v1/price-book/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("price book not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Price book not found",
        });
      }
      toast.error(error.response?.data || "Failed to update price book");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update price book",
      );
    }
  },
);

// Delete a price book
export const deletePriceBook = createAsyncThunk(
  "priceBooks/deletePriceBook",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/price-book/${id}`),
        {
          loading: " price book deleting...",
          success: (res) => res.data.message || "Price book deleted successfully!",
          error: "Failed to delete price book",
        }
      );
      // const response = await apiClient.delete(`/v1/price-book/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "Price book deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete price book");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete price book",
      );
    }
  },
);

// Fetch a Single price book by ID
export const fetchPriceBookById = createAsyncThunk(
  "priceBooks/fetchPriceBookById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/price-book/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch price book",
      );
    }
  },
);


const priceBookSlice = createSlice({
  name: "priceBooks",
  initialState: {
    priceBooks: {},
    orderDetail: null,
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
      .addCase(fetchPriceBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceBook.fulfilled, (state, action) => {
        state.loading = false;
        state.priceBooks = action.payload.data;
      })
      .addCase(fetchPriceBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addPriceBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPriceBook.fulfilled, (state, action) => {
        state.loading = false;
        // state.orders = [action.payload.data, ...state.orders];
        state.priceBooks = {...state.priceBooks , data: [ action.payload.data ,...state.priceBooks.data]};
        state.success = action.payload.message;
      })
      .addCase(addPriceBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatePriceBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePriceBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.priceBooks?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.priceBooks.data[index] = action.payload.data;
        } else {
          state.priceBooks ={...state.priceBooks , data: [ action.payload.data ,...state.priceBooks.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updatePriceBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletePriceBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePriceBook.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.priceBooks.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.priceBooks = {...state.priceBooks,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deletePriceBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchPriceBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(fetchPriceBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = priceBookSlice.actions;
export default priceBookSlice.reducer;
