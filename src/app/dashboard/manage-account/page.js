"use client";
import Loader from '@/components/loader/Loader';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const Accountpage = () => {

    const session = useSession();
    const { status } = session;
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState();
    const [previews, setPreviews] = useState();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;

    useEffect(() => {
        async function fetchUser() {
            const { data } = await axios.get("/api/users/current-user");
            if (data.success) {
                setLoading(false);
                setUser(data.user);
                setUsername(data.user.username);
                setEmail(data.user.email);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (!file) return;
        let tmp = [];
        tmp.push(URL.createObjectURL(file));
        const objectUrls = tmp[0];
        setPreviews(objectUrls);
        return URL.revokeObjectURL(objectUrls[0]);
    }, [file]);

    async function handleAccount(e) {
        e.preventDefault();
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("upload_preset", "mediagramapp");
        fileData.append("cloud_name", cloudName);
        const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, fileData);

        const res = await axios.put("/api/account", { profileImage: data.url, username, email });
        if (res.data.success) {
            toast.success(res.data.message);
        }
    }

    async function handleDelete(id) {
        const result = confirm("You will lose your followers,posts and other data.Are u sure?");
        if (result) {
            const { data } = await axios.delete(`/api/users/delete/${id}`);
            if (data.success) {
                signOut();
            }
        }
    }

    if (status === "unauthenticated") {
        redirect("/");
    }

    return loading ? <Loader /> : (
        <div className='w-[350px] md:w-[500px]'>
            <h1 className='text-white text-xl md:text-2xl mb-5'>Manage Account</h1>
            <div className='bg-[#111111] p-3 md:p-5'>
                {user && (
                    <>
                        <form className="space-y-4 md:space-y-10 mb-5" onSubmit={handleAccount} >
                            <div className='flex gap-5 items-center'>
                                {previews ? (
                                    <Image src={previews} alt='profile' width={120} height={120} className='rounded-full' />
                                ) : (
                                    <Image src={user.profileImage ? user.profileImage : "/images/user.png"} alt='profile' width={120} height={120} className='rounded-full' />
                                )}
                                <input
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            setFile(e.target.files[0]);
                                        }
                                    }}
                                    type='file'
                                    id='image'
                                    className='hidden'
                                />
                                <label htmlFor='image' className='text-white text-sm'>Change profile</label>
                            </div>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
                                <input value={username} onChange={e => setUsername(e.target.value)} type="text" name="username" id="username" className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="password" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" id="email" className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="email" />
                            </div>
                            <button type="submit" className="w-full text-white font-semibold focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center bg-gradient-to-r from-purple-400 to-pink-600">Save</button>
                        </form>
                        <button onClick={() => handleDelete(user._id)} className='text-red-500 underline text-sm'>Delete my account</button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Accountpage