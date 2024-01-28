"use client";
import Post from '@/components/layouts/Post'
import Loader from '@/components/loader/Loader';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const LikedPostsPage = () => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const session = useSession();
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

    if (status === "unauthenticated") {
        redirect("/");
    }

    return loading ? <Loader /> : (
        <div>
            <h1 className='text-white text-xl md:text-2xl mb-5'>Liked Posts</h1>
            <div className='flex flex-col gap-5'>
                {user && (
                    user?.likedPosts?.length > 0 && (
                        user?.likedPosts?.map(post => (
                            <Post key={post._id} post={post} />
                        ))
                    )
                )}
                {!user?.likedPosts.length > 0 && <h1 className='text-white'>Nothing Liked yet...</h1>}
            </div>
        </div>
    )
}

export default LikedPostsPage