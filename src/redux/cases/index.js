import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All Case
export const fetchCases = createAsyncThunk(
  "cases/fetchCases",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/cases?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Case",
      );
    }
  },
);
export const fetchCaseReason = createAsyncThunk(
  "cases/fetchCaseReason",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/case-reason?page=${datas?.page || ""}&size=${datas?.size || ""}`);
      return response.data; // Returns a list of order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Case",
      );
    }
  },
);

// Add a Case
export const addCases = createAsyncThunk(
  "cases/addCases",
  async (orderData, thunkAPI) => {
   
    try {
      const response = await toast.promise(
        apiClient.post("/v1/cases", orderData),
        {
            loading: "Case creating...",
            success: (res) => res.data.message || "Case created successfully!",
            error: "Failed to create Case",
        }
    );
      // const response = await apiClient.post("/v1/cases", orderData);
      // toast.success(response.data.message || "order created successfully");
      return response.data; // Returns the newly added order
    } catch (error) {
      toast.error(error.response?.data || "Failed to create Case");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create Case",
      );
    }
  },
);

// Update a Case
export const updateCases = createAsyncThunk(
  "cases/updateCases",
  async (orderData, thunkAPI) => {
    let id = orderData.get("id")
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/cases/${id}`, orderData),
        {
          loading: "Case updating...",
          success: (res) => res.data.message || "Case updated successfully!",
          error: "Failed to update Case",
        }
      );
      // const response = await apiClient.put(`/v1/cases/${id}`, orderData);
      // toast.success(response.data.message || "order updated successfully");
      return response.data; // Returns the updated order
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Case not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Case not found",
        });
      }
      toast.error(error.response?.data || "Failed to update Case");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update Case",
      );
    }
  },
);

// Delete a Case
export const deleteCases = createAsyncThunk(
  "cases/deleteCases",
  async (id, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.delete(`/v1/cases/${id}`),
        {
          loading: " Case deleting...",
          success: (res) => res.data.message || "Case deleted successfully!",
          error: "Failed to delete Case",
        }
      );
      // const response = await apiClient.delete(`/v1/cases/${id}`);
      // toast.success(response.data.message || "order deleted successfully");
      return {
        data: { id },
        message: response.data.message || "Case deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete Case");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete Case",
      );
    }
  },
);

// Fetch a Single Case by ID
export const fetchCasesById = createAsyncThunk(
  "cases/fetchCasesById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/cases/${id}`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch Case",
      );
    }
  },
);
// Fetch a Generated Case Code
export const fetchCasesCode = createAsyncThunk(
  "cases/fetchCasesCode",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/case-number`);
      return response.data; // Returns the order details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch case code",
      );
    }
  },
);

const casesSlice = createSlice({
  name: "cases",
  initialState: {
    cases: {},
    orderDetail: null,
    caseReason:[],
    cashNumber:null,
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
      .addCase(fetchCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCases.fulfilled, (state, action) => {
        state.loading = false;
        state.cases = action.payload.data;
      })
      .addCase(fetchCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCases.fulfilled, (state, action) => {
        state.loading = false;
        // state.orders = [action.payload.data, ...state.orders];
        state.cases = {...state.cases , data: [ action.payload.data ,...state.cases.data]};
        state.success = action.payload.message;
      })
      .addCase(addCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCases.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cases?.data?.findIndex(
          (data) => data.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.cases.data[index] = action.payload.data;
        } else {
          state.cases ={...state.cases , data: [ action.payload.data ,...state.cases.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCases.fulfilled, (state, action) => {
        state.loading = false;
        let filteredData = state.cases.data.filter(
          (data) => data.id !== action.payload.data.id,
        );
        state.cases = {...state.cases,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCasesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCasesById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(fetchCasesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCasesCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCasesCode.fulfilled, (state, action) => {
        state.loading = false;
        state.cashNumber = action.payload.data;
      })
      .addCase(fetchCasesCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCaseReason.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseReason.fulfilled, (state, action) => {
        state.loading = false;
        state.caseReason = action.payload.data;
      })
      .addCase(fetchCaseReason.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = casesSlice.actions;
export default casesSlice.reducer;
