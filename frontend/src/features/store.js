import { configureStore } from '@reduxjs/toolkit';
import { authSliceReducer } from './authSlice.js';
import { themeSliceReducer } from './themeSlice.js';
import { chatSliceReducer } from './chatSlice.js';


const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        theme: themeSliceReducer,
        chat: chatSliceReducer
    }
});

export default store;