import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All Projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (datas, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/projects?search=${datas?.search || ""}&page=${datas?.page || ""}&size=${datas?.size || ""}&startDate=${datas?.startDate?.toISOString() || ""}&endDate=${datas?.endDate?.toISOString() || ""}`);
      return response.data; // Returns a list of projects
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch projects",
      );
    }
  },
);

// Add a Project
export const addProject = createAsyncThunk(
  "projects/addProject",
  async (projectData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/projects", projectData);
      return response.data; // Returns the newly added project
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add project",
      );
    }
  },
);

// Update a Project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, projectData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/projects/${id}`, projectData);
      return response.data; // Returns the updated project
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Project not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update project",
      );
    }
  },
);

// Delete a Project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/projects/${id}`);
      return {
        data: { id },
        message: response.data.message || "Project deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete project",
      );
    }
  },
);

// Fetch a Single Project by ID
export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/projects/${id}`);
      return response.data; // Returns the project details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch project",
      );
    }
  },
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: {},
    projectDetail: null,
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
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = {...state.projects , data: [ action.payload.data ,...state.projects.data]};
        state.success = action.payload.message;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.data?.findIndex(
          (project) => project.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.projects.data[index] = action.payload.data;
        } else {
          state.projects ={...state.projects , data: [ action.payload.data ,...state.projects.data]};

        }
        state.success = action.payload.message;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.projects.data?.filter(
          (project) => project.id !== action.payload.data.id,
        );
        state.projects ={...state.projects ,data : filterData};
        state.success = action.payload.message;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.projectDetail = action.payload.data;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = projectSlice.actions;
export default projectSlice.reducer;
