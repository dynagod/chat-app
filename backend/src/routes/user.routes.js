import { Router } from "express";
import { getCurrentUser, loginUser, logOutUser, refreshAccessToken, registerUser, updateProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route('/register').post(
    upload.single("avatar"),
    registerUser
);

userRouter.route('/login').post(loginUser);

userRouter.route('/logout').post(verifyJWT, logOutUser);
userRouter.route('/get-current-user').post(verifyJWT, getCurrentUser);
userRouter.route('/refresh-token').post(refreshAccessToken);
userRouter.route('/update-profile/:updateField').put(verifyJWT, updateProfile);

export default userRouter;