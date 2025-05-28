import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All solution
export const fetchSolutions = createAsyncThunk(
  "solutions/fetchSolutions",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/solutions?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch solution",
      );
    }
  },
);


// Add a solution
export const addSolutions = createAsyncThunk(
  "solutions/addSolutions",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/solutions", orderData),
        {
            loading: "Solution creating...",
            success: (res) => res.data.message || "Solution created successfully!",
            error: "Failed to create solution",
        }
    );
      // const response = await apiClient.post("/v1/solutions", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create solution");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create solution",
      );
    }
  },
);

// Update a solution
export const updateSolutions = createAsyncThunk(
  "solutions/updateSolutions",
  async (orderData, thunkAPI) => {
    console.log("is Updating : ",orderData)
    let id = orderData.id
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/solutions/${id}`, orderData),
        {
          loading: "Solution updating...",
          success: (res) => res.data.message || "Solution updated successfully!",
          error: "Failed to update solution",
        }
      );
      // const response = await apiClient.put(`/v1/solutions/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Solution not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Solution not found",
        });
      }
      toast.error(error.response?.data || "Failed to update solution");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update solution",
      );
    }
  },
);

// Delete a solution
export const deleteSolutions = createAsyncThunk(
  "solutions/deleteSolutions",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/solutions/${id}`),
        {
          loading: "Solution deleting...",
          success: (res) => res.data.message || "Solution deleted successfully!",
          error: "Failed to delete solution",
        }
      );
      // const response = await apiClient.delete(`/v1/solutions/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "Solution deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete solution");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete solution",
      );
    }
  },
);

// Fetch a Single solution by ID
export const fetchSolutionsById = createAsyncThunk(
  "solutions/fetchSolutionsById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/solutions/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch solution",
      );
    }
  },
);

const solutionsSlice = createSlice({
  name: "solutions",
  initialState: {
    solutions: {},
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
      .addCase(fetchSolutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolutions.fulfilled, (state, action) => {
        state.loading = false;
        state.solutions = action.payload.data;
      })
      .addCase(fetchSolutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addSolutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSolutions.fulfilled, (state, action) => {
        state.loading = false;
        // state.orders = [action.payload.data, ...state.orders];
        state.solutions = {...state.solutions , data: [ action.payload.data ,...state.solutions.data]};
        state.success = action.payload.message;
      })
      .addCase(addSolutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateSolutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSolutions.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.solutions?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.solutions.data[index] = action.payload.data;
        } else {
          state.solutions ={...state.solutions , data: [ action.payload.data ,...state.solutions.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateSolutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteSolutions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSolutions.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.solutions.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.solutions = {...state.solutions,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteSolutions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchSolutionsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSolutionsById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(fetchSolutionsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = solutionsSlice.actions;
export default solutionsSlice.reducer;
