'use client'

import React from 'react'
import { NAV_ITEMS } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CommandManyItems } from './ui/SearchCommand'
const NavIteams = ({ initialStocks }: { initialStocks: StockWithWatchlistStatus[] }) => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    };

    return (
        <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
            {NAV_ITEMS.map(({ href, label }) => {
                { console.log('initialStocks', initialStocks); }
                if (href === "/search") {
                    return (
                        <li key="search-trigger">
                            <CommandManyItems
                                initialStocks={initialStocks}
                                label="Search"
                                renderAs="text"
                            />
                        </li>
                    );
                }

                return (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`hover:text-yellow-500 transition-colors 
                                ${isActive(href) ? "text-gray-400" : ""}`}>
                            {label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}


export default NavIteams
