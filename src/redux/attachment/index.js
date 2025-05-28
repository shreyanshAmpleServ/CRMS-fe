// Call Status Slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast"
// Fetch All Call Statuses
export const fetchAttachment = createAsyncThunk(
    "attachments/fetchAttachment",
    async (datas, thunkAPI) => {
        try {
            // const params= {}
            // if(filteredType) params.related_type = filteredType
            const response = await apiClient.get(`/v1/file-attachment?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}&related_type=${datas?.filteredType || ""}`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch file attachment"
            );
        }
    }
);

// Add a File attachment
export const addAttachment = createAsyncThunk(
    "attachments/addAttachment",
    async (attachmentData, thunkAPI) => {
        try {
            // const response = await apiClient.post("/v1/file-attachment", attachmentData);
            // toast.success(  response.data.message || "File attachment added successfull !");
            const response = await toast.promise(
                apiClient.post("/v1/file-attachment", attachmentData),
                {
                    loading: "Uploading file...",
                    success: (res) => res.data.message || "File attachment added successfully!",
                    error: "Failed to add file attachment",
                }
            );
            return response.data;
        } catch (error) {
            toast.error( error.response?.data || "Failed to add file attachment");
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add file attachment"
            );
        }
    }
);

// Update a File attachment
export const updateAttachment = createAsyncThunk(
    "attachments/updateAttachment",
    async (attachmentData, thunkAPI) => {

        try {
            const id = attachmentData.get("id")
            const response = await toast.promise(apiClient.put(`/v1/file-attachment/${id}`, attachmentData),
            {
                loading: "Updating attachment file...",
                success: (res) => res.data.message || "File attachment updated successfully!",
                error: "Failed to update file attachment",
            }
        );
            // toast.success(  response.data.message || "File attachment updated successfull !");
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("Attachment not fount ");
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            toast.error(error.response?.data || "Failed to update File attachment");
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update File attachment"
            );
        }
    }
);

// Delete a File attachment
export const deleteAttachment = createAsyncThunk(
    "attachments/deleteAttachment",
    async (id, thunkAPI) => {
        try {
            const response = await toast.promise(apiClient.delete(`/v1/file-attachment/${id}`),
            {
                loading: "Deleting attachment file...",
                success: (res) => res.data.message || "File attachment deleted successfull !",
                error: "Failed to delete file attachment",
            }
        );
            // toast.success(  response.data.message || "File attachment deleted successfull !");
            return {
                data: { id },
                message: response.data.message || "File attachment deleted successfully",
            };
        } catch (error) {
            toast.error(error.response?.data || "Failed to delete File attachment");
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete File attachment"
            );
        }
    }
);

const attachmentSlice = createSlice({
    name: "attachments",
    initialState: {
        attachments: [],
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
            .addCase(fetchAttachment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAttachment.fulfilled, (state, action) => {
                state.loading = false;
                state.attachments = action.payload.data;
            })
            .addCase(fetchAttachment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addAttachment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAttachment.fulfilled, (state, action) => {
                state.loading = false;
                state.attachments = {...state.attachments , data: [ action.payload.data ,...state.attachments.data]};
                state.success = action.payload.message;
            })
            .addCase(addAttachment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateAttachment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAttachment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.attachments.data?.findIndex(
                    (status) => status.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.attachments.data[index] = action.payload.data;
                } else {
                    state.attachments ={...state.attachments , data: [ action.payload.data ,...state.attachments.data]};
                }
                state.success = action.payload.message;
            })
            .addCase(updateAttachment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteAttachment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAttachment.fulfilled, (state, action) => {
                state.loading = false;
                const filterData = state.attachments.data.filter(
                    (status) => status.id !== action.payload.data.id
                );
                state.attachments = {...state.attachments,data:filterData}
                state.success = action.payload.message;
            })
            .addCase(deleteAttachment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = attachmentSlice.actions;
export default attachmentSlice.reducer;