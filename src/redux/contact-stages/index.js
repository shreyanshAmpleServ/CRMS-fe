import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All Contact Stages
export const fetchContactStages = createAsyncThunk(
    "contactStages/fetchContactStages",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/contact-stages");
            return response.data; // Returns a list of contact stages
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch contact stages"
            );
        }
    }
);

// Add a Contact Stage
export const addContactStage = createAsyncThunk(
    "contactStages/addContactStage",
    async (contactStageData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/contact-stages", contactStageData);
            return response.data; // Returns the newly added contact stage
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add contact stage"
            );
        }
    }
);

// Update a Contact Stage
export const updateContactStage = createAsyncThunk(
    "contactStages/updateContactStage",
    async ({ id, contactStageData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/contact-stages/${id}`, contactStageData);
            return response.data; // Returns the updated contact stage
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update contact stage"
            );
        }
    }
);

// Delete a Contact Stage
export const deleteContactStage = createAsyncThunk(
    "contactStages/deleteContactStage",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/contact-stages/${id}`);
            return {
                data: { id },
                message: response.data.message || "Contact stage deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete contact stage"
            );
        }
    }
);

// Fetch a Single Contact Stage by ID
export const fetchContactStageById = createAsyncThunk(
    "contactStages/fetchContactStageById",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.get(`/v1/contact-stages/${id}`);
            return response.data; // Returns the contact stage details
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch contact stage"
            );
        }
    }
);

const contactStagesSlice = createSlice({
    name: "contactStages",
    initialState: {
        contactStages: [],
        contactStageDetail: null,
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
            .addCase(fetchContactStages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContactStages.fulfilled, (state, action) => {
                state.loading = false;
                state.contactStages = action.payload.data;
            })
            .addCase(fetchContactStages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addContactStage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addContactStage.fulfilled, (state, action) => {
                state.loading = false;
                state.contactStages = [action.payload.data, ...state.contactStages];
                state.success = action.payload.message;
            })
            .addCase(addContactStage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateContactStage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateContactStage.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.contactStages?.findIndex(
                    (stage) => stage.id === action.payload.data.id
                );

                if (index !== -1) {
                    state.contactStages[index] = action.payload.data;
                } else {
                    state.contactStages = [action.payload.data, ...state.contactStages];
                }

                state.success = action.payload.message;
            })
            .addCase(updateContactStage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteContactStage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteContactStage.fulfilled, (state, action) => {
                state.loading = false;
                state.contactStages = state.contactStages.filter(
                    (stage) => stage.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteContactStage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(fetchContactStageById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContactStageById.fulfilled, (state, action) => {
                state.loading = false;
                state.contactStageDetail = action.payload.data;
            })
            .addCase(fetchContactStageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = contactStagesSlice.actions;
export default contactStagesSlice.reducer;
