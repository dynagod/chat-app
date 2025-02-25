import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { Friendship } from './friendship.model.js';

const chatSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message"
        }
    },
    {
        timestamps: true
    }
);

chatSchema.index({ users: 1 })

chatSchema.pre("save", async function (next) {
    if (this.users.length !== 2) return next(new ApiError(400, "Private chat should must have exactly 2 users"));

    const [user1Id, user2Id] = this.users;

    const friendship = await Friendship.findOne({
        $or: [
            { user1: user1Id, user2: user2Id, status: "accepted" },
            { user1: user2Id, user2: user1Id, status: "accepted" }
        ]
    });

    if (!friendship) return next(new ApiError(400, "Users must be friends to chat"));
    
    next();
});

export const Chat = mongoose.model("Chat", chatSchema);