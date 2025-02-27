import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: {
            type: String,
        },
        image: {
            type: String
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
    },
    {
        timestamps: true
    }
);

messageSchema.index({ conversation: 1 });

export const Message = mongoose.model("Message", messageSchema);