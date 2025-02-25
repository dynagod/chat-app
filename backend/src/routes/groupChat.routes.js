import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addUserToGroup, createGroupChat, deleteGroup, getAllGroupChats, removeUserFromGroup, updateGroupName } from "../controllers/groupChat.controller.js";

const groupChatRouter = Router();

groupChatRouter.route('/').post(verifyJWT, createGroupChat);
groupChatRouter.route('/').get(verifyJWT, getAllGroupChats);
groupChatRouter.route('/add').put(verifyJWT, addUserToGroup);
groupChatRouter.route('/remove').put(verifyJWT, removeUserFromGroup);
groupChatRouter.route('/update').put(verifyJWT, updateGroupName);
groupChatRouter.route('/:groupId').delete(verifyJWT, deleteGroup);

export default groupChatRouter;