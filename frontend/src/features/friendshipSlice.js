import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { ACCEPT_FRIEND_REQUEST, GET_ALL_FRIENDS, GET_ALL_PENDING_REQUESTS, REJECT_FRIEND_REQUEST, REMOVE_FRIEND, SEND_FRIEND_REQUEST } from "../constants";

const initialState = {
    friends: [],
    friendRequests: [],
    sentRequests: [],
    sendingRequest: false,
    acceptingRequest: false,
    rejectingRequest: false,
    removingFriend: false,
    loading: false,
    isFindingFriends: false,
    error: null
};

export const sendFriendRequest = createAsyncThunk(
    SEND_FRIEND_REQUEST,
    async (username, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/friendships/send', { username });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
        }
    }
);

export const getAllPendingRequests = createAsyncThunk(
    GET_ALL_PENDING_REQUESTS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/v1/friendships/requests');
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
        }
    }
);

export const acceptFriendRequest = createAsyncThunk(
    ACCEPT_FRIEND_REQUEST,
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/friendships/accept', { requestId });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
        }
    }
);

export const rejectFriendRequest = createAsyncThunk(
    REJECT_FRIEND_REQUEST,
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/friendships/reject', { requestId });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
        }
    }
);

export const removeFriend = createAsyncThunk(
    REMOVE_FRIEND,
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/friendships/remove', { userId });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
        }
    }
);

// Not in use
export const getFriends = createAsyncThunk(
    GET_ALL_FRIENDS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/v1/friendships/friends');
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message ||  "An unexpected error occurred" );
        }
    }
);

const friendshipSlice = createSlice({
    name: 'friendship',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(sendFriendRequest.pending, (state) => {
            state.sendingRequest = true;
        })
        builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
            state.sendingRequest = false;
            state.sentRequests = [action.payload.data.friendship, ...state.sentRequests];
            toast.success(action.payload.message);
        })
        builder.addCase(sendFriendRequest.rejected, (state, action) => {
            state.sendingRequest = false;
            state.error = action.payload;
            toast.error(state.error);
        })
        builder.addCase(getAllPendingRequests.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getAllPendingRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.friendRequests = action.payload.data.requests;
        })
        builder.addCase(getAllPendingRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(state.error);
        })
        builder.addCase(acceptFriendRequest.pending, (state) => {
            state.acceptingRequest = true;
        })
        builder.addCase(acceptFriendRequest.fulfilled, (state, action) => {
            state.acceptingRequest = false;
            state.friends = [action.payload.data.friend, ...state.friends];
            state.friendRequests = state.friendRequests.filter(request => request._id !== action.meta.arg);
        })
        builder.addCase(acceptFriendRequest.rejected, (state, action) => {
            state.acceptingRequest = false;
            state.error = action.payload;
        })
        builder.addCase(rejectFriendRequest.pending, (state) => {
            state.rejectingRequest = true;
        })
        builder.addCase(rejectFriendRequest.fulfilled, (state, action) => {
            state.rejectingRequest = false;
            state.friendRequests = state.friendRequests.filter(request => request._id !== action.meta.arg);
        })
        builder.addCase(rejectFriendRequest.rejected, (state, action) => {
            state.rejectingRequest = false;
            state.error = action.payload;
        })
        builder.addCase(removeFriend.pending, (state) => {
            state.removingFriend = true;
        })
        builder.addCase(removeFriend.fulfilled, (state, action) => {
            state.removingFriend = false;
            state.friends = state.friends.filter(friend => friend._id !== action.meta.arg);
        })
        builder.addCase(removeFriend.rejected, (state, action) => {
            state.removingFriend = false;
            state.error = action.payload;
        })
        .addCase(getFriends.pending, (state, action) => {
            state.isFindingFriends = true;
        })
        .addCase(getFriends.fulfilled, (state, action) => {
            state.isFindingFriends = false;
            state.friends = action.payload.data.friends;
        })
        .addCase(getFriends.rejected, (state, action) => {
            state.isFindingFriends = false;
            state.error = action.payload;
        })
    }
});

export const friendshipSliceReducer = friendshipSlice.reducer;