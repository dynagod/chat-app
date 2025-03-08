import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { acceptFriendRequest, getFriends, rejectFriendRequest, removeFriend, sendFriendRequest, getPendingRequests } from "../controllers/friendship.controller.js";

const friendshipRouter = Router();

friendshipRouter.route('/send').post(verifyJWT, sendFriendRequest);
friendshipRouter.route('/accept').post(verifyJWT, acceptFriendRequest);
friendshipRouter.route('/reject').post(verifyJWT, rejectFriendRequest);
friendshipRouter.route('/remove').post(verifyJWT, removeFriend);
friendshipRouter.route('/friends').get(verifyJWT, getFriends);
friendshipRouter.route('/requests').get(verifyJWT, getPendingRequests);

export default friendshipRouter;