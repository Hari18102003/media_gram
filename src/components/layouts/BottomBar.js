"use client";
import { Menu } from '@/libs/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const BottomBar = () => {
    const currentPath = usePathname();
    return (
        <div className='fixed bg-[#111111] w-full bottom-0 md:hidden'>
            <div className='flex px-5 py-2 gap-5'>
                {Menu.map(item => (
                    <Link key={item.id} href={item.path} className={item.path === currentPath ? 'bg-purple-500 rounded-lg p-3 flex gap-2 items-center text-white' : 'flex gap-2 p-3 items-center text-white'}>
                        <span>{item.icon}</span>
                        <p className='text-lg hidden lg:block'>{item.label}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default BottomBar