import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavIteams from './NavIteams'
import DropDown from './DropDown'

/**
 * Renders the app header containing the logo, primary navigation, and user dropdown.
 *
 * @param user - The authenticated user object to display in the dropdown.
 * @returns The header React element.
 */
function Header({user}:{user:User}) {
  return (
   <header className='sticky top-0 header'>
    <div className="container header-wrapper">
      <Link href='/'>
      <Image src = '/assets/images/logo.png' alt='QuantView Logo' width={140} height={32} className='h-8 w-auto cursor-pointer' />
      </Link>
      <nav className='hidden sm:block'>
        <NavIteams/>
      </nav>
      <DropDown user={user} />
    </div>

   </header>
  )
}

export default Header