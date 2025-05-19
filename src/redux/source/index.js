import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All Sources
export const fetchSources = createAsyncThunk(
  "sources/fetchSources",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get("/v1/sources");
      return response.data; // Returns a list of sources
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch sources",
      );
    }
  },
);

// Add a Source
export const addSource = createAsyncThunk(
  "sources/addSource",
  async (sourceData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/sources", sourceData);
      return response.data; // Returns the newly added source
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add source",
      );
    }
  },
);

// Update a Source
export const updateSource = createAsyncThunk(
  "sources/updateSource",
  async ({ id, sourceData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/sources/${id}`, sourceData);
      return response.data; // Returns the updated source
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update source",
      );
    }
  },
);

// Delete a Source
export const deleteSource = createAsyncThunk(
  "sources/deleteSource",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/sources/${id}`);
      return {
        data: { id },
        message: response.data.message || "Source deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete source",
      );
    }
  },
);

// Fetch a Single Source by ID
export const fetchSourceById = createAsyncThunk(
  "sources/fetchSourceById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/sources/${id}`);
      return response.data; // Returns the source details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch source",
      );
    }
  },
);

const sourcesSlice = createSlice({
  name: "sources",
  initialState: {
    sources: [],
    sourceDetail: null,
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
      .addCase(fetchSources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSources.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = action.payload.data;
      })
      .addCase(fetchSources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSource.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = [action.payload.data, ...state.sources];
        state.success = action.payload.message;
      })
      .addCase(addSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSource.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sources?.findIndex(
          (source) => source.id === action.payload.data.id,
        );

        if (index !== -1) {
          state.sources[index] = action.payload.data;
        } else {
          state.sources = [action.payload.data, ...state.sources];
        }

        state.success = action.payload.message;
      })
      .addCase(updateSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteSource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSource.fulfilled, (state, action) => {
        state.loading = false;
        state.sources = state.sources.filter(
          (source) => source.id !== action.payload.data.id,
        );
        state.success = action.payload.message;
      })
      .addCase(deleteSource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchSourceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSourceById.fulfilled, (state, action) => {
        state.loading = false;
        state.sourceDetail = action.payload.data;
      })
      .addCase(fetchSourceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = sourcesSlice.actions;
export default sourcesSlice.reducer;
