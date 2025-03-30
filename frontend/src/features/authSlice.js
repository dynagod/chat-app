import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import toast from "react-hot-toast";
import { AUTHENTICATE, LOGOUT, REFRESH_ACCESS_TOKEN, UPDATE_USER } from "../constants";
import { disconnectSocket, initializeSocketListeners } from "./socketSlice";

const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
    isUserLoading: false,
    isUserUpdating: false
};

export const authenticateUser = createAsyncThunk(
    AUTHENTICATE,
    async ({ route, userCredentials }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(route, userCredentials);
            dispatch(initializeSocketListeners(response.data.data.user));
            console.log(response.data)
            return response.data;
        } catch (error) {
            if (error.response?.data?.message === "jwt expired") {
                await dispatch(refreshAccessToken());

                try {
                    const retryResponse = await axios.post(route, userCredentials);
                    dispatch(initializeSocketListeners(retryResponse.data.data.user));
                    return retryResponse.data;
                } catch (err) {
                    console.error("Error response: ", err.response);
                    return rejectWithValue(err.response?.data?.message || "An unexpected error occurred");
                }
            }
            else {
                console.error("Error response: ", error);
                return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
            }
        }
    }
);

export const logoutUser = createAsyncThunk(
    LOGOUT,
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/users/logout');
            dispatch(disconnectSocket());
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred" );
        }
    }
);

export const updateUser = createAsyncThunk(
    UPDATE_USER,
    async ({ updatedField, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/v1/users/update-profile/${updatedField}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

export const refreshAccessToken = createAsyncThunk(
    REFRESH_ACCESS_TOKEN,
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/api/v1/users/refresh-token`);
            return response.data;
        } catch (error) {
            console.error("Error response: ", error.response);
            return rejectWithValue(error.response?.data?.message || "An unexpected error occurred");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.pending, (state) => {
                state.isUserLoading = true;
                state.error = null;
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
                toast.success(action.payload.message);
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.isUserLoading = false;
                state.error = action.payload;
                toast.error(state.error);
            })
            .addCase(logoutUser.pending, (state) => {
                state.isUserLoading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.isUserLoading = false;
                state.user = null;
                toast.success(action.payload.message);
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isUserLoading = false;
                state.error = action.payload;
                toast.error(state.error);
            })
            .addCase(updateUser.pending, (state) => {
                state.isUserUpdating = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isUserUpdating = false;
                state.user = action.payload.data.user;
                toast.success(action.payload.message);
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isUserUpdating = false;
                state.error = action.payload;
                toast.error(state.error);
            })
            .addCase(refreshAccessToken.pending, (state) => {
                state.isUserLoading = true;
                state.error = null;
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                state.isUserLoading = false;
                toast.success(action.payload.message)
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                state.isUserLoading = false;
                state.error = action.payload;
                toast.error(state.error);
            });
    }
});

export const authSliceReducer = authSlice.reducer;