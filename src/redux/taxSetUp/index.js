import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// tax Slice

// Fetch All taxs
export const fetchTaxSetup = createAsyncThunk(
    "taxs/fetchTaxSetup",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/tax-setup");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch taxs"
            );
        }
    }
);

// Add an tax
export const addTaxSetup = createAsyncThunk(
    "taxs/addTaxSetup",
    async (taxData, thunkAPI) => {
        try {
            // const response = await apiClient.post("/v1/tax-setup", taxData);
            const response = await toast.promise(
                apiClient.post("/v1/tax-setup", taxData),
                {
                  loading: " Tax adding...",
                  success: (res) => res.data.message || "Tax added successfully!",
                  error: "Failed to add tax",
                }
              );
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add tax"
            );
        }
    }
);

// Update an tax
export const updateTaxSetup = createAsyncThunk(
    "taxs/updateTaxSetup",
    async ({ id, taxData }, thunkAPI) => {
        try {
            // const response = await apiClient.put(`/v1/tax-setup/${id}`, taxData);
            const response = await toast.promise(
                apiClient.put(`/v1/tax-setup/${id}`, taxData),
                {
                  loading: " Tax updating...",
                  success: (res) => res.data.message || "Tax updated successfully!",
                  error: "Failed to update tax",
                }
              );
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update tax"
            );
        }
    }
);

// Delete an tax
    export const deleteTaxSetup = createAsyncThunk(
        "taxs/deleteTaxSetup",
        async (id, thunkAPI) => {
            try {
                const response = await apiClient.delete(`/v1/tax-setup/${id}`);
                return {
                    data: { id },
                    message: response.data.message || "tax deleted successfully",
                };
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data || "Failed to delete tax"
                );
            }
        }
    );

const taxsSlice = createSlice({
    name: "taxs",
    initialState: {
        taxs: [],
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
            .addCase(fetchTaxSetup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaxSetup.fulfilled, (state, action) => {
                state.loading = false;
                state.taxs = action.payload.data;
            })
            .addCase(fetchTaxSetup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addTaxSetup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTaxSetup.fulfilled, (state, action) => {
                state.loading = false;
                state.taxs = [action.payload.data, ...state.taxs];
                state.success = action.payload.message;
            })
            .addCase(addTaxSetup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateTaxSetup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTaxSetup.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.taxs?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.taxs[index] = action.payload.data;
                } else {
                    state.taxs = [action.payload.data, ...state.taxs];
                }
                state.success = action.payload.message;
            })
            .addCase(updateTaxSetup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteTaxSetup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTaxSetup.fulfilled, (state, action) => {
                state.loading = false;
                state.taxs = state.taxs.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteTaxSetup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = taxsSlice.actions;
export default taxsSlice.reducer;


