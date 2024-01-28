import { connectDB } from "@/db/connectDB";
import { User } from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req) {
    connectDB();
    const currentUser = await getServerSession(authOptions);
    const userEmail = currentUser?.user.email;
    const allUsers = await User.find().populate("posts savedPosts likedPosts followers following friendRequests");
    const users = allUsers?.filter(user => user.email !== userEmail);
    return Response.json({
        success: true,
        message: "fetch successfull",
        users
    });
}