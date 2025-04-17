import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../services/axios";

// REGISTER
export const registerUser = createAsyncThunk(
  "/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      const { token, newUser } = response.data; // Исправлено на newUser

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", newUser._id); // Исправлено на newUser._id
        localStorage.setItem("userName", newUser.userName); // Исправлено на newUser.userName
        localStorage.setItem("userEmail", newUser.email); // Исправлено на newUser.email
        localStorage.setItem("isAuth", "true");
      }

      return {
        token,
        userId: newUser._id, // Исправлено на newUser._id
        userName: newUser.userName, // Исправлено на newUser.userName
        userEmail: newUser.email, // Исправлено на newUser.email
      };
    } catch (error) {
      console.log("blyat" + error);
      return rejectWithValue(error.response?.data?.message || "Ошибка регистрации");
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user._id);
        localStorage.setItem("userName", user.userName);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("isAuth", "true");
      }

      return {
        token,
        userId: user._id,
        userName: user.userName,
        userEmail: user.email,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Ошибка входа");
    }
  }
);

// INITIAL STATE
const initialState = {
  isAuth: localStorage.getItem("isAuth") === "true",
  userId: localStorage.getItem("userId") || "",
  userName: localStorage.getItem("userName") || "",
  userEmail: localStorage.getItem("userEmail") || "",
  token: localStorage.getItem("token") || "",
  error: null,
  loading: false,
};

// SLICE
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      state.userId = "";
      state.userName = "";
      state.userEmail = "";
      state.token = "";
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId; // Уже правильно
        state.userName = action.payload.userName; // Уже правильно
        state.userEmail = action.payload.userEmail; // Уже правильно
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
        state.userEmail = action.payload.userEmail;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;