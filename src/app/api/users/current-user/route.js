import { connectDB } from "@/db/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { User } from "@/models/User";
import { Post } from "@/models/Post";

export async function GET(req) {
    connectDB();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const user = await User.findOne({ email: userEmail }).populate("posts")
        .populate("savedPosts")
        .populate("likedPosts")
        .populate("followers")
        .populate("following")
        .populate("friendRequests");
    if (user) {
        for (const savedPost of user?.savedPosts) {
            const post = await Post.findById(savedPost._id).populate('creator').populate("likes");
            const index = user?.savedPosts.findIndex(post => post._id.equals(savedPost._id));
            user.savedPosts[index] = post;
        }
        for (const likedPost of user?.likedPosts) {
            const post = await Post.findById(likedPost._id).populate('creator').populate("likes");
            const index = user?.likedPosts.findIndex(post => post._id.equals(likedPost._id));
            user.likedPosts[index] = post;
        }
    }
    return Response.json({
        success: true,
        message: "fetch successfull",
        user
    });
}
