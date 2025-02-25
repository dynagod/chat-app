import { Router } from "express";
import { clearChat, createChat, deleteChat, getAllChats, getChatById } from "../controllers/chat.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

chatRouter.route('/create').post(verifyJWT, createChat);
chatRouter.route('/get-chats').get(verifyJWT, getAllChats);
chatRouter.route('/get-chat/:chatId').get(verifyJWT, getChatById);
chatRouter.route('/clear-chat/:chatId').delete(verifyJWT, clearChat);
chatRouter.route('/delete-chat/:chatId').delete(verifyJWT, deleteChat);

export default chatRouter;