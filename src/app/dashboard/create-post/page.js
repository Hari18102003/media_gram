"use client";
import CreateForm from '@/components/layouts/CreateForm'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React from 'react'

const CreatePostpage = () => {

    const session = useSession();
    const { status } = session;

    if (status === "unauthenticated") {
        redirect("/");
    }

    return (
        <div className='text-white flex flex-col gap-5'>
            <h1 className='text-xl md:text-2xl mb-5'>Create a Post</h1>
            <CreateForm />
        </div>
    )
}

export default CreatePostpage