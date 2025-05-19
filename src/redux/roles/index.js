// Roles Slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All Roles
export const fetchRoles = createAsyncThunk(
    "roles/fetchRoles",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/roles");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch roles"
            );
        }
    }
);

// Add a Role
export const addRole = createAsyncThunk(
    "roles/addRole",
    async (roleData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/roles", roleData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add role"
            );
        }
    }
);

// Update a Role
export const updateRole = createAsyncThunk(
    "roles/updateRole",
    async ({ id, roleData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/roles/${id}`, roleData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update role"
            );
        }
    }
);

// Delete a Role
export const deleteRole = createAsyncThunk(
    "roles/deleteRole",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/roles/${id}`);
            return {
                data: { id },
                message: response.data.message || "Role deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete role"
            );
        }
    }
);

const rolesSlice = createSlice({
    name: "roles",
    initialState: {
        roles: [],
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
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload.data;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addRole.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = [action.payload.data, ...state.roles];
                state.success = action.payload.message;
            })
            .addCase(addRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.roles?.findIndex(
                    (role) => role.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.roles[index] = action.payload.data;
                } else {
                    state.roles = [action.payload.data, ...state.roles];
                }
                state.success = action.payload.message;
            })
            .addCase(updateRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteRole.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = state.roles.filter(
                    (role) => role.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteRole.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = rolesSlice.actions;
export default rolesSlice.reducer;
