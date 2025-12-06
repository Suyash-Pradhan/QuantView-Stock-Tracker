import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavIteams from './NavIteams'
import DropDown from './DropDown'

function Header() {
  return (
   <header className='sticky top-0 header'>
    <div className="container header-wrapper">
      <Link href='/'>
      <Image src = '/assets/images/logo.png' alt='QuantView Logo' width={140} height={32} className='h-8 w-auto cursor-pointer' />
      </Link>
      <nav className='hidden sm:block'>
        <NavIteams/>
      </nav>
      <DropDown />
    </div>

   </header>
  )
}

export default Header
