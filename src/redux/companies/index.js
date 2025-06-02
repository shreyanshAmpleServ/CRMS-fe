import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";

// Fetch All Companies
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search:datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate : datas?.endDate?.toISOString() || "",
      }
      const response = await apiClient.get("/v1/companies",{params});
      return response.data; // Returns a list of companies
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch companies",
      );
    }
  },
);

// Add a Company
export const addCompany = createAsyncThunk(
  "companies/addCompany",
  async (companyData, thunkAPI) => {
    try {
      const response = await apiClient.post("/v1/companies", companyData);
      return response.data; // Returns the newly added company
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add company",
      );
    }
  },
);

// Update a Company
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async ({ id, companyData }, thunkAPI) => {
    try {
      const response = await apiClient.put(`/v1/companies/${id}`, companyData);
      return response.data; // Returns the updated company
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "Company not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update company",
      );
    }
  },
);

// Delete a Company
export const deleteCompany = createAsyncThunk(
  "companies/deleteCompany",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.delete(`/v1/companies/${id}`);
      return {
        data: { id },
        message: response.data.message || "Company deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete company",
      );
    }
  },
);

// Fetch a Single Company by ID
export const fetchCompanyById = createAsyncThunk(
  "companies/fetchCompanyById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/companies/${id}`);
      return response.data; // Returns the company details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch company",
      );
    }
  },
);

const companySlice = createSlice({
  name: "companies",
  initialState: {
    companies: [],
    companyDetail: null,
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
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies ={...state.companies, data: [action.payload.data, ...state.companies.data]};
        state.success = action.payload.message;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.data?.findIndex(
          (company) => company.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.companies.data[index] = action.payload.data;
        } else {
          state.companies ={...state.companies , data: [action.payload.data, ...state.companies.data]};
        }
        state.success = action.payload.message;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        const filteredData = state.companies.data.filter(
          (company) => company.id !== action.payload.data.id,
        );
        state.companies = {...state.companies,data:filteredData}
        state.success = action.payload.message;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetail = action.payload.data;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = companySlice.actions;
export default companySlice.reducer;
