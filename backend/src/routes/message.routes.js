import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const messageRouter = Router();

messageRouter.route('/').post(verifyJWT, upload.single('image'), sendMessage);
messageRouter.route('/:conversationId/:conversationType').get(verifyJWT, getMessages);

export default messageRouter;