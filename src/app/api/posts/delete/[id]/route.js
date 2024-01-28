import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/db/connectDB";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";

export async function DELETE(req, { params }) {
    const { id } = params;
    connectDB();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    await User.findOneAndUpdate({ email: userEmail }, { $pull: { posts: id } });
    await Post.findOneAndDelete({ _id: id });
    return Response.json({
        success: true,
        message: "Deleted!"
    })
}