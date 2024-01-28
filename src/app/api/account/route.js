import { connectDB } from "@/db/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";

export async function PUT(req) {
    connectDB();
    const { profileImage, username, email } = await req.json();
    const update = { profileImage, username, email }
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    await User.findOneAndUpdate({ email: userEmail }, { ...update });
    return Response.json({
        success: true,
        message: "Saved!"
    });
}