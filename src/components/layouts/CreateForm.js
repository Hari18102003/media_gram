"use client";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const CreateForm = () => {

    const [file, setFile] = useState();
    const [previews, setPreviews] = useState();
    const [created, setCreated] = useState(false);
    const [caption, setCaption] = useState("");
    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;

    useEffect(() => {
        if (!file) return;
        let tmp = [];
        tmp.push(URL.createObjectURL(file));
        const objectUrls = tmp[0];
        setPreviews(objectUrls);
        return URL.revokeObjectURL(objectUrls[0]);
    }, [file]);

    async function handleCreate(e) {
        e.preventDefault();
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("upload_preset", "mediagramapp");
        fileData.append("cloud_name", cloudName);
        const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, fileData);

        const res = await axios.post("/api/create-post", { image: data.url, caption });
        if (res.data.success) {
            toast.success(res.data.message);
            setCaption("");
            setCreated(true);
        }
    }

    if (created) {
        redirect("/dashboard");
    }


    return (
        <form onSubmit={handleCreate}>
            <div className='bg-[#111111] p-5 flex flex-col gap-9'>
                <div className='flex gap-5 items-center'>
                    {previews ?
                        <div className='flex gap-5 items-center flex-col md:flex-row'>
                            <Image width={400} height={400} className='rounded-lg' src={previews} key={previews} alt='image' />
                            <label htmlFor='image'>Change photo</label>
                        </div>

                        :
                        <>
                            <label htmlFor='image'>
                                <AddPhotoAlternateIcon className='text-[120px]' />
                            </label>
                            <label htmlFor='image'>Upload a photo</label>
                        </>}
                    <input
                        type='file'
                        id='image'
                        className='hidden'
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                            }
                        }}
                        required
                    />
                </div>
                <div className='flex flex-col gap-3'>
                    <label className='text-lg font-semibold'>Caption</label>
                    <textarea value={caption} onChange={e => setCaption(e.target.value)} className='bg-[#1D1927] w-[300px] h-[70px] md:w-[600px] md:h-[120px] text-lg caret-purple-400' required />
                </div>
                <button type='submit' className='w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-lg text-xl'>Post</button>
            </div>
        </form>
    )
}

export default CreateForm