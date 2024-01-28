import { connectDB } from "@/db/connectDB";
import { Post } from "@/models/Post";
import { User } from "@/models/User";

export async function GET(req, { params }) {
    const { id } = params;
    connectDB();
    const user = await User.findOne({ _id: id }).populate("posts followers following");
    if (user) {
        for (const post of user.posts) {
            const findpost = await Post.findOne({ _id: post._id }).populate("creator likes");
            const index = user.posts.findIndex(singlepost => singlepost._id === post._id);
            user.posts[index] = findpost;
        }
        for (const follower of user.followers) {
            const findfollower = await User.findOne({ _id: follower._id }).populate("followers following");
            const index = user.followers.findIndex(singlefollower => singlefollower._id === follower._id);
            user.followers[index] = findfollower;
        }
        for (const following of user.following) {
            const findfollowing = await User.findOne({ _id: following._id }).populate("followers following");
            const index = user.following.findIndex(singlefollowing => singlefollowing._id === following._id);
            user.following[index] = findfollowing;
        }
    }
    return Response.json({
        success: true,
        message: "fetch successfull",
        user
    });
}