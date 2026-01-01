import Header from '@/components/Header'
import { auth } from '@/lib/better-auth/auth'
import { getSession } from 'better-auth/api'
import { headers } from 'next/headers'
import React from 'react'
import { redirect } from 'next/navigation'

async function layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    redirect('/sign-in')
  }
  const user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name
  }
  return (
    <main className='min-h-screen text-gray-400'>
      <Header user={user} />
      <div className='container py-10 '>

        {children}
      </div>
    </main>
  )
}

export default layout
