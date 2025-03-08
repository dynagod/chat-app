import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createChat = asyncHandler( async (req, res) => {
    const { userId } = req.body;

    if (!userId) throw new ApiError(400, "User is not send with body");

    if (userId.toString() === req.user._id.toString()) throw new ApiError(400, "You can not chat with yourself");

    const existingChat = await Chat.findOne({ users: { $all: [req.user._id, userId] } });

    if (existingChat) return res.status(200).json(new ApiResponse(200, { chat: existingChat }, "Chat already existed"));

    const newChat = await Chat.create( { users: [userId, req.user._id] } );

    const chat = await Chat.findById(newChat._id)
        .populate("users", "-password -refreshToken")
        .populate("latestMessage")
        .lean();

    return res.status(200).json(new ApiResponse(200, { chat }, "Chat created successfully"));
});

const getAllChats = asyncHandler( async (req, res) => {
    const chats = await Chat.find({ users: req.user._id })
        .populate("users", "-password -refreshToken")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .lean();

    return res.status(200).json(new ApiResponse(200, { chats }, "Chats fetched successfully"));
});

const getChatById = asyncHandler( async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) throw new ApiError(400, "Chat id is required");

    const chat = await Chat.findById(chatId)
        .populate("users", "-password -refreshToken")
        .populate("latestMessage");

    if (!chat) throw new ApiError(400, "Chat not found");

    return res.status(200).json(new ApiResponse(200, { chat }, "Chat fetched successfully"));
});

const deleteChat = asyncHandler( async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) throw new ApiError(400, "Chat ID is required");

    const chat = await Chat.findById(chatId);
    if (!chat) throw new ApiError(404, "Chat not found");

    if (!chat.users.includes(req.user._id)) throw new ApiError(403, "You are not a participant in this chat");

    await Message.deleteMany({ conversation: chatId });

    await Chat.findByIdAndDelete(chatId);

    return res.status(200).json(new ApiResponse(200, {}, "Chat deleted successfully"));
});

export { createChat, getAllChats, getChatById, deleteChat };