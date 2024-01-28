import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/db/connectDB";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";

export async function PUT(req, { params }) {
    const { id } = params;
    connectDB();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const user = await User.findOne({ email: userEmail }).populate("likedPosts");
    const find = user?.likedPosts.find(post => post._id.toString() === id.toString());
    if (find) {
        await User.findOneAndUpdate({ email: userEmail }, { $pull: { likedPosts: id } });
        await Post.findOneAndUpdate({ _id: id }, { $pull: { likes: user._id } });
        return Response.json({
            success: true,
            message: "Disliked"
        })
    }
    await User.findOneAndUpdate({ email: userEmail }, { $addToSet: { likedPosts: id } });
    await Post.findOneAndUpdate({ _id: id }, { $addToSet: { likes: user._id } });
    return Response.json({
        success: true,
        message: "Liked"
    })
}