import { Post } from "@/models/Post";
import { User } from "@/models/User";

export async function DELETE(req, { params }) {
    const { id } = params;
    const user = await User.findOne({ _id: id }).populate("posts followers following");
    if (user) {
        for (const post of user.posts) {
            await Post.findOneAndDelete({ _id: post._id });
        }
        if (user.followers.length > 0) {
            for (const follower of user.followers) {
                await User.findOneAndUpdate({ _id: follower._id }, { $pull: { following: id } });
            }
        }
        if (user.following.length > 0) {
            for (const following of user.following) {
                await User.findOneAndUpdate({ _id: following._id }, { $pull: { followers: id } });
            }
        }
    }
    await User.findOneAndDelete({ _id: id });
    return Response.json({
        success: true,
        message: "Deleted account"
    });
}