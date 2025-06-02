// Call Status Slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
// Fetch All Call Statuses
export const fetchCallTypes = createAsyncThunk(
    "callTypes/fetchCallTypes",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/call-types");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch call types"
            );
        }
    }
);

// Add a Call type
export const addCallType = createAsyncThunk(
    "callTypes/addCallType",
    async (callTypeData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/call-types", callTypeData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add call type"
            );
        }
    }
);

// Update a Call type
export const updateCallType = createAsyncThunk(
    "callTypes/updateCallType",
    async ({ id, callTypeData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/call-types/${id}`, callTypeData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update call type"
            );
        }
    }
);

// Delete a Call Type
export const deleteCallType = createAsyncThunk(
    "callTypes/deleteCallType",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/call-types/${id}`);
            return {
                data: { id },
                message: response.data.message || "Call type deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete call type"
            );
        }
    }
);

const callTypesSlice = createSlice({
    name: "callTypes",
    initialState: {
        callTypes: [],
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
            .addCase(fetchCallTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCallTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.callTypes = action.payload.data;
            })
            .addCase(fetchCallTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addCallType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCallType.fulfilled, (state, action) => {
                state.loading = false;
                state.callTypes = [action.payload.data, ...state.callTypes];
                state.success = action.payload.message;
            })
            .addCase(addCallType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateCallType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCallType.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.callTypes?.findIndex(
                    (status) => status.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.callTypes[index] = action.payload.data;
                } else {
                    state.callTypes = [action.payload.data, ...state.callTypes];
                }
                state.success = action.payload.message;
            })
            .addCase(updateCallType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteCallType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCallType.fulfilled, (state, action) => {
                state.loading = false;
                state.callTypes = state.callTypes.filter(
                    (status) => status.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteCallType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = callTypesSlice.actions;
export default callTypesSlice.reducer;