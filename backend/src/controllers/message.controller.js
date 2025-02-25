import { Chat } from "../models/chat.model.js";
import { GroupChat } from "../models/groupChat.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const sendMessage = asyncHandler( async (req, res) => {
    const { conversationId, conversationType, content, messageType } = req.body;

    if (!conversationId || !conversationType || !content) throw new ApiError(400, "Conversation ID, type and content are required");

    if (!["Chat", "GroupChat"].includes(conversationType)) throw new ApiError(400, "Invalid conversation type");

    const message = await Message.create({
        sender: req.user._id,
        content,
        conversation: conversationId,
        conversationType,
        messageType: messageType || "text"
    });

    if (conversationType === "Chat") await Chat.findByIdAndUpdate(conversationId, { latestMessage: message._id });
    else await GroupChat.findByIdAndUpdate(conversationId, { latestMessage: message._id });

    return res.status(200).json(new ApiResponse(200, { message }, "Message sent successfully"));
});

const getMessages = asyncHandler( async (req, res) => {
    const { conversationId, conversationType } = req.params;

    if (!conversationId || !conversationType) throw new ApiError(400, "Conversation ID and type are required");

    if (!["Chat", "GroupChat"].includes(conversationType)) throw new ApiError(400, "Invalid conversation type");

    const messages = (await Message.find({ conversation: conversationId, conversationType }))
        .populate("sender", "-password -refreshToken")
        .sort({ createdAt: -1 });
    
    return res.status(200).json(new ApiResponse(200, { messages }, "Messages fetched successfully"));
});

export { sendMessage, getMessages };