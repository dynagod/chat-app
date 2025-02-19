import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
    loading: false
};

export const loginAsync = createAsyncThunk(
    'auth/loginAsync',
    async ({ route, userCredentials }, { rejectWithValue }) => {
        try {
            const response = await axios.post(route, userCredentials);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "An unexpected error occurred" });
        }
    }
);

export const fetchUser = createAsyncThunk(
    'fetch/user',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('/get-current-user');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;

export const authSliceReducer = authSlice.reducer;