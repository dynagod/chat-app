import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ADD_USER_TO_GROUP, CREATE_GROUP_CHAT, DELETE_GROUP, GET_GROUP_CHATS, REMOVE_USER_FROM_GROUP, UPDATE_GROUP_NAME } from "../constants";
import { sendMessage } from "./messageSlice";
import instance from "../services/axios";

const initialState = {
    groupChats: [],
    selectedGroupChat: null,
    isGroupChatsLoading: false,
    creatingGroupChat: false,
    isDeletingGroupChat: false,
    addingOrRemovingUser: false,
    updatingName: false,
    error: null
};

export const getGroupChats = createAsyncThunk(
    GET_GROUP_CHATS,
    async (_, { rejectWithValue }) => {
        try {
            const response = await instance.get('/api/v1/group-chats');
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data || { message: "An unexpected error occurred" });
        }
    }
);

export const createGroupChat = createAsyncThunk(
    CREATE_GROUP_CHAT,
    async ({ name, users }, { rejectWithValue }) => {
        try {
            const response = await instance.post('/api/v1/group-chats', { name, users });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

// Not in use
export const addUserToGroup = createAsyncThunk(
    ADD_USER_TO_GROUP,
    async ({ groupId, userId }, { rejectWithValue }) => {
        try {
            const response = await instance.put('/api/v1/group-chats/add', { groupId, userId });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

// Not in use
export const removeUserFromGroup = createAsyncThunk(
    REMOVE_USER_FROM_GROUP,
    async ({ groupId, userId }, { rejectWithValue }) => {
        try {
            const response = await instance.put('/api/v1/group-chats/remove', { groupId, userId });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

export const updateGroupName = createAsyncThunk(
    UPDATE_GROUP_NAME,
    async ({ groupId, name }, { rejectWithValue }) => {
        try {
            const response = await instance.put('/api/v1/group-chats/update', { groupId, name });
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

export const deleteGroup = createAsyncThunk(
    DELETE_GROUP,
    async (groupId, { rejectWithValue }) => {
        try {
            const response = await instance.delete(`/api/v1/group-chats/${groupId}`);
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

const groupChatSlice = createSlice({
    name: 'groupChat',
    initialState,
    reducers: {
        setSelectedGroupChat: (state, action) => {
            state.selectedGroupChat = action.payload;
        },
        setLatestMessageInGroupChat: (state, action) => {
            state.groupChats[action.payload.chatIndex].latestMessage = action.payload.message;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGroupChats.pending, (state) => {
                state.isGroupChatsLoading = true;
                state.error = null;
                state.groupChats = [];
            })
            .addCase(getGroupChats.fulfilled, (state, action) => {
                state.groupChats = action.payload.data.allGroupChats;
                state.isGroupChatsLoading = false;
            })
            .addCase(getGroupChats.rejected, (state, action) => {
                state.error = action.payload;
                state.isGroupChatsLoading = false;
            })
            .addCase(createGroupChat.pending, (state) => {
                state.creatingGroupChat = true;
                state.error = null;
            })
            .addCase(createGroupChat.fulfilled, (state, action) => {
                state.groupChats = [action.payload.data.groupChat, ...state.groupChats];
                state.creatingGroupChat = false;
            })
            .addCase(createGroupChat.rejected, (state, action) => {
                state.error = action.payload;
                state.creatingGroupChat = false;
            })
            .addCase(addUserToGroup.pending, (state) => {
                state.addingOrRemovingUser = true;
                state.error = null;
            })
            .addCase(addUserToGroup.fulfilled, (state, action) => {
                state.selectedGroupChat = action.payload.data.group
                state.addingOrRemovingUser = false;;
            })
            .addCase(addUserToGroup.rejected, (state, action) => {
                state.error = action.payload;
                state.addingOrRemovingUser = false;
            })
            .addCase(removeUserFromGroup.pending, (state) => {
                state.addingOrRemovingUser = true;
                state.error = null;
            })
            .addCase(removeUserFromGroup.fulfilled, (state, action) => {
                state.selectedGroupChat = action.payload.data.group;
                state.addingOrRemovingUser = false;
            })
            .addCase(removeUserFromGroup.rejected, (state, action) => {
                state.error = action.payload;
                state.addingOrRemovingUser = false;
            })
            .addCase(updateGroupName.pending, (state) => {
                state.updatingName = true;
                state.error = null;
            })
            .addCase(updateGroupName.fulfilled, (state, action) => {
                state.selectedGroupChat = action.payload.data.group;
                state.groupChats = [action.payload.data.group, ...state.groupChats.filter(chat => chat._id !== action.meta.arg.groupId)];
                state.updatingName = false;
            })
            .addCase(updateGroupName.rejected, (state, action) => {
                state.error = action.payload;
                state.updatingName = false;
            })
            .addCase(deleteGroup.pending, (state) => {
                state.isDeletingGroupChat = true;
                state.error = null;
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.groupChats = state.groupChats.filter(groupChat => groupChat._id !== action.meta.arg);
                state.isDeletingGroupChat = false;
            })
            .addCase(deleteGroup.rejected, (state, action) => {
                state.error = action.payload;
                state.isDeletingGroupChat = false;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const chatIndex = state.groupChats.findIndex(group => group._id === action.payload.data.message.conversation);
            
                if (chatIndex >= 0) state.groupChats[chatIndex].latestMessage = action.payload.data.message;
            })
    }
});

export const { setSelectedGroupChat, setLatestMessageInGroupChat } = groupChatSlice.actions;

export const groupChatSliceReducer = groupChatSlice.reducer;