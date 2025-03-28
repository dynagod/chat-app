import { Chat } from "../models/chat.model.js";
import { GroupChat } from "../models/groupChat.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../utils/socket.js";

const sendMessage = asyncHandler( async (req, res) => {
    const { conversationId, conversationType, text } = req.body;

    if (!conversationId || !conversationType) throw new ApiError(400, "Conversation ID amd type are required");

    if (!["Chat", "GroupChat"].includes(conversationType)) throw new ApiError(400, "Invalid conversation type");

    const imageLocalPath = req.file ? req.file.path : undefined;

    const image = await uploadOnCloudinary(imageLocalPath);

    const createMessage = await Message.create({
        sender: req.user._id,
        text,
        image: image?.url,
        conversation: conversationId,
        conversationType,
    });

    if (!createMessage) throw new ApiError(400, "Something went wrong while creating the message model");

    const message = await Message.findById(createMessage._id)
        .populate("sender", "-password -refreshToken");

    if (conversationType === "Chat") await Chat.findByIdAndUpdate(conversationId, { latestMessage: message._id });
    else await GroupChat.findByIdAndUpdate(conversationId, { latestMessage: message._id });

    const chat = conversationType === "Chat" ? await Chat.findByIdAndUpdate(conversationId, { latestMessage: message._id }, { new: true }) : await GroupChat.findByIdAndUpdate(conversationId, { latestMessage: message._id }, { new: true });

    const receiverIds = chat.users.filter(u => u.toString() !== req.user._id.toString()).map(u => u.toString());

    const socketIds = getReceiverSocketId(receiverIds);

    socketIds.forEach(socketId => {
        io.to(socketId).emit("new_message", message);
    });

    return res.status(200).json(new ApiResponse(200, { message }, "Message sent successfully"));
});

const getMessages = asyncHandler( async (req, res) => {
    const { conversationId, conversationType } = req.params;

    if (!conversationId || !conversationType) throw new ApiError(400, "Conversation ID and type are required");

    if (!["Chat", "GroupChat"].includes(conversationType)) throw new ApiError(400, "Invalid conversation type");

    const messages = await Message.find({ conversation: conversationId, conversationType })
        .populate("sender", "-password -refreshToken")
        .sort({ createdAt: 1 });
    
    return res.status(200).json(new ApiResponse(200, { messages }, "Messages fetched successfully"));
});

const deleteMessage = asyncHandler( async (req, res) => {
    const { conversationId, conversationType, messageId } = req.body;

    if (!conversationId || !conversationType) throw new ApiError(400, "Conversation ID and type are required");

    if (!["Chat", "GroupChat"].includes(conversationType)) throw new ApiError(400, "Invalid conversation type");

    if (messageId) await Message.findByIdAndDelete(messageId);
    else await Message.deleteMany({ conversation: conversationId, conversationType });

    const chat = conversationType === "Chat" ? await Chat.findById(conversationId) : await GroupChat.findById(conversationId);

    const receiverIds = chat.users.filter(u => u.toString() !== req.user._id.toString()).map(u => u.toString());

    const socketIds = getReceiverSocketId(receiverIds);

    socketIds.forEach(socketId => {
        io.to(socketId).emit("delete_message", { messageId, conversationType });
    });

    return res.status(200).json(new ApiResponse(200, {}, "Message(s) deleted successfully"));
});

export { sendMessage, getMessages, deleteMessage };