import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All modules
export const fetchPermissions = createAsyncThunk(
    "permissions/fetchPermissions",
    async (role_id, thunkAPI) => {
        try {
            const params = {}
            if(role_id) params.role_id = role_id
            const response = await apiClient.get("/v1/permissions",{params});
            return response.data; // Returns a list of modules
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch modules"
            );
        }
    }
);

// Add a Module
export const addPermissions = createAsyncThunk(
    "permissions/addPermissions",
    async (permissionData, thunkAPI) => {
        try {
            const role_id = localStorage.getItem("role_id")
            const response = await apiClient.post("/v1/permissions", permissionData);      
             if(role_id == response?.data?.data?.role_id){
                localStorage.setItem("permissions",JSON.stringify(response?.data?.data?.permissions))
            }
            window.location.reload(true);

            return response.data; // Returns the newly added Permissions
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add Module"
            );
        }
    }
);

// Update a Module
export const updateModules = createAsyncThunk(
    "permissions/updateModules",
    async ({ id, permissionData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/permissions/${id}`, permissionData);
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
    "permissions/deleteModules",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/permissions/${id}`);
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
export const fetchPermissionsById = createAsyncThunk(
    "permissions/fetchPermissionsById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/permissions/${id}`);
            return response.data; // Returns the Module details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch Module"
            );
        }
    }
);

const permissionsSlice = createSlice({
    name: "permissions",
    initialState: {
        permissions: [],
        permissionDetail: null,
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
            .addCase(fetchPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.permissions = action.payload.data;
            })
            .addCase(fetchPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.permissions = action.payload.data;
                state.success = action.payload.message;
            })
            .addCase(addPermissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateModules.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.permissions?.findIndex(
                    (module) => module.id === action.payload.data.id
                );

                if (index !== -1) {
                    state.permissions[index] = action.payload.data;
                } else {
                    state.permissions = [action.payload.data, ...state.permissions];
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
                state.permissions = state.permissions.filter(
                    (module) => module.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(fetchPermissionsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPermissionsById.fulfilled, (state, action) => {
                state.loading = false;
                state.moduleDetail = action.payload.data;
            })
            .addCase(fetchPermissionsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = permissionsSlice.actions;
export default permissionsSlice.reducer;
