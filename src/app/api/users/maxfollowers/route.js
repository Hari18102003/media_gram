import { connectDB } from "@/db/connectDB";
import { User } from "@/models/User";

export async function GET(req) {
    connectDB();
    const users = await User.find().sort({ followers: -1 }).limit(5).populate("posts savedPosts likedPosts followers following friendRequests");
    return Response.json({
        success: true,
        message: "fetch successfull",
        users
    });
}