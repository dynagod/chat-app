import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {}
});

export const {  } = chatSlice.actions;

export const chatSliceReducer = chatSlice.reducer;