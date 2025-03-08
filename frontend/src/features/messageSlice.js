import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { DELETE_MESSAGE, GET_MESSAGES, SEND_MESSAGE } from "../constants";

const initialState = {
    messages: [],
    conversationType: null,
    conversationId: null,
    isMessagesLoading: false,
    isDeletingMessage: false,
    error: null
};

export const getMessages = createAsyncThunk(
    GET_MESSAGES,
    async ({ conversationId, conversationType }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/v1/messages/${conversationId}/${conversationType}`);
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
        }
    }
);

export const sendMessage = createAsyncThunk(
    SEND_MESSAGE,
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/messages', formData);
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
        }
    }
);

// Not in use
export const deleteMessage = createAsyncThunk(
    DELETE_MESSAGE,
    async ({ conversationId, conversationType, messageId }, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/messages/delete', { conversationId, conversationType, messageId });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
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
                state.messages = [];
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isMessagesLoading = false;
                state.messages = action.payload.data.messages;
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isMessagesLoading = false;
                state.error = action.payload;
                toast.error(state.error);
            })
            .addCase(sendMessage.pending, (state) => {
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages = [...state.messages, action.payload.data.message];
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.error = action.payload;
                toast.error(state.error);
            })
            .addCase(deleteMessage.pending, (state) => {
                state.isDeletingMessage = true;
                state.error = null;
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                if (action.meta.arg.messageId) state.messages = state.messages.filter(message => message._id !== action.meta.arg.messageId);
                else state.messages = [];
                state.isDeletingMessage = false;
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.isDeletingMessage  =false;
                state.error = action.payload;
            })
    }
});

export const { setConversationTypeAndId } = messageSlice.actions;

export const messageSliceReducer = messageSlice.reducer;