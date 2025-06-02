import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All modules
export const fetchModules = createAsyncThunk(
    "modules/fetchModules",
    async (datas, thunkAPI) => {
        try {
            const params = {
                search:datas?.search || "",
                page: datas?.page || "",
                size: datas?.size || "",
            }
            const response = await apiClient.get("/v1/module-related_to",{params});
            return response.data; // Returns a list of modules
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch modules"
            );
        }
    }
);

// Add a Module
export const addModules = createAsyncThunk(
    "modules/addModules",
    async (moduleData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/module-related_to", moduleData);
            return response.data; // Returns the newly added Module
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add Module"
            );
        }
    }
);

// Update a Module
export const updateModules = createAsyncThunk(
    "modules/updateModules",
    async ({ id, moduleData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/module-related_to/${id}`, moduleData);
            return response.data; // Returns the updated Module
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update Module"
            );
        }
    }
);

// Delete a Module
export const deleteModules = createAsyncThunk(
    "modules/deleteModules",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/module-related_to/${id}`);
            return {
                data: { id },
                message: response.data.message || "Module deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete Module"
            );
        }
    }
);

// Fetch a Single Module by ID
export const fetchModulesById = createAsyncThunk(
    "modules/fetchModulesById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/module-related_to/${id}`);
            return response.data; // Returns the Module details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch Module"
            );
        }
    }
);

const modulesSlice = createSlice({
    name: "modules",
    initialState: {
        modules: [],
        moduleDetail: null,
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
            .addCase(fetchModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModules.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action.payload.data;
            })
            .addCase(fetchModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addModules.fulfilled, (state, action) => {
                state.loading = false;
                state.modules ={...state.modules, data: [action.payload.data, ...state.modules.data]};
                state.success = action.payload.message;
            })
            .addCase(addModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateModules.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.modules.data.findIndex(
                    (module) => module.id === action.payload.data.id
                );

                if (index !== -1) {
                    state.modules.data[index] = action.payload.data;
                } else {
                    state.modules ={...state.modules, data: [ ...state.modules,action.payload.data]};
                }

                state.success = action.payload.message;
            })
            .addCase(updateModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteModules.fulfilled, (state, action) => {
                state.loading = false;
                const filteredData = state.modules.data.filter(
                    (module) => module.id !== action.payload.data.id
                );
                state.modules = {...state.modules,data:filteredData}
                state.success = action.payload.message;
            })
            .addCase(deleteModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(fetchModulesById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModulesById.fulfilled, (state, action) => {
                state.loading = false;
                state.moduleDetail = action.payload.data;
            })
            .addCase(fetchModulesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = modulesSlice.actions;
export default modulesSlice.reducer;
