import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    chats: [],
    selectedChat: null,
    isChatsLoading: false,
    error: null,
    message: null
};

export const getUsers = createAsyncThunk(
    'get/chats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/v1/chats/get');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "An unexpected error occurred" });
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isChatsLoading = true;
                state.error = null;
                state.message = null;
                state.chats = [];
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isChatsLoading = false;
                state.chats = action.payload.data.chats;
                state.message = action.payload.message || "Action completed successfully";
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isChatsLoading = false;
                state.error = action.payload
                state.message = action.payload.message;
            })
    }
});

export const { setSelectedChat } = chatSlice.actions;

export const chatSliceReducer = chatSlice.reducer;