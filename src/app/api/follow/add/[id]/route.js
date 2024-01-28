import { connectDB } from "@/db/connectDB";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PUT(req, { params }) {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    connectDB();
    const user = await User.findOne({ email: userEmail }).populate("posts followers following savedPosts likedPosts friendRequests");
    await User.findOneAndUpdate({ _id: id }, { $addToSet: { friendRequests: user._id } });
    return Response.json({
        success: true,
        message: "Request Sent!"
    });
}