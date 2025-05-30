import { Router } from "express";
import { createChat, deleteChat, getAllChats, getChatById } from "../controllers/chat.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

chatRouter.route('/create').post(verifyJWT, createChat);
chatRouter.route('/get').get(verifyJWT, getAllChats);
chatRouter.route('/get/:chatId').get(verifyJWT, getChatById);
chatRouter.route('/delete/:chatId').delete(verifyJWT, deleteChat);

export default chatRouter;