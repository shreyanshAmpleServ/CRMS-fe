// Call Result Slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
// Fetch All Call Results
export const fetchCallResults = createAsyncThunk(
    "callResults/fetchCallResults",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/call-results");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch call results"
            );
        }
    }
);

// Add a Call Result
export const addCallResult = createAsyncThunk(
    "callResults/addCallResult",
    async (callResultData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/call-results", callResultData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add call result"
            );
        }
    }
);

// Update a Call Result
export const updateCallResult = createAsyncThunk(
    "callResults/updateCallResult",
    async ({ id, callResultData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/call-results/${id}`, callResultData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update call result"
            );
        }
    }
);

// Delete a Call Result
export const deleteCallResult = createAsyncThunk(
    "callResults/deleteCallResult",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/call-results/${id}`);
            return {
                data: { id },
                message: response.data.message || "Call result deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete call result"
            );
        }
    }
);

const callResultsSlice = createSlice({
    name: "callResults",
    initialState: {
        callResults: [],
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
            .addCase(fetchCallResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCallResults.fulfilled, (state, action) => {
                state.loading = false;
                state.callResults = action.payload.data;
            })
            .addCase(fetchCallResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addCallResult.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCallResult.fulfilled, (state, action) => {
                state.loading = false;
                state.callResults = [action.payload.data, ...state.callResults];
                state.success = action.payload.message;
            })
            .addCase(addCallResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateCallResult.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCallResult.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.callResults?.findIndex(
                    (status) => status.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.callResults[index] = action.payload.data;
                } else {
                    state.callResults = [action.payload.data, ...state.callResults];
                }
                state.success = action.payload.message;
            })
            .addCase(updateCallResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteCallResult.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCallResult.fulfilled, (state, action) => {
                state.loading = false;
                state.callResults = state.callResults.filter(
                    (status) => status.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteCallResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = callResultsSlice.actions;
export default callResultsSlice.reducer;