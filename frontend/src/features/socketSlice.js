import { createSlice } from '@reduxjs/toolkit';
import { clearSocket, createSocket, getSocket } from '../services/socket';
import { removeMessage, subscribeToMessage } from './messageSlice';
import { setLatestMessageInChat } from './chatSlice';
import { setLatestMessageInGroupChat } from './groupChatSlice';

const initialState = {
    socketId: null,
    isConnected: false,
    onlineUsers: [],
    error: null
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocketConnection: (state, action) => {
            state.socketId = action.payload.socketId;
            state.isConnected = action.payload.isConnected;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload.userIds;
        }
    },
    extraReducers: (builder) => {}
});

export const initializeSocketListeners = (user) => (dispatch, getState) => {
    createSocket(user);
    const socket = getSocket();

    if (!socket) return;

    socket.on("getOnlineUsers", (userIds) => {
        dispatch(setOnlineUsers({ userIds }));
    });

    socket.on("connect", () => {
        dispatch(setSocketConnection({ socketId: socket.id, isConnected: true }));
    });

    socket.on("disconnect", () => {
        dispatch(setSocketConnection({ socketId: null, isConnected: false }));
    });

    socket.on("new_message", message => {
        const { conversationType, conversationId } = getState().message;
        if (message.conversationType === "Chat") dispatch(setLatestMessageInChat({ message }));
        else dispatch(setLatestMessageInGroupChat(message));

        if (message && conversationId && conversationType && message.conversation === conversationId && message.conversationType === conversationType) {
            dispatch(subscribeToMessage(message));
        }
    });

    socket.on("delete_message", ({ messageId, conversationType, conversationId }) => {
        dispatch(removeMessage(messageId));
    })

    socket.on("message_error", (error) => {
        dispatch(setError(error));
    });

    socket.on("user_online", (user) => {
        console.log(`${user.username} is online!`);
    });
};

export const disconnectSocket = () => (dispatch) => {
    const socket = getSocket();

    if (socket && !socket.connected) return;

    socket.disconnect();
    clearSocket();
    dispatch(setSocketConnection({ socketId: null, isConnected: false }));

    socket.off("connect");
    socket.off("disconnect");
    socket.off("new_message");
    socket.off("message_error");
    socket.off("user_online");
};

export const { setSocketConnection, setError, setOnlineUsers } = socketSlice.actions;

export const socketSliceReducer = socketSlice.reducer;