import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavIteams from './NavIteams'
import DropDown from './DropDown'
import { searchStocks } from '@/lib/action/finnhub.actions'

async function Header({ user }: { user: User }) {
  const initialStocks = await searchStocks();
{  console.log('Header initialStocks', initialStocks);}
  return (
    <header className='sticky top-0 header'>
      <div className="container header-wrapper">
        <Link href='/'>
          <Image src='/assets/images/logo.png' alt='QuantView Logo' width={140} height={32} className='h-8 w-auto cursor-pointer' />
        </Link>
        <nav className='hidden sm:block'>
          <NavIteams
            initialStocks={initialStocks} />
        </nav>
        <DropDown user={user} />
      </div>

    </header>
  )
}

export default Header
