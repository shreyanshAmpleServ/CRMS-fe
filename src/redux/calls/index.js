// Call Status Slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import SendEmail from "../../utils/SendMail";
// Fetch All Calls
export const fetchCalls = createAsyncThunk(
    "calls/fetchCalls",
    async (data, thunkAPI) => {
        try {
            const params = {};
            if (data?.lead_id) params.lead_id = data.lead_id;
            if (data?.contact_id) params.contact_id = data.contact_id;
            if (data?.project_id) params.project_id = data.project_id;
            if (data?.search) params.search = data.search;
            if (data?.callType) params.callType = data.callType;
            if (data?.category) params.callCategory = data.category;
            if (data?.startDate) params.startDate = data.startDate?.toISOString();
            if (data?.endDate) params.endDate = data.endDate?.toISOString();
            const response = await apiClient.get(`/v1/calls`,{params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch calls"
            );
        }
    }
);

// Add a Calls
export const addCalls = createAsyncThunk(
    "calls/addCalls",
    async (callData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/calls", callData);
            console.log("Response",response?.data?.data?.ongoing_callStatus ,response?.data?.data?.ongoing_callStatus === "Scheduled")
           
            if(response?.data?.data?.ongoing_callStatus === "Scheduled"){
                SendEmail(response?.data?.data)
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add call"
            );
        }
    }
);

// Update a Calls
export const updateCalls = createAsyncThunk(
    "calls/updateCalls",
    async ({ id, callData }, thunkAPI) => {
        console.log("Resposn", id, callData)
        try {
            const response = await apiClient.put(`/v1/calls/${id}`, callData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update call"
            );
        }
    }
);

// Delete a Calls
export const deleteCalls = createAsyncThunk(
    "calls/deleteCalls",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/calls/${id}`);
            return {
                data: { id },
                message: response.data.message || "Calls deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete call"
            );
        }
    }
);
// Fetch All Related To
export const fetchRelatedTo = createAsyncThunk(
    "calls/fetchRelatedTo",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/module-related_to");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch  related To data"
            );
        }
    }
);

const callsSlice = createSlice({
    name: "calls",
    initialState: {
        calls: [],
        relatedTo: [],
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
            .addCase(fetchCalls.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCalls.fulfilled, (state, action) => {
                state.loading = false;
                state.calls = action.payload.data;
            })
            .addCase(fetchCalls.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addCalls.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCalls.fulfilled, (state, action) => {
                state.loading = false;
                state.calls ={...state.calls, data: [action.payload.data, ...state.calls.data]};
                state.success = action.payload.message;
            })
            .addCase(addCalls.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateCalls.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCalls.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.calls.data?.findIndex(
                    (status) => status.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.calls.data[index] = action.payload.data;
                } else {
                    state.calls ={...state.calls, data: [ ...state.calls,action.payload.data]};
                }
                state.success = action.payload.message;
            })
            .addCase(updateCalls.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteCalls.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCalls.fulfilled, (state, action) => {
                state.loading = false;
                const filteredData = state.calls?.data?.filter(
                    (status) => status.id !== action.payload.data.id
                );
                state.calls = {...state.calls,data:filteredData}
                state.success = action.payload.message;
            })
            .addCase(deleteCalls.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(fetchRelatedTo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRelatedTo.fulfilled, (state, action) => {
                state.loading = false;
                state.relatedTo = action.payload.data;
            })
            .addCase(fetchRelatedTo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = callsSlice.actions;
export default callsSlice.reducer;