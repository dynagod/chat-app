import { Friendship } from "../models/friendship.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const sendFriendRequest = asyncHandler( async (req, res) => {
    const { username } = req.body;

    if (!username) throw new ApiError(400, "User is not send with body");

    if (username.toString() === req.user.username.toString()) throw new ApiError(400, "You cannot send friend request to yourself");

    const user = await User.findOne({ username });

    if (!user) throw new ApiError(400, "User does not exists");

    const existingRequest = await Friendship.findOne({
        $or: [
            { user1: user._id, user2: req.user._id },
            { user1: req.user._id, user2: user._id }
        ]
    });

    if (existingRequest) throw new ApiError(400, "Friend request already sent or exists");

    const friendship = await Friendship.create({
        user1: req.user._id,
        user2: user._id,
        status: "pending"
    });

    return res.status(200).json(new ApiResponse(200, { friendship }, "Friend request sent successfully"));
});

const acceptFriendRequest = asyncHandler( async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) throw new ApiError(400, "Request ID is required");

    const friendship = await Friendship.findById(requestId).populate("user1 user2", "-password -refreshToken");

    if (!friendship) throw new ApiError(400, "Request not found");

    if(friendship.status !== "pending") throw new ApiError(400, "Friend request already handled");

    friendship.status = "accepted";
    await friendship.save();

    const friend = friendship.user1._id.toString() === req.user._id.toString() ? friendship.user2 : friendship.user1;

    return res.status(200).json(new ApiResponse(200, { friend }, "Friend request accepted"));
});

const rejectFriendRequest = asyncHandler( async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) throw new ApiError(400, "Does not get request id from body");

    const friendship = await Friendship.findById(requestId);

    if (!friendship) throw new ApiError(400, "Request not found");

    if(friendship.status !== "pending") throw new ApiError(400, "Friend request already handled");

    await Friendship.findByIdAndDelete(requestId);

    return res.status(200).json(new ApiResponse(200, {}, "Friend request rejected"));
});

const removeFriend = asyncHandler( async (req, res) => {
    const { userId } = req.body;

    if (!userId) throw new ApiError(400, "Request doesnot contains user id");

    const friendship = await Friendship.findOneAndDelete({
        $or: [
            { user1: req.user._id, user2: userId, status: "accepted" },
            { user1: userId, user2: req.user._id, status: "accepted" }
        ]
    });

    if (!friendship) throw new ApiError(404, "Friend not found");

    return res.status(200).json(new ApiResponse(200, {}, "Friend removed successfully"));
});

const getFriends = asyncHandler( async (req, res) => {
    const friendships = await Friendship.find({
        $or: [{ user1: req.user._id }, { user2: req.user._id }],
        status: "accepted"
    }).populate("user1 user2", "-password -refreshToken");

    if (!friendships) return res.status(200).json(new ApiResponse(200, { friends: [] }, "You have no friends"));

    const friends = friendships.map(friendship => {
        if (friendship.user1._id.toString() === req.user._id.toString()) return friendship.user2;
        return friendship.user1;
    });

    return res.status(200).json(new ApiResponse(200, { friends }, "All friends fetched"));
});

const getPendingRequests = asyncHandler( async (req, res) => {
    const requests = await Friendship.find({
        user2: req.user._id,
        status: "pending"
    }).populate("user1", "-password -refreshToken").sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, { requests }, "All pending requests fetched successfully"));
});

export { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, getFriends, getPendingRequests };