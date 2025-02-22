import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentTheme: localStorage.getItem("chat-theme") || 'coffee',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setCurrentTheme: (state, action) => {
            localStorage.setItem("chat-theme", action.payload);
            state.currentTheme = action.payload;
        }
    }
});

export const { setCurrentTheme } = themeSlice.actions;

export const themeSliceReducer = themeSlice.reducer;