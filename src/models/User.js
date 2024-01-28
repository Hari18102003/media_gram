import mongoose, { models } from "mongoose";
import { Post } from "./Post";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friendRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]

}, { timestamps: true });

export const User = models.User || mongoose.model("User", userSchema);