"use client";
import Post from '@/components/layouts/Post';
import Loader from '@/components/loader/Loader';
import axios from 'axios';
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Dashboardpage = () => {
    const session = useSession();
    const [posts, setposts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { status } = session;

    useEffect(() => {
        async function fetchPosts() {
            const { data } = await axios.get('/api/posts');
            if (data.success) {
                setLoading(false);
                setposts(data.posts);
            }
        }
        fetchPosts();
    }, [posts]);

    if (status === "unauthenticated") {
        redirect("/");
    }

    return loading ? <Loader /> : (
        <div className='w-[320px] md:w-[500px] h-auto mb-[40px] md:mb-0'>
            <h1 className='text-white text-xl  md:text-2xl mb-5'>Feed</h1>
            <div className='flex flex-col pl-3 md:pl-0 gap-5'>
                {posts.length > 0 && (
                    posts.map(post => (
                        <Post key={post._id} post={post} />
                    ))
                )}
                {!posts.length > 0 && <h1 className='text-white'>No posts ..</h1>}
            </div>

        </div>

    )
}

export default Dashboardpage