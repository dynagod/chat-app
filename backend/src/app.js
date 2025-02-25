import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static('public'));
app.use(cookieParser());



// routes import
import userRouter from './routes/user.routes.js';
import chatRouter from './routes/chat.routes.js';
import friendshipRouter from './routes/friendship.routes.js';
import messageRouter from './routes/message.routes.js';
import groupChatRouter from './routes/groupChat.routes.js';


// router declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/chats', chatRouter);
app.use('/api/v1/friendships', friendshipRouter);
app.use('/api/v1/messages', messageRouter);
app.use('/api/v1/group-chats', groupChatRouter);


export { app };