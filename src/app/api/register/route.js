import { connectDB } from "@/db/connectDB"
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    connectDB();
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
        return Response.json({
            success: false,
            message: "Enter all fields"
        });
    }
    if (password.length < 4) {
        return Response.json({
            success: false,
            message: "Password should be minimum 4"
        });
    }
    const user = await User.findOne({ email });
    if (user) {
        return Response.json({
            success: false,
            message: "User already exists!"
        });
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    await User.create({ username, email, password: hashPassword });
    return Response.json({
        success: true,
        message: "Account created!"
    });
}