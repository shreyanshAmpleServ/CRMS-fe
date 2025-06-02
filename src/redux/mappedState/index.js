import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All States
export const fetchMappedStates = createAsyncThunk(
    "states/fetchMappedStates",
    async (datas, thunkAPI) => {
        try {
           const params  ={}
            if(datas?.country_code) params.country_id = datas?.country_code
            if(datas?.search) params.search = datas?.search
            if(datas?.page) params.page = datas?.page
            if(datas?.size) params.size = datas?.size
            const response = await apiClient.get("/v1/mapped-states",{params});
            return response.data; // Returns a list of states
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch states"
            );
        }
    }
);

// Add a State
export const addMappedState = createAsyncThunk(
    "states/addMappedState",
    async (stateData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/mapped-states", stateData);
            return response.data; // Returns the newly added state
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add state"
            );
        }
    }
);

// Update a State
export const updateMappedState = createAsyncThunk(
    "states/updateMappedState",
    async ({ id, stateData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/mapped-states/${id}`, stateData);
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
export const deleteMappedState = createAsyncThunk(
    "states/deleteMappedState",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/mapped-states/${id}`);
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
export const fetchMappedStateById = createAsyncThunk(
    "states/fetchMappedStateById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/mapped-states/${id}`);
            return response.data; // Returns the state details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch state"
            );
        }
    }
);

const statesSlice = createSlice({
    name: "mappedStates",
    initialState: {
        mappedStates: {},
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
            .addCase(fetchMappedStates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMappedStates.fulfilled, (state, action) => {
                state.loading = false;
                state.mappedStates = action.payload.data;
            })
            .addCase(fetchMappedStates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addMappedState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMappedState.fulfilled, (state, action) => {
                state.loading = false;
                state.mappedStates ={...state.mappedStates, data: [action.payload.data, ...state.mappedStates.data]};   
                state.success = action.payload.message;
            })
            .addCase(addMappedState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateMappedState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMappedState.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.mappedStates?.data?.findIndex(
                    (stateItem) => stateItem.id === action.payload.data.id
                );

                if (index !== -1) {
                    state.mappedStates.data[index] = action.payload.data;
                } else {
                    state.mappedStates ={...state.mappedStates, data: [ ...state.mappedStates,action.payload.data]};
                }

                state.success = action.payload.message;
            })
            .addCase(updateMappedState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteMappedState.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMappedState.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.mappedStates.data.filter(
                    (stateItem) => stateItem.id !== action.payload.data.id
                );
                state.mappedStates= {...state.mappedStates,data:filterData}
                state.success = action.payload.message;
            })
            .addCase(deleteMappedState.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(fetchMappedStateById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMappedStateById.fulfilled, (state, action) => {
                state.loading = false;
                state.stateDetail = action.payload.data;
            })
            .addCase(fetchMappedStateById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = statesSlice.actions;
export default statesSlice.reducer;
