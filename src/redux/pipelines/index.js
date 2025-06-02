import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All Pipelines
export const fetchPipelines = createAsyncThunk(
  "pipelines/fetchPipelines",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search:datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate : datas?.endDate?.toISOString() || "",
        status:datas?.status || ""
      }
      const response = await apiClient.get("/v1/pipelines",{params});
      return response.data; // Returns a list of pipelines
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch pipelines",
      );
    }
  },
);

// Fetch a Pipeline by ID
export const fetchPipelineById = createAsyncThunk(
  "pipelines/fetchPipelineById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/pipelines/${id}`);
      return response.data; // Returns the pipeline details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch pipeline",
      );
    }
  },
);

// Create a Pipeline
export const createPipeline = createAsyncThunk(
  "pipelines/createPipeline",
  async (pipelineData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/pipelines", pipelineData);
      return response.data; // Returns the newly created pipeline
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create pipeline",
      );
    }
  },
);

// Update a Pipeline
export const updatePipeline = createAsyncThunk(
  "pipelines/updatePipeline",
  async ({ id, pipelineData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/pipelines/${id}`, pipelineData);
      return response.data; // Returns the updated pipeline
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Pipeline not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update pipeline",
      );
    }
  },
);

// Delete a Pipeline
export const deletePipeline = createAsyncThunk(
  "pipelines/deletePipeline",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/pipelines/${id}`);
      return {
        data: { id },
        message: response.data.message || "Pipeline deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete pipeline",
      );
    }
  },
);

// Fetch Pipeline Data with Deals
export const fetchPipelineDeals = createAsyncThunk(
  "pipelines/fetchPipelineDeals",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/pipelines/${id}/deals`);
      return response.data; // Returns pipeline data with deals
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch pipeline deals",
      );
    }
  },
);

export const updateDealStage = createAsyncThunk(
  "pipelines/updateDealStage",
  async ({ dealId, stageId, pipelineId }, thunkAPI) => {
    try {
      const response = await apiClient.put(
        `/v1/pipelines/${dealId}/update-stage`,
        {
          stageId,
          pipelineId,
        },
      );
      return response.data; // Returns updated deal and associated pipeline details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update deal stage",
      );
    }
  },
);

const pipelineSlice = createSlice({
  name: "pipelines",
  initialState: {
    pipelines: [],
    pipelineDetail: null,
    deals: null,
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
      .addCase(fetchPipelines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelines.fulfilled, (state, action) => {
        state.loading = false;
        state.pipelines = action.payload.data;
      })
      .addCase(fetchPipelines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchPipelineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelineById.fulfilled, (state, action) => {
        state.loading = false;
        state.pipelineDetail = action.payload.data;
      })
      .addCase(fetchPipelineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(createPipeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPipeline.fulfilled, (state, action) => {
        state.loading = false;
        state.pipelines ={...state.pipelines, data: [action.payload.data, ...state.pipelines.data]};
        state.success = action.payload.message;
      })
      .addCase(createPipeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updatePipeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePipeline.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pipelines.data?.findIndex(
          (pipeline) => pipeline.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.pipelines.data[index] = action.payload.data;
        } else {
          state.pipelines ={...state.pipelines, data: [ ...state.pipelines,action.payload.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updatePipeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deletePipeline.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePipeline.fulfilled, (state, action) => {
        state.loading = false;
        const filteredData = state.pipelines.data.filter(
          (pipeline) => pipeline.id !== action.payload.data.id,
        );
        state.pipelines = {...state.pipelines,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deletePipeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchPipelineDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelineDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload.data;
      })
      .addCase(fetchPipelineDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update deal stage
      .addCase(updateDealStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDealStage.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload.data;
      })
      .addCase(updateDealStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = pipelineSlice.actions;
export default pipelineSlice.reducer;
