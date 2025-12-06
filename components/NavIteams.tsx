'use client'

import React from 'react'
import { NAV_ITEMS } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
function NavIteams() {
    const Pathname = usePathname()
    const isActive = (hreaf: string) => {
       if(hreaf === '/' ){return Pathname === '/'}

       return Pathname?.startsWith(hreaf)
    }
    return (
        <ul className='flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium'>
            {NAV_ITEMS.map((iteam) => (
                <li key={iteam.href}>
                    <Link href={iteam.href} className={`hover:text-yellow-500 transition-colors ${
                        isActive(iteam.href)? 'text-gray-400': ''
                    }`}>
                        {iteam.label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export default NavIteams
