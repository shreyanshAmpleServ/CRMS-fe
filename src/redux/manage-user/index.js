import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../utils/axiosConfig";
import toast from "react-hot-toast";

// Fetch All Users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (datas, thunkAPI) => {
    try {
      const params = {
        search:datas?.search || "",
        page: datas?.page || "",
        size: datas?.size || "",
        startDate: datas?.startDate?.toISOString() || "",
        endDate : datas?.endDate?.toISOString() || "",
      }
      const response = await apiClient.get("/v1/users",{params});
      return response.data; // Returns a list of users
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch users",
      );
    }
  },
);

// Add a User
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, thunkAPI) => {
    try {
      // const response = await apiClient.post("/v1/users", userData);
      const response = await toast.promise(
        apiClient.post("/v1/users", userData),
        {
            loading: "User creating...",
            success: (res) => res.data.message || "User created successfully!",
            error: (err) => {
              // Optional console log to inspect error
              console.error("API Error:", err);
              return (
                err?.response?.data?.message ||
                err?.message ||
                "Failed to create user"
              );
            },
        }
    );
      return response.data; // Returns the newly added user
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add user",
      );
    }
  },
);

// Update a User
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, thunkAPI) => {
    try {
      // const response = await apiClient.put(`/v1/users/${id}`, userData);
      const response = await toast.promise(
        apiClient.put(`/v1/users/${id}`, userData),
        {
            loading: "User updating...",
            success: (res) => res.data.message || "User updated successfully!",
            error: (err) => {
              return (
                err?.response?.data?.message ||
                err?.message ||
                "Failed to update user"
              );
            },
        }
    );
      return response.data; // Returns the updated user
    } catch (error) {
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          status: 404,
          message: "User not found",
        });
      }
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update user",
      );
    }
  },
);

// Delete a User
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, thunkAPI) => {
    try {
      // const response = await apiClient.delete(`/v1/users/${id}`);
      const response = await toast.promise(
        apiClient.delete(`/v1/users/${id}`),
        {
            loading: "User deleting...",
            success: (res) => res.data.message || "User deleted successfully!",
            error: "Failed to delete user",
        }
    );
      return {
        data: { id },
        message: response.data.message || "User deleted successfully",
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete user",
      );
    }
  },
);

// Fetch a Single User by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/users/${id}`);
      return response.data; // Returns the user details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user",
      );
    }
  },
);
export const fetchUserByToken = createAsyncThunk(
  "users/fetchUserByToken",
  async (_, thunkAPI) => {
    try {
      const response = await apiClient.get(`/v1/userByToken`);
      return response.data; // Returns the user details
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch user",
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    userDetail: null,
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users ={...state.users, data: [action.payload.data, ...state.users.data]}; 
        state.success = action.payload.message;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users?.data?.findIndex(
          (user) => user.id === action.payload.data.id,
        );
        if (index !== -1) {
          state.users.data[index] = action.payload.data;
        } else {
          state.users ={...state.users, data: [ ...state.users,action.payload.data]};

        }
        state.success = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const filterData = state.users?.data?.filter(
          (user) => user.id !== action.payload.data.id,
        );
        state.users = {...state.users , data:filterData}
        state.success = action.payload.message;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload.data;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchUserByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetail = action.payload.data;
      })
      .addCase(fetchUserByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearMessages } = userSlice.actions;
export default userSlice.reducer;
