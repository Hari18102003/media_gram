"use client";
import { LogoutOutlined, Notifications, Settings } from '@mui/icons-material'
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const TopBar = () => {

    const [user, setUser] = useState(null);
    const session = useSession();
    const { status } = session;
    useEffect(() => {
        async function fetchUser() {
            const { data } = await axios.get("/api/users/current-user");
            if (data.success) {
                setUser(data.user);
            }
        }
        fetchUser();
    }, [user]);

    if (status === "unauthenticated") {
        redirect("/");
    }

    return (
        <div className='flex w-[360px] md:hidden justify-between items-center p-2'>
            <Link href={"/dashboard"} className='flex items-center gap-1'>
                <Image src={"/images/logo.png"} alt="logo-image" width={32} height={32} />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Media Gram</h1>
            </Link>
            {user && (
                <div className='flex gap-3 items-center'>
                    <Link href={`/dashboard/profile/${user._id}`}>
                        <Image
                            src={user.profileImage ? user.profileImage : "/images/user.png"}
                            alt='profile-image'
                            width={36}
                            height={36}
                            className='rounded-full p-[2px] bg-white'
                        />
                    </Link>
                    {user?.friendRequests.length > 0 ? (
                        <Link href={"/dashboard/follow-request"} className='relative'>
                            <Notifications className='text-white' />
                            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 w-1 h-1 rounded-full"></div>
                        </Link>
                    ) : (
                        <Link href={"/dashboard/follow-request"}>
                            <Notifications className='text-white' />
                        </Link>
                    )}
                    <Link href={"/dashboard/manage-account"}>
                        <Settings className='text-white' />
                    </Link>
                    <button onClick={() => signOut()}><LogoutOutlined className='text-white' /></button>
                </div>
            )}
        </div>
    )
}

export default TopBar