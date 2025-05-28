import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All Lost Reasons
export const fetchLostReasons = createAsyncThunk(
    "lostReasons/fetchLostReasons",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/lost-reasons");
            return response.data; // Returns a list of lost reasons
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch lost reasons"
            );
        }
    }
);

// Add a Lost Reason
export const addLostReason = createAsyncThunk(
    "lostReasons/addLostReason",
    async (lostReasonData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/lost-reasons", lostReasonData);
            return response.data; // Returns the newly added lost reason
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add lost reason"
            );
        }
    }
);
// Update a Lost Reason
export const updateLostReason = createAsyncThunk(
    "lostReasons/updateLostReason",
    async ({ id, lostReasonData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/lost-reasons/${id}`, lostReasonData);
            return response.data; // Returns the updated lost reason
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update lost reason"
            );
        }
    }
);

// Delete a Lost Reason
export const deleteLostReason = createAsyncThunk(
    "lostReasons/deleteLostReason",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/lost-reasons/${id}`);
            return {
                data: { id },
                message: response.data.message || "Lost reason deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete lost reason"
            );
        }
    }
);

// Fetch a Single Lost Reason by ID
export const fetchLostReasonById = createAsyncThunk(
    "lostReasons/fetchLostReasonById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/lost-reasons/${id}`);
            return response.data; // Returns the lost reason details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch lost reason"
            );
        }
    }
);

const lostReasonsSlice = createSlice({
    name: "lostReasons",
    initialState: {
        lostReasons: [],
        lostReasonDetail: null,
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
            .addCase(fetchLostReasons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLostReasons.fulfilled, (state, action) => {
                state.loading = false;
                state.lostReasons = action.payload.data;
            })
            .addCase(fetchLostReasons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addLostReason.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addLostReason.fulfilled, (state, action) => {
                state.loading = false;
                state.lostReasons = [action.payload.data, ...state.lostReasons];
                state.success = action.payload.message;
            })
            .addCase(addLostReason.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateLostReason.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLostReason.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.lostReasons?.findIndex(
                    (reason) => reason.id === action.payload.data.id
                );

                if (index !== -1) {
                    state.lostReasons[index] = action.payload.data;
                } else {
                    state.lostReasons = [action.payload.data, ...state.lostReasons];
                }

                state.success = action.payload.message;
            })
            .addCase(updateLostReason.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteLostReason.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLostReason.fulfilled, (state, action) => {
                state.loading = false;
                state.lostReasons = state.lostReasons.filter(
                    (reason) => reason.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteLostReason.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(fetchLostReasonById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLostReasonById.fulfilled, (state, action) => {
                state.loading = false;
                state.lostReasonDetail = action.payload.data;
            })
            .addCase(fetchLostReasonById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = lostReasonsSlice.actions;
export default lostReasonsSlice.reducer;
