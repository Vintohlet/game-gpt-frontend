import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  const response = await axios.get("/chat", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  
  return response.data;
});


export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId, thunkAPI) => {
    try {
      await axios.delete(`/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return chatId;
    } catch (error) {
      console.error("Ошибка при удалении чата:", error);
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Ошибка при удалении");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload
      
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteChat.pending, (state) =>{
    
        state.loading = true;
      })
      .addCase(deleteChat.fulfilled, (state, action) =>{
        
        state.loading = false;
        state.chats = state.chats.filter(chat => chat._id !== action.payload);
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default chatSlice.reducer;
