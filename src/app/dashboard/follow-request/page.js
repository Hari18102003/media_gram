"use client";
import Loader from '@/components/loader/Loader';
import { Close, Done } from '@mui/icons-material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const FollowRequestpage = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const userEmail = session?.data?.user?.email;
    const { status } = session;

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

    if (status === "unauthenticated") {
        redirect("/");
    }

    return loading ? <Loader /> : (
        <div className='w-[360px]'>
            <h1 className='text-white text-xl mb-5'>Follow Requests</h1>
            <div className='flex flex-col gap-5'>

                {user?.friendRequests.length > 0 && (
                    user.friendRequests.map(user => (
                        <div key={user._id} className='flex gap-5 items-center'>
                            <Link href={`/dashboard/profile/${user._id}`} className='flex items-center gap-4 mr-3'>
                                <Image src={user.profileImage ? user.profileImage : "/images/user.png"} className='rounded-full bg-white p-[2px]' width={40} height={40} alt='profile-img' />
                                <p className='text-white text-sm'>{user.username}</p>
                            </Link>
                            <div className='flex gap-5'>
                                <button onClick={() => handleAccept(user._id)}><Done className='text-green-400' /></button>
                                <button onClick={() => handleDecline(user._id)}><Close className='text-red-400' /></button>
                            </div>
                        </div>
                    )))}
                {!user?.friendRequests.length > 0 && (
                    <h1 className='text-white'>No follow request</h1>
                )}
            </div>
        </div>
    )
}

export default FollowRequestpage