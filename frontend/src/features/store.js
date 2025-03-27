import { configureStore } from '@reduxjs/toolkit';
import { authSliceReducer } from './authSlice.js';
import { themeSliceReducer } from './themeSlice.js';
import { chatSliceReducer } from './chatSlice.js';
import { messageSliceReducer } from './messageSlice.js';
import { groupChatSliceReducer } from './groupChatSlice.js';
import { friendshipSliceReducer } from './friendshipSlice.js';
import { socketSliceReducer } from './socketSlice.js';


const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        socket: socketSliceReducer,
        theme: themeSliceReducer,
        chat: chatSliceReducer,
        groupChat: groupChatSliceReducer,
        message: messageSliceReducer,
        friendship: friendshipSliceReducer
    }
});

export default store;