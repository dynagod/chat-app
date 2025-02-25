import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
    {
        user1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        user2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["pending", "accepted"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

friendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

export const Friendship = mongoose.model("Friendship", friendshipSchema);