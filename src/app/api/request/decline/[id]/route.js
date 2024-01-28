import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/db/connectDB";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";

export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const { id } = params;
    connectDB();
    await User.findOneAndUpdate({ email: userEmail }, { $pull: { friendRequests: id } });
    return Response.json({
        success: true,
        message: "Declined!"
    });
}