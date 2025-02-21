// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from 'axios';

// const initialState = {
//     isAuthenticated: false,
//     user: null,
//     error: null,
//     loading: false,
//     message: null
// };

// export const loginAsync = createAsyncThunk(
//     'auth/loginAsync',
//     async ({ route, userCredentials }, { rejectWithValue }) => {
//         try {
//             const response = await axios.post(route, userCredentials);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || { message: "An unexpected error occurred" });
//         }
//     }
// );

// export const logoutUser = createAsyncThunk(
//     'logout/user',
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axios.post('/api/v1/users/logout');
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || { message: "An unexpected error occurred" });
//         }
//     }
// );

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginAsync.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//                 state.message = null;
//             })
//             .addCase(loginAsync.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.isAuthenticated = true;
//                 state.user = action.payload.data;
//                 state.message = action.payload.message;
//             })
//             .addCase(loginAsync.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//                 state.message = action.payload.message;
//             })
//             .addCase(logoutUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//                 state.message = null;
//             })
//             .addCase(logoutUser.fulfilled, (state, action) => {
//                 state.isAuthenticated = false;
//                 state.user = null;
//                 state.error = null;
//                 state.message = action.payload.message;
//             })
//             .addCase(logoutUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//                 state.message = action.payload.message;
//             });
//     }
// });

// export const authSliceReducer = authSlice.reducer;






import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

// Constants for action types to avoid string duplication
const AUTHENTICATE = 'auth/authenticate';
const LOGOUT = 'auth/logoutUser';
const UPDATE = 'user/update';

const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
    loading: false,
    message: null
};

// Async Thunk for login
export const authenticateUser = createAsyncThunk(
    AUTHENTICATE,
    async ({ route, userCredentials }, { rejectWithValue }) => {
        try {
            const response = await axios.post(route, userCredentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "An unexpected error occurred" });
        }
    }
);

// Async Thunk for logout
export const logoutUser = createAsyncThunk(
    LOGOUT,
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/v1/users/logout');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "An unexpected error occurred" });
        }
    }
);

export const updateUser = createAsyncThunk(
    UPDATE,
    async ({ updatedField, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/api/v1/users/update-profile/${updatedField}`, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "An unexpected error occurred" });
        }
    }
);

// Utility function to handle common reducer logic (optional)
const handleAsyncReducers = (builder, actionType, successHandler) => {
    builder
        .addCase(actionType.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
        })
        .addCase(actionType.fulfilled, (state, action) => {
            state.loading = false;
            successHandler(state, action);
            state.message = action.payload.message || "Action completed successfully";
        })
        .addCase(actionType.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.message = action.payload?.message || "An error occurred";
        });
};

// Slice for authentication
const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        // Handle login async actions
        handleAsyncReducers(builder, authenticateUser, (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.data;
        });

        // Handle logout async actions
        handleAsyncReducers(builder, logoutUser, (state, action) => {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
        });

        // Handle update async actions
        handleAsyncReducers(builder, updateUser, (state, action) => {
            state.user = action.payload.data;
        });
    }
});

export const authSliceReducer = authSlice.reducer;