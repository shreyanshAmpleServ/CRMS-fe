import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/products?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of product
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch product",
      );
    }
  },
);

// Add a product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.post("/v1/products", productData),
        {
            loading: " Product adding...",
            success: (res) => res.data.message || "Product added successfully!",
            error: "Failed to add product",
        }
    );
      // const response = await apiClient.post("/v1/products", productData);
      // toast.success(response.data.message || "product created successfully");
      return response.data; // Returns the newly added product
    } catch (error) {
      toast.error(error.response?.data || "Failed to add product");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add product",
      );
    }
  },
);

// Update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, thunkAPI) => {
    try {
      const response = await toast.promise(
        apiClient.put(`/v1/products/${id}`, productData),
        {
          loading: " Product updating...",
          success: (res) => res.data.message || "Product updated successfully!",
          error: "Failed to update product",
        }
      );
      // const response = await apiClient.put(`/v1/products/${id}`, productData);
      // toast.success(response.data.message || "product updated successfully");
      return response.data; // Returns the updated product
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("product not found");
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "product not found",
        });
      }
      toast.error(error.response?.data || "Failed to update product");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update product",
      );
    }
  },
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/products/${id}`);
      toast.success(response.data.message || "product deleted successfully");
      return {
        data: { id },
        message: response.data.message || "product deleted successfully",
      };
    } catch (error) {
      toast.error( error.response?.data || "Failed to delete product");
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete product",
      );
    }
  },
);

// Fetch a Single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/products/${id}`);
      return response.data; // Returns the product details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch product",
      );
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: {},
    productDetail: null,
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products =  {...state.products , data: [ action.payload.data ,...state.products.data]};
        state.success = action.payload.message;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.data?.findIndex(
          (user) => user.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.products.data[index] = action.payload.data;
        } else {
          state.products = [action.payload.data, ...state.products];
        }
        state.success = action.payload.message;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
       const filterData = state.products.data.filter(
          (user) => user.id !== action.payload.data.id,
        );
        state.products = {...state.products , data:filterData}
        state.success = action.payload.message;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload.data;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = productsSlice.actions;
export default productsSlice.reducer;
