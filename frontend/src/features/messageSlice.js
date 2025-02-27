import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    messages: [],
    conversationType: null,
    conversationId: null,
    isMessagesLoading: false,
    error: null,
    message: null
};

export const getMessages = createAsyncThunk(
    'get/messages',
    async ({ conversationId, conversationType }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/messages/${conversationId}/${conversationType}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.message || { message: "An unexpected error occured" });
        }
    }
);

export const sendMessage = createAsyncThunk(
    'send/message',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/messages', formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.message || { message: "An unexpected error occured" });
        }
    }
);

const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        setConversationTypeAndId: (state, action) => {
            state.conversationType = action.payload.conversationType;
            state.conversationId = action.payload.conversationId;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state) => {
                state.isMessagesLoading = true;
                state.error = null;
                state.message = null;
                state.messages = [];
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                state.messages = action.payload.data.messages;
                state.message = action.payload.message || "Action completed successfully";
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isMessagesLoading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            .addCase(sendMessage.pending, (state) => {
                state.error = null;
                state.message = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages = [...state.messages, action.payload.data.message];
                state.message = action.payload.message || "Action completed successfully";
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload;
                state.message = action.payload.message;
            })
    }
});

export const { setConversationTypeAndId } = messageSlice.actions;

export const messageSliceReducer = messageSlice.reducer;