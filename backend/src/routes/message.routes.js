import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const messageRouter = Router();

messageRouter.route('/').post(verifyJWT, sendMessage);
messageRouter.route('/:conversationId/:conversationType').get(verifyJWT, getMessages);

export default messageRouter;