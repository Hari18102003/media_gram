import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/db/connectDB";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";

export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const { id } = params;
    connectDB();
    const user = await User.findOne({ email: userEmail });
    await User.findOneAndUpdate({ email: userEmail }, { $push: { followers: id } });
    await User.findOneAndUpdate({ email: userEmail }, { $pull: { friendRequests: id } });
    await User.findOneAndUpdate({ _id: id }, { $push: { following: user._id } });
    return Response.json({
        success: true,
        message: "You got a New Follower!"
    });
}