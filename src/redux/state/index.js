import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All States
export const fetchStates = createAsyncThunk(
    "states/fetchStates",
    async (_, thunkAPI) => {
        try {

            const response = await apiClient.get("/v1/states");
            return response.data; // Returns a list of states
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch states"
            );
        }
    }
);

// Add a State
export const addState = createAsyncThunk(
    "states/addState",
    async (stateData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/states", stateData);
            return response.data; // Returns the newly added state
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add state"
            );
        }
    }
);

// Update a State
export const updateState = createAsyncThunk(
    "states/updateState",
    async ({ id, stateData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/states/${id}`, stateData);
            return response.data; // Returns the updated state
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update state"
            );
        }
    }
);

// Delete a State
export const deleteState = createAsyncThunk(
    "states/deleteState",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/states/${id}`);
            return {
                data: { id },
                message: response.data.message || "State deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete state"
            );
        }
    }
);

// Fetch a Single State by ID
export const fetchStateById = createAsyncThunk(
    "states/fetchStateById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/states/${id}`);
            return response.data; // Returns the state details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch state"
            );
        }
    }
);

const statesSlice = createSlice({
    name: "states",
    initialState: {
        states: [],
        stateDetail: null,
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
            .addCase(fetchStates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStates.fulfilled, (state, action) => {
                state.loading = false;
                state.states = action.payload.data;
            })
            .addCase(fetchStates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addState.fulfilled, (state, action) => {
                state.loading = false;
                state.states = [action.payload.data, ...state.states];
                state.success = action.payload.message;
            })
            .addCase(addState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateState.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.states?.findIndex(
                    (stateItem) => stateItem.id === action.payload.data.id
                );

                if (index !== -1) {
                    state.states[index] = action.payload.data;
                } else {
                    state.states = [action.payload.data, ...state.states];
                }

                state.success = action.payload.message;
            })
            .addCase(updateState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteState.fulfilled, (state, action) => {
                state.loading = false;
                state.states = state.states.filter(
                    (stateItem) => stateItem.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(fetchStateById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStateById.fulfilled, (state, action) => {
                state.loading = false;
                state.stateDetail = action.payload.data;
            })
            .addCase(fetchStateById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = statesSlice.actions;
export default statesSlice.reducer;
