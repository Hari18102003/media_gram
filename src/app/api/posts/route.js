import { connectDB } from "@/db/connectDB"
import { Post } from "@/models/Post";

export const dynamic = 'force-dynamic';
export async function GET(req) {
    connectDB();
    const posts = await Post.find().populate("creator").populate("likes");
    return Response.json({
        success: true,
        message: "fetch successfull",
        posts
    });
}