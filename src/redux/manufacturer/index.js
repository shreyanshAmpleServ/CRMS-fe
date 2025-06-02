import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// manufacturer Slice

// Fetch All manufacturers
export const fetchManufacturer = createAsyncThunk(
    "manufacturers/fetchManufacturer",
    async (datas, thunkAPI) => {
        try {
            const params  ={}
            if(datas?.search) params.search = datas?.search
            if(datas?.page) params.page = datas?.page
            if(datas?.size) params.size = datas?.size

            const response = await apiClient.get("/v1/manufacturer",{params});
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch manufacturers"
            );
        }
    }
);

// Add an manufacturer
export const addManufacturer = createAsyncThunk(
    "manufacturers/addManufacturer",
    async (manufacturerData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/manufacturer", manufacturerData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add manufacturer"
            );
        }
    }
);

// Update an manufacturer
export const updateManufacturer = createAsyncThunk(
    "manufacturers/updateManufacturer",
    async ({ id, manufacturerData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/manufacturer/${id}`, manufacturerData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update manufacturer"
            );
        }
    }
);

// Delete an manufacturer
export const deleteManufacturer = createAsyncThunk(
    "manufacturers/deleteManufacturer",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/manufacturer/${id}`);
            return {
                data: { id },
                message: response.data.message || "manufacturer deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete manufacturer"
            );
        }
    }
);

const manufacturersSlice = createSlice({
    name: "manufacturers",
    initialState: {
        manufacturers: [],
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
            .addCase(fetchManufacturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchManufacturer.fulfilled, (state, action) => {
                state.loading = false;
                state.manufacturers = action.payload.data;
            })
            .addCase(fetchManufacturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addManufacturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addManufacturer.fulfilled, (state, action) => {
                state.loading = false;
                state.manufacturers ={...state.manufacturers, data: [action.payload.data, ...state.manufacturers.data]}; 
                state.success = action.payload.message;
            })
            .addCase(addManufacturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateManufacturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateManufacturer.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.manufacturers?.data?.findIndex(
                    (data) => data.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.manufacturers.data[index] = action.payload.data;
                } else {
                    state.manufacturers ={...state.manufacturers, data: [ ...state.manufacturers,action.payload.data]};
                }
                state.success = action.payload.message;
            })
            .addCase(updateManufacturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteManufacturer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteManufacturer.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.manufacturers.data.filter(
                    (data) => data.id !== action.payload.data.id
                );
                state.manufacturers= {...state.manufacturers,data:filterData}
                state.success = action.payload.message;
            })
            .addCase(deleteManufacturer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = manufacturersSlice.actions;
export default manufacturersSlice.reducer;


