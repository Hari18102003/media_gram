"use client";
import { Close, Done } from '@mui/icons-material'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '../loader/Loader';

const RightSideBar = () => {

    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const userEmail = session?.data?.user?.email;

    useEffect(() => {
        async function fetchUser() {
            const { data } = await axios.get("/api/users/current-user");
            if (data.success) {
                setLoading(false);
                setUser(data.user);
            }
        }
        fetchUser();
    }, [user]);

    useEffect(() => {
        async function fetchUser() {
            const { data } = await axios.get("/api/users/maxfollowers");
            if (data.success) {
                setUsers(data.users);
            }
        }
        fetchUser();
    }, [users]);

    async function handleAccept(id) {
        const { data } = await axios.put(`/api/request/accept/${id}`, { userEmail });
        if (data.success) {
            toast.success(data.message);
        }
    }

    async function handleDecline(id) {
        const { data } = await axios.put(`/api/request/decline/${id}`, { userEmail });
        if (data.success) {
            toast.success(data.message);
        }
    }

    return loading ? <Loader /> : (
        <div className='p-12 bg-[#111111] sticky top-0 h-screen hidden md:flex md:flex-col gap-5 '>
            {user?.friendRequests.length > 0 && (
                <div>
                    <h1 className='text-white text-lg font-semibold mb-7'>Follow Requests</h1>
                    <div className='flex flex-col gap-5'>

                        {user?.friendRequests.length > 0 && (
                            user.friendRequests.map(user => (
                                <div key={user._id} className='flex items-center'>
                                    <Link href={`/dashboard/profile/${user._id}`} className='flex items-center gap-4 mr-3'>
                                        <div className='relative rounded-full w-8 h-8'>
                                            <Image src={user.profileImage ? user.profileImage : "/images/user.png"} className='rounded-full bg-white p-[2px]' alt='profile-img' fill />
                                        </div>
                                        <p className='text-white text-sm'>{user.username}</p>
                                    </Link>
                                    <div className='flex gap-5'>
                                        <button onClick={() => handleAccept(user._id)}><Done className='text-green-400' /></button>
                                        <button onClick={() => handleDecline(user._id)}><Close className='text-red-400' /></button>
                                    </div>
                                </div>
                            )))}
                    </div>

                </div>
            )}
            <div>
                <h1 className='text-white text-lg font-semibold mb-7'>Having highest followers</h1>
                <div className='flex flex-col gap-5'>
                    {users && (
                        users.map(user => (
                            <div className='flex justify-between items-center' key={user._id}>
                                <Link href={`/dashboard/profile/${user._id}`} className='flex items-center gap-4'>
                                    <div className='relative rounded-full w-12 h-12'>
                                        <Image src={user.profileImage ? user.profileImage : "/images/user.png"} className='rounded-full bg-white p-[2px]' fill alt='profile-img' />
                                    </div>
                                    <p className='text-white text-sm'>{user.username}</p>
                                </Link>
                                <p className='text-white text-xs'>{user.followers.length}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default RightSideBar