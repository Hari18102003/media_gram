import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/db/connectDB"
import { User } from "@/models/User";
import { getServerSession } from "next-auth";

export async function PUT(req, { params }) {
    const { id } = params;
    connectDB();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const user = await User.findOne({ email: userEmail }).populate("posts savedPosts");
    await User.findOneAndUpdate({ email: userEmail }, { $pull: { savedPosts: id } });
    return Response.json({
        success: true,
        message: "UnSaved!"
    })

}