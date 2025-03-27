import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { CREATE_CHAT, DELETE_CHAT, GET_CHATS } from '../constants';
import { sendMessage } from './messageSlice';

const initialState = {
    chats: [],
    selectedChat: null,
    isChatsLoading: false,
    isCreatingChat: false,
    isDeletingChat: false,
    error: null
};

export const getUsers = createAsyncThunk(
    GET_CHATS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/v1/chats/get');
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred" );
        }
    }
);

export const createChat = createAsyncThunk(
    CREATE_CHAT,
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/chats/create', { userId });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

export const deleteChat = createAsyncThunk(
    DELETE_CHAT,
    async (chatId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/v1/chats/delete/${chatId}`);
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setLatestMessageInChat: (state, action) => {
            state.chats = state.chats.map(chat => {
                if (chat._id === action.payload.message.conversation) return { ...chat, latestMessage: action.payload.message };
                else return chat;
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isChatsLoading = true;
                state.error = null;
                state.chats = [];
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.chats = action.payload.data.chats;
                state.isChatsLoading = false;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.error = action.payload;
                state.isChatsLoading = false;
            })
            .addCase(createChat.pending, (state) => {
                state.isCreatingChat = true;
                state.error = null;
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.chats = [action.payload.data.chat, ...state.chats];
                state.isCreatingChat = false;
            })
            .addCase(createChat.rejected, (state, action) => {
                state.error = action.payload;
                state.isCreatingChat = false;
            })
            .addCase(deleteChat.pending, (state) => {
                state.isDeletingChat = true;
                state.error = null;
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                state.chats = state.chats.filter(chat => chat._id !== action.meta.arg.chatId);
                state.isDeletingChat = false;
            })
            .addCase(deleteChat.rejected, (state, action) => {
                state.error = action.payload;
                state.isDeletingChat = false;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const chatIndex = state.chats.findIndex(chat => chat._id === action.payload.data.message.conversation);

                if (chatIndex >= 0) state.chats[chatIndex].latestMessage = action.payload.data.message;
            })
    }
});

export const { setSelectedChat, setLatestMessageInChat } = chatSlice.actions;

export const chatSliceReducer = chatSlice.reducer;