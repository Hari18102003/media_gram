import { connectDB } from "@/db/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";
import { Post } from "@/models/Post";

export async function POST(req) {
    connectDB();
    const { image, caption } = await req.json();
    const currentUser = await getServerSession(authOptions);
    const userEmail = currentUser?.user?.email;
    const user = await User.findOne({ email: userEmail });
    const post = await Post.create({ creator: user._id, image, caption });
    await User.findOneAndUpdate({ email: userEmail }, { $push: { posts: post._id } });
    return Response.json({
        success: true,
        message: "Created Post!"
    });
}