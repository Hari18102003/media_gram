"use client";
import { Bookmark, BookmarkBorderOutlined, DeleteOutlined, Favorite, FavoriteBorderOutlined, PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material'
import axios from 'axios';
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Post = ({ post }) => {

    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const { data } = await axios.get("/api/users/current-user");
            if (data.success) {
                setUser(data.user);
            }
        }
        fetchUser();
    }, [user]);

    async function handleAddFollow(id) {
        const { data } = await axios.put(`/api/follow/add/${id}`, { userEmail });
        if (data.success) {
            toast.success(data.message);
        }
    }

    async function handleRemoveFollow(id) {
        const { data } = await axios.put(`/api/follow/remove/${id}`, { userEmail });
        if (data.success) {
            toast.success(data.message);
        }
    }

    async function handleSave(id) {
        const { data } = await axios.put(`/api/posts/save/${id}`, { userEmail });
        if (data.success) {
            toast.success(data.message);
        }
    }
    async function handleUnSave(id) {
        const { data } = await axios.put(`/api/posts/unsave/${id}`, { userEmail });
        if (data.success) {
            toast.success(data.message);
        }
    }

    async function handleLike(id) {
        const { data } = await axios.put(`/api/posts/like/${id}`, { userEmail });
        if (data.success) {
            console.log("success");
        }
    }

    async function handleDelete(id) {
        const { data } = await axios.delete(`/api/posts/delete/${id}`);
        if (data.success) {
            toast.success(data.message);
        }
    }
    const find = user?.following.find(user => user._id === post.creator._id);

    return (
        <>
            {post && (
                <div className='bg-[#111111] p-5 flex flex-col gap-3 rounded-md'>
                    <div className='flex justify-between items-center'>
                        <Link href={`/dashboard/profile/${post.creator._id}`}>
                            <div className='flex gap-3 items-center'>
                                <div className='relative rounded-full w-11 h-11'>
                                    <Image
                                        src={post.creator.profileImage ? post.creator.profileImage : "/images/user.png"}
                                        alt='profile-image'
                                        fill
                                        className='rounded-full p-[2px] bg-white'
                                    />
                                </div>
                                <h1 className='text-white'>{post.creator.username}</h1>
                            </div>
                        </Link>
                        <div className='text-purple-500'>
                            {user?._id !== post.creator._id && (
                                find ? (
                                    <button onClick={() => handleRemoveFollow(post.creator._id)}><PersonRemoveOutlined /></button>
                                ) : (<button onClick={() => handleAddFollow(post.creator._id)}><PersonAddOutlined /></button>)
                            )}
                        </div>
                    </div>
                    <div>
                        <p className='text-slate-200 text-sm'>{post.caption}</p>
                    </div>
                    <div className='relative rounded-lg w-full h-[400px]'>
                        <Image
                            src={post.image}
                            alt='profile-image'
                            fill
                            className='rounded-lg'
                        />
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex gap-1'>
                            {user?.likedPosts?.find(likedpost => likedpost._id.toString() === post._id) ? (
                                <button onClick={() => handleLike(post._id)}><Favorite className='text-red-500' /></button>
                            ) : (
                                <button onClick={() => handleLike(post._id)}><FavoriteBorderOutlined className='text-white' /></button>
                            )}
                            <span className='text-white'>{post.likes.length}</span>
                        </div>
                        {post.creator.email === userEmail ? (
                            <button onClick={() => handleDelete(post._id)}><DeleteOutlined className='text-red-500' /></button>
                        ) :
                            (user?.savedPosts?.find(savedpost => savedpost._id.toString() === post._id) ? (
                                <button onClick={() => handleUnSave(post._id)}><Bookmark className='text-purple-500' /></button>
                            ) : (
                                <button onClick={() => handleSave(post._id)}><BookmarkBorderOutlined className='text-white' /></button>
                            )
                            )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Post