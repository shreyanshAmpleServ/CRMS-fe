import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// product category Slice

// Fetch All productCategories
export const fetchProductCategory = createAsyncThunk(
    "productCategories/fetchProductCategory",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/v1/product-category");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to fetch productCategories"
            );
        }
    }
);

// Add an product category
export const addProductCategory = createAsyncThunk(
    "productCategories/addProductCategory",
    async (categoryData, thunkAPI) => {
        try {
            const response = await apiClient.post("/v1/product-category", categoryData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to add product category"
            );
        }
    }
);

// Update an product category
export const updateProductCategory = createAsyncThunk(
    "productCategories/updateProductCategory",
    async ({ id, categoryData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/v1/product-category/${id}`, categoryData);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return thunkAPI.rejectWithValue({
                    status: 404,
                    message: "Not found",
                });
            }
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to update product category"
            );
        }
    }
);

// Delete an product category
export const deleteProductCategory = createAsyncThunk(
    "productCategories/deleteProductCategory",
    async (id, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/v1/product-category/${id}`);
            return {
                data: { id },
                message: response.data.message || "product category deleted successfully",
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Failed to delete product category"
            );
        }
    }
);

const productCategoriesSlice = createSlice({
    name: "productCategories",
    initialState: {
        productCategories: [],
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
            .addCase(fetchProductCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.productCategories = action.payload.data;
            })
            .addCase(fetchProductCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(addProductCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addProductCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.productCategories = [action.payload.data, ...state.productCategories];
                state.success = action.payload.message;
            })
            .addCase(addProductCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(updateProductCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProductCategory.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.productCategories?.findIndex(
                    (category) => category.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.productCategories[index] = action.payload.data;
                } else {
                    state.productCategories = [action.payload.data, ...state.productCategories];
                }
                state.success = action.payload.message;
            })
            .addCase(updateProductCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(deleteProductCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProductCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.productCategories = state.productCategories.filter(
                    (category) => category.id !== action.payload.data.id
                );
                state.success = action.payload.message;
            })
            .addCase(deleteProductCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const { clearMessages } = productCategoriesSlice.actions;
export default productCategoriesSlice.reducer;


