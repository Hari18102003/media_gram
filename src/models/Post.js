import mongoose, { models } from "mongoose";
import { User } from "./User";
const postSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true });

export const Post = models.Post || mongoose.model("Post", postSchema);