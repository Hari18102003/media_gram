"use client";
import Loader from '@/components/loader/Loader';
import { PersonAddAltOutlined, PersonRemoveOutlined } from '@mui/icons-material'
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Peoplepage = () => {

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const { status } = session;
    const userEmail = session?.data?.user?.email;

    useEffect(() => {
        async function fetchUsers() {
            const { data } = await axios.get('/api/users');
            if (data.success) {
                setLoading(false);
                setUsers(data.users);
            }
        }
        fetchUsers();
        const filters = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
        setSearchUsers(filters);
    }, [search, users]);

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
        <div>
            <h1 className='text-white text-xl md:text-2xl mb-5'>Find People</h1>
            {!users.length > 0 && <h1 className='text-white'>No users yet..</h1>}

            <div className='bg-[#111111] w-[345px] md:w-[500px] rounded-md p-3 md:p-5 flex flex-col gap-10'>
                <input value={search} onChange={e => setSearch(e.target.value)} type='search' className='w-full text-white p-3 caret-purple-500 rounded-lg h-10 bg-[#1D1927]' placeholder='Search..' />
                <div className='flex flex-col gap-2'>
                    {searchUsers.length > 0 && (
                        searchUsers.map(user => (
                            <div key={user._id} className='flex justify-between items-center'>
                                <Link href={user._id} className='flex items-center gap-4'>
                                    <Image src={user.profileImage ? user.profileImage : "/images/user.png"} className='rounded-full bg-white p-[2px]' width={40} height={40} alt='profile-img' />
                                    <p className='text-sm text-white'>{user.username}</p>
                                </Link>
                                {user.followers?.find(user => user.email === userEmail) ? (
                                    <button onClick={() => handleRemoveFollow(user._id)}><PersonRemoveOutlined className='text-purple-500' /></button>
                                ) : (
                                    <button onClick={() => handleAddFollow(user._id)}><PersonAddAltOutlined className='text-purple-500' /></button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    )
}

export default Peoplepage