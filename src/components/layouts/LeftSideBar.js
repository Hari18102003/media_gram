"use client";
import { Menu } from '@/libs/constants'
import { LogoutOutlined } from '@mui/icons-material'
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Loader from '../loader/Loader';

const LeftSideBar = () => {

    const currentPath = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return loading ? <Loader /> : (
        <div className='px-10 py-6 bg-[#111111] sticky top-0 h-screen hidden md:block'>
            {user && (
                <>
                    <Link href={"/dashboard"} className='flex items-center gap-1'>
                        <Image src={"/images/logo.png"} alt="logo-image" width={36} height={36} />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Media Gram</h1>
                    </Link>
                    <div className='flex flex-col gap-2 items-center my-9 text-white'>
                        <Link href={`/dashboard/profile/${user._id}`}>
                            <div className='flex flex-col items-center gap-2'>
                                <Image
                                    src={user.profileImage ? user.profileImage : "/images/user.png"}
                                    alt='profile-image'
                                    width={56}
                                    height={56}
                                    className='rounded-full p-[2px] bg-white'
                                />
                                <h1 className='font-bold text-xl'>{user.username}</h1>
                            </div>
                        </Link>
                        <div className='flex justify-between gap-5 my-2'>
                            <div className='flex flex-col items-center gap-1'>
                                <span>{user.posts?.length}</span>
                                <p className='text-sm text-slate-300'>Posts</p>
                            </div>
                            <div className='flex flex-col  items-center gap-1'>
                                <span>{user.followers?.length}</span>
                                <p className='text-sm text-slate-300'>Followers</p>
                            </div>
                            <div className='flex flex-col  items-center gap-1'>
                                <span>{user.following?.length}</span>
                                <p className='text-sm text-slate-300'>Following</p>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='flex flex-col gap-2 my-6 pl-9'>
                        {Menu.map(item => (
                            <Link key={item.id} href={item.path} className={item.path === currentPath ? 'bg-purple-500 rounded-lg p-3 flex gap-2 items-center text-white' : 'flex gap-2 p-3 items-center text-white'}>
                                <span>{item.icon}</span>
                                <p className='text-lg'>{item.label}</p>
                            </Link>
                        ))}
                    </div>
                    <hr />
                    <div className='my-5 flex flex-col gap-7 pl-9 justify-center'>
                        <Link href={"/dashboard/manage-account"}>
                            <div className='flex gap-2 items-center'>
                                <Image
                                    src={user.profileImage ? user.profileImage : "/images/user.png"}
                                    alt='profile-image'
                                    width={40}
                                    height={40}
                                    className='rounded-full p-[2px] bg-white'
                                />
                                <p className='text-white'>Manage Account</p>
                            </div>
                        </Link>
                        <button className='text-white flex items-center gap-3' onClick={() => signOut()}>
                            <span><LogoutOutlined /></span>
                            <p>Logout</p>
                        </button>
                    </div>
                </>
            )}

        </div>
    )
}

export default LeftSideBar