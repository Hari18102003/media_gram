"use client";
import Post from '@/components/layouts/Post';
import Loader from '@/components/loader/Loader';
import { PersonAddAltOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Profilepage = ({ params }) => {

    const { id } = params;
    const [active, setActive] = useState("posts");
    const session = useSession();
    const { status } = session;
    const userEmail = session?.data?.user?.email;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            const { data } = await axios.get(`/api/users/get/${id}`);
            if (data.success) {
                setLoading(false);
                setUser(data.user);
            }
        }
        getUser();
    }, [id]);

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

    if (status === "unauthenticated") {
        redirect("/");
    }

    return loading ? <Loader /> : (
        <>
            {user && (
                <div className='w-[360px] md:w-[500px] mb-14 md:mb-0 flex flex-col md:p-5 gap-5 md:gap-9'>
                    <div className='flex items-center gap-2 md:gap-5'>
                        <div className='relative rounded-full w-28 h-28'>
                            <Image src={user.profileImage ? user.profileImage : "/images/user.png"} className='rounded-full' alt='profile' fill />
                        </div>
                        <div className='text-white flex flex-col gap-4'>
                            <h1 className='font-semibold'>{user.username}</h1>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <span className='text-purple-500'>{user.posts.length}</span>
                                    <p className='text-sm text-slate-300'>Posts</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='text-purple-500'>{user.followers.length}</span>
                                    <p className='text-sm text-slate-300'>Followers</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='text-purple-500'>{user.following.length}</span>
                                    <p className='text-sm text-slate-300'>Following</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-6'>
                        <button
                            onClick={() => setActive("posts")}
                            className={active === "posts" ? `text-white bg-purple-600 text-sm px-3 py-1 rounded-lg` : 'text-slate-300 bg-gray-600 text-sm px-3 py-1 rounded-lg'}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setActive("followers")}
                            className={active === "followers" ? `text-white bg-purple-600 text-sm px-3 py-1 rounded-lg` : 'text-slate-300 bg-gray-600 text-sm px-3 py-1 rounded-lg'}
                        >
                            Followers
                        </button>
                        <button
                            onClick={() => setActive("following")}
                            className={active === "following" ? `text-white bg-purple-600 text-sm px-3 py-1 rounded-lg` : 'text-slate-300 bg-gray-600 text-sm px-3 py-1 rounded-lg'}
                        >
                            Following
                        </button>
                    </div>
                    <div className='flex flex-col gap-4'>
                        {active === "posts" && (
                            user.posts.length > 0 ? (
                                user.posts.map(post => (
                                    <Post key={post._id} post={post} />
                                ))
                            ) : (
                                <h1 className='text-white font-semibold'>No Posts...</h1>
                            )
                        )}
                    </div>

                    {active === "followers" && (
                        <div className='flex flex-col bg-[#111111] px-2 rounded-md py-3 gap-2'>
                            {user.followers.length > 0 ? (
                                user.followers.map(follower => (
                                    <div key={follower._id} className='flex justify-between items-center'>
                                        <Link href={`/dashboard/profile/${follower._id}`} className='flex items-center gap-4'>
                                            <div className='relative rounded-full w-11 h-11'>
                                                <Image src={follower.profileImage ? follower.profileImage : "/images/user.png"} className='rounded-full bg-white p-[2px]' fill alt='profile-img' />
                                            </div>
                                            <p className='text-sm text-white'>{follower.username}</p>
                                        </Link>
                                        {follower.email !== userEmail && (
                                            follower.followers?.find(user => user.email === userEmail) ? (
                                                <button onClick={() => handleRemoveFollow(user._id)}><PersonRemoveOutlined className='text-purple-500' /></button>
                                            ) : (
                                                <button onClick={() => handleAddFollow(user._id)}><PersonAddAltOutlined className='text-purple-500' /></button>
                                            )
                                        )}
                                    </div>
                                ))
                            ) : (
                                <h1 className='text-white font-semibold'>No Followers...</h1>
                            )}
                        </div>
                    )}


                    {active === "following" && (
                        <div className='flex flex-col bg-[#111111] px-2 rounded-md py-3 gap-2'>
                            {user.following.length > 0 ? (
                                user.following.map(singleFollowing => (
                                    <div key={singleFollowing._id} className='flex justify-between items-center'>
                                        <Link href={`/dashboard/profile/${singleFollowing._id}`} className='flex items-center gap-4'>
                                            <div className='relative rounded-full w-11 h-11'>
                                                <Image src={singleFollowing.profileImage ? singleFollowing.profileImage : "/images/user.png"} className='rounded-full bg-white p-[2px]' fill alt='profile-img' />
                                            </div>
                                            <p className='text-sm text-white'>{singleFollowing.username}</p>
                                        </Link>
                                        {singleFollowing.email !== userEmail && (
                                            singleFollowing.followers?.find(user => user.email === userEmail) ? (
                                                <button onClick={() => handleRemoveFollow(user._id)}><PersonRemoveOutlined className='text-purple-500' /></button>
                                            ) : (
                                                <button onClick={() => handleAddFollow(user._id)}><PersonAddAltOutlined className='text-purple-500' /></button>
                                            )
                                        )}
                                    </div>
                                ))
                            ) : (
                                <h1 className='text-white font-semibold'>Not Following anyone...</h1>
                            )}
                        </div>
                    )}

                </div>
            )}
        </>
    )
}

export default Profilepage