import { GroupChat } from "../models/groupChat.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createGroupChat = asyncHandler( async (req, res) => {
    const { name, users } = req.body;

    if (!name || !users || users.length < 2) throw new ApiError(400, "A group chat must have a name and at least 2 members");

    const newGroupChat = await GroupChat.create({
        name,
        users: [...users, req.user._id],
        admin: req.user._id
    });

    if (!newGroupChat) throw new ApiError(500, "Something went wrong while creating the group");

    const groupChat = await GroupChat.findById(newGroupChat._id)
        .populate("users", "-password -refreshToken")
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "-password -refreshToken"
            }
        })
        .lean();

    return res.status(200).json(new ApiResponse(201, { groupChat }, "Group created successfully"));
});

const getAllGroupChats = asyncHandler( async (req, res) => {
    const allGroupChats = await GroupChat.find({ users: req.user._id })
        .populate("users", "-password -refreshToken")
        .populate({
            path: "latestMessage",
            populate: {
                path: "sender",
                select: "-password -refreshToken"
            }
        })
        .sort({ updatedAt: -1 })
        .lean();

    return res.status(200).json(new ApiResponse(200, { allGroupChats }, "Fetched all group chats of a user"));
});

const addUserToGroup = asyncHandler( async (req, res) => {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) throw new ApiError(400, "User and Group ID are required");

    const group = await GroupChat.findById(groupId);

    if (!group) throw new ApiError(404, "Group not found");

    if (!group.users.includes(req.user._id)) throw new ApiError(403, "You are not a member of this group");

    if (group.users.includes(userId)) throw new ApiError(400, "User is already in the group");

    group.users.push(userId);
    await group.save();

    return res.status(200).json(new ApiResponse(200, { group }, "User added successfully"));
});

const removeUserFromGroup = asyncHandler( async (req, res) => {
    const {userId, groupId} = req.body;

    if (!userId || !groupId) throw new ApiError(400, "User and Group ID is required");

    const group = await GroupChat.findById(groupId);

    if (!group) throw new ApiError(404, "Group not found");

    if (!group.users.includes(req.user._id)) throw new ApiError(403, "You are not a member of the group");

    if (!group.users.includes(userId)) throw new ApiError(400, "User is not the member of the group");

    group.users = group.users.filter(user => user.toString() !== userId.toString());
    await group.save();

    return res.status(200).json(new ApiResponse(200, { group }, "User removed from the group successfully"));
});

const updateGroupName = asyncHandler( async (req, res) => {
    const { groupId, name } = req.body;

    if (!groupId || !name) throw new ApiError(400, "Name and Group ID are required");

    const group = await GroupChat.findById(groupId);

    if (!group) throw new ApiError(404, "Group not found");

    if (group.admin.toString() !== req.user._id.toString()) throw new ApiError(403, "You are not admin of this group");

    group.name = name;
    await group.save();

    return res.status(200).json(new ApiResponse(200, { group }, "Updated Group name successfully"));
});

const deleteGroup = asyncHandler( async (req, res) => {
    const { groupId } = req.params;

    if (!groupId) throw new ApiError(400, "Group ID is required");

    const group = await GroupChat.findById(groupId);

    if (!group) throw new ApiError(404, "Group not found");

    if (group.admin.toString() !== req.user._id.toString()) throw new ApiError(403, "You are not admin of this group");

    await Message.deleteMany({ conversation: groupId });
    await GroupChat.findByIdAndDelete(groupId);

    return res.status(200).json(new ApiResponse(200, {}, "Group deleted successfully"));
});

export { createGroupChat, getAllGroupChats, addUserToGroup, removeUserFromGroup, updateGroupName, deleteGroup };