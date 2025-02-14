import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler( async (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim();
  const fullName = req.body.fullName?.trim();
  const confirm = req.body.confirm?.trim();
  const password = req.body.password?.trim();

  if (!username) throw new ApiError(400, "Username is required");
  if (!fullName) throw new ApiError(400, "Name is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "Enter password you want to give to your account");
  if (password.length < 6) throw new ApiError(400, "Length of password must be greater than 5");
  if (!confirm) throw new ApiError(400, "Confirm the password");

  if (confirm !== password) {
    throw new ApiError(400, "Password and confirm password doesnot match");
  }

  const existedUsername = await User.findOne({username});
  if (existedUsername) throw new ApiError(409, "Username already exists");

  const existedEmail = await User.findOne({email});
  if (existedEmail) throw new ApiError(409, "Email already exists");

  const avatarLocalPath = req.file ? req.file.path : undefined;

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.create({
    fullName,
    avatar: avatar?.url,
    email,
    password,
    username
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) throw new ApiError(500, "Something went wrong while registering the user");

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

export { registerUser };