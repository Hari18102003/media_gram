import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/db/connectDB"
import { User } from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function PUT(req, { params }) {
    const { id } = params;
    connectDB();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    await User.findOneAndUpdate({ email: userEmail }, { $addToSet: { savedPosts: id } });
    return Response.json({
        success: true,
        message: "Saved!"
    })
}