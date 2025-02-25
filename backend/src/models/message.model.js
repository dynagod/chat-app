import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: {
            type: String,
            required: true
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "conversationType"
        },
        conversationType: {
            type: String,
            required: true,
            enum: ["Chat", "GroupChat"]
        },
        isRead: {
            type: Boolean,
            default: false
        },
        messageType: {
            type: String,
            enum: ["text", "image"],
            default: "text"
        }
    },
    {
        timestamps: true
    }
);

messageSchema.index({ conversation: 1 });

export const Message = mongoose.model("Message", messageSchema);