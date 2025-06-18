import { defaultProfileImage } from "../constants.js";
import { upload } from "../middlewares/multer.middleware.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { destroyOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
    
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token");
  }
};

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

  const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  if (!createdUser) throw new ApiError(500, "Something went wrong while registering the user");

  return res
  .status(201)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: createdUser, accessToken, refreshToken
      },
      "User registered successfully"
    )
  );
});

const loginUser = asyncHandler( async (req, res) => {
  const {usernameOrEmail, password} = req.body;
  
  if (!usernameOrEmail) throw new ApiError(400, "User name or email is required");
  if (!password) throw new ApiError(400, "Password is required");

  const user = await User.findOne({
    $or: [{username: usernameOrEmail}, {email: usernameOrEmail}]
  });

  if (!user) throw new ApiError(404, "User does not exists");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid) throw new ApiError(400, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      {
        user: loggedInUser, accessToken, refreshToken
      },
      "User logged in successfully"
    )
  );

});

const logOutUser = asyncHandler( async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out successfully"));

});

const refreshAccessToken = asyncHandler( async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id);
  
    if (!user) throw new ApiError(401, "Invalid refresh token");
  
    if (incomingRefreshToken !== user.refreshToken) throw new ApiError(401, "Refresh token is expired or used");
  
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None"
    }
  
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }

});

const getCurrentUser = asyncHandler( async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user }, "Current user fetched successfully"));
});

const changeCurrentPassword = asyncHandler( async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) throw new ApiError(400, "Password and confirm password does not match");

  const user = await User.findById(req.user._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) throw new ApiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, "Password changed successfully"));

});

const changeCurrentProfilePic = asyncHandler( async (req, res) => {
  const avatarLocalPath = req.file ? req.file.path : undefined;

  const oldProfileImagePath = req.user.avatar;

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar ? avatar.url : defaultProfileImage
      }
    },
    {new: true}
  ).select("-password -refreshToken");

  await destroyOnCloudinary(oldProfileImagePath);

  return res
  .status(200)
  .json(new ApiResponse(200, { user }, "Profile image updated successfuly"));

});

const changeCurrentFullName = asyncHandler( async (req, res) => {
  const fullName = req.body.fullName;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName: fullName
      }
    },
    {new: true}
  ).select("-password -refreshToken");

  return res
  .status(200)
  .json(new ApiResponse(200, { user }, "Full name updated successfuly"));
});

const changeCurentUsername = asyncHandler( async (req, res) => {
  const username = req.body.username;

  const existedUsername = await User.findOne({ username });
  if (existedUsername) throw new ApiError(409, "Username already exists");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username: username
      }
    },
    {new: true}
  ).select("-password -refreshToken");

  return res
  .status(200)
  .json(new ApiResponse(200, { user }, "Username updated successfuly"));
});

const updateProfile = asyncHandler( async (req, res) => {
  const updateField = req.params['updateField'];

  switch (updateField) {
    case 'avatar':
      upload.single('avatar')(req, res, async () => {
        await changeCurrentProfilePic(req, res);
      });
      break;
    
    case 'password':
      await changeCurrentPassword(req, res);
      break;

    case 'fullName':
      await changeCurrentFullName(req, res);
      break;

    case 'username':
      await changeCurentUsername(req, res);
      break;
  }

});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  getCurrentUser,
  updateProfile,
};