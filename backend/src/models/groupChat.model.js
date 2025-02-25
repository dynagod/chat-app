import mongoose from "mongoose";

const groupChatSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const GroupChat = mongoose.model("GroupChat", groupChatSchema);